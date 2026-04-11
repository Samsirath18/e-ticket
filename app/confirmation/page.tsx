import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 text-white">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-black to-black" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-4 text-5xl font-bold text-yellow-400">OK</div>

          <h1 className="mb-3 text-3xl font-bold text-yellow-400">
            Paiement recu
          </h1>

          <p className="mb-6 text-gray-300">
            Nous verifions votre paiement et generons votre ticket. Des que le
            webhook FedaPay est confirme, vous recevez votre QR code par email.
          </p>

          <div className="mb-6 rounded-xl border border-blue-400/20 bg-blue-500/20 p-4 text-sm text-blue-300">
            Si vous ne voyez rien arriver, verifiez aussi vos spams ou contactez-nous.
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/events"
              className="rounded-full bg-yellow-500 py-3 font-bold text-black transition hover:scale-105"
            >
              Retour aux evenements
            </Link>

            <Link
              href="/checkout"
              className="rounded-full border border-white/30 py-3 transition hover:bg-white hover:text-black"
            >
              Contacter l&apos;equipe
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
