"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">

        <div className="absolute inset-0">
          <Image src="/cket.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-yellow-500/20" />
        </div>

        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            À propos de e-ticket
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto">
            La plateforme qui révolutionne la vente de tickets
          </p>
        </div>

      </section>

      {/* CONTENU */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-28">

        {/* BLOC 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-500">
              Notre mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Permettre à chaque organisateur de vendre ses tickets facilement,
              rapidement et sans complexité technique grâce à une plateforme simple et moderne.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-xl border border-yellow-100 hover:scale-105 transition">

              <Image src="/oks.jpg" alt="" fill className="object-cover" />

            </div>
          </div>

        </div>

        {/* BLOC 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div className="flex justify-center order-2 md:order-1">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-xl border border-yellow-100 hover:scale-105 transition">

              <Image src="/pkw.jpg" alt="" fill className="object-cover" />

            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-4 text-yellow-500">
              Pourquoi e-ticket ?
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>✔ Vente rapide et sécurisée</li>
              <li>✔ Visibilité maximale des événements</li>
              <li>✔ Expérience simple et fluide</li>
            </ul>
          </div>

        </div>

        {/* BLOC 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-500">
              Vision
            </h2>
            <p className="text-gray-600">
              Devenir la plateforme numéro 1 de billetterie en Afrique avec une
              expérience utilisateur simple et rapide.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-xl border border-yellow-100 hover:scale-105 transition">

              <Image src="/vission.jpg" alt="" fill className="object-cover" />

            </div>
          </div>

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Lance ton événement avec e-ticket
        </h2>

        <p className="mb-8 text-lg">
          Rejoins les organisateurs qui vendent déjà leurs tickets
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link href="/checkout">
            <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition shadow-lg">
              Nous contacter
            </button>
          </Link>

          <Link href="/events">
            <button className="border border-black px-10 py-4 rounded-full hover:bg-black hover:text-white transition">
              Voir les événements
            </button>
          </Link>

        </div>

      </section>

    </main>
  );
}