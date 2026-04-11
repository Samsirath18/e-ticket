import Image from "next/image";
import Link from "next/link";
import { listPublicEvents } from "@/src/lib/events";

const events = listPublicEvents();

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="relative flex h-[60vh] items-center justify-center text-center">
        <div className="absolute inset-0">
          <Image src="/Show.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Evenements disponibles
          </h1>
          <p className="mt-3 text-gray-200">
            Reserve tes tickets et vis des experiences uniques
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition hover:shadow-xl"
            >
              <div className="relative h-60">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h2 className="mb-1 text-xl font-bold">{event.name}</h2>
                <p className="mb-3 text-sm text-gray-500">
                  {event.subtitle} · {event.location}
                </p>
                <p className="mb-3 text-sm text-gray-600">{event.description}</p>
                <p className="mb-4 text-lg font-bold text-yellow-600">
                  {event.priceLabel}
                </p>

                <Link href={`/tickets/${event.id}`}>
                  <button className="w-full rounded-full bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-600">
                    Payer maintenant
                  </button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-20 text-center text-black">
        <h2 className="mb-4 text-3xl font-bold">
          Vous organisez un evenement ?
        </h2>
        <p className="mb-6">
          Publiez vos evenements et vendez vos tickets facilement.
        </p>

        <Link href="/lancer">
          <button className="rounded-full bg-black px-8 py-4 font-bold text-white transition hover:scale-105">
            Vendre mes tickets
          </button>
        </Link>
      </section>
    </main>
  );
}
