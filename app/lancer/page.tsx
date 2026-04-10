"use client";

import Image from "next/image";
import { useState } from "react";
import emailjs from "emailjs-com";

export default function Lancer() {

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    event: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    // ✅ VALIDATION
    if (!form.nom || !form.prenom || !form.email || !form.event || !form.phone || !form.message) {
      setStatus("error");
      return;
    }

    emailjs.send(
      "service_8y67a8i",
      "template_u6slwbj",
      {
        name: form.nom + " " + form.prenom,
        email: form.email,
        phone: form.phone,
        event: form.event,
        message: form.message,
      },
      "baziNbYizwfZDBk1C"
    )
    .then(() => {
      setStatus("success");

      // ✅ RESET FORM
      setForm({
        nom: "",
        prenom: "",
        email: "",
        event: "",
        phone: "",
        message: "",
      });
    })
    .catch(() => {
      setStatus("error");
    });
  }

  return (
    <main className="min-h-screen relative text-white">

      <div className="absolute inset-0">
        <Image src="/fete.png" alt="" fill className="object-cover"/>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 py-20">

        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl space-y-5">

          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center">
            Lancer mon événement 
          </h1>

          <p className="text-center text-gray-300 mb-4">
            Remplissez ce formulaire et publiez votre événement en quelques minutes
          </p>

          {status === "success" && (
            <p className="text-green-400 text-center">
              Demande envoyée avec succès ✅
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 text-center">
              Veuillez remplir tous les champs ❌
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4">

            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" className="input-style"/>
            <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" className="input-style"/>

          </div>

          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input-style"/>
          <input name="event" value={form.event} onChange={handleChange} placeholder="Nom de l'événement" className="input-style"/>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Téléphone (+229...)" className="input-style"/>

          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Décrivez votre événement..." rows={4} className="input-style"/>

          <button className="w-full bg-yellow-500 text-black py-3 rounded-full font-bold hover:scale-105 transition shadow-xl">
            Envoyer mon événement
          </button>

        </form>

      </div>
    </main>
  );
}