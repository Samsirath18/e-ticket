# GO-TICKET

Plateforme de billetterie construite avec Next.js, Prisma, PostgreSQL et FedaPay.

## Stack

- Next.js App Router
- React 19
- Prisma 7 avec adaptateur PostgreSQL
- PostgreSQL
- FedaPay pour le paiement
- Resend pour les emails

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner au minimum:

- `DATABASE_URL`
- `QR_SECRET`
- `FEDA_API_SECRET_KEY`
- `FEDA_ENVIRONMENT`
- `FEDA_CURRENCY_ISO`
- `APP_URL`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Variables recommandees pour la securite:

- `FEDA_WEBHOOK_SECRET`
- `CONTACT_TO`
- `ADMIN_API_TOKEN`
- `SCAN_API_TOKEN`

Notes:

- Le projet accepte aussi les anciennes variables `FEDAPAY_*` pour rester compatible avec l'ancienne configuration.
- `FEDA_API_PUBLIC_KEY` peut etre renseignee des maintenant, meme si le flow actuel utilise le mode API serveur et non Checkout.js.

## Demarrage local

1. Lancer PostgreSQL:

```bash
docker compose up -d
```

2. Installer les dependances:

```bash
npm install
```

3. Appliquer les migrations:

```bash
npm run prisma:migrate
```

4. Inserer l'evenement par defaut:

```bash
npm run db:seed
```

5. Demarrer le projet:

```bash
npm run dev
```

## Routes utiles

- `/events` liste les evenements
- `/tickets/mode-avion` ouvre le tunnel d'achat
- `/api/payments/create` cree une transaction FedaPay
- `/api/webhook/fedapay` traite la confirmation de paiement
- `/confirmation` reverifie le statut reel de la transaction a partir de son `id`
- `/api/tickets/verify` verifie et consomme un QR code
- `/api/admin/stats` statistiques admin
- `/api/admin/tickets` liste admin des tickets

## Notes de securite

- Les routes admin utilisent `ADMIN_API_TOKEN` via `Authorization: Bearer ...`
- La route de scan utilise `SCAN_API_TOKEN` ou retombe sur `ADMIN_API_TOKEN`
- En production, configure `FEDA_WEBHOOK_SECRET` pour verifier la signature du webhook
- La page de retour ne se fie pas au `status` dans l'URL: elle demande a nouveau le statut reel a FedaPay avec l'identifiant de transaction
