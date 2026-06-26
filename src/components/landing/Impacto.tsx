import { useState, useRef, useCallback } from "react";

const PHRASES = [
  "Donación de materiales didácticos",
  "Capacitaciones de movilidad y cuidado",
  "Donaciones de sillas de ruedas",
  "Visitas periódicas y convivencia",
];

function r(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Impacto() {
  const [hoveredWord, setHoveredWord] = useState<{ line: number; word: number } | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<{ line: number; word: number; char: number } | null>(null);
  const vars = useRef<Map<string, [number, number, number]>>(new Map());
  const [, re] = useState(0);

  const k = (l: number, w: number, c: number) => `${l}-${w}-${c}`;

  const onWordEnter = useCallback((l: number, w: number, word: string) => {
    for (let c = 0; c < word.length; c++) {
      vars.current.set(k(l, w, c), [r(-25, 25), r(-25, 25), r(-20, 20)]);
    }
    setHoveredWord({ line: l, word: w });
    setHoveredLetter(null);
    re((n) => n + 1);
  }, []);

  const onWordLeave = useCallback(() => {
    setHoveredWord(null);
    setHoveredLetter(null);
    re((n) => n + 1);
  }, []);

  const onLetterEnter = useCallback((l: number, w: number, c: number) => {
    vars.current.set(k(l, w, c), [r(-8, 8), r(-8, 8), r(-8, 8)]);
    setHoveredLetter({ line: l, word: w, char: c });
    re((n) => n + 1);
  }, []);

  const isActive = (l: number, w: number) =>
    hoveredWord !== null && hoveredWord.line === l && hoveredWord.word === w;

  return (
    <div className="impacto mt-6 w-full">
      <p className="inline-flex flex-col items-center gap-3">
        {PHRASES.map((phrase, l) => (
          <span key={l} className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {phrase.split(" ").map((word, w) => (
              <span
                key={w}
                className="cursor-default transition-opacity duration-200"
                style={{ opacity: hoveredWord && !isActive(l, w) ? 0.2 : 1 }}
                onMouseEnter={() => onWordEnter(l, w, word)}
                onMouseLeave={onWordLeave}
              >
                {word.split("").map((char, c) => {
                  const v = vars.current.get(k(l, w, c));
                  const active = isActive(l, w);
                  const letterHovered =
                    hoveredLetter &&
                    hoveredLetter.line === l &&
                    hoveredLetter.word === w &&
                    hoveredLetter.char === c;

                  const s: React.CSSProperties = {};
                  if (active && v) {
                    s.transform = `translate(${v[0]}%, ${v[1]}%) rotate(${v[2]}deg) scale(${letterHovered ? 1.35 : 1})`;
                  }
                  if (letterHovered) {
                    s.color = "var(--run-orange)";
                    s.textShadow = "0 4px 12px oklch(0.68 0.18 38 / 0.3)";
                    s.zIndex = 2;
                  }

                  return (
                    <span
                      key={c}
                      className={`letter ${letterHovered ? "wobble" : ""}`}
                      style={s}
                      onMouseEnter={() => onLetterEnter(l, w, c)}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  );
}
