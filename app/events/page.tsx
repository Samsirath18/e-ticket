import Image from "next/image";
import Link from "next/link";

const events = [
  {
    id: "mode-avion",
    name: "Mode d’Avion",
    image: "/Avion.png",
  },
];

export default function EventsPage() {
  return (
    <main className="min-h-screen text-white">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">

        <div className="absolute inset-0">
          <Image src="/cool.jpeg" alt="" fill className="object-cover"/>
          <div className="absolute inset-0 bg-black/70"/>
        </div>

        <div className="relative z-10">
          <Image
            src="/tik.png"
            alt="logo"
            width={180}
            height={180}
            className="mx-auto mb-4"
          />
          <h1 className="text-5xl font-bold">Événements disponibles</h1>
        </div>
      </section>

      {/* LIST */}
      <section className="p-10 max-w-6xl mx-auto">

        <div className="grid md:grid-cols-3 gap-8">

          {events.map((event) => (
            <Link key={event.id} href={`/tickets`}>
              <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden hover:scale-105 transition shadow-lg">

                <div className="relative h-56">
                  <Image src={event.image} alt="" fill className="object-cover"/>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold">{event.name}</h2>
                  <p className="text-gray-300 text-sm mt-2">
                  Tous loins des écrans
                  </p>
                  <p className="text-gray-300 text-sm mt-2">
                    Cliquez pour réserver votre place
                  </p>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="py-20 text-center bg-gradient-to-r from-yellow-500 to-black-500">
        <h2 className="text-3xl font-bold mb-4">
          Vous organisez un événement ?
        </h2>

        <Link href="/checkout">
          <button className="bg-white text-yellow-600 px-8 py-4 rounded-full font-bold hover:scale-110">
             Vendre mes tickets
          </button>
        </Link>
      </section>

    </main>
  );
}