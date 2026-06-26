import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Calendar,
  Users,
  Clock,
  Award,
  Shirt,
  Droplets,
  Beer,
  Gamepad2,
  Music,
  Trophy,
  Handshake,
} from "lucide-react";

import { Countdown } from "@/components/landing/Countdown";
import { Gallery2025 } from "@/components/landing/Gallery2025";
import { Impacto } from "@/components/landing/Impacto";
import { FooterGsap } from "@/components/landing/FooterGsap";
import { EVENT, PRICES, currentPhase } from "@/lib/event-config";

import heroImg from "@/assets/hero-runner.jpg";
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
        content:
          "06.09.2026 · 3K · 5K · 10K. Una experiencia editorial de running en Zitara Golf Club.",
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

function HoverCard({ images, label }: { images: string[]; label: string }) {
  const [hovering, setHovering] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!hovering) {
      setImgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [hovering, images.length]);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="overflow-hidden rounded-xl border border-run-beige bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={images[imgIndex]}
        alt={label}
        className="aspect-[4/3] w-full object-cover transition-all duration-500"
        loading="lazy"
      />
      <div className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Landing() {
  const phase = currentPhase();
  const prices = PRICES[phase];

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <a
        href="/registro"
        className="group flex w-full items-center justify-between bg-white px-10 py-6 text-lg font-semibold uppercase tracking-widest text-run-blue transition-all duration-300 hover:bg-gray-50"
      >
        <span className="inline-block transition-all duration-300 group-hover:scale-105">
          Inscríbete
        </span>
        <ArrowUpRight className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5" />
      </a>

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
        <img
          src={heroImg}
          alt="Runner al amanecer"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grain opacity-30" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/70"
          >
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
            <p className="max-w-lg text-pretty text-base text-white/80 sm:text-lg">
              Un evento de running editorial en {EVENT.venue}. 3K · 5K · 10K. Capacidad limitada a{" "}
              {EVENT.capacity.toLocaleString("es-MX")} corredores.
            </p>
          </motion.div>
        </div>
      </section>

      {/* EVENT META */}
      <section id="evento" className="bg-run-beige px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div className="col-span-2 rounded-3xl bg-run-blue p-8 flex flex-col justify-between md:col-span-2">
            <Calendar className="h-6 w-6 text-run-orange mb-4" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Fecha</div>
              <div className="font-display text-2xl font-bold text-white md:text-3xl">
                {fmtDate(EVENT.date)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-run-orange p-6 flex flex-col justify-between">
            <MapPin className="h-5 w-5 text-white/70 mb-3" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">Sede</div>
              <div className="font-display text-lg font-bold text-white">{EVENT.venue}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-run-blue p-6 flex flex-col justify-between">
            <Users className="h-5 w-5 text-run-orange mb-3" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">Cupo</div>
              <div className="font-display text-lg font-bold text-white">
                {EVENT.capacity.toLocaleString("es-MX")} corredores
              </div>
            </div>
          </div>
          <div className="col-span-2 rounded-3xl bg-run-orange p-8 flex flex-col justify-between md:col-span-4">
            <Clock className="h-6 w-6 text-white/70 mb-4" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                Inscripciones hasta
              </div>
              <div className="font-display text-2xl font-bold text-white md:text-3xl">
                {fmtDate(EVENT.registrationDeadline)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative overflow-hidden bg-run-beige px-5 py-24 sm:py-32">
        <div className="absolute inset-0 grain opacity-20" aria-hidden />
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
            Fecha del evento
          </div>
          <h2 className="editorial-display mt-4 text-5xl sm:text-6xl md:text-7xl text-run-blue">
            06.09.<span className="text-run-orange">2026</span>
          </h2>
          <p className="mt-6 max-w-lg text-muted-foreground">
            Inscríbete y genera tu folio en línea, nuestras inscripciones cierran el 04 de
            septiembre, tenemos cupo máximo de 1,000 corredores.
          </p>
          <div className="mt-10">
            <Countdown />
          </div>
        </div>
      </section>

      {/* DISTANCES & PRICES */}
      <section id="distancias" className="relative overflow-hidden bg-ink text-white">
        <img
          src={distancesBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 grain opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:py-32">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
                Distancias & precios
              </div>
              <h2 className="editorial-display mt-4 text-5xl sm:text-7xl md:text-8xl">
                Elige tu
                <br />
                distancia.
              </h2>
            </div>
            <div className="rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-widest">
              {phase === "phase1" ? <>Fase 1 · hasta 10 jul 2026</> : <>Fase 2 · vigente</>}
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
                  <span className="editorial-display text-7xl text-white">
                    {d.replace("k", "")}
                  </span>
                  <span className="font-display text-5xl font-medium text-white/70">km</span>
                </div>
                <div className="mt-10 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                      {phase === "phase1" ? "Fase 1" : "Fase 2"}
                    </div>
                    <div className="font-display text-3xl font-bold text-run-orange">
                      ${prices[d]} <span className="text-sm font-normal text-white/60">MXN</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <p className="mt-8 max-w-xl text-xs text-white/50">
            Los precios se actualizan automáticamente según la fase. Fase 1 termina el 10 de julio
            2026; a partir del 11 de julio aplica Fase 2.
          </p>
        </div>
      </section>

      {/* QUE INCLUYE */}
      <section className="relative overflow-hidden bg-run-beige px-5 py-24 sm:py-32">
        <div className="absolute inset-0 grain opacity-20" aria-hidden />
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
              Tu inscripción incluye
            </div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              ¿Qué incluye mi
              <br />
              inscripción?
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {[
              { icon: Award, label: "Medalla conmemorativa", color: "text-run-orange" },
              { icon: Shirt, label: "Playera del evento", color: "text-run-blue" },
              { icon: Droplets, label: "Banda de hidratación", color: "text-run-orange" },
              { icon: Beer, label: "Cerveza post-carrera", color: "text-run-blue" },
              { icon: Gamepad2, label: "Juegos y activaciones", color: "text-run-orange" },
              { icon: Music, label: "Música en vivo", color: "text-run-blue" },
              { icon: Trophy, label: "Premiaciones", color: "text-run-orange" },
              { icon: Handshake, label: "Convenios especiales", color: "text-run-blue" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-run-blue/10 bg-white/30 p-5 text-center backdrop-blur-sm transition hover:bg-white/40"
              >
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <span className="text-sm font-semibold text-run-blue">{item.label}</span>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">¡y mucho más!</p>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="relative overflow-hidden bg-run-beige px-5 py-24 sm:py-32">
        <div className="absolute inset-0 grain opacity-20" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Cronograma</div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              El día
              <br />
              del evento.
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
              Tu lugar de
              <br />
              confianza.
              <br />
              Zitara Golf Club.
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
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-run-orange/30 bg-white/5 shadow-[0_0_30px_-8px_oklch(0.68_0.18_38/0.3)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-run-blue/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-run-blue/60 to-transparent" />
            <iframe
              title="Mapa Zitara Golf Club"
              className="h-full w-full [filter:grayscale(0.1)_sepia(0.05)_hue-rotate(210deg)_saturate(0.4)_brightness(1.1)]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.120816611338!2d-102.3759109!3d21.8842151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429e99f7dee90a1%3A0xb347f18b59f16343!2sZitara%20Ciudad%20Residencial%20%26%20Golf%20Club!5e1!3m2!1ses-419!2smx!4v1782450355763!5m2!1ses-419!2smx"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      <Gallery2025 />

      {/* CAUSA SOCIAL */}
      <section id="causa" className="relative overflow-hidden bg-white px-5 py-24 sm:py-32">
        <div className="absolute inset-0 grain opacity-10" aria-hidden />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
              Causa Social
            </div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              Corremos por
              <br />
              una causa.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/90">
              <strong>Runnaract</strong> es un evento organizado por el{" "}
              <strong>Club Rotaract Esencia de Aguascalientes</strong>, una organización sin fines
              de lucro conformada por jóvenes líderes comprometidos con transformar nuestra
              comunidad.
            </p>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              Este evento es nuestro proyecto de recaudación de fondos para financiar programas de
              apoyo social, con especial enfoque en la <strong>Casa Hogar Divino Maestro</strong>,
              institución que brinda cuidado y protección a adultos mayores en situación vulnerable en Aguascalientes.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Casa Hogar Divino Maestro
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  {
                    images: [
                      "https://picsum.photos/seed/hogar1a/400/500",
                      "https://picsum.photos/seed/hogar1b/400/500",
                      "https://picsum.photos/seed/hogar1c/400/500",
                    ],
                    label: "Instalaciones",
                  },
                  {
                    images: [
                      "https://picsum.photos/seed/hogar2a/400/500",
                      "https://picsum.photos/seed/hogar2b/400/500",
                      "https://picsum.photos/seed/hogar2c/400/500",
                    ],
                    label: "Actividades",
                  },
                  {
                    images: [
                      "https://picsum.photos/seed/hogar3a/400/500",
                      "https://picsum.photos/seed/hogar3b/400/500",
                      "https://picsum.photos/seed/hogar3c/400/500",
                    ],
                    label: "Donaciones",
                  },
                  {
                    images: [
                      "https://picsum.photos/seed/hogar4a/400/500",
                      "https://picsum.photos/seed/hogar4b/400/500",
                      "https://picsum.photos/seed/hogar4c/400/500",
                    ],
                    label: "Convivencia",
                  },
                ].map((img) => (
                  <HoverCard key={img.label} images={img.images} label={img.label} />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Nuestro impacto
              </p>
              <Impacto />
              <a
                href="https://www.instagram.com/rotaractesenciaags/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-run-orange hover:brightness-110"
              >
                Conoce más en nuestras redes
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section
        id="patrocinadores"
        className="relative overflow-hidden border-y border-border bg-white px-5 py-20"
      >
        <div className="absolute inset-0 grain opacity-10" aria-hidden />
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">
                Patrocinadores
              </div>
              <h2 className="editorial-display mt-4 text-4xl text-run-blue md:text-5xl">
                Agradecemos a nuestros
                <br />
                patrocinadores oficiales.
              </h2>
            </div>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
            {[
              { name: "Zitara", desc: "Sede oficial del evento" },
              { name: "Powerade", desc: "Hidratación oficial" },
              { name: "Asics", desc: "Calzado deportivo oficial" },
              { name: "Garmin", desc: "Cronometraje oficial" },
              { name: "Gatorade", desc: "Nutrición deportiva" },
              { name: "Strava", desc: "App de tracking oficial" },
              { name: "Suunto", desc: "Relojes deportivos" },
              { name: "Brooks", desc: "Ropa técnica oficial" },
            ].map((s) => (
              <div key={s.name} className="group perspective-[1000px]">
                <div className="flex aspect-[3/1.4] flex-col items-center justify-center bg-white px-6 transition-all duration-500 hover:[transform:rotateY(-3deg)] hover:shadow-lg">
                  <span className="font-display text-xl font-bold tracking-tight text-run-blue/70 transition-all duration-300 group-hover:text-run-orange group-hover:scale-105">
                    {s.name}
                  </span>
                  <span className="mt-1 text-[10px] text-muted-foreground/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {s.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative overflow-hidden bg-run-beige px-5 py-24 sm:py-32">
        <div className="absolute inset-0 grain opacity-20" aria-hidden />
        <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">FAQ</div>
            <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
              Preguntas
              <br />
              frecuentes.
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
              <details key={f.q} className="group py-5">
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
      <section
        id="inscripcion"
        className="relative overflow-hidden bg-run-orange px-5 py-28 text-white sm:py-36"
      >
        <div className="absolute inset-0 grain" aria-hidden />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-white/70">Tu turno</div>
          <h2 className="editorial-display mt-6 max-w-5xl text-[14vw] sm:text-[10vw] md:text-[8rem]">
            Asegura
            <br />
            tu lugar.
          </h2>
          <div className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-white/85">
              Inscríbete ahora y asegura tu lugar en Runnaract 2.0. Cupo limitado a{" "}
              {EVENT.capacity.toLocaleString("es-MX")} corredores.
            </p>
          </div>
        </div>
      </section>

      <FooterGsap />
    </div>
  );
}
