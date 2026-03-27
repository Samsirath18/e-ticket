"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10">

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <div className="relative w-32 h-32">
  <Image
    src="/tik.png"
    alt="logo"
    fill
    className="object-contain"
  />
</div>
      </Link>

      {/* MENU */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/events" className="hover:text-orange-400 transition">
          Événements
        </Link>

        <Link href="/about" className="hover:text-orange-400 transition">
          À propos
        </Link>

        <Link href="/checkout" className="hover:text-orange-400 transition">
          Contact
        </Link>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link href="/events">
          <button className="bg-orange-500 px-5 py-2 rounded-full hover:scale-105 transition">
            Explorer
          </button>
        </Link>

        <Link href="/tickets">
          <button className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
            Acheter un ticket
          </button>
        </Link>
      </div>

    </nav>
  );
}