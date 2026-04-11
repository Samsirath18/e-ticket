import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-28 w-32">
            <Image
              src="/GO-ticket.png"
              alt="GO-TICKET"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div>
          <h3 className="mb-3 font-bold">Navigation</h3>
          <div className="flex flex-col gap-2 text-gray-400">
            <Link href="/events">Evenements</Link>
            <Link href="/about">A propos</Link>
            <Link href="/checkout">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-bold">Organisateur ?</h3>
          <p className="mb-4 text-gray-400">
            Vendez vos tickets facilement sur GO-TICKET.
          </p>

          <Link href="/lancer">
            <button className="rounded-full bg-yellow-500 px-6 py-3 transition hover:scale-105">
              Lancer mon evenement
            </button>
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-6 pt-6 text-center text-sm text-gray-500">
        (c) {new Date().getFullYear()} GO-TICKET. Tous droits reserves.
      </div>
    </footer>
  );
}
