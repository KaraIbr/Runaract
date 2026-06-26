import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event-config";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const cell = "flex flex-col items-center";
const num =
  "font-display tabular-nums text-5xl sm:text-6xl md:text-7xl font-bold leading-none text-run-blue";
const lbl = "mt-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground";

export function Countdown() {
  const [t, setT] = useState(() => diff(EVENT.date));
  useEffect(() => {
    const i = setInterval(() => setT(diff(EVENT.date)), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-[11px] uppercase tracking-[0.3em] text-run-blue font-semibold">
        FALTAN…
      </span>
      <div className="grid grid-cols-4 gap-4 sm:gap-8 md:gap-12">
        <div className={cell}>
          <span className={num}>{String(t.days).padStart(2, "0")}</span>
          <span className={lbl}>Días</span>
        </div>
        <div className={cell}>
          <span className={num}>{String(t.hours).padStart(2, "0")}</span>
          <span className={lbl}>Horas</span>
        </div>
        <div className={cell}>
          <span className={num}>{String(t.minutes).padStart(2, "0")}</span>
          <span className={lbl}>Minutos</span>
        </div>
        <div className={cell}>
          <span className={num}>{String(t.seconds).padStart(2, "0")}</span>
          <span className={lbl}>Segundos</span>
        </div>
      </div>
    </div>
  );
}
