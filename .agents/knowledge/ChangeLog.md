# Engineering Changelog & State Register

This file acts as the single source of truth for all code updates, database schema changes, features, and bug fixes over time. Every modification must be logged chronologically by date.

---

## [2026-06-03] - Automated Multi-Tenant Email Dispatch via Resend API
### Added
- Installed `resend` SDK (`^6.12.4`) for direct transactional email delivery.
- Installed `@vercel/functions` (`^3.6.1`) to utilize host runtime lifecycle helpers.

### Changed
- Refactored `src/app/api/create-audit/route.ts` to replace manual "Copy Link" email workflow with automated, non-blocking background email dispatch.
- Integrated `waitUntil` from `@vercel/functions` to protect the asynchronous concurrent `Promise.all` mailing queue from Vercel container freezing.
- Added dynamic platform sender spoofing depending on the audit container's active `platform_source` resolved via `getTenantFromHeaders()`.
- Implemented absolute path fallbacks for email button anchors (e.g. `https://www.repstanding.com` or `https://www.theperceptionmirror.com`) with local development resolution.
- Resolved creator's `full_name` from the `profiles` table to populate templates with professional relationship-aware signatures.

## [2026-06-03] - Multi-Tenant Onboarding Goals & Archetype Customization
### Added
- Added `TenantArchetype` interface, `getArchetypes` helper, and `getArchetypeLabel` helper to `src/lib/tenant.ts` to support brand-specific roster selections and resolve legacy mapping.
- Added brand-specific `archetypes` lists (6 corporate archetypes for `repstanding`, 6 wellness/introspective archetypes for `perception_mirror`) and `goals` configs in `src/lib/tenant.ts`.

### Changed
- Refactored `SetupWizard.tsx` to dynamically query goals and archetypes from the active tenant config, utilizing `GOAL_ICON_MAP` to prevent Next.js tree-shaking and dynamically initializing the roster using the tenant's primary archetype.
- Updated `src/app/dashboard/page.tsx` and `src/app/dashboard/dispatch/[auditId]/DispatchHubList.tsx` to display human-readable archetype labels via `getArchetypeLabel`.
- Updated `src/lib/emailTemplates.ts` to map new brand-specific goals and archetypes to legacy rater templates for email phrasing.
- Updated `/api/submit-feedback` endpoint in `src/app/api/submit-feedback/route.ts` to pass the human-readable rater archetype (`entry.archetype`) to the sanitizer prompt context.
- Updated `/api/generate-report/[id]` report compiler (`synthesiseReport`) to resolve raw archetype keys with `getArchetypeLabel` when generating consensus prompts.


## [2026-06-03] - Dynamic Micro-Survey & Rater Responses
### Added
- Created database migration file `supabase/migrations/20260603120000_create_rater_responses.sql` defining `rater_responses` table (capturing `quantitative_score`, `selected_tags`, `optional_text_seed`), index, and owner `SELECT` RLS policy.
- Added `GoalCategoryConfig` interface, `GOAL_CONFIG_MAP` dictionary, and `getGoalConfig` helper in `src/lib/tenant.ts` to map developmental goals to custom survey categories, tag banks, and dynamic context placeholders.

### Changed
- Refactored `/api/submit-feedback` endpoint in `src/app/api/submit-feedback/route.ts` to process structured survey responses, insert entries securely into the `rater_responses` table using the backend service client role, synthesize evaluations into a qualitative block, pass it to Gemini sanitizer, and preserve legacy Stripe stubs.
- Refactored `/rate/[id]` Server Component in `src/app/rate/[id]/page.tsx` to dynamically resolve tenant contexts from the parent audit's `goal_type` and apply layout branding (serif/sans fonts, themes) to the loading/invalid/thank-you views.
- Refactored client-side form `FeedbackForm.tsx` to implement a multi-step micro-survey wizard, including a 1–5 scalar button matrix with dynamic labels, tag chip selection, a real-time dynamic contextual text seed placeholder, and a summary confirmation screen before final submission.

## [2026-06-03] - Dynamic Multi-Tenant Report Route
### Added
- Created `ReportClientView.tsx` to handle client-side rendering of the report page with multi-tenant delegation, dynamic brand vocabularies ("reflection partners" under `perception_mirror` vs "raters" under `repstanding`), and responsive layout containers.

### Changed
- Refactored `src/app/report/[id]/page.tsx` into a Server Component that validates user authentication, directly queries Supabase for the audit and report data (to avoid client-side API requests on mount), handles threshold checking, and passes results as static props.
- Refactored `PerceptionGapChart.tsx` to support dynamic styling, custom colors, axis styles, and legends matching active tenant attributes (Sage Green/Pastels vs Indigo/Emerald).

## [2026-06-02] - Domain Infrastructure & Multi-Brand Styling
### Added
- Integrated Component Delegation for the landing page by generating `repstanding-hero.tsx` (baseline corporate executive coaching layout) and `perception-mirror-hero.tsx` (premium introspective editorial layout with serif typography, calm ambient glow, and generous whitespace) under `src/components/marketing/`.
- Centralized client context provider (`TenantProvider`) and `useTenant` hook to expose brand config details, titles, taglines, and vocabulary components.
- Introduced a server-only helper `src/lib/tenant-server.ts` using `next/headers` to isolate server resolution from client-side imports.
- Defined Tailwind CSS v4 dynamic variables mapping specific OKLCH color palettes (Indigo accents for RepStanding, Sage/Sand accents for The Perception Mirror) and fonts on dynamic attributes (`html[data-tenant]`).
- Configured multi-domain architecture support for a single-codebase Vercel deployment.
- Map primary brand assets for `theperceptionmirror.com`:
  - Added Apex `A` record pointing to Vercel production IP (`216.198.79.1`).
  - Added `www` `CNAME` record mapping to Vercel distribution target (`863100b610f526e7.vercel-dns-017.com`).
  - Generated and validated automated SSL certificate (HTTP-01 challenge) via distributed network verification.
- Parked `.uk` regional domain variations as local cPanel aliases sharing the root directory:
  - `theperceptionmirror.co.uk`
  - `perceptionmirror.co.uk`
- Implemented server-side permanent redirection rules via `.htaccess` (301 redirects) routing all incoming `.uk` regional traffic and wildcard paths cleanly to the canonical primary address: `https://www.theperceptionmirror.com`.

### Changed
- Refactored `src/app/page.tsx` as a clean Server Component utilizing `getTenantFromHeaders()` to statically import and conditionally render the correct brand-specific landing layout.
- Refactored `src/middleware.ts` to capture brand overrides via query parameters (`?tenant=x`), cookies, or request host headers, attaching the resolved tenant to downstream request headers (`x-tenant-source`).
- Refactored root layout `src/app/layout.tsx` to handle server-side tenant lookup, dynamically load specific Google Fonts (Geist, Playfair Display, Plus Jakarta Sans), and toggle the base `dark` class dynamically.
- Migrated static B2B values on the Landing page (`src/app/page.tsx`), Login page (`src/app/login/page.tsx`), Dashboard (`src/app/dashboard/page.tsx`), Setup Wizard (`SetupWizard.tsx`), and Dispatch Hub (`DispatchHubList.tsx`) to pull colors from semantic CSS variables and copy from dynamic dictionaries.
- Bypassed registrar-level client panel propagation bottlenecks by routing core DNS management natively through existing ecoHosting server Zone Editor.

## [2026-06-01] - Project Re-Initialization
### 🚀 Added
*   Created `REPSTANDING_ARCHITECTURE_PLAYBOOK.md` blueprint to establish the multi-tenant single-codebase strategy.

### 🛠️ Changed
*   Pivoted monetization strategy from consumer one-off reports to a dual-brand B2B subscription model targeting corporate executive coaches (`RepStanding`) and alternative wellness/mindset coaches (`The Perception Mirror`).
*   Configured cPanel DNS to safely route web traffic to Vercel (`76.76.21.21` / `cname.vercel-dns.com`) while securely isolating the email server routing back to cPanel (`mail.repstanding.com` to `91.238.162.176`).
