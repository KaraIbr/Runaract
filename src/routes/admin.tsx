import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createServerFn } from "@tanstack/react-start";
import {
  Users,
  Search,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  LogOut,
  TrendingUp,
  MapPin,
  Hash,
  Eye,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENT } from "@/lib/event-config";

const ensureAdminUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { email: string; password: string })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error && !error.message?.includes("already exists")) {
      throw error;
    }
    return { success: true };
  });

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Runnaract 2.0" }],
  }),
  component: AdminPage,
});

type ParticipantRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  category_id: number;
  registration_folio: string | null;
  is_minor: boolean;
  created_at: string;
  race_categories?: { name: string; distance_km: number } | null;
  payments?: {
    id: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    created_at: string;
    receipt_url: string | null;
  }[];
};

type Stats = {
  total: number;
  approved: number;
  pending: number;
  review: number;
  capacity_left: number;
};

function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    approved: 0,
    pending: 0,
    review: 0,
    capacity_left: 2000,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "pending" | "review">("all");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) setAuthed(true);
    else setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: parts, error: _pe } = await supabase
      .from("participants")
      .select("*, race_categories(name, distance_km)")
      .order("created_at", { ascending: false });

    const { data: payments, error: _pye } = await supabase
      .from("payments")
      .select(
        "id, participant_id, amount, payment_method, payment_status, created_at, receipt_url",
      );

    if (parts) {
      const withPayments = parts.map((p) => ({
        ...p,
        payments: (payments ?? []).filter((py) => py.participant_id === p.id),
      })) as ParticipantRow[];
      setParticipants(withPayments);

      const approved = payments?.filter((p) => p.payment_status === "approved").length ?? 0;
      const pending = payments?.filter((p) => p.payment_status === "pending").length ?? 0;
      const reviewCount = payments?.filter((p) => p.payment_status === "review").length ?? 0;

      setStats({
        total: parts.length,
        approved,
        pending,
        review: reviewCount,
        capacity_left: 2000 - approved,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      if (authEmail === "eva@runnaract.com") {
        try {
          await ensureAdminUser({ data: { email: authEmail, password: authPassword } });
          const retry = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });
          if (!retry.error) {
            localStorage.setItem("admin_token", "authed");
            setAuthed(true);
            setAuthLoading(false);
            return;
          }
        } catch {}
      }
      setAuthError("Credenciales inválidas.");
      setAuthLoading(false);
      return;
    }
    localStorage.setItem("admin_token", "authed");
    setAuthed(true);
    setAuthLoading(false);
  };

  const handleExport = () => {
    const rows = participants.map((p) => ({
      folio: p.registration_folio ?? "",
      nombre: `${p.first_name} ${p.last_name}`,
      correo: p.email,
      distancia: `${p.race_categories?.distance_km ?? ""}K`,
      categoria: p.race_categories?.name ?? "",
      menor_edad: p.is_minor ? "Sí" : "No",
      registrado: p.created_at,
      metodo_pago: p.payments?.[0]?.payment_method ?? "",
      estado_pago: p.payments?.[0]?.payment_status ?? "",
      monto: p.payments?.[0]?.amount ?? "",
    }));

    const headers = Object.keys(rows[0] ?? {});
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = r[h as keyof typeof r];
            const s = String(v ?? "");
            return s.includes(",") || s.includes('"') || s.includes("\n")
              ? `"${s.replace(/"/g, '""')}"`
              : s;
          })
          .join(","),
      ),
    ].join("\n");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participantes_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    supabase.auth.signOut();
    setAuthed(false);
  };

  const handleApprove = async (paymentId: string) => {
    const { error } = await supabase
      .from("payments")
      .update({ payment_status: "approved", validated_at: new Date().toISOString() })
      .eq("id", paymentId);
    if (!error) {
      setActionMsg("Pago aprobado.");
      fetchData();
    } else setActionMsg("Error al aprobar.");
  };

  const handleReject = async (paymentId: string) => {
    const { error } = await supabase
      .from("payments")
      .update({ payment_status: "rejected", validated_at: new Date().toISOString() })
      .eq("id", paymentId);
    if (!error) {
      setActionMsg("Pago rechazado.");
      fetchData();
    } else setActionMsg("Error al rechazar.");
  };

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.registration_folio?.toLowerCase() ?? "").includes(q);

    const latestPayment = p.payments?.[0];
    if (tab === "pending") return matchesSearch && latestPayment?.payment_status === "pending";
    if (tab === "review") return matchesSearch && latestPayment?.payment_status === "review";
    return matchesSearch;
  });

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-run-beige px-5">
        <div className="w-full max-w-sm">
          <a
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-run-orange hover:opacity-80"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Volver
          </a>
          <h1 className="editorial-display text-4xl text-run-blue">Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para gestionar el evento.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="mt-8 space-y-4"
          >
            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
              className="h-12"
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
              className="h-12"
            />
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-full bg-run-orange py-6 text-sm font-semibold uppercase tracking-wider text-white hover:brightness-110"
            >
              {authLoading ? "Entrando…" : "Entrar"}
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            por uso interno por el club rotaract escencia. todos los derechos reservados. dudas
            contactar al administrador del sistema (eva)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-run-beige">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="editorial-display text-4xl text-run-blue">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">Runnaract 2.0 · {EVENT.venue}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-run-orange"
            >
              <ArrowUpRight className="h-3.5 w-3.5" /> Exportar
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-run-orange"
            >
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {actionMsg}
            <button onClick={() => setActionMsg(null)} className="ml-3 font-bold">
              &times;
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Registrados", value: stats.total, icon: Users, color: "text-run-blue" },
            { label: "Pagados", value: stats.approved, icon: CheckCircle, color: "text-green-600" },
            {
              label: "Pendientes",
              value: stats.pending + stats.review,
              icon: Clock,
              color: "text-amber-600",
            },
            {
              label: "Lugares libres",
              value: stats.capacity_left,
              icon: TrendingUp,
              color: stats.capacity_left > 100 ? "text-green-600" : "text-red-600",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className={`mt-2 font-display text-3xl font-bold ${s.color}`}>
                {s.value.toLocaleString("es-MX")}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, correo o folio…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-full pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "review"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  tab === t
                    ? "bg-run-orange text-white"
                    : "border border-border bg-white text-muted-foreground hover:border-run-orange/50"
                }`}
              >
                {t === "all" ? "Todos" : t === "pending" ? "Pendientes" : "En revisión"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4">Participante</th>
                <th className="px-5 py-4">Correo</th>
                <th className="px-5 py-4">Distancia</th>
                <th className="px-5 py-4">Folio</th>
                <th className="px-5 py-4">Pago</th>
                <th className="px-5 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    Cargando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    Sin resultados.
                  </td>
                </tr>
              ) : (
                filtered.slice(0, 100).map((p) => {
                  const latestPayment = p.payments?.[0];
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-border/50 last:border-0 hover:bg-run-beige/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-run-blue">
                          {p.first_name} {p.last_name}
                        </p>
                        {p.is_minor && (
                          <span className="text-[10px] font-semibold uppercase text-amber-600">
                            Menor
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{p.email}</td>
                      <td className="px-5 py-4 text-xs">
                        {p.race_categories?.distance_km ?? "—"}K
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold">
                        {p.registration_folio ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        {latestPayment ? (
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              latestPayment.payment_status === "approved"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : latestPayment.payment_status === "review"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : latestPayment.payment_status === "rejected"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {latestPayment.payment_method === "mercadopago" ? "MP" : latestPayment.payment_method === "efectivo" ? "EFEC" : "TRANSF"} ·{" "}
                            {latestPayment.payment_status}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5">
                          {latestPayment?.payment_status === "review" && (
                            <>
                              <button
                                onClick={() => handleApprove(latestPayment.id)}
                                className="rounded-full bg-green-500 p-1.5 text-white transition hover:bg-green-600"
                                title="Aprobar"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(latestPayment.id)}
                                className="rounded-full bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                                title="Rechazar"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          {latestPayment?.receipt_url && (
                            <a
                              href={latestPayment.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-border p-1.5 text-muted-foreground transition hover:bg-run-beige"
                              title="Ver comprobante"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Mostrando {Math.min(filtered.length, 100)} de {filtered.length} participantes
        </p>

        <footer className="mt-12 border-t border-border pt-6 pb-4 text-center text-[10px] leading-relaxed text-muted-foreground">
          <p>De uso interno y exclusivo por el Club Rotaract Escencia de Aguascalientes.</p>
          <p>Todos los derechos reservados.</p>
          <p>Dudas contactar al administrador del sistema (#eva) </p>
        </footer>
      </div>
    </div>
  );
}
