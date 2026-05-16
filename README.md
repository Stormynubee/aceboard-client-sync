# AceBoard Client Sync

AceBoard Client Sync is a Next.js micro-SaaS designed for video editors to streamline the feedback loop. It allows editors to share timestamped review links with clients, enabling precise, time-coded comments and approvals directly on the video timeline.

## Project Structure (Next.js App Router)

```text
/
├── app/                  # App Router
│   ├── (auth)/           # Auth route group (login, signup, etc.)
│   ├── (dashboard)/      # Authenticated editor dashboard
│   │   ├── projects/     # Project management (CRUD)
│   │   └── settings/     # Account and workspace settings
│   ├── api/              # Backend API Route Handlers
│   ├── review/           # Public/Client-facing review pages ([projectId])
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing/Marketing page
├── components/           # React components
│   ├── ui/               # Reusable UI primitives (Shadcn UI)
│   ├── dashboard/        # Dashboard-specific UI
│   ├── review/           # Video player and feedback UI
│   └── shared/           # Common layout components
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities (db, auth, constants)
├── public/               # Static assets (images, icons)
├── styles/               # Global CSS and Tailwind config
├── types/                # TypeScript interfaces and types
├── prisma/               # Database schema and migrations
└── middleware.ts         # Authentication and routing middleware
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: NextAuth.js / Auth.js
- **Storage**: AWS S3 / R2 for video hosting

## Deployment (Vercel)

1. **Push your code to GitHub.**
2. **Import the repository into Vercel.**
3. **Configure Environment Variables:** Add the following to your Vercel project settings:

```text
# Database
DATABASE_URL="postgresql://..."

# Auth.js
AUTH_SECRET="your-generated-secret"
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# Cloudflare R2 / AWS S3
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_ENDPOINT="..."
R2_BUCKET_NAME="..."
NEXT_PUBLIC_R2_PUBLIC_URL="..."
```

4. **Run Database Migrations:** 
   Vercel's build process will handle `prisma generate` via the `postinstall` script. You should run your migrations (`npx prisma migrate deploy`) before or during the first deployment.
