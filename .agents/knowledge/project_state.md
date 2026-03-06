# Project State: Reputation Audit

## Architecture
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Authentication**: Supabase Auth (Server & Client)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **AI Synthesis**: Google GenAI (Gemini 2.0 Flash)
- **Styling**: Tailwind CSS + shadcn/ui (Dark Mode focused)
- **Payments**: Stripe Integration (Checkout & Webhooks)
- **Icons**: Lucide React
- **File Structure**:
  - `src/app/`: Core routing and page components.
  - `src/components/ui/`: Reusable shadcn/ui components.
  - `src/lib/supabase/`: Supabase client initialization.
  - `src/lib/emailTemplates.ts`: Core matrix of 30 relationship-aware email templates.
  - `supabase/migrations/`: Database schema and RLS policies.
  - `.agents/knowledge/`: Persistent project documentation (Knowledge Items).

## Completed Features
- **User Authentication**: Secure signup with Full Name capture, integrated login/logout.
- **Dashboard UI & Audit Flow**:
  - Overview of active and completed audits with real-time progress tracking.
  - Audit Setup Wizard: Goal selection and rater nomination (up to 20 emails).
- **Rater Feedback Interface**: Dynamic, anonymous, guided negative/positive prompt feedback form.
- **Dispatch Hub**: Dynamic, context-aware 30-template matrix for 'mailto' email invitations.
- **Qualitative "While You Wait" Hypothesis UI**: 
  - Users can form a holistic prediction of what their raters will say while waiting for feedback.
  - Editable via Dashboard up until report generation.
- **Hypothesis Locking & Confirmation**: 
  - "View Final Report" modal warns the user that viewing the report will permanently lock their hypothesis.
  - Server-side security (`/api/audits/[id]/prediction/route.ts`) rejects 403 Forbidden if a report already exists for the audit.
  - Rendered read-only "Hypothesis Locked" dashboard state once report generation connects the dots.
- **AI Synthesis ("The Radical Truth" Report)**:
  - Consumes user's saved Hypothesis and compares it directly against aggregated rater feedback.
  - Explicitly identifiers "Phantom Insecurities" and "Blindspots" using Gemini 2.0.

## Active Issues
- **End-to-End Production Testing**: The new Hypothesis Locking UI (modal and checkout button intercept) and API security checks require manual verification on localhost to ensure edge cases are handled elegantly.

## Next Iteration
- **Finalize Qualitative Report Verification**: Confirm the AI tone and output reliably synthesize the subject's hypothesis vs actual feedback without breaking context.
- **Perception Gap Charting & Self Audit**: Proceed to flesh out the visual Radar Chart and quantitative "Self Audit" phase to compliment the qualitative AI generated text report.
