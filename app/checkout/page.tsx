"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const PRICES = {
  Standard: 5000,
  VIP: 15000,
};

export default function CheckoutPage() {
  const params = useSearchParams();

  const type = params.get("type") as "Standard" | "VIP";
  const qty = Number(params.get("qty") || 1);

  const total = type ? PRICES[type] * qty : 0;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const orderData = {
      ...form,
      type,
      qty,
      total,
    };

    console.log("Commande :", orderData);

    // 👉 BACKEND ICI (soulé)
    // await fetch("/api/order", {...})

    setTimeout(() => {
      setLoading(false);
      alert("Paiement simulé ✅");
    }, 1500);
  };

  return (
    <main className="min-h-screen text-white relative">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image src="/evet.jpeg" alt="" fill className="object-cover"/>
        <div className="absolute inset-0 bg-black/80"/>
      </div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-12">
        Finaliser votre commande
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur p-8 rounded-2xl space-y-4 border border-white/20"
          >

            <h2 className="text-xl font-bold mb-4">
              Vos informations
            </h2>

            <input
              type="text"
              placeholder="Nom complet"
              required
              className="w-full p-3 rounded bg-black/50 border border-white/20 focus:border-orange-500 outline-none"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded bg-black/50 border border-white/20 focus:border-orange-500 outline-none"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="tel"
              placeholder="Téléphone (+22901...)"
              required
              className="w-full p-3 rounded bg-black/50 border border-white/20 focus:border-orange-500 outline-none"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 py-3 rounded-full font-bold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Traitement..." : " Payer maintenant"}
            </button>

          </form>

          {/*  RÉSUMÉ  */}
          <div className="bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl border border-white/20">

            <h2 className="text-xl font-bold mb-6 text-white">
              Résumé de votre commande
            </h2>

            <div className="space-y-4 text-gray-300">

              <div className="flex justify-between">
                <span>Type de ticket</span>
                <span className="font-semibold text-white">{type}</span>
              </div>

              <div className="flex justify-between">
                <span>Quantité</span>
                <span className="font-semibold text-white">{qty}</span>
              </div>

              <div className="flex justify-between">
                <span>Prix unitaire</span>
                <span className="font-semibold text-white">
                  {type && PRICES[type].toLocaleString()} XOF
                </span>
              </div>

            </div>

            <div className="border-t border-white/20 my-6"></div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-orange-500">
                {total.toLocaleString()} XOF
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              ✔ Paiement sécurisé • ✔ Confirmation instantanée
            </p>

          </div>

        </div>

      </div>

{/* FAQ */}
<section className="py-20 px-6 max-w-6xl mx-auto">

  <h2 className="text-4xl font-bold text-center mb-12">
    Questions fréquentes ❓
  </h2>

  <div className="grid md:grid-cols-2 gap-10 items-center">

    {/* IMAGE */}
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl animate-fade-in">
      <Image
        src="/bien.jpg"
        alt="faq"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>
    </div>

    {/* QUESTIONS */}
    <div className="space-y-6">

      <div className="bg-white/10 backdrop-blur p-5 rounded-xl hover:scale-105 transition">
        <h3 className="font-bold text-lg">Comment acheter un ticket ?</h3>
        <p className="text-gray-300 mt-2">
          Choisissez votre événement, sélectionnez votre ticket et suivez les étapes de paiement.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur p-5 rounded-xl hover:scale-105 transition">
        <h3 className="font-bold text-lg">Comment vendre mes tickets ?</h3>
        <p className="text-gray-300 mt-2">
          Contactez-nous via le formulaire et nous vous aidons à publier votre événement.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur p-5 rounded-xl hover:scale-105 transition">
        <h3 className="font-bold text-lg">Le paiement est-il sécurisé ?</h3>
        <p className="text-gray-300 mt-2">
          Oui, toutes les transactions sont sécurisées (le backend sera géré par ton collègue ).
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur p-5 rounded-xl hover:scale-105 transition">
        <h3 className="font-bold text-lg">Puis-je annuler mon ticket ?</h3>
        <p className="text-gray-300 mt-2">
          Cela dépend des conditions de l’événement.
        </p>
      </div>

    </div>

  </div>

</section>



    </main>
  );
}