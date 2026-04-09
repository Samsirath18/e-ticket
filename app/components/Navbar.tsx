"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 
    bg-black/40 backdrop-blur-xl border-b border-white/10 
    text-white px-8 py-5 flex justify-between items-center">

      {/* LOGO */}
      <Link href="/" className="flex items-center">
        <div className="relative w-30 h-30">
          <Image src="/tik.png" alt="logo" fill className="object-contain" />
        </div>
      </Link>

      {/* MENU DESKTOP */}
      <div className="hidden md:flex items-center gap-10 font-medium text-lg">

        <Link href="/events"
          className={pathname === "/events"
            ? "text-yellow-400 font-bold"
            : "hover:text-yellow-400 transition"}>
          Événements
        </Link>

        <Link href="/about"
          className={pathname === "/about"
            ? "text-yellow-400 font-bold"
            : "hover:text-yellow-400 transition"}>
          À propos
        </Link>

        <Link href="/checkout"
          className={pathname === "/checkout"
            ? "text-yellow-400 font-bold"
            : "hover:text-yellow-400 transition"}>
          Contact
        </Link>

      </div>

      {/* CTA */}
      <div className="hidden md:block">
        <Link href="/lancer">
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg">
            Lancer mon événement
          </button>
        </Link>
      </div>

      {/* MOBILE BTN */}
      <button onClick={() => setOpen(true)} className="md:hidden text-3xl">
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setOpen(false)} />
      )}

      {/* MOBILE MENU */}
      <div className={`fixed top-0 right-0 h-full w-[80%] bg-black/95 backdrop-blur-xl z-50 transition-transform duration-500
        ${open ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <Image src="/tik.png" alt="logo" width={100} height={50} />
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="flex flex-col gap-6 p-6 text-lg">

          <Link href="/events" onClick={() => setOpen(false)}>Événements</Link>
          <Link href="/about" onClick={() => setOpen(false)}>À propos</Link>
          <Link href="/checkout" onClick={() => setOpen(false)}>Contact</Link>

          <Link href="/lancer" onClick={() => setOpen(false)}>
            <button className="bg-yellow-500 w-full py-3 rounded-full font-bold text-black">
              Lancer mon événement
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
}