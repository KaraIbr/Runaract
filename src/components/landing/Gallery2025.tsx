import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GalleryImage {
  src: string;
  label: string;
}

const IMAGES: GalleryImage[] = [
  { src: "https://picsum.photos/seed/salida/600/450", label: "La salida" },
  { src: "https://picsum.photos/seed/recorrido/600/675", label: "El recorrido" },
  { src: "https://picsum.photos/seed/meta/600/450", label: "La meta" },
  { src: "https://picsum.photos/seed/calentamiento/600/675", label: "Calentamiento" },
  { src: "https://picsum.photos/seed/premiacion/600/450", label: "Premiación" },
  { src: "https://picsum.photos/seed/corredores/600/450", label: "Los corredores" },
  { src: "https://picsum.photos/seed/amanecer/600/675", label: "Amanecer" },
  { src: "https://picsum.photos/seed/ambiente/600/450", label: "El ambiente" },
];

const ROTATIONS = [-1.5, 1.2, -0.8, 1.5, -1.1, 0.7, -1.8, -0.5];

const SIZE_CLASSES = ["w-48 sm:w-56", "w-64 sm:w-80", "w-80 sm:w-96"];
const SIZE_INDEX = [1, 2, 0, 1, 2, 0, 1, 2];

export function Gallery2025() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isPaused1, setIsPaused1] = useState(false);
  const [isPaused2, setIsPaused2] = useState(false);

  useEffect(() => {
    const el = scrollRef1.current;
    if (!el || isPaused1) return;

    let animationId: number;

    const scroll = () => {
      if (!el) return;
      el.scrollLeft += 0.8;
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused1]);

  useEffect(() => {
    const el = scrollRef2.current;
    if (!el || isPaused2) return;

    if (el.scrollLeft === 0) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    let animationId: number;

    const scroll = () => {
      if (!el) return;
      el.scrollLeft -= 0.8;
      if (el.scrollLeft <= 0) {
        el.scrollLeft = el.scrollWidth / 2;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused2]);

  const renderRow = (images: GalleryImage[], startIdx: number) =>
    [...images, ...images].map((img, i) => {
      const idx = (startIdx + i) % IMAGES.length;
      return (
        <motion.figure
          key={`${img.label}-${startIdx}-${i}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
          className={`shrink-0 ${SIZE_CLASSES[SIZE_INDEX[idx]]}`}
        >
          <div className="polaroid" style={{ transform: `rotate(${ROTATIONS[idx]}deg)` }}>
            <img
              src={img.src}
              alt={img.label}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="polaroid-label">{img.label}</div>
          </div>
        </motion.figure>
      );
    });

  return (
    <section id="galeria" className="bg-run-beige px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-run-orange">Galería</div>
          <h2 className="editorial-display mt-4 text-5xl text-run-blue md:text-6xl">
            Nuestro año
            <br />
            anterior!
          </h2>
        </div>
      </div>

      <div className="relative mt-14">
        <div
          ref={scrollRef1}
          onMouseEnter={() => setIsPaused1(true)}
          onMouseLeave={() => setIsPaused1(false)}
          className="flex gap-6 overflow-x-hidden py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {renderRow(IMAGES, 0)}
        </div>

        <div
          ref={scrollRef2}
          onMouseEnter={() => setIsPaused2(true)}
          onMouseLeave={() => setIsPaused2(false)}
          className="flex gap-6 overflow-x-hidden py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {renderRow(IMAGES, 4)}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-run-beige to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-run-beige to-transparent" />
      </div>
    </section>
  );
}
