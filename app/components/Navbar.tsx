"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/events", label: "Evenements" },
  { href: "/about", label: "A propos" },
  { href: "/checkout", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/40 px-8 py-5 text-white backdrop-blur-xl">
      <Link href="/" className="flex items-center">
        <div className="relative h-12 w-36">
          <Image
            src="/GO-ticket.png"
            alt="GO-TICKET"
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </div>
      </Link>

      <div className="hidden items-center gap-10 text-lg font-medium md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "font-bold text-yellow-400"
                : "transition hover:text-yellow-400"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:block">
        <Link href="/lancer">
          <button className="rounded-full bg-yellow-500 px-8 py-3 font-bold text-black shadow-lg transition hover:scale-105">
            Lancer mon evenement
          </button>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-3xl md:hidden"
        aria-label="Ouvrir le menu"
      >
        Menu
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/95"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-[85%] bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-yellow-500/20 p-6">
          <Image
            src="/GO-ticket.png"
            alt="GO-TICKET"
            width={100}
            height={50}
            style={{ width: "auto", height: "auto" }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-2xl text-white transition hover:text-yellow-400"
            aria-label="Fermer le menu"
          >
            X
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6 pt-12 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-3 transition ${
                pathname === link.href
                  ? "bg-yellow-500 font-bold text-black shadow-lg"
                  : "text-gray-300 hover:bg-white/5 hover:text-yellow-400"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6">
            <Link href="/lancer" onClick={() => setOpen(false)}>
              <button className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black shadow-xl transition hover:scale-105">
                Lancer mon evenement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
