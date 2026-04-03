"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-black/80 backdrop-blur-md text-white px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/10">

      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <Image
            src="/tik.png"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      {/* MENU DESKTOP */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/events" className="hover:text-yellow-400 transition">
          Événements
        </Link>

        <Link href="/about" className="hover:text-yellow-400 transition">
          À propos
        </Link>

        <Link href="/contact" className="hover:text-yellow-400 transition">
          Contact
        </Link>
      </div>

      {/* CTA DESKTOP */}
      <div className="hidden md:flex gap-3">
        <Link href="/events">
          <button className="bg-yellow-500 px-5 py-2 rounded-full hover:scale-105 transition">
            Explorer
          </button>
        </Link>

        <Link href="/tickets">
          <button className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition">
            Acheter
          </button>
        </Link>
      </div>

      {/* MENU MOBILE BUTTON */}
      <button onClick={() => setOpen(true)} className="md:hidden text-2xl">
  ☰
</button>
{/* OVERLAY */}
{open && (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
    onClick={() => setOpen(false)}
  />
)}

{/* MENU MOBILE */}
<div className={`fixed top-0 right-0 h-full w-[80%] max-w-sm z-50 
  bg-gradient-to-b from-black/95 via-black/90 to-gray-900/95 backdrop-blur-xl border-l border-white/10
  transform transition-transform duration-500 ease-in-out
  ${open ? "translate-x-0" : "translate-x-full"}`}>

  {/* HEADER AVEC LOGO */}
  <div className="flex justify-between items-center p-6 border-b border-white/10">

    <Image
      src="/tik.png"
      alt="logo"
      width={100}
      height={40}
      className="object-contain"
    />

    <button 
      onClick={() => setOpen(false)} 
      className="text-2xl text-white hover:text-yellow-400 transition"
    >
      ✕
    </button>
  </div>

  {/* MENU LINKS */}
  <div className="flex flex-col gap-3 p-6 text-lg">

    <Link 
      href="/events" 
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
      ${pathname === "/events"
        ? "bg-yellow-500 text-black font-bold shadow-lg"
        : "hover:bg-white/10 hover:text-yellow-400"
      }`}
    >
      Événements
    </Link>

    <Link 
      href="/about" 
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
      ${pathname === "/about"
        ? "bg-yellow-500 text-black font-bold shadow-lg"
        : "hover:bg-white/10 hover:text-yellow-400"
      }`}
    >
      À propos
    </Link>

    <Link 
      href="/checkout" 
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
      ${pathname === "/checkout"
        ? "bg-yellow-500 text-black font-bold shadow-lg"
        : "hover:bg-white/10 hover:text-yellow-400"
      }`}
    >
      Contact
    </Link>

  </div>

  {/* CTA */}
  <div className="mt-6 px-6 flex flex-col gap-4">

    <Link href="/events" onClick={() => setOpen(false)}>
      <button className="w-full bg-yellow-500 text-black py-3 rounded-full font-bold hover:scale-105 transition shadow-lg">
         Explorer
      </button>
    </Link>

    <Link href="/tickets" onClick={() => setOpen(false)}>
      <button className="w-full border border-white py-3 rounded-full hover:bg-white hover:text-black transition">
        Acheter un ticket
      </button>
    </Link>

  </div>

</div>
    </nav>
  );
}