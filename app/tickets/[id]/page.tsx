"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "../../lib/axios";
import axios from "axios";

// TYPES
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
  const eventId = params?.id as string;

  const [form, setForm] = useState<TicketFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: "ORANGE",
    group: "A",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!eventId) {
      setError("Event introuvable");
      return;
    }

    setLoading(true);
    setError("");
    setPopup("");
console.log("DATA ENVOYÉE :", {
  eventId,
  ...form,
});
    try {
      const res = await api.post("/payements/create", {
        eventId,
        ...form,
      });

      window.location.href = res.data.url;

    } 
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message;

        if (
          message?.toLowerCase().includes("couleur") ||
          message?.toLowerCase().includes("group")
        ) {
          setPopup(message);
        } else {
          setError(message || "Erreur lors du paiement");
        }
      } else {
        setError("Erreur inconnue");
      }console.log(err);
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src="/mel.png" // change si tu veux
          alt="background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* FORM */}
      <div className="relative z-10 w-full max-w-lg">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
            Acheter un ticket
          </h1>

          {/* POPUP */}
          {popup && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm text-center">
              {popup}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-center mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/30 p-3 rounded-xl placeholder-gray-300 focus:outline-none focus:border-yellow-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/30 p-3 rounded-xl placeholder-gray-300 focus:outline-none focus:border-yellow-400"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-transparent border border-white/30 p-3 rounded-xl placeholder-gray-300 focus:outline-none focus:border-yellow-400"
              required
            />

            {/* COLOR */}
            <select
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/30 p-3 rounded-xl"
            >
              {COLORS.map((color) => (
                <option key={color} value={color}>
                  Couleur {color}
                </option>
              ))}
            </select>

            {/* GROUP */}
            <select
              name="group"
              value={form.group}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/30 p-3 rounded-xl"
            >
              {GROUPS.map((group) => (
                <option key={group} value={group}>
                  Groupe {group}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-yellow-500 text-black hover:scale-105"
              }`}
            >
              {loading ? "Traitement..." : "Payer"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}