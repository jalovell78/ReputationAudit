# Project State: Reputation Audit

## Architecture
- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth (Server & Client)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **AI Synthesis**: Google GenAI (Gemini 2.0 Flash)
- **Styling**: Tailwind CSS + shadcn/ui (Dark Mode focused)
- **Payments**: Stripe Integration (In progress: Setup flow & Webhooks)
- **Icons**: Lucide React
- **File Structure**:
  - `src/app/`: Core routing and page components.
  - `src/components/ui/`: Reusable shadcn/ui components.
  - `src/components/marketing/`: Brand-specific landing page hero layouts.
  - `src/lib/supabase/`: Supabase client initialization.
  - `src/lib/emailTemplates.ts`: Core matrix of 30 relationship-aware email templates.
  - `src/app/api/generate-report/`: Serverless endpoint for AI generation and data caching.
  - `supabase/migrations/`: Database schema and RLS policies.
  - `.agents/knowledge/`: Persistent project documentation (Knowledge Items).

## Completed Features
- **Multi-Tenant Landing Pages**: Split primary entry route `src/app/page.tsx` using full-page Component Delegation for `RepStanding` (corporate layout) and `The Perception Mirror` (introspective wellness layout).
- **Multi-Tenant Report View Route**: Refactored the report view route (`src/app/report/[id]`) to use server-side tenant delegation, dynamic CSS variables/themes, dynamic typography, brand-aligned vocabulary, and a server-side data fetching model.
- **User Authentication**: Secure signup with Full Name capture, integrated login/logout.
- **Dashboard UI & Audit Flow**:
  - Overview of active/completed audits with real-time progress tracking.
  - Audit Setup Wizard: Goal selection and rater nomination (up to 20 emails).
- **Rater Feedback Interface**: Dynamic, anonymous, guided feedback form (Positive/Reflective/Critical).
- **Feedback Sanitization**: AI-driven removal of identifying language from rater feedback to preserve anonymity.
- **Dynamic Micro-Survey Response System**:
  - Replaced the qualitative-only rater interface (`/rate/[id]`) with a "Click First, Elaborate Second" quantitative wizard flow.
  - Implemented category-aware 1-to-5 metric sliders, trait tag clouds, and dynamic placeholder context seed inputs.
  - Created `rater_responses` schema and integrated privileged server-side database insertion to record granular dimension metrics.
  - Integrated dynamic brand-vocabulary and score labels (e.g. corporate development scales vs. wellness alignment presence).
  - Synthesized structured outputs into a single text block for backward compatibility with Gemini sanitization and report engines.
- **Dispatch Hub**: Dynamic, context-aware 30-template matrix for email invitations.
- **Hypothesis UI & Locking**: 
  - Subjects predict what raters will say while waiting for feedback.
  - Permanent lock on hypothesis upon report generation (enforced via Supabase RLS and API).
- **The Reputation Audit AI Report**:
  - Insight-driven report replacing the "Radical Truth" branding.
  - Sections include: "The Hard Truth", "The Perception Gap", and "Phantom Insecurities."
  - Conclusions focus on the subject's "Unfair Advantage" for empowering growth.
  - UI refinement for scannable Markdown content.

## Active Issues
- **Self-Audit Scoring Discontinued**: The quantitative *self-audit* scoring has been removed to focus on external rater reviews. Quantitative external reviews are now fully gathered via structured rater micro-surveys.

## Next Iteration
- **Stripe Integration Implementation**: Completing the end-to-end payment flow to gate the final AI report.
- **Automated Email Alerts**: Setting up transactional emails for completion milestones.
- **SWOT Analysis Section**: Adding a strategic "Strengths, Weaknesses, Opportunities, Threats" section to the generated reports.
