# GiveOffer AI Full App

A Next.js starter app for giveoffer.com that lets users search for products, uses AI to understand the request, pulls product offers from SerpApi Google Shopping, ranks them with OpenAI, and saves searches/offers in SQLite via Prisma.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000

## Environment variables

```bash
OPENAI_API_KEY=your_openai_key
SERPAPI_API_KEY=your_serpapi_key
DATABASE_URL="file:./dev.db"
```

If SERPAPI_API_KEY is missing, the app shows demo offers.

## Deploy

Recommended: Vercel for the Next.js app. For production database, switch Prisma from SQLite to PostgreSQL.

## Next features

- user accounts
- saved offers
- affiliate link rewriting
- store blacklist
- price alerts
- product compare pages
- admin dashboard
