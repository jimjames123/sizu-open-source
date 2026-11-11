# SIZU Portal

**Social Impact Zone Uganda (SIZU)** is a digital platform developed by **Sizunet (U) Limited** to improve the visibility and discoverability of social impact initiatives in Uganda. Visitors can explore projects, organizations, and opportunities, while registered organizations can manage their profiles and project information.

**Live platform:** https://sizuportal.org

## Features

- Public discovery of social impact projects and organizations
- Organization registration and profile management
- Project creation and management
- FemTech initiative classification, dashboards, self-evaluation, and reporting workflows
- Administrative management and review interfaces
- Authentication and role-based database access controls
- Responsive mobile and desktop interface

Some workflows may require administrator access or additional configuration. Features should be tested in the target environment before being presented as production-ready.

## Technology stack

- **Frontend:** React, TypeScript, Vite
- **Interface:** Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Supabase
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Authentication and files:** Supabase Auth and Storage
- **Source control:** Git and GitHub
- **Deployment:** Vercel (other static hosting platforms can also be configured)

## Public source snapshot

This repository is a clean-history public source snapshot for independent review, including the frontend, FemTech functionality, Supabase Edge Functions, and database migrations. It does not contain live production data, credentials, or the private repository's commit history. Some binary brand/media assets are not included; replace missing assets when building your own deployment. A working Supabase instance must be configured separately.

## Getting started

### Prerequisites

- Node.js and npm
- A Supabase project configured with the required schema, policies, and storage buckets

### Local development

```bash
git clone https://github.com/jimjames123/sizu-open-source.git
cd sizu-open-source
npm install
cp .env.example .env
npm run dev
```

On Windows, copy `.env.example` to `.env` manually if the `cp` command is unavailable.

Set these values in your local `.env` file:

```dotenv
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never commit service-role keys, passwords, or other secrets. Variables prefixed with `VITE_` are embedded in the frontend bundle and must not contain confidential credentials.

### Available commands

```bash
npm run dev       # Start local development server
npm run build     # Build production assets into dist/
npm run preview   # Preview production build
npm run lint      # Run lint checks
```

## Deploying

The frontend can be deployed to Vercel or another host that supports Vite single-page applications.

1. Import the repository into your hosting provider.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Configure the Supabase environment variables in the hosting provider's project settings.
4. Configure SPA route rewrites and any server-side API/function routing required by the deployment.
5. Deploy and test authentication, project pages, FemTech workflows, and administrative access.

The Supabase database, authentication configuration, storage, and any Edge Functions must be configured separately. Frontend deployment alone does not provision those services.

## FemTech

FemTech features support discovery and management of projects addressing women's and girls' health. The codebase includes project classification, a dedicated dashboard, self-evaluation/reporting workflows, and administrative review capabilities. See the relevant files in `src/pages`, `src/components`, and `supabase` for implementation details.

## Contributing and licensing

The source code is provided under the [MIT License](LICENSE). SIZU names, logos, and official branding are addressed separately in [BRANDING.md](BRANDING.md). Contributions and issues can be discussed through GitHub.

## Maintainer

**Sizunet (U) Limited** — https://sizuportal.org
