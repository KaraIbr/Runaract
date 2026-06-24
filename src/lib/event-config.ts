// Runnaract 2.0 — event configuration

export const EVENT = {
  name: "Runnaract 2.0",
  poweredBy: "Zitara",
  venue: "Zitara Golf Club",
  date: new Date("2026-09-06T07:00:00-06:00"),
  registrationDeadline: new Date("2026-09-04T23:59:59-06:00"),
  phaseOneDeadline: new Date("2026-07-10T23:59:59-06:00"),
  capacity: 2000,
} as const;

export type Distance = "3k" | "5k" | "10k";

export const PRICES: Record<"phase1" | "phase2", Record<Distance, number>> = {
  phase1: { "3k": 300, "5k": 400, "10k": 450 },
  phase2: { "3k": 350, "5k": 450, "10k": 500 },
};

export function currentPhase(now: Date = new Date()): "phase1" | "phase2" {
  return now <= EVENT.phaseOneDeadline ? "phase1" : "phase2";
}

export function getPrices(now: Date = new Date()) {
  return PRICES[currentPhase(now)];
}
