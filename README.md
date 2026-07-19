# PakAssist AI — Citizen Assistance Platform

PakAssist AI is an enterprise-grade AI-powered assistant designed for citizens in Pakistan to understand and navigate government administrative procedures (NADRA CNICs, Passports, Driving Licenses, HEC Scholarships, SECP Business Registrations, FBR Taxes, Utilities, and Legal matters) through a zero-hallucination database-anchored AI agent.

---

## Technical Architecture

```mermaid
graph TD
    Client[Next.js 16 App Router]
    Middleware[Next.js Root Middleware]
    ServerActions[Next.js Server Actions]
    SupabaseAuth[Supabase Auth SSR]
    GeminiAPI[Google Gemini 3.5 Flash API]
    PrismaClient[Prisma Client ORM]
    Postgres[Supabase PostgreSQL]

    Client -->|User UI & Navigation| Middleware
    Middleware -->|Refresh Session Cookies| SupabaseAuth
    Client -->|User UI Actions| ServerActions
    
    ServerActions -->|Query/Mutation| PrismaClient
    ServerActions -->|RAG Injected Prompts| GeminiAPI
    
    PrismaClient --> Postgres
```

### Core Stack
- **Frontend Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Framer Motion
- **Database & Auth**: PostgreSQL via Supabase, Prisma ORM (with explicit performance indexes), Supabase SSR Cookie Auth
- **AI RAG Core**: Google Gemini 3.5 Flash API utilizing two-stage database-anchored RAG context extraction with zero-hallucination prompt locks

---

## Key Features

1. **Zero-Hallucination RAG Pipeline**:
   - Matches user questions against verified database records.
   - Restricts Gemini from fabricating details if no matching database record is found.
   - Generates structured JSON outputs (Summary, Documents, Eligibility, Fees, Processing Time, Steps, Citing Official Source).
2. **Interactive Preparation Checklist**:
   - A step-by-step document checkbox widget that dynamically tracks overall preparedness with progress percentages.
3. **Interactive Fee & Validity Calculator**:
   - Toggles through multiple delivery speed options (Normal, Urgent, Executive) and validity periods to calculate total fees due.
4. **Interactive RAG Simulator**:
   - Live landing page demonstration showcasing exact database context injection and strict JSON response formatting.
5. **Secure Authentication & Admin Console**:
   - Email-password and Google OAuth integrations using Supabase SSR cookie sessions.
   - Admin panel for managing active procedures, database health checks, announcements, user management, and analytics.

---

## Project Structure

```
├── app/                      # Next.js App Router root
│   ├── (auth)/               # Auth route group (login, signup)
│   ├── (dashboard)/          # Dashboard interface route group
│   │   ├── dashboard/        # User main landing page
│   │   ├── services/         # Directory of government services & [slug] details
│   │   └── chat/             # AI chat assistant workspace
│   ├── (admin)/              # Admin management system route group
│   ├── actions/              # Server Actions (admin, dashboard, bookmark)
│   ├── auth/callback/        # OAuth callback handler
│   ├── middleware.ts         # Next.js root session middleware
│   ├── robots.ts             # Dynamic search engine robots configuration
│   └── sitemap.ts            # Dynamic XML sitemap generator
├── components/               # Shareable UI components
│   ├── ui/                   # Shadcn UI base primitives (Button, Card, Input, Badge)
│   ├── layout/               # Navbar, Footer
│   ├── services/             # Interactive document checklist & bookmark button
│   └── shared/               # Canvas neural network particle animation & instant search
├── features/                 # Feature-specific modules
│   ├── landing/              # Hero, Features list, Interactive RAG Simulator Demo
│   └── chat/                 # Chat assistant actions & session management
├── db/                       # Prisma client initialization
├── lib/                      # Core business logic
│   ├── ai/                   # Gemini client, RAG context builder, and system prompts
│   └── auth/                 # Admin authorization logic (`isUserAdmin`)
├── prisma/                   # Prisma migrations, schema, and seeding scripts
│   ├── schema.prisma         # Database schema mapping with indexes
│   └── import-govt-services.js # Data seeder script
├── services/                 # Database querying & Supabase clients
│   ├── services-db.ts        # Database fetching with static fallback
│   └── supabase/             # Client, server, and middleware Supabase instances
└── validation/               # Zod validation schemas
```

---

## Setup & Local Installation

### 1. Environment Variables Configuration
Duplicate `.env.example` as `.env.local` and configure your API keys:
```bash
cp .env.example .env.local
```

Fill in the required credentials:
```env
# Database Connections
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Supabase Auth Credentials
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_SUPABASE_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Provider Key
GEMINI_API_KEY="your-google-gemini-api-key"

# Admin Configuration
ADMIN_EMAIL="admin@pakassist.ai"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Run Database Migrations & Seeding
Push the Prisma schema to your PostgreSQL database and seed official government service guidelines:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment (Vercel + Supabase)

1. **Database Setup**: Ensure Supabase PostgreSQL database is active with connection pooling (`DATABASE_URL`) and direct connection (`DIRECT_URL`).
2. **Deploy to Vercel**:
   - Push repository to GitHub/GitLab.
   - Import project in Vercel Dashboard.
   - Configure environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `ADMIN_EMAIL`).
3. **Build Command**: Vercel automatically runs `npm run build` (`prisma generate && next build`).

---

## License

Distributed under the MIT License. Developed for Pakistani citizen assistance. All official service procedures are verified against official government portals.
# PakAssist-AI
