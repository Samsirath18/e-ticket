"use client";

import Image from "next/image";
import { useState } from "react";
import emailjs from "emailjs-com";

export default function Contact() {

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    emailjs.send(
      "service_zskx37u",
      "template_wrjdl8h",
      {
        name: form.nom + " " + form.prenom,
        email: form.email,
        phone: form.phone,
        message: form.message,
        requestType: "Contact",
      },
      "GAdsPyTGhu3QCJhI2"
    )
    .then(() => {
      setStatus("success");
    })
    .catch(() => {
      setStatus("error");
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative">

      <div className="absolute inset-0">
        <Image src="/phone.jpg" alt="background" fill className="object-cover opacity-10"/>
      </div>

      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 w-full max-w-4xl">

        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-10 border border-yellow-300/40 shadow-xl">

          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Contactez-nous
          </h1>

          {/* MESSAGE STATUS */}
          {status === "success" && (
            <p className="text-green-400 text-center mb-4">
              Message envoyé avec succès ✅
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 text-center mb-4">
              Une erreur est survenue ❌
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <input name="nom" placeholder="Nom" onChange={handleChange} className="bg-transparent border border-yellow-200/40 text-white placeholder-gray-200 rounded-xl p-3 focus:border-yellow-400 focus:outline-none"/>
            <input name="prenom" placeholder="Prénom" onChange={handleChange} className="bg-transparent border border-yellow-200/40 text-white placeholder-gray-200 rounded-xl p-3 focus:border-yellow-400 focus:outline-none"/>
            <input name="email" placeholder="Email" onChange={handleChange} className="bg-transparent border border-yellow-200/40 text-white placeholder-gray-200 rounded-xl p-3 focus:border-yellow-400 focus:outline-none"/>
            <input name="phone" placeholder="Téléphone" onChange={handleChange} className="bg-transparent border border-yellow-200/40 text-white placeholder-gray-200 rounded-xl p-3 focus:border-yellow-400 focus:outline-none"/>

            <textarea name="message" placeholder="Votre message..." onChange={handleChange} className="md:col-span-2 bg-transparent border border-yellow-200/40 text-white placeholder-gray-200 rounded-xl p-3 h-32 focus:border-yellow-400 focus:outline-none"/>

            <button className="md:col-span-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition">
              Envoyer
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}