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
          <Image src="/GO-ticket.png" alt="logo" fill className="object-contain" />
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
  <div
    className="fixed inset-0 bg-black/95 "
    onClick={() => setOpen(false)}
  />
)}

{/* MOBILE MENU */}
<div
  className={`fixed top-0 right-0 h-full w-[85%] bg-gradient-to-b from-black via-gray-900 to-black z-50 transition-transform duration-500 shadow-2xl
  ${open ? "translate-x-0" : "translate-x-full"}`}
>

  {/* HEADER */}
  <div className="flex justify-between items-center p-6 border-b border-yellow-500/20">
    <Image src="/GO-ticket.png" alt="logo" width={100} height={50} />
    <button onClick={() => setOpen(false)} className="text-2xl text-white hover:text-yellow-400">
      ✕
    </button>
  </div>

  {/* MENU */}
  <div className="flex flex-col gap-4 p-6 pt-12 text-lg font-medium">

    <Link
      href="/events"
      onClick={() => setOpen(false)}
      className={`px-4 py-3 rounded-lg transition ${
        pathname === "/events"
          ? "bg-yellow-500 text-black font-bold shadow-lg"
          : "text-gray-300 hover:bg-white/5 hover:text-yellow-400"
      }`}
    >
       Événements
    </Link>

    <Link
      href="/about"
      onClick={() => setOpen(false)}
      className={`px-4 py-3 rounded-lg transition ${
        pathname === "/about"
          ? "bg-yellow-500 text-black font-bold shadow-lg"
          : "text-gray-300 hover:bg-white/5 hover:text-yellow-400"
      }`}
    >
      À propos
    </Link>

    <Link
      href="/checkout"
      onClick={() => setOpen(false)}
      className={`px-4 py-3 rounded-lg transition ${
        pathname === "/checkout"
          ? "bg-yellow-500 text-black font-bold shadow-lg"
          : "text-gray-300 hover:bg-white/5 hover:text-yellow-400"
      }`}
    >
      Contact
    </Link>

    {/* CTA */}
    <div className="mt-6">
      <Link href="/lancer" onClick={() => setOpen(false)}>
        <button className="bg-yellow-500 w-full py-3 rounded-full font-bold text-black shadow-xl hover:scale-105 transition">
          Lancer mon événement
        </button>
      </Link>
    </div>

  </div>
</div>
    </nav>
  );
}