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

## Structure du projet

```
ecommerce-ai/
├── app/
│   ├── (auth)/              # Pages login/register
│   ├── (shop)/              # Catalogue, produits, panier
│   ├── dashboard/           # Admin
│   └── api/
│       ├── auth/            # NextAuth + register
│       ├── categories/      # CRUD catégories
│       ├── products/        # CRUD produits + variants
│       └── orders/          # Commandes
├── components/
│   ├── ui/                  # shadcn composants
│   ├── shop/                # Composants boutique
│   ├── chat/                # Chatbot widget
│   └── dashboard/           # Composants admin
├── lib/
│   ├── prisma.ts            # Singleton Prisma
│   ├── auth.ts              # NextAuth v5 config
│   ├── utils.ts             # slugify + helpers
│   └── ai/                  # Tools + prompts OpenAI
├── stores/
│   └── cart.store.ts        # Zustand cart
├── types/
│   ├── next-auth.d.ts       # Types NextAuth
│   └── cart.ts              # Type CartItem
├── prisma/
│   └── schema.prisma        # Schéma DB
└── proxy.ts
```

## API Routes

```
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/categories` | Liste + créer catégorie |
| GET/PUT/DELETE | `/api/categories/[id]` | Détail + modifier + supprimer |
| GET/POST | `/api/products` | Liste + créer produit |
| GET/PUT/DELETE | `/api/products/[id]` | Détail + modifier + supprimer |
| GET/POST | `/api/products/[id]/variants` | Variants d'un produit |
| GET/POST | `/api/orders` | Liste + créer commande |
| GET/PATCH | `/api/orders/[id]` | Détail + modifier statut |
| POST | `/api/auth/register` | Créer un compte |
```

## Fonctionnalités

- 🛍 Catalogue produits avec filtres
- 🛒 Panier persistant (Zustand + localStorage)
- 💳 Paiement Stripe
- 📦 Suivi de commandes
- 🤖 Chatbot AI (stock, commandes, recommandations)
- 🖥 Dashboard Admin
- ⚡ Automatisation n8n (emails, Slack, Google Sheets)
- 🔐 Auth email/password + Google OAuth

## Avancement

- [x] Setup & Fondations (Next.js, Tailwind, shadcn)
- [x] Prisma 7 + Neon PostgreSQL
- [x] Schema DB + migrations
- [x] API Categories (CRUD)
- [x] API Products (CRUD)
- [x] API Products Variants (GET + POST)
- [x] API Orders (GET, POST, PATCH)
- [x] Zustand Cart Store
- [x] Auth NextAuth v5 (JWT)
- [x] Pages Login + Register
- [x] proxy.ts protection routes
- [ ] Layout principal (Navbar + Footer)
- [ ] Page catalogue produits
- [ ] Page produit détail
- [ ] Page panier + checkout
- [ ] Dashboard Admin
- [ ] Chatbot AI (OpenAI + 5 tools)
- [ ] n8n Automatisation
- [ ] Tests + Production
