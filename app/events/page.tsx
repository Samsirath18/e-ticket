import Image from "next/image";
import Link from "next/link";

const events = [
  {
    id: "mode-avion",
    name: "Mode d’Avion",
    image: "/Avion.png",
    price: "6000 FCFA",
    description:
      "Un événement unique pour se déconnecter du digital et vivre une expérience réelle.",
  },
  
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">

        <div className="absolute inset-0">
          <Image src="/Show.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 px-4">


          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Événements disponibles
          </h1>

          <p className="text-gray-200 mt-3">
            Réservez vos tickets et vivez des expériences uniques
          </p>

        </div>
      </section>

      {/* LIST */}
      <section className="py-16 px-6 max-w-6xl mx-auto">

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">

          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition"
            >

              {/* IMAGE */}
              <div className="relative h-60">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">

                <h2 className="text-xl font-bold mb-2">
                  {event.name}
                </h2>

                <p className="text-gray-600 text-sm mb-3">
                  {event.description}
                </p>

                <p className="text-yellow-600 font-bold text-lg mb-4">
                  {event.price}
                </p>

                <Link href={`/tickets/${event.id}`}>
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-full font-bold transition">
                    Payer maintenant
                  </button>
                </Link>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">

        <h2 className="text-3xl font-bold mb-4">
          Vous organisez un événement ?
        </h2>

        <p className="mb-6">
          Publiez vos événements et vendez vos tickets facilement
        </p>

        <Link href="/checkout">
          <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition">
            Vendre mes tickets
          </button>
        </Link>

      </section>

    </main>
  );
}