# Engineering Changelog & State Register

This file acts as the single source of truth for all code updates, database schema changes, features, and bug fixes over time. Every modification must be logged chronologically by date.

---

## [2026-06-02] - Domain & Infrastructure Setup
### Added
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
- Bypassed registrar-level client panel propagation bottlenecks by routing core DNS management natively through existing ecoHosting server Zone Editor.

## [2026-06-01] - Project Re-Initialization
### 🚀 Added
*   Created `REPSTANDING_ARCHITECTURE_PLAYBOOK.md` blueprint to establish the multi-tenant single-codebase strategy.

### 🛠️ Changed
*   Pivoted monetization strategy from consumer one-off reports to a dual-brand B2B subscription model targeting corporate executive coaches (`RepStanding`) and alternative wellness/mindset coaches (`The Perception Mirror`).
*   Configured cPanel DNS to safely route web traffic to Vercel (`76.76.21.21` / `cname.vercel-dns.com`) while securely isolating the email server routing back to cPanel (`mail.repstanding.com` to `91.238.162.176`).
