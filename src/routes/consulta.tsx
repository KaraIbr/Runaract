import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ArrowUpRight, User, MapPin, CreditCard, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/consulta")({
  head: () => ({
    meta: [
      { title: "Consulta tu inscripción — Runnaract 2.0" },
    ],
  }),
  component: ConsultaPage,
});

const searchSchema = z.object({
  query: z.string().min(3, "Ingresa al menos 3 caracteres"),
});

type SearchForm = z.infer<typeof searchSchema>;

type LookupResult = {
  first_name: string;
  last_name: string;
  distance_km: number;
  payment_status: string | null;
  registration_folio: string | null;
  contact_email: string;
  category_name: string;
};

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600 bg-amber-50 border-amber-200" },
  review: { label: "En revisión", color: "text-blue-600 bg-blue-50 border-blue-200" },
  approved: { label: "Aprobado", color: "text-green-600 bg-green-50 border-green-200" },
  rejected: { label: "Rechazado", color: "text-red-600 bg-red-50 border-red-200" },
  cancelled: { label: "Cancelado", color: "text-gray-600 bg-gray-50 border-gray-200" },
};

function ConsultaPage() {
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  async function onSubmit(data: SearchForm) {
    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    try {
      const q = data.query.trim();
      const isFolio = /^RUNN26-/i.test(q);

      const { data: lookupData, error: fnErr } = await supabase.rpc(
        "lookup_registration",
        isFolio ? { p_folio: q.toUpperCase() } : { p_email: q },
      );

      if (fnErr) throw fnErr;

      const rows = lookupData as unknown as LookupResult[];
      if (!rows || rows.length === 0) {
        setError("No se encontró ninguna inscripción con esos datos.");
        return;
      }
      setResult(rows[0]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al consultar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-run-beige">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-run-orange hover:opacity-80"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Volver al inicio
        </a>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Consulta</div>
          <h1 className="editorial-display mt-3 text-5xl text-run-blue sm:text-6xl">
            ¿Ya te<br />inscribiste?
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Ingresa tu correo electrónico o folio (ej. RUNN26-0001) para consultar el estado de tu inscripción.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Correo electrónico o folio</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com o RUNN26-0001" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-12 shrink-0 rounded-full bg-run-orange px-6 text-sm font-semibold uppercase tracking-wider text-white hover:brightness-110"
              >
                {loading ? "…" : <Search className="h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-4"
          >
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-run-orange" />
                  <div>
                    <p className="font-semibold text-run-blue">
                      {result.first_name} {result.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{result.category_name}</p>
                  </div>
                </div>
                {result.payment_status && (
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      PAYMENT_LABELS[result.payment_status]?.color ?? "text-gray-600 bg-gray-50 border-gray-200"
                    }`}
                  >
                    {PAYMENT_LABELS[result.payment_status]?.label ?? result.payment_status}
                  </span>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-run-orange" />
                  <span className="text-muted-foreground">{result.distance_km}K</span>
                </div>
                {result.registration_folio && (
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-run-orange" />
                    <span className="font-mono font-semibold text-run-blue">{result.registration_folio}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-muted-foreground">
              ¿Tienes dudas? Escríbenos a{" "}
              <a href={`mailto:${result.contact_email}`} className="text-run-orange underline underline-offset-2">
                {result.contact_email}
              </a>
            </div>

            {!result.registration_folio && result.payment_status !== "approved" && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                Tu pago está en proceso. El folio se generará automáticamente cuando el pago sea aprobado.
              </div>
            )}
          </motion.div>
        )}

        {searched && !result && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            No se encontraron resultados.
          </motion.div>
        )}

        <footer className="mt-20 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © 2026 Runnaract. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
