# Qyvex

Qyvex is a production-ready Tech Job Alert SaaS for computer science students. It helps users discover jobs, internships, and off-campus drives, then sends automated email alerts when a newly posted role matches preferences.

## Tech Stack

- Next.js App Router + TypeScript
- React + Tailwind CSS
- ShadCN-style reusable UI components
- PostgreSQL + Prisma ORM
- NextAuth credential authentication
- Resend email API for job alerts
- Deployment target: Vercel

## Core Features

- Landing page with featured jobs, categories, testimonials, and CTA
- Jobs listing with filters, sorting, and pagination
- Job details page with structured JobPosting schema
- Signup/login with bcrypt password hashing
- User dashboard: saved jobs, applications, email preferences
- Admin dashboard: post/manage jobs and analytics
- REST API routes for jobs, companies, subscriptions, saved jobs, applications
- Automated email alerts on matching new jobs
- SEO metadata, OpenGraph, Twitter cards, sitemap, robots
- Basic API rate limiting

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qyvex"
NEXTAUTH_SECRET="replace-with-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxxxxx"
RESEND_FROM_EMAIL="Qyvex <alerts@qyvex.tech>"
APP_URL="http://localhost:3000"
```

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client and run migration

```bash
npx prisma migrate dev
```

3. Optional: seed starter data

```bash
npm run seed
```

4. Run development server

```bash
npm run dev
```

## Deployment (Vercel)

1. Push code to GitHub repository.
2. Import project in Vercel.
3. Add environment variables from `.env.example` in Vercel dashboard.
4. Set up PostgreSQL (Neon/Supabase/RDS) and update `DATABASE_URL`.
5. Run Prisma migrations in deployment workflow.
6. Configure custom domain (e.g. `qyvex.tech`) in Vercel domains settings.

## Default Admin (seed)

- Email: `admin@qyvex.tech`
- Password: `Admin@12345`

Change credentials immediately in production.
