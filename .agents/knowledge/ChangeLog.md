# Engineering Changelog & State Register

This file acts as the single source of truth for all code updates, database schema changes, features, and bug fixes over time. Every modification must be logged chronologically by date.

---

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
