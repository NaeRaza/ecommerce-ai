# E-Commerce AI

E-commerce fullstack avec chatbot AI intégré.

## Stack Technique

- **Framework** : Next.js 16.2.4 (App Router, Turbopack)
- **Language** : TypeScript
- **UI** : Tailwind v4 + shadcn/ui (Nova preset)
- **Base de données** : PostgreSQL (Neon) + Prisma 7
- **Auth** : NextAuth v5
- **AI** : OpenAI GPT-4o + Vercel AI SDK
- **Paiement** : Stripe
- **Automatisation** : n8n (self-hosted Docker)
- **Rate limiting** : Upstash Redis
- **Images** : Cloudinary
- **Deploy** : Vercel (app) + VPS (n8n)

## Prérequis

- Node.js >= 18.17
- npm >= 9
- Compte Neon (PostgreSQL)
- Compte Stripe
- Compte OpenAI
- Compte Upstash
- Compte Cloudinary
- Docker (pour n8n)

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/ton-user/ecommerce-ai.git
cd ecommerce-ai
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Variables d'environnement

Crée un fichier `.env` et `.env.local` à la racine :

```bash
# .env (pour Prisma CLI)
DATABASE_URL="postgresql://..."

# .env.local (pour Next.js)
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
OPENAI_API_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
N8N_WEBHOOK_URL="..."
N8N_WEBHOOK_SECRET="..."
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 4. Base de données

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Structure du projet

ecommerce-ai/
├── app/
│ ├── (auth)/ # Pages login/register
│ ├── (shop)/ # Catalogue, produits, panier
│ ├── dashboard/ # Admin
│ └── api/ # Routes API
├── components/
│ ├── ui/ # shadcn composants
│ ├── shop/ # Composants boutique
│ ├── chat/ # Chatbot widget
│ └── dashboard/ # Composants admin
├── lib/
│ ├── prisma.ts # Singleton Prisma
│ ├── auth.ts # NextAuth config
│ └── ai/ # Tools + prompts OpenAI
├── stores/ # Zustand stores
├── types/ # TypeScript types
├── prisma/
│ └── schema.prisma # Schéma DB
└── proxy.ts # Protection routes

## Fonctionnalités

- 🛍 Catalogue produits avec filtres
- 🛒 Panier persistant
- 💳 Paiement Stripe
- 📦 Suivi de commandes
- 🤖 Chatbot AI (stock, commandes, recommandations)
- 🖥 Dashboard Admin
- ⚡ Automatisation n8n (emails, Slack, Google Sheets)
- 🔐 Auth email/password + Google OAuth

## Avancement

- [x] Setup & Fondations
- [x] API Categories (CRUD)
- [x] API Products (CRUD)
- [ ] API Orders
- [ ] API Cart
- [ ] Auth (NextAuth v5)
- [ ] Frontend
- [ ] Chatbot AI
- [ ] n8n
- [ ] Production
