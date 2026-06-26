import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EVENT } from "@/lib/event-config";

export function FooterGsap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1200;
    const h = 300;
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 100px 'Comfortaa', 'Rubik', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("RUNNARACT 2.0", w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w, h).data;
    const gap = 4;
    const particles: { x: number; y: number }[] = [];

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const i = (y * w + x) * 4;
        if (imageData[i + 3] > 128) {
          particles.push({ x, y });
        }
      }
    }

    ctx.clearRect(0, 0, w, h);

    const particleEls: HTMLDivElement[] = [];

    particles.forEach((p, i) => {
      const el = document.createElement("div");
      el.className = "absolute rounded-full bg-run-orange";
      el.style.width = "3px";
      el.style.height = "3px";
      el.style.left = `${(p.x / w) * 100}%`;
      el.style.top = `${(p.y / h) * 100}%`;
      el.style.transform = "translate(-50%, -50%)";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      container.appendChild(el);
      particleEls.push(el);

      gsap.to(el, {
        opacity: 1,
        duration: 0.4,
        delay: i * 0.0015,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(el, {
            opacity: 0.2 + Math.random() * 0.8,
            duration: 1.5 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
    });

    gsap.set(container.querySelectorAll(".footer-content"), { opacity: 0 });

    const tl = gsap.timeline({ delay: particles.length * 0.0015 + 0.5 });
    tl.to(particleEls, {
      opacity: 0,
      duration: 0.8,
      stagger: 0.002,
      ease: "power2.in",
      delay: 3,
    });
    tl.to(container.querySelectorAll(".footer-content"), {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    return () => {
      particleEls.forEach((el) => el.remove());
      tl.kill();
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative min-h-[500px] overflow-hidden bg-ink px-5 py-14 text-white/70"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        aria-hidden
      />

      <div className="footer-content relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-white">
             
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Powered by Zitara &middot; {EVENT.venue}.
            </p>
                  <p>2026 Runnaract. Todos los derechos reservados</p>

          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">Evento</div>
            <ul className="space-y-2">
              <li>
                <a href="#distancias" className="hover:text-white">
                  Distancias
                </a>
              </li>
              <li>
                <a href="#ruta" className="hover:text-white">
                  Ruta
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white">
                  Galería
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
              Contacto
            </div>
            <ul className="space-y-2">
              <li>karinibarra11@gmail.com</li>
              <li>{EVENT.venue}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
