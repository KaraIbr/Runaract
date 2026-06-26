import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, CreditCard, Building, Upload, CheckCircle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EVENT, PRICES, currentPhase } from "@/lib/event-config";

export const Route = createFileRoute("/pago/$id")({
  head: () => ({
    meta: [
      { title: "Pago — Runnaract 2.0" },
    ],
  }),
  component: PagoPage,
});

type ParticipantInfo = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  category_id: number;
  race_categories?: { name: string; distance_km: number } | null;
};

type PaymentMethod = "transferencia" | "efectivo";

const DISTANCE_LABELS: Record<number, string> = { 3: "3K", 5: "5K", 10: "10K" };

function PagoPage() {
  const { id } = Route.useParams() as { id: string };
  const navigate = useNavigate();
  const phase = currentPhase();
  const prices = PRICES[phase];

  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);

  useEffect(() => {
    const fetchParticipant = async () => {
      const { data, error: _err } = await supabase
        .from("participants")
        .select("id, first_name, last_name, email, category_id, race_categories(name, distance_km)")
        .eq("id", id)
        .single();
      if (data) {
        setParticipant(data as unknown as ParticipantInfo);
        const p = data as unknown as ParticipantInfo;
        const km = p.race_categories?.distance_km;
        if (km) {
          setDistanceKm(km);
        } else {
          const { data: cat } = await supabase
            .from("race_categories")
            .select("distance_km")
            .eq("id", p.category_id)
            .single();
          setDistanceKm(cat?.distance_km ?? 0);
        }
      } else {
        navigate({ to: "/" });
      }
      setLoading(false);
    };
    fetchParticipant();
  }, [id, navigate]);
  const price = distanceKm === 3 ? prices["3k"] : distanceKm === 5 ? prices["5k"] : prices["10k"];
  const distanceLabel = DISTANCE_LABELS[distanceKm] ?? `${distanceKm}K`;

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReceiptFile(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      if (method === "transferencia" || method === "efectivo") {
        let receiptUrl: string | null = null;

        if (receiptFile) {
          const fileExt = receiptFile.name.split(".").pop();
          const fileName = `receipts/${id}/${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage
            .from("receipts")
            .upload(fileName, receiptFile);
          if (uploadErr) throw new Error("Error al subir el comprobante.");
          const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
          receiptUrl = urlData?.publicUrl ?? null;
        }

        const { error: pErr } = await supabase.from("payments").insert({
          participant_id: id,
          amount: price,
          payment_method: method,
          payment_status: "review",
          receipt_url: receiptUrl,
        });

        if (pErr) {
          if (pErr.message?.includes("CAPACITY_REACHED")) {
            throw new Error("Se ha alcanzado el límite de 2000 corredores.");
          }
          throw pErr;
        }

        setSuccess(true);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al procesar el pago.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-run-beige">
        <div className="text-sm text-muted-foreground">Cargando…</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-run-beige px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="editorial-display mt-6 text-4xl text-run-blue sm:text-5xl">
            Registro recibido
          </h1>
          <p className="mt-4 text-muted-foreground">
            Tu solicitud de inscripción está en revisión. Te notificaremos por correo una vez que el pago
            sea aprobado y tu folio esté asignado.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            El equipo validará tu comprobante en un plazo de 24-48 hrs.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-run-orange px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Volver al inicio <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-run-beige">
      <div className="mx-auto max-w-lg px-5 py-12 sm:py-20">
        <a
          href={`/registro`}
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-run-orange hover:opacity-80"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Volver
        </a>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Pago</div>
          <h1 className="editorial-display mt-3 text-4xl text-run-blue sm:text-5xl">
            Confirma tu<br />inscripción.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 rounded-2xl border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-run-blue">
                {participant?.first_name} {participant?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{participant?.email}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold text-run-orange">${price} MXN</p>
              <p className="text-xs text-muted-foreground">{distanceLabel} · {phase === "phase1" ? "Fase 1" : "Fase 2"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 space-y-3"
        >
          <Label className="text-sm font-semibold">Método de pago</Label>

          <button
            disabled
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white/50 p-5 text-left opacity-60 cursor-not-allowed"
          >
            <CreditCard className="h-6 w-6 text-run-blue shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-run-blue">Mercado Pago — Tarjeta</p>
              <p className="text-xs text-muted-foreground">Débito o crédito. Pago inmediato.</p>
            </div>
            <span className="border border-border rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Próximamente
            </span>
          </button>

          <button
            disabled
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white/50 p-5 text-left opacity-60 cursor-not-allowed"
          >
            <Building className="h-6 w-6 text-run-blue shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-run-blue">Mercado Pago — SPEI</p>
              <p className="text-xs text-muted-foreground">Transferencia instantánea vía Mercado Pago.</p>
            </div>
            <span className="border border-border rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Próximamente
            </span>
          </button>

          <button
            onClick={() => setMethod("transferencia")}
            className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
              method === "transferencia"
                ? "border-run-orange bg-run-orange/5 ring-1 ring-run-orange"
                : "border-border bg-white hover:border-run-orange/40"
            }`}
          >
            <Upload className="h-6 w-6 text-run-blue shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-run-blue">Transferencia bancaria</p>
              <p className="text-xs text-muted-foreground">Sube tu comprobante. Validación manual (24-48 hrs).</p>
            </div>
          </button>

          <button
            onClick={() => setMethod("efectivo")}
            className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
              method === "efectivo"
                ? "border-run-orange bg-run-orange/5 ring-1 ring-run-orange"
                : "border-border bg-white hover:border-run-orange/40"
            }`}
          >
            <DollarSign className="h-6 w-6 text-run-blue shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-run-blue">Efectivo</p>
              <p className="text-xs text-muted-foreground">Paga con nuestros representantes oficiales.</p>
            </div>
          </button>

          {method === "transferencia" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <p className="mb-2 text-sm font-medium text-run-blue">Datos para transferencia</p>
              <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                <p><strong>Banco:</strong> STP (Sistema de Transferencias y Pagos)</p>
                <p><strong>CLABE:</strong>638180000030326402
</p>
                <p><strong>Beneficiario:</strong> Ivanna Vazquez </p>
                <p><strong>Monto exacto:</strong> ${price} MXN</p>
                <p><strong>Referencia:</strong> RUNN-{id.slice(0, 8).toUpperCase()}</p>
              </div>
              <Label className="mb-1.5 block text-sm font-medium">Sube tu comprobante (PDF o imagen)</Label>
              <InputFile onChange={handleReceiptUpload} />
              {receiptFile && (
                <p className="mt-1.5 text-xs text-green-600">{receiptFile.name} seleccionado</p>
              )}
            </motion.div>
          )}

          {method === "efectivo" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <p className="mb-2 text-sm font-medium text-run-blue">Pago en efectivo</p>
              <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                <p>Para pagar en efectivo, contacta a nuestros representantes oficiales:</p>
                <p className="mt-2"><strong>Instagram:</strong> @rotaractesenciaags</p>
                <p><strong>Teléfono:</strong> 449 980 8124</p>
                <p className="mt-2">O bien, sube tu comprobante de pago aquí.</p>
              </div>
              <Label className="mb-1.5 block text-sm font-medium">Sube tu comprobante (PDF o imagen)</Label>
              <InputFile onChange={handleReceiptUpload} />
              {receiptFile && (
                <p className="mt-1.5 text-xs text-green-600">{receiptFile.name} seleccionado</p>
              )}
            </motion.div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!method || submitting}
            className="mt-4 w-full rounded-full bg-run-orange px-8 py-6 text-sm font-semibold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? (
              "Procesando…"
            ) : (
              <span className="inline-flex items-center gap-2">
                Confirmar pago <ArrowUpRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Al confirmar, aceptas las condiciones del evento.{" "}
            {EVENT.venue} · {EVENT.date.toLocaleDateString("es-MX")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function InputFile({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-run-beige/50 px-4 py-6 text-sm text-muted-foreground transition hover:border-run-orange/50 hover:text-run-orange">
      <Upload className="h-5 w-5" />
      <span>Seleccionar archivo</span>
      <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={onChange} className="sr-only" />
    </label>
  );
}
