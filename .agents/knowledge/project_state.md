# Project State: Reputation Audit
**Date**: 2026-03-05

## Architecture
**Stack**:
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS)
- **AI/LLM**: Google Gemini API (Gemini 2.5 Flash)
- **Payments**: Stripe Checkout
- **Styling**: Tailwind CSS, `shadcn/ui` components
- **Charting**: Recharts

**Key Patterns**:
- Multi-step wizard onboarding (`SetupWizard.tsx`)
- Secure backend API routes handling Supabase Service Role operations to bypass RLS for data manipulation.
- AI logic integrated directly into API endpoints (e.g., `/api/generate-report`, `/api/submit-feedback`, `/api/aggregate-sentiment`) using dynamic prompting.
- Lazy report generation and versioning through the `audit_reports` table.

## Completed Features
- **Goal-Driven Onboarding**: Users select a primary development goal (Career Progression, Leadership Mastery, etc.) during setup. AI prompts are tailored to this goal.
- **Dynamic Rater Nomination**: Users can nominate 3 to 20 raters and dynamically assign roles (Archetype Groups) to them.
- **Feedback Collection and Aggregation**: Individual feedback is safely collected, and if multiple raters are in the same group, their sentiment is aggregated into a "Consensus View" via Gemini.
- **Self-Audit Flow**: Users complete a 1-5 Likert scale self-assessment across key dimensions.
- **Perception-Gap Analysis**: The final report includes a Radar Chart comparing self-scores with rater-average scores.
- **Smart Report Versioning**: 
  - Generates initial report at ≥3 responses AND ≥25% completion.
  - Lazily regenerates reports only when new feedback has been received since the last view.
  - Maintains full history in `audit_reports`.
- **Paywall and Teaser**: Unpaid users see a blurred teaser (first ~150 words) and an "Unlock Full Report" button. Paid users access the full document.
- **Authentication & Security**: Complete Auth flow with Clerk/Supabase, including a recent robust password reset flow.
- **Dashboard UI Enhancements**: Active audits display their selected goal badge, progress counters, and appropriate call-to-action buttons. Setup wizard validates for at least 3 valid emails before launching.
- **Rater Context & Clarity**: The feedback form now displays the subject's name and primary goal, providing context through multi-stage descriptions and a centered anonymity guarantee. It also provides both positive and negative prompt examples.
- **Improved Auth Flow**: Added the ability for users to capture their Full Name during registration and more importantly, added a secure Logout functionality to the dashboard.

## Active Issues
- No critical bugs currently logged. The recent UI state issues on `SetupWizard.tsx` (stale state on dropdowns, broken rendering on Step 2 navigation) were fully resolved and validated.
- **Pending verification**: Ensure the newly implemented minimum 3 email validation and dashboard goal badges operate correctly in the Vercel production environment post-deployment.

## Next Iteration
- [ ] Finalizing perception gap deep-dive insights (AI synthesis of the Radar Chart data).
- [ ] Expanding the AI actionable steps logic based on specific goal + data intersections.
- [ ] Polish email notification templates for raters.
