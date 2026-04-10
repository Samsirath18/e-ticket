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
{/* MOBILE MENU SIMPLE */}
{open && (
  <div className="md:hidden absolute top-full left-0 w-full bg-white text-black border-t border-gray-200 shadow-md">

    <div className="flex flex-col p-5 gap-4 text-lg font-medium">

      <Link
        href="/events"
        onClick={() => setOpen(false)}
        className={
          pathname === "/events"
            ? "text-yellow-500 font-bold"
            : "text-gray-800"
        }
      >
        Événements
      </Link>

      <Link
        href="/about"
        onClick={() => setOpen(false)}
        className={
          pathname === "/about"
            ? "text-yellow-500 font-bold"
            : "text-gray-800"
        }
      >
        À propos
      </Link>

      <Link
        href="/checkout"
        onClick={() => setOpen(false)}
        className={
          pathname === "/checkout"
            ? "text-yellow-500 font-bold"
            : "text-gray-800"
        }
      >
        Contact
      </Link>

      {/* CTA */}
      <Link href="/lancer" onClick={() => setOpen(false)}>
        <button className="mt-3 w-full bg-yellow-500 text-black py-3 rounded-full font-bold">
          Lancer mon événement
        </button>
      </Link>

    </div>

  </div>
)}
    </nav>
  );
}