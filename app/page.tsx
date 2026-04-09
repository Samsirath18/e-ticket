"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    "/boss.png",
    "/gazelle.jpeg",
    "/fille.png",
    "/Dj.png",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">

        <div className="absolute inset-0">
          <Image
            src={images[index]}
            alt=""
            fill
            className="object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 flex flex-col items-center px-4">

        

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-gray-200">
            Achetez et vendez vos tickets
          </h1>

          <p className="text-lg mb-8 max-w-xl text-gray-200">
            Découvrez les meilleurs événements au Bénin et réservez en quelques clics
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/events">
              <button className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition shadow-lg">
                Nous contacter
              </button>
            </Link>

            <Link href="/lancer">
              <button className="border border-yellow-500 text-yellow-600 px-8 py-4 rounded-full hover:bg-white-500 hover:text-white transition">
                Vendre un ticket
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* POURQUOI */}
      <section className="py-20 px-6 text-center max-w-6xl mx-auto bg-white">

        <h2 className="text-4xl font-bold mb-10 text-gray-900">
          Pourquoi choisir e-ticket ?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            🤝 Networking
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            💡 Opportunités
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition">
            🎉 Expérience unique
          </div>

        </div>

        <Link href="/events">
          <button className="mt-10 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 shadow-lg">
            Explorer les événements
          </button>
        </Link>
      </section>
{/* EVENEMENT UNIQUE - MODE AVION */}
<section className="py-24 px-6 bg-gradient-to-b from-yellow to-gray-50">

  {/* HEADER */}
  <div className="text-center mb-14">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
       Événement à ne pas rater
    </h2>

    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
      Découvrez l’événement le plus attendu du moment au Bénin et vivez une expérience unique.
    </p>
  </div>

  {/* CARD */}
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

    {/* IMAGE */}
    <div className="relative">
      <Image
        src="/Avion.png"
        alt="Mode Avion Event"
        width={900}
        height={700}
        className="w-full h-full object-cover"
      />

      {/* overlay léger pour effet premium */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>

    {/* CONTENT */}
    <div className="p-10">

      <span className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm shadow-sm">
        ✨ Événement exclusif
      </span>

      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        MODE AVION — Parakou 2026
      </h3>

      <p className="text-gray-600 mb-4 leading-relaxed">
        En mai 2026 à Parakou, un événement unique prend vie.
        <br /><br />
        Et quand la nuit tombe, l’Afterparty prend feu. DJ, lumières, ambiance blanche, énergie à 100%.
      </p>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Trois ambiances. Une seule journée. Une expérience que Parakou n’a encore jamais connue.
      </p>

      {/* WARNING BOX */}
      <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl mb-8">
        <p className="font-semibold text-yellow-800">
          ⚠️ Places limitées
        </p>
        <p className="text-yellow-700 text-sm mt-2">
          Si tu ressens que tu dois y être, n’attends pas.
          Les regrets appartiennent à ceux qui hésitent trop longtemps.
        </p>
      </div>

      {/* CTA */}
      <Link href="/events">
        <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:scale-105">
          Réserver ma place 
        </button>
      </Link>

    </div>

  </div>

</section>



      {/* CAROUSEL */}
      <section className="py-20 px-6 text-center bg-gray-50">

        <h2 className="text-4xl font-bold mb-12 text-gray-900">
          Événements populaires
        </h2>

        <div className="flex justify-center items-center gap-6">

          {images.map((img, i) => {
            const position = (i - index + images.length) % images.length;

            let className =
              "w-60 h-80 rounded-xl overflow-hidden transition-all duration-500 shadow-lg border border-gray-100";

            if (position === 0) className += " scale-110 z-20";
            else if (position === 1) className += " rotate-6 opacity-60";
            else if (position === images.length - 1)
              className += " -rotate-6 opacity-60";
            else className += " hidden";

            return (
              <div key={i} className={className}>
                <Image
                  src={img}
                  alt=""
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          })}

        </div>

        <Link href="/events">
          <button className="mt-12 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 shadow-lg">
            Voir tous les événements
          </button>
        </Link>
      </section>
{/* TEMOIGNAGES */}
<section className="py-20 px-6 text-center bg-white border-y-4 border-yellow-400">

  <h2 className="text-4xl font-bold mb-10 text-gray-900">
    Ils témoignent
  </h2>

  <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md hover:border-yellow-300 transition">
      "Un événement incroyable"
    </div>

    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md hover:border-yellow-300 transition">
      "Très bien organisé"
    </div>

    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md hover:border-yellow-300 transition">
      "Grâce à e-ticket, j’ai vendu tous mes tickets en 48h"
    </div>

    <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md hover:border-yellow-300 transition">
      "Je vous recommande"
    </div>

  </div>

  <Link href="/tickets">
    <button className="mt-10 bg-yellow-500 text-black px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 hover:bg-yellow-600 transition">
      Réserver maintenant
    </button>
  </Link>

</section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-gradient-to-r from-yellow-400 to-white-500 text-black">

        <h2 className="text-4xl font-bold mb-6">
          Lance ton événement avec e-ticket
        </h2>

        <p className="mb-8 text-lg">
          Vends facilement tes tickets en ligne et touche plus de participants
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">

          <Link href="/checkout">
            <button className="bg-black text-white px-10 py-5 rounded-full font-bold hover:scale-105 transition shadow-lg">
              Nous contacter
            </button>
          </Link>

          <Link href="/events">
            <button className="border border-black px-10 py-5 rounded-full hover:bg-black hover:text-white transition">
              Voir les événements
            </button>
          </Link>

        </div>

      </section>

    </main>
  );
}