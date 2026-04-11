"use client";

import Image from "next/image";
import { useState } from "react";

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer votre message.");
      }

      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
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
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="absolute inset-0">
        <Image
          src="/phone.jpg"
          alt="Contact"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="rounded-2xl border border-yellow-300/40 bg-white/10 p-10 shadow-xl backdrop-blur-xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            Contactez-nous
          </h1>

          {status === "success" && (
            <p className="mb-4 text-center text-green-400">
              Message envoye avec succes.
            </p>
          )}

          {status === "error" && (
            <p className="mb-4 text-center text-red-400">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <input
              name="lastName"
              placeholder="Nom"
              value={form.lastName}
              onChange={handleChange}
              className="rounded-xl border border-yellow-200/40 bg-transparent p-3 text-white placeholder-gray-200 focus:border-yellow-400 focus:outline-none"
            />
            <input
              name="firstName"
              placeholder="Prenom"
              value={form.firstName}
              onChange={handleChange}
              className="rounded-xl border border-yellow-200/40 bg-transparent p-3 text-white placeholder-gray-200 focus:border-yellow-400 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="rounded-xl border border-yellow-200/40 bg-transparent p-3 text-white placeholder-gray-200 focus:border-yellow-400 focus:outline-none"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Telephone"
              value={form.phone}
              onChange={handleChange}
              className="rounded-xl border border-yellow-200/40 bg-transparent p-3 text-white placeholder-gray-200 focus:border-yellow-400 focus:outline-none"
            />

            <textarea
              name="message"
              placeholder="Votre message..."
              value={form.message}
              onChange={handleChange}
              className="h-32 rounded-xl border border-yellow-200/40 bg-transparent p-3 text-white placeholder-gray-200 focus:border-yellow-400 focus:outline-none md:col-span-2"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-200 md:col-span-2"
            >
              {status === "loading" ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
