"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import api from "../../../../src/lib/axios"
import axios from "axios"

// ✅ TYPES ALIGNÉS PRISMA
type Color = "ORANGE" | "BLEU" | "BLANC" | "JAUNE" | "ROUGE"
type Group = "A" | "B" | "C" | "D" | "E"

type TicketFormData = {
  fullName: string
  email: string
  phone: string
  color: Color
  group: Group
}

const COLORS: Color[] = ["ORANGE", "BLEU", "BLANC", "JAUNE", "ROUGE"]
const GROUPS: Group[] = ["A", "B", "C", "D", "E"]

export default function BuyTicketPage() {
  const params = useParams()
  const eventId = params?.id as string

  const [form, setForm] = useState<TicketFormData>({
    fullName: "",
    email: "",
    phone: "",
    color: "ORANGE",
    group: "A",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [popup, setPopup] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!eventId) {
      setError("Event introuvable")
      return
    }

    setLoading(true)
    setError("")
    setPopup("")

    try {
      const res = await api.post("/payements/create", {
        eventId,
        ...form,
      })

      // ✅ FIX backend → url
      window.location.href = res.data.url

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message

        if (
          message?.toLowerCase().includes("couleur") ||
          message?.toLowerCase().includes("group")
        ) {
          setPopup(message)
        } else {
          setError(message || "Erreur lors du paiement")
        }
      } else {
        setError("Erreur inconnue")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Acheter un ticket
      </h1>

      {/* 🔥 POPUP (limite atteinte) */}
      {popup && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          {popup}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Nom complet"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* 🎨 COLOR */}
        <select
          name="color"
          value={form.color}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {COLORS.map((color) => (
            <option key={color} value={color}>
              Couleur {color}
            </option>
          ))}
        </select>

        {/* 👥 GROUP */}
        <select
          name="group"
          value={form.group}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {GROUPS.map((group) => (
            <option key={group} value={group}>
              Groupe {group}
            </option>
          ))}
        </select>

        {/* ❌ ERREUR */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Traitement..." : "Payer"}
        </button>
      </form>
    </div>
  )
}