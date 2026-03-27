"use client";

import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="text-white">

      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center text-center">

        <div className="absolute inset-0">
          <Image src="/cool.jpeg" alt="" fill className="object-cover"/>
          <div className="absolute inset-0 bg-black/70"/>
        </div>

        <div className="relative z-10 animate-slide">
          <h1 className="text-5xl font-extrabold mb-4">
            À propos de e-ticket
          </h1>
          <p className="text-lg text-gray-300">
            La plateforme qui révolutionne la vente de tickets
          </p>
        </div>

      </section>

      {/* CONTENU */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-24">

        {/* BLOC 1 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="animate-slide">
            <h2 className="text-3xl font-bold mb-4">Notre mission</h2>
            <p className="text-gray-300">
              Permettre à chaque organisateur de vendre ses tickets facilement,
              rapidement et sans complexité technique.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-orange-500 shadow-2xl animate-float hover:scale-110 transition duration-500">

              <Image src="/gazelle.jpeg" alt="" fill className="object-cover"/>

              <div className="absolute inset-0 bg-black/40"></div>

            </div>
          </div>

        </div>

        {/* BLOC 2 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="flex justify-center order-2 md:order-1">
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl animate-float hover:scale-110 transition duration-500">

              <Image src="/cool.jpeg" alt="" fill className="object-cover"/>
              <div className="absolute inset-0 bg-black/40"></div>

            </div>
          </div>

          <div className="order-1 md:order-2 animate-slide">
            <h2 className="text-3xl font-bold mb-4">Pourquoi e-ticket ?</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✔ Vente rapide et sécurisée</li>
              <li>✔ Visibilité maximale</li>
              <li>✔ Expérience simple et fluide</li>
            </ul>
          </div>

        </div>

        {/* BLOC 3 */}
        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div className="animate-slide">
            <h2 className="text-3xl font-bold mb-4">Vision</h2>
            <p className="text-gray-300">
              Devenir la plateforme numéro 1 de billetterie en Afrique.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-orange-400 shadow-2xl animate-float hover:scale-110 transition duration-500">

              <Image src="/blanc.jpeg" alt="" fill className="object-cover"/>
              <div className="absolute inset-0 bg-black/40"></div>

            </div>
          </div>

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl mx-6 mb-10">

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Lance ton événement avec e-ticket
        </h2>

        <p className="mb-8 text-lg">
          Rejoins les organisateurs qui vendent déjà leurs tickets
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link href="/checkout">
            <button className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold hover:scale-110 transition shadow-xl">
              Nous contacter
            </button>
          </Link>

          <Link href="/events">
            <button className="border border-white px-10 py-4 rounded-full hover:bg-white hover:text-orange-600 transition">
              Voir les événements
            </button>
          </Link>

        </div>

      </section>

    </main>
  );
}