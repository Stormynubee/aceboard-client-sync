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
