"use client";

import Image from "next/image";
import { useState } from "react";

type OrganizerFormState = {
  firstName: string;
  lastName: string;
  email: string;
  eventName: string;
  phone: string;
  message: string;
};

export default function OrganizerPage() {
  const [form, setForm] = useState<OrganizerFormState>({
    firstName: "",
    lastName: "",
    email: "",
    eventName: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/organizers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          eventName: form.eventName,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer votre demande.");
      }

      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        eventName: "",
        phone: "",
        message: "",
      });
    } catch (submitError) {
      console.error(submitError);
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue."
      );
    }
  }

  return (
    <main className="relative min-h-screen text-white">
      <div className="absolute inset-0">
        <Image src="/fete.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl space-y-5 rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl"
        >
          <h1 className="text-center text-3xl font-bold text-yellow-400 md:text-4xl">
            Lancer mon evenement
          </h1>

          <p className="mb-4 text-center text-gray-300">
            Remplissez ce formulaire et publiez votre evenement en quelques minutes.
          </p>

          {status === "success" && (
            <p className="text-center text-green-400">
              Demande envoyee avec succes.
            </p>
          )}

          {status === "error" && (
            <p className="text-center text-red-400">{error}</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="lastName"
              placeholder="Nom"
              value={form.lastName}
              onChange={handleChange}
              className="input-style"
            />
            <input
              name="firstName"
              placeholder="Prenom"
              value={form.firstName}
              onChange={handleChange}
              className="input-style"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="eventName"
            placeholder="Nom de l'evenement"
            value={form.eventName}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Telephone (+229...)"
            value={form.phone}
            onChange={handleChange}
            className="input-style"
          />

          <textarea
            name="message"
            placeholder="Decrivez votre evenement..."
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="input-style"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black shadow-xl transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-yellow-200"
          >
            {status === "loading" ? "Envoi..." : "Envoyer mon evenement"}
          </button>
        </form>
      </div>
    </main>
  );
}
