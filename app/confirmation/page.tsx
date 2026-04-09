"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessPage() {

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-black to-black"></div>
      </div>

      {/* CONTENT */}
      <div className={`relative z-10 max-w-md w-full transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">

          {/* ICON */}
          <div className="text-green-400 text-6xl mb-4 animate-bounce">
            ✔
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-3 text-yellow-400">
            Paiement réussi 🎉
          </h1>

          {/* MESSAGE */}
          <p className="text-gray-300 mb-6">
            Votre ticket a été généré avec succès.  
            Vérifiez votre email pour récupérer votre QR code.
          </p>

          {/* INFO BOX */}
          <div className="bg-blue-500/20 text-blue-300 p-4 rounded-xl mb-6 text-sm border border-blue-400/20">
            Présentez votre QR code à l’entrée de l’événement.
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3">

            <Link
              href="/"
              className="bg-yellow-500 text-black py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Retour à l’accueil
            </Link>

            <Link
              href="/events"
              className="border border-white/30 py-3 rounded-full hover:bg-white hover:text-black transition"
            >
              Voir les événements
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}