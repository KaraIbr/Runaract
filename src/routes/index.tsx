import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Calendar, Users, Clock } from "lucide-react";

import { Nav } from "@/components/landing/Nav";
import { Countdown } from "@/components/landing/Countdown";
import { EVENT, PRICES, currentPhase } from "@/lib/event-config";

import heroImg from "@/assets/hero-runner.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import distancesBg from "@/assets/distances-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Runnaract 2.0 — Zitara Golf Club" },
      {
        name: "description",
        content:
          "Runnaract 2.0 — carrera 3K · 5K · 10K en Zitara Golf Club. 06 de septiembre 2026. Inscríbete antes de agotar lugares.",
      },
      { property: "og:title", content: "Runnaract 2.0 — Zitara Golf Club" },
      {
        property: "og:description",
        content: "06.09.2026 · 3K · 5K · 10K. Una experiencia editorial de running en Zitara Golf Club.",
      },
      { property: "og:image", content: heroImg },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Landing,
});

const fmtDate = (d: Date) =>
  d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

function Landing() {
  const phase = currentPhase();
  const prices = PRICES[phase];

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
        <img
          src={heroImg}
          alt="Runner al amanecer"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
            <span className="h-px w-10 bg-run-orange" />
            Runnaract 2.0 · powered by Zitara
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="editorial-display mt-6 max-w-5xl text-[16vw] text-white sm:text-[12vw] md:text-[9rem] lg:text-[10.5rem]"
          >
            Runnaract
            <br />
            <span className="text-run-orange">2.0</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
          >
            <p className="max-w-md text-pretty text-base text-white/80 sm:text-lg">
              Un evento de running editorial en {EVENT.venue}.
              3K · 5K · 10K. Capacidad limitada a {EVENT.capacity.toLocaleString("es-MX")} corredores.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/registro"
                className="group inline-flex items-center gap-2 rounded-full bg-run-orange px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
              >
                Inscríbete
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#evento"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                Conoce el evento
              </a>
            </div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60">
          <span className="h-px w-8 bg-white/40" /> scroll
        </div>
      </section>

      {/* MARQUEE / EVENT META */}
      <section id="evento" className="border-y border-border bg-ink text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-white/10 md:grid-cols-4">
          {[
            { icon: Calendar, label: "Fecha", value: fmtDate(EVENT.date) },
            { icon: MapPin, label: "Sede", value: EVENT.venue },
            { icon: Users, label: "Cupo", value: `${EVENT.capacity.toLocaleString("es-MX")} corredores` },
            { icon: Clock, label: "Inscripciones hasta", value: fmtDate(EVENT.registrationDeadline) },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-4 bg-ink px-6 py-8">
              <m.icon className="h-5 w-5 text-run-orange" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">{m.label}</div>
                <div className="font-display text-lg font-semibold">{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative overflow-hidden bg-run-beige px-5 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_auto] md:items-end">
          <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
                El evento inicia en…!
              </div>
            <h2 className="editorial-display mt-4 text-5xl sm:text-6xl md:text-7xl text-run-blue">
              06.09.<span className="text-run-orange">2026</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              La línea de salida espera. Asegura tu lugar antes de que las inscripciones cierren
              el {fmtDate(EVENT.registrationDeadline)} o se agote el cupo de {EVENT.capacity.toLocaleString("es-MX")} corredores.
            </p>
          </div>
          <Countdown />
        </div>
      </section>

      {/* DISTANCES & PRICES */}
      <section
        id="distancias"
        className="relative overflow-hidden bg-ink text-white"
      >
        <img
          src={distancesBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
                Distancias & precios
              </div>
              <h2 className="editorial-display mt-4 text-5xl sm:text-7xl md:text-8xl">
                Elige tu<br />distancia.
              </h2>
            </div>
            <div className="rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-widest">
              {phase === "phase1" ? (
                <>Fase 1 · hasta 10 jul 2026</>
              ) : (
                <>Fase 2 · vigente</>
              )}
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {(["3k", "5k", "10k"] as const).map((d, i) => (
              <motion.article
                key={d}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:border-run-orange/60 hover:bg-white/10"
              >
                <div className="flex items-baseline justify-between">
                  <span className="editorial-display text-7xl text-white">{d.replace("k", "")}</span>
                  <span className="font-display text-2xl font-medium text-white/70">km</span>
                </div>
                <div className="mt-10 flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                      {phase === "phase1" ? "Fase 1" : "Fase 2"}
                    </div>
                    <div className="font-display text-3xl font-bold text-run-orange">
                      ${prices[d]} <span className="text-sm font-normal text-white/60">MXN</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-white/40 line-through">
                    {phase === "phase1" ? `$${PRICES.phase2[d]}` : `$${PRICES.phase1[d]}`}
                  </div>
                </div>
                <a
                  href="#inscripcion"
                  className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-run-orange opacity-80 transition group-hover:opacity-100"
                >
                  Inscríbete <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.article>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-xs text-white/50">
            Los precios se actualizan automáticamente según la fase. Fase 1 termina el 10 de julio
            2026; a partir del 11 de julio aplica Fase 2.
          </p>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="bg-run-beige px-5 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Cronograma</div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              El día<br />del evento.
            </h2>
          </div>
          <ol className="divide-y divide-border border-t border-border">
            {[
              ["05:30", "Apertura de paquetes y registro en sede"],
              ["06:30", "Calentamiento dirigido"],
              ["07:00", "Salida 10K"],
              ["07:15", "Salida 5K"],
              ["07:30", "Salida 3K"],
              ["09:00", "Premiación por categorías"],
              ["10:00", "Cierre y convivencia"],
            ].map(([time, what]) => (
              <li
                key={time}
                className="grid grid-cols-[80px_1fr] items-baseline gap-6 py-5 sm:grid-cols-[120px_1fr]"
              >
                <span className="font-display text-2xl font-bold text-run-orange tabular-nums">
                  {time}
                </span>
                <span className="text-base text-foreground/90 sm:text-lg">{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MAP */}
      <section id="ruta" className="relative overflow-hidden bg-run-blue text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 sm:py-32 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">La ruta</div>
            <h2 className="editorial-display mt-4 text-5xl md:text-6xl">
              Tu lugar de<br />confianza.<br />Zitara Golf Club.
            </h2>
            <p className="mt-6 max-w-md text-white/70">
              Una ruta diseñada sobre Zitara Golf Club. Conoce los espacios que Zitara trae para ti.
            </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-run-orange"
          >
            Conoce el recorrido <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <iframe
              title="Mapa Zitara Golf Club"
              className="h-full w-full grayscale-[0.4]"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-103.45%2C20.62%2C-103.40%2C20.66&layer=mapnik"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="galeria" className="bg-run-beige px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Galería</div>
              <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
                Movimiento<br />en cuadros.
              </h2>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-12 gap-6 md:gap-8">
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-12 md:col-span-5 md:row-span-2"
            >
              <div className="polaroid rotate-[-1.5deg] hover:rotate-0">
                <img src={gallery1} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="polaroid-label">La salida</div>
              </div>
            </motion.figure>
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-12 md:col-span-7"
            >
              <div className="polaroid rotate-[1.2deg] hover:rotate-0">
                <img src={gallery2} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="polaroid-label">El recorrido</div>
              </div>
            </motion.figure>
            <motion.figure
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-12 md:col-span-7"
            >
              <div className="polaroid rotate-[-0.8deg] hover:rotate-0">
                <img src={gallery3} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="polaroid-label">La meta</div>
              </div>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="patrocinadores" className="border-y border-border bg-white px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
                Patrocinadores
              </div>
              <h2 className="editorial-display mt-4 text-4xl text-run-blue md:text-5xl">
                Hacen posible la línea de salida.
              </h2>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
            {["Zitara", "Powerade", "Asics", "Garmin", "Gatorade", "Strava", "Suunto", "Brooks"].map(
              (s) => (
                <div
                  key={s}
                  className="flex aspect-[3/1.4] items-center justify-center bg-white px-6"
                >
                  <span className="font-display text-xl font-bold tracking-tight text-run-blue/70 transition hover:text-run-orange">
                    {s}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-run-beige px-5 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">FAQ</div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              Preguntas<br />frecuentes.
            </h2>
          </div>
          <div className="divide-y divide-border border-t border-border">
            {[
              {
                q: "¿Cuándo cierran las inscripciones?",
                a: `El 04 de septiembre de 2026 o cuando se complete el cupo de ${EVENT.capacity.toLocaleString("es-MX")} corredores; lo que ocurra primero.`,
              },
              {
                q: "¿Cómo se calculan las fases de precio?",
                a: "Fase 1 hasta el 10 de julio 2026 (precios reducidos). A partir del 11 de julio aplica Fase 2. El sistema lo detecta automáticamente.",
              },
              {
                q: "¿Pueden participar menores de edad?",
                a: "La edad se calcula al día del evento. Menores de 18 años pueden participar únicamente mediante carta responsiva.",
              },
              {
                q: "¿Qué métodos de pago aceptan?",
                a: "Mercado Pago (tarjeta y SPEI) y transferencia bancaria con comprobante. El registro se confirma al aprobarse el pago.",
              },
              {
                q: "¿Cómo consulto mi inscripción?",
                a: "Próximamente: con tu correo electrónico o folio (formato RUNN26-0001).",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="group py-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="font-display text-lg font-semibold text-run-blue md:text-xl">
                    {f.q}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-run-orange transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="inscripcion" className="relative overflow-hidden bg-run-orange px-5 py-28 text-white sm:py-36">
        <div className="absolute inset-0 grain" aria-hidden />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">Tu turno</div>
          <h2 className="editorial-display mt-6 max-w-5xl text-[14vw] sm:text-[10vw] md:text-[8rem]">
            Asegura<br />tu lugar.
          </h2>
          <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-white/85">
              Inscríbete ahora y asegura tu lugar en Runnaract 2.0.
              Cupo limitado a {EVENT.capacity.toLocaleString("es-MX")} corredores.
            </p>
            <a
              href="/registro"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-run-blue"
            >
              Inscribirme
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink px-5 py-14 text-white/70">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-run-orange text-xs">R</span>
              Runnaract 2.0
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Powered by Zitara · {EVENT.venue}.
            </p>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">Evento</div>
            <ul className="space-y-2">
              <li><a href="#distancias" className="hover:text-white">Distancias</a></li>
              <li><a href="#ruta" className="hover:text-white">Ruta</a></li>
              <li><a href="#galeria" className="hover:text-white">Galería</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">Contacto</div>
            <ul className="space-y-2">
              <li>registro@runnaract.mx</li>
              <li>{EVENT.venue}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
          <span>© 2026 Runnaract. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
