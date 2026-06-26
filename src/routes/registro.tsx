import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, FileText, MessageCircle } from "lucide-react";
import { EVENT, PRICES, currentPhase, type Distance } from "@/lib/event-config";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  TERMS_AND_CONDITIONS,
  PRIVACY_NOTICE,
  INFORMED_CONSENT,
  TUTOR_CONSENT,
} from "@/lib/legal-content";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Inscripción — Runnaract 2.0" },
      {
        name: "description",
        content: "Inscríbete a Runnaract 2.0 powered by Zitara. 3K · 5K · 10K en Zitara Golf Club.",
      },
    ],
  }),
  component: RegistroPage,
});

const GENDERS = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
] as const;

const DISTANCES = [
  { value: "3k", label: "3 km", km: 3 },
  { value: "5k", label: "5 km", km: 5 },
  { value: "10k", label: "10 km", km: 10 },
] as const;

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - i);

const formSchema = z.object({
  first_name: z.string().min(1, "Nombre es obligatorio").max(100),
  last_name: z.string().min(1, "Apellido es obligatorio").max(100),
  email: z.string().email("Correo inválido"),
  birth_month: z.coerce.number().int().min(1).max(12),
  birth_year: z.coerce.number().int().min(1940).max(currentYear),
  gender: z.enum(["male", "female"], {
    required_error: "Selecciona una categoría",
  }),
  distance: z.enum(["3k", "5k", "10k"], { required_error: "Selecciona una distancia" }),
  phone: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar términos y condiciones" }),
  }),
  privacy_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el aviso de privacidad" }),
  }),
  consent_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar el consentimiento informado" }),
  }),
  marketing_accepted: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function calculateAge(birthYear: number, birthMonth: number): number {
  const event = EVENT.date;
  let age = event.getFullYear() - birthYear;
  const monthDiff = event.getMonth() + 1 - birthMonth;
  if (monthDiff < 0) age--;
  return age;
}

function getCategoryId(
  distance: string,
  gender: string,
  categories: Array<{ id: number; name: string; distance_km: number }>,
): number {
  const categoryGender = gender === "male" ? "Varonil" : "Femenil";
  const km = DISTANCES.find((d) => d.value === distance)?.km ?? 3;
  const match = categories.find(
    (c) => c.name.toLowerCase().includes(categoryGender.toLowerCase()) && c.distance_km === km,
  );
  return match?.id ?? 1;
}

function RegistroPage() {
  const navigate = useNavigate();
  const phase = currentPhase();
  const prices = PRICES[phase];
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; distance_km: number }>
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartaFile, setCartaFile] = useState<File | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | undefined>();

  useEffect(() => {
    supabase
      .from("race_categories")
      .select("id, name, distance_km")
      .eq("active", true)
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      birth_month: undefined,
      birth_year: undefined,
      gender: undefined,
      distance: undefined,
      phone: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      terms_accepted: false as unknown as true,
      privacy_accepted: false as unknown as true,
      consent_accepted: false as unknown as true,
      marketing_accepted: false,
    },
  });

  const distance = selectedDistance || form.watch("distance");
  const gender = form.watch("gender");
  const birthYear = form.watch("birth_year");
  const birthMonth = form.watch("birth_month");
  const isMinor =
    birthYear && birthMonth ? calculateAge(Number(birthYear), Number(birthMonth)) < 18 : false;

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    setError(null);

    try {
      const age = calculateAge(data.birth_year, data.birth_month);
      const minor = age < 18;
      const categoryId = getCategoryId(data.distance, data.gender, categories);

      if (minor && !cartaFile) {
        throw new Error("Debes subir la carta responsiva firmada por tu tutor legal.");
      }

      const birthDate = `${data.birth_year}-${String(data.birth_month).padStart(2, "0")}-01`;

      const { data: participant, error: pErr } = await supabase
        .from("participants")
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email.toLowerCase().trim(),
          birth_date: birthDate,
          gender: data.gender,
          phone: data.phone || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          category_id: categoryId,
          shirt_size: "M",
          marketing_accepted: data.marketing_accepted ?? false,
          is_minor: minor,
        })
        .select("id")
        .single();

      if (pErr) {
        if (pErr.message?.includes("participants_email_unique") || pErr.code === "23505") {
          throw new Error("Este correo electrónico ya está registrado.");
        }
        if (pErr.message?.includes("CAPACITY_REACHED")) {
          throw new Error("Se ha alcanzado el límite de 2000 corredores.");
        }
        throw pErr;
      }

      if (minor && cartaFile) {
        const filePath = `cartas/${participant.id}_carta.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("runaract")
          .upload(filePath, cartaFile, {
            contentType: "application/pdf",
            upsert: true,
          });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("runaract").getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from("participants")
          .update({ carta_responsiva_url: publicUrl })
          .eq("id", participant.id);
        if (updateError) throw updateError;
      }

      const { error: cErr } = await supabase.from("consents").insert({
        participant_id: participant.id,
        terms_accepted: true,
        privacy_accepted: true,
        consent_accepted: true,
        accepted_at: new Date().toISOString(),
      });

      if (cErr) throw cErr;

      window.location.href = `/pago/${participant.id}`;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al registrar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPrice = distance ? prices[distance as Distance] : null;

  return (
    <div className="min-h-screen bg-run-beige">
      <div className="mx-auto max-w-2xl px-5 py-12 sm:py-20">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-run-orange hover:opacity-80"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Volver al inicio
        </a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Inscripción</div>
          <h1 className="editorial-display mt-3 text-5xl text-run-blue sm:text-6xl">
            Tu lugar
            <br />
            te espera.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Completa tus datos y asegura tu lugar en Runnaract 2.0 — {EVENT.venue}.{" "}
            {EVENT.date.toLocaleDateString("es-MX", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Birth date */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Fecha de nacimiento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birth_month"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MONTHS.map((m) => (
                                <SelectItem key={m.value} value={m.value.toString()}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birth_year"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {YEARS.map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {GENDERS.map((g) => (
                            <div key={g.value} className="flex items-center gap-2">
                              <RadioGroupItem value={g.value} id={`gender-${g.value}`} />
                              <Label
                                htmlFor={`gender-${g.value}`}
                                className="cursor-pointer font-normal"
                              >
                                {g.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Distance */}
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distancia</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(v) => {
                            field.onChange(v);
                            setSelectedDistance(v);
                          }}
                          value={field.value}
                          className="flex flex-wrap gap-4"
                        >
                          {DISTANCES.map((d) => (
                            <div key={d.value} className="flex items-center gap-2">
                              <RadioGroupItem value={d.value} id={`dist-${d.value}`} />
                              <Label
                                htmlFor={`dist-${d.value}`}
                                className="cursor-pointer font-normal"
                              >
                                {d.label} — ${prices[d.value]} MXN
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional fields */}
                <div className="space-y-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Opcional
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="55 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contacto de emergencia — nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emergency_contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contacto de emergencia — teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="55 1234 5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Marketing opt-in */}
                <FormField
                  control={form.control}
                  name="marketing_accepted"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <Label className="text-sm font-normal leading-snug text-muted-foreground cursor-pointer">
                        Acepto recibir información promocional de Runnaract y Zitara.
                      </Label>
                    </FormItem>
                  )}
                />

                {/* Legals */}
                <div className="space-y-4 rounded-2xl border border-border bg-white/50 p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={
                        form.watch("terms_accepted") &&
                        form.watch("privacy_accepted") &&
                        form.watch("consent_accepted")
                      }
                      onCheckedChange={(checked) => {
                        form.setValue("terms_accepted", checked as true);
                        form.setValue("privacy_accepted", checked as true);
                        form.setValue("consent_accepted", checked as true);
                      }}
                    />
                    <div className="text-sm font-normal leading-snug pt-0.5">
                      Acepto los{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-run-orange underline underline-offset-2 hover:brightness-110 cursor-pointer"
                          >
                            términos y condiciones
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Términos y Condiciones</DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {TERMS_AND_CONDITIONS}
                          </div>
                        </DialogContent>
                      </Dialog>
                      ,{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-run-orange underline underline-offset-2 hover:brightness-110 cursor-pointer"
                          >
                            aviso de privacidad
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Aviso de Privacidad</DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {PRIVACY_NOTICE}
                          </div>
                        </DialogContent>
                      </Dialog>{" "}
                      y{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-run-orange underline underline-offset-2 hover:brightness-110 cursor-pointer"
                          >
                            consentimiento informado
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Consentimiento Informado y Exoneración de Responsabilidad
                            </DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {INFORMED_CONSENT}
                          </div>
                        </DialogContent>
                      </Dialog>{" "}
                      del evento.
                    </div>
                  </div>
                  {(form.formState.errors.terms_accepted ||
                    form.formState.errors.privacy_accepted ||
                    form.formState.errors.consent_accepted) && (
                    <p className="text-xs text-red-500">
                      Debes aceptar los términos, aviso de privacidad y consentimiento informado.
                    </p>
                  )}

                  {isMinor && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-amber-800">
                        <FileText className="h-4 w-4" />
                        Carta Responsiva — Tutor Legal
                      </div>
                      <p className="text-xs text-amber-700">
                        Al ser menor de edad, se requiere una carta responsiva firmada por tu padre,
                        madre o tutor legal. Descarga e imprime el documento, fírmalo junto con tu
                        tutor y súbelo en PDF.
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-xs font-medium text-run-orange underline underline-offset-2 hover:brightness-110 cursor-pointer"
                          >
                            Ver texto de la carta responsiva
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Carta Responsiva para Tutor</DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {TUTOR_CONSENT}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <div>
                        <Label className="text-sm font-medium text-amber-800">
                          Sube el PDF firmado <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setCartaFile(e.target.files?.[0] ?? null)}
                          className="mt-1.5 cursor-pointer file:cursor-pointer file:border-0 file:bg-amber-100 file:text-amber-800 file:font-medium hover:file:bg-amber-200"
                        />
                        {cartaFile && (
                          <p className="mt-1 text-xs text-green-600">
                            {cartaFile.name} ({(cartaFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    "w-full rounded-full bg-run-orange px-8 py-6 text-sm font-semibold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-60",
                    submitting && "cursor-wait",
                  )}
                >
                  {submitting ? (
                    "Registrando…"
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Inscribirme {selectedPrice && `— $${selectedPrice} MXN`}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {phase === "phase1"
                    ? "Precios de Fase 1 vigentes hasta el 10 de julio 2026."
                    : "Precios de Fase 2 vigentes."}{" "}
                  Cupo limitado a {EVENT.capacity.toLocaleString("es-MX")} corredores.
                </p>
              </form>
            </Form>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-20 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © 2026 Runnaract. Todos los derechos reservados.
        </footer>
      </div>

      {/* Floating WhatsApp & Instagram */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <span className="text-right text-[10px] uppercase tracking-wider text-muted-foreground">
          ¿Dudas?
        </span>
        <a
          href="https://wa.me/524499808124"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
          title="Contáctanos por WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href="https://www.instagram.com/rotaractesenciaags/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg transition hover:scale-110"
          title="Síguenos en Instagram"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
