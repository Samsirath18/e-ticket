"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getEventConfig } from "@/src/lib/events";

type Color = "ORANGE" | "BLEU" | "BLANC" | "JAUNE" | "ROUGE";
type Group = "A" | "B" | "C" | "D" | "E";

type TicketFormData = {
  fullName: string;
  email: string;
  phone: string;
  color: Color;
  group: Group;
};

const COLORS: Color[] = ["ORANGE", "BLEU", "BLANC", "JAUNE", "ROUGE"];
const GROUPS: Group[] = ["A", "B", "C", "D", "E"];

export default function BuyTicketPage() {
  const params = useParams();
  const eventId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const event = eventId ? getEventConfig(eventId) : null;

  const [form, setForm] = useState<TicketFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: "ORANGE",
    group: "A",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!eventId || !event) {
      setError("Evenement introuvable.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          ...form,
        }),
      });

      const data = (await response.json()) as { message?: string; url?: string };

      if (!response.ok) {
        const message = data.message || "Erreur lors de la creation du paiement.";

        if (
          message.toLowerCase().includes("couleur") ||
          message.toLowerCase().includes("groupe")
        ) {
          setNotice(message);
        } else {
          setError(message);
        }

        return;
      }

      if (!data.url) {
        setError("L'URL de paiement est introuvable.");
        return;
      }

      window.location.assign(data.url);
    } catch (submitError) {
      console.error(submitError);
      setError("Une erreur reseau est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-20 text-white">
      <div className="absolute inset-0">
        <Image src="/mel.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="mb-2 text-center text-3xl font-bold text-yellow-400">
            Acheter un ticket
          </h1>
          <p className="mb-6 text-center text-sm text-gray-200">
            {event
              ? `${event.name} · ${event.subtitle} · ${event.priceLabel}`
              : "Evenement introuvable"}
          </p>

          {notice && (
            <div className="mb-4 rounded bg-red-500/20 p-3 text-center text-sm text-red-200">
              {notice}
            </div>
          )}

          {error && (
            <p className="mb-4 text-center text-sm text-red-300">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-transparent p-3 placeholder-gray-300 focus:border-yellow-400 focus:outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-transparent p-3 placeholder-gray-300 focus:border-yellow-400 focus:outline-none"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Telephone (+229...)"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-transparent p-3 placeholder-gray-300 focus:border-yellow-400 focus:outline-none"
              required
            />

            <p className="-mt-2 text-xs text-gray-300">
              Utilisez si possible votre numero avec l&apos;indicatif pays.
            </p>

            <select
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-black/40 p-3"
            >
              {COLORS.map((color) => (
                <option key={color} value={color}>
                  Couleur {color}
                </option>
              ))}
            </select>

            <select
              name="group"
              value={form.group}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-black/40 p-3"
            >
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  Groupe {group}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading || !event}
              className={`w-full rounded-full py-3 font-bold transition ${
                loading || !event
                  ? "cursor-not-allowed bg-gray-500"
                  : "bg-yellow-500 text-black hover:scale-105"
              }`}
            >
              {loading ? "Redirection..." : `Payer ${event?.priceLabel ?? ""}`}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
