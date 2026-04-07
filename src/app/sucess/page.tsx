"use client"

import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">

        {/* ✅ ICON SUCCESS */}
        <div className="text-green-500 text-5xl mb-4">
          ✔
        </div>

        {/* 🎉 TITLE */}
        <h1 className="text-2xl font-bold mb-2">
          Paiement réussi !
        </h1>

        {/* 📩 MESSAGE */}
        <p className="text-gray-600 mb-6">
          Votre ticket a été généré avec succès.  
          Veuillez vérifier votre email pour récupérer votre QR code.
        </p>

        {/* INFO BOX */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded mb-6 text-sm">
          Présentez votre QR code à l’entrée de l’événement.
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Retour à l’accueil
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="border py-2 rounded hover:bg-gray-100"
          >
            Rafraîchir
          </button>
        </div>
      </div>
    </div>
  )
}