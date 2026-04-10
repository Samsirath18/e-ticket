"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t border-white/10">

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* LOGO */}
       <Link href="/" className="flex items-center gap-2">
        <div className="relative w-32 h-32">
  <Image
    src="/Go-ticket.png"
    alt="logo"
    fill
    className="object-contain"
  />
</div>
      </Link>

        {/* NAV */}
        <div>
          <h3 className="font-bold mb-3">Navigation</h3>
          <div className="flex flex-col gap-2 text-gray-400">
            <Link href="/events">Événements</Link>
            <Link href="/about">À propos</Link>
            <Link href="/checkout">Contact</Link>
          </div>
        </div>

        {/* CTA */}
        <div>
          <h3 className="font-bold mb-3">Organisateur ?</h3>
          <p className="text-gray-400 mb-4">
            Vendez vos tickets facilement sur e-ticket
          </p>

          <Link href="/lancer">
            <button className="bg-yellow-500 px-6 py-3 rounded-full hover:scale-105 transition">
              Lancer mon évènement
            </button>
          </Link>
        </div>
 

             <div className="text-center text-gray-500 mt-10 text-sm border-t border-white/10 pt-6">
            © {new Date().getFullYear()} GO-TICKET. Tous droits réservés.
            </div>
      </div>

    </footer>
  );
}