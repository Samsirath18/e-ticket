"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const images = [
    "/gazelle.jpeg",
    "/blanc.jpeg",
    "/cool.jpeg",
    "/evet.jpeg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">

        <div className="absolute inset-0">
          <Image src={images[index]} alt="" fill className="object-cover transition-opacity duration-1000"/>
          <div className="absolute inset-0 bg-black/70"/>
        </div>

        <div className="relative z-10 flex flex-col items-center animate-fade-in">

          {/* LOGO */}
          <Image
            src="/tik.png"
            alt="e-ticket"
            width={300}
            height={300}
            className="mb-6 drop-shadow-2xl"
          />

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Achetez et vendez vos tickets 
          </h1>

          <p className="text-lg mb-8 max-w-xl">
            Découvrez les meilleurs événements au Bénin et réservez en quelques clics
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/events">
              <button className="bg-yellow-500 px-8 py-4 rounded-full font-bold hover:scale-110 transition shadow-xl">
                Voir les événements
              </button>
            </Link>
           <Link href="checkout">
           
            <button className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition">
              Vendre un ticket
            </button>
           
           </Link>
           
          </div>

        </div>
      </section>

      {/* POURQUOI */}
      <section className="py-20 px-6 text-center max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10">Pourquoi choisir e-ticket ?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:scale-105 transition">
            🤝 Networking
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:scale-105 transition">
            💡 Opportunités
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl hover:scale-105 transition">
            🎉 Expérience unique
          </div>
        </div>

        <Link href="/events">
          <button className="mt-10 bg-yellow-500 px-8 py-4 rounded-full font-bold hover:scale-105">
            Explorer les événements
          </button>
        </Link>
      </section>

      {/*  CAROUSEL ROTATION */}
      <section className="py-20 px-6 text-center bg-gray-950">
        <h2 className="text-4xl font-bold mb-12">
          Événements populaires
        </h2>

        <div className="flex justify-center items-center gap-6 perspective">

          {images.map((img, i) => {
            const position = (i - index + images.length) % images.length;

            let className = "w-60 h-80 rounded-xl overflow-hidden transition-all duration-500";

            if (position === 0) className += " scale-110 z-20";
            else if (position === 1) className += " rotate-6 opacity-60";
            else if (position === images.length - 1) className += " -rotate-6 opacity-60";
            else className += " hidden";

            return (
              <div key={i} className={className}>
                <Image src={img} alt="" width={300} height={400} className="object-cover w-full h-full"/>
              </div>
            );
          })}

        </div>

        <Link href="/events">
          <button className="mt-12 bg-yellow-500 px-8 py-4 rounded-full font-bold hover:scale-110">
             Voir tous les événements
          </button>
        </Link>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">Ils témoignent </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
            "Un événement incroyable "
          </div>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
            "Très bien organisé "
          </div>
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
  "Grâce à e-ticket, j’ai vendu tous mes tickets en 48h "
         </div>
         <div className="bg-white/10 p-6 rounded-xl backdrop-blur">
  "Je vous les recommandes"
</div>
        </div>

        <Link href="/tickets">
          <button className="mt-10 bg-yellow-500 px-8 py-4 rounded-full font-bold">
             Réserver maintenant
          </button>
        </Link>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-gradient-to-r from-yellow-500 to-black-500">
  <h2 className="text-4xl font-bold mb-6">
    Lance ton événement avec e-ticket 
  </h2>

  <p className="mb-8 text-lg">
    Vends facilement tes tickets en ligne et touche plus de participants
  </p>

  <div className="flex flex-col sm:flex-row justify-center gap-4">

    {/* CTA PRINCIPAL */}
    <Link href="/checkout">
      <button className="bg-white text-yellow-600 px-10 py-5 rounded-full font-bold hover:scale-110 transition shadow-xl">
        Nous contacter
      </button>
    </Link>

    {/* CTA SECONDAIRE */}
    <Link href="/events">
      <button className="border border-white px-10 py-5 rounded-full hover:bg-white hover:text-orange-600 transition">
         Voir les événements
      </button>
    </Link>

  </div>
</section>

    </main>
  );
}