export type EventConfig = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  amount: number;
  priceLabel: string;
  date: string;
  location: string;
  totalTickets: number;
  maxPerColor: number;
  maxPerGroup: number;
};

export const EVENT_CATALOG: Record<string, EventConfig> = {
  "mode-avion": {
    id: "mode-avion",
    name: "Mode Avion",
    subtitle: "Parakou 2026",
    description:
      "Un evenement immersif a Parakou avec performances, afterparty et ambiance blanche.",
    image: "/Avion.png",
    amount: 6000,
    priceLabel: "6000 FCFA",
    date: "2026-05-16T18:00:00.000Z",
    location: "Parakou, Benin",
    totalTickets: 150,
    maxPerColor: 30,
    maxPerGroup: 30,
  },
};

export function getEventConfig(eventId: string) {
  return EVENT_CATALOG[eventId] ?? null;
}

export function listPublicEvents() {
  return Object.values(EVENT_CATALOG);
}
