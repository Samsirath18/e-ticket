"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus } from "lucide-react";
import Image from "next/image";

const PRICES = { Standard: 5000, VIP: 15000 };

export default function TicketsPage() {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState<"Standard" | "VIP" | null>(null);
  const [quantity, setQuantity] = useState(1);

  const total = selectedTicket ? PRICES[selectedTicket] * quantity : 0;

  return (
    <main className="min-h-screen text-white relative">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <Image src="/evet.jpeg" alt="ticket" fill className="object-cover"/>
        <div className="absolute inset-0 bg-black/80"/>
      </div>

      <div className="relative z-10 px-6 py-12">

        <h1 className="text-4xl font-bold text-center mb-12">
          Choisissez votre ticket
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* STANDARD */}
          <div
            onClick={() => setSelectedTicket("Standard")}
            className={`p-8 rounded-2xl cursor-pointer backdrop-blur border ${
              selectedTicket === "Standard"
                ? "border-orange-500 scale-105 shadow-2xl"
                : "border-white/20 hover:scale-105"
            }`}
          >
            <h2 className="text-2xl font-bold">Standard</h2>
            <p className="text-gray-300">Accès général</p>
            <p className="text-3xl text-orange-500 mt-4">5 000 XOF</p>

            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2"><Check/> Accès événement</li>
              <li className="flex items-center gap-2"><Check/> Networking</li>
            </ul>
          </div>

          {/* VIP */}
          <div
            onClick={() => setSelectedTicket("VIP")}
            className={`p-8 rounded-2xl cursor-pointer backdrop-blur border ${
              selectedTicket === "VIP"
                ? "border-orange-500 scale-105 shadow-2xl"
                : "border-white/20 hover:scale-105"
            }`}
          >
            <h2 className="text-2xl font-bold">VIP</h2>
            <p className="text-gray-300">Expérience premium</p>
            <p className="text-3xl text-orange-500 mt-4">15 000 XOF</p>
          </div>

        </div>

        {/* TOTAL */}
        {selectedTicket && (
          <div className="mt-10 bg-white/10 backdrop-blur p-6 rounded-xl max-w-3xl mx-auto flex justify-between items-center">

            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(q => Math.max(1, q-1))}><Minus/></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)}><Plus/></button>
            </div>

            <h2 className="text-2xl font-bold text-orange-500">
              {total.toLocaleString()} XOF
            </h2>

            <button
              onClick={() => router.push(`/checkout?type=${selectedTicket}&qty=${quantity}`)}
              className="bg-orange-500 px-6 py-3 rounded-full"
            >
              Continuer
            </button>

          </div>
        )}

      </div>
    </main>
  );
}