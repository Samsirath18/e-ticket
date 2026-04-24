import Link from "next/link";
import { getFedaPayTransaction } from "@/src/lib/fedapay";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

type ConfirmationTone = "success" | "warning" | "danger" | "info";

type ConfirmationState = {
  tone: ConfirmationTone;
  badge: string;
  title: string;
  description: string;
  transactionId?: string;
  verifiedStatus?: string;
  ticketReady?: boolean;
  statusMismatch?: boolean;
};

type ConfirmationPageProps = {
  searchParams: Promise<{
    id?: string | string[];
    status?: string | string[];
  }>;
};

function getFirstQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getStatusLabel(status?: string) {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case "approved":
      return "Approuve";
    case "pending":
      return "En attente";
    case "declined":
      return "Decline";
    case "canceled":
      return "Annule";
    case "refunded":
      return "Rembourse";
    case "transferred":
      return "Transfere";
    default:
      return "Inconnu";
  }
}

function getToneClasses(tone: ConfirmationTone) {
  switch (tone) {
    case "success":
      return {
        badge: "text-emerald-300",
        title: "text-emerald-300",
        panel: "border-emerald-400/20 bg-emerald-500/15 text-emerald-100",
      };
    case "warning":
      return {
        badge: "text-yellow-300",
        title: "text-yellow-300",
        panel: "border-yellow-400/20 bg-yellow-500/15 text-yellow-100",
      };
    case "danger":
      return {
        badge: "text-red-300",
        title: "text-red-300",
        panel: "border-red-400/20 bg-red-500/15 text-red-100",
      };
    default:
      return {
        badge: "text-blue-300",
        title: "text-blue-300",
        panel: "border-blue-400/20 bg-blue-500/15 text-blue-100",
      };
  }
}

async function resolveConfirmationState(
  transactionId?: string,
  reportedStatus?: string
): Promise<ConfirmationState> {
  if (!transactionId) {
    return {
      tone: "info",
      badge: "...",
      title: "Confirmation en attente",
      description:
        "Le retour FedaPay ne contient pas encore d'identifiant de transaction. Si vous venez de payer, attendez quelques secondes puis rechargez cette page.",
    };
  }

  try {
    const [transaction, payment] = await Promise.all([
      getFedaPayTransaction(transactionId),
      prisma.payment.findUnique({
        where: { transactionId },
        include: {
          tickets: {
            select: { id: true },
          },
        },
      }),
    ]);

    const verifiedStatus = transaction.status;
    const statusMismatch =
      Boolean(reportedStatus) &&
      reportedStatus?.toLowerCase() !== verifiedStatus.toLowerCase();
    const ticketReady = Boolean(payment?.tickets.length);

    switch (verifiedStatus) {
      case "approved":
      case "transferred":
        if (ticketReady) {
          return {
            tone: "success",
            badge: "OK",
            title: "Paiement confirme",
            description:
              "Le paiement a ete valide et votre ticket a deja ete genere. Verifiez votre boite email pour recuperer votre QR code.",
            transactionId,
            verifiedStatus,
            ticketReady,
            statusMismatch,
          };
        }

        return {
          tone: "warning",
          badge: "...",
          title: "Paiement approuve",
          description:
            "FedaPay confirme le paiement. Nous finalisons encore la generation du ticket et l'envoi de l'email.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
      case "pending":
        return {
          tone: "warning",
          badge: "...",
          title: "Paiement en attente",
          description:
            "La transaction existe bien, mais le paiement n'est pas encore confirme. Vous pouvez patienter quelques instants ou verifier a nouveau.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
      case "declined":
        return {
          tone: "danger",
          badge: "!",
          title: "Paiement refuse",
          description:
            "FedaPay indique que la transaction a ete refusee. Aucun ticket n'a ete emis pour cette tentative.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
      case "canceled":
        return {
          tone: "danger",
          badge: "X",
          title: "Paiement annule",
          description:
            "Le processus de paiement a ete annule avant validation. Vous pouvez relancer un nouveau paiement quand vous voulez.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
      case "refunded":
        return {
          tone: "info",
          badge: "i",
          title: "Paiement rembourse",
          description:
            "Cette transaction a ete remboursee. Si besoin, contactez l'equipe pour toute precision complementaire.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
      default:
        return {
          tone: "info",
          badge: "?",
          title: "Statut recu",
          description:
            "Le paiement a ete retrouve, mais son statut n'est pas encore interprete par l'interface. L'equipe peut verifier la transaction si necessaire.",
          transactionId,
          verifiedStatus,
          ticketReady,
          statusMismatch,
        };
    }
  } catch (error) {
    console.error("Confirmation lookup failed:", error);

    return {
      tone: "info",
      badge: "?",
      title: "Verification indisponible",
      description:
        "Nous n'avons pas pu confirmer la transaction aupres de FedaPay pour le moment. Reessayez dans un instant ou contactez l'equipe si le doute persiste.",
      transactionId,
    };
  }
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const resolvedSearchParams = await searchParams;
  const transactionId = getFirstQueryValue(resolvedSearchParams.id);
  const reportedStatus = getFirstQueryValue(resolvedSearchParams.status);
  const state = await resolveConfirmationState(transactionId, reportedStatus);
  const toneClasses = getToneClasses(state.tone);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 text-white">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-black to-black" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className={`mb-4 text-5xl font-bold ${toneClasses.badge}`}>
            {state.badge}
          </div>

          <h1 className={`mb-3 text-3xl font-bold ${toneClasses.title}`}>
            {state.title}
          </h1>

          <p className="mb-6 text-gray-300">{state.description}</p>

          <div className={`mb-4 rounded-xl border p-4 text-sm ${toneClasses.panel}`}>
            <p>
              <strong>Transaction:</strong> {state.transactionId ?? "Non fournie"}
            </p>
            <p>
              <strong>Statut verifie:</strong> {getStatusLabel(state.verifiedStatus)}
            </p>
            <p>
              <strong>Ticket genere:</strong> {state.ticketReady ? "Oui" : "Pas encore"}
            </p>
          </div>

          {state.statusMismatch && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/15 p-4 text-sm text-red-200">
              Le statut dans l&apos;URL ne correspond pas au statut verifie aupres de
              FedaPay. L&apos;affichage ci-dessus utilise la verification serveur.
            </div>
          )}

          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
            Si le ticket n&apos;apparait pas tout de suite, laissez au webhook
            quelques secondes pour terminer la generation et l&apos;envoi de l&apos;email.
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
