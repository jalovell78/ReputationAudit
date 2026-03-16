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
  - `src/app/api/generate-report/`: Serverless endpoint for AI generation and data caching.
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
  - Server-side security (`/api/audits/[id]/prediction/route.ts`) rejects 403 Forbidden.
  - Rendered read-only "Hypothesis Locked" dashboard state.
- **The Reputation Audit AI Report**:
  - High-end formatting (Markdown parsing, explicit H3/H4 tags for visual hierarchy).
  - Explicitly identifies "Phantom Insecurities" and "Blindspots."
  - Actionable steps delivered in highly scannable 'Insight vs. Action' bullet points.
  - **Peak-End Rule**: Report always concludes with an empowering "Unfair Advantage" summary.
  - Strict privacy logic enforces anonymity when pooling 1-2 responses.

## Active Issues
None.

## Next Iteration
- **Automated Email Alerts**: Implement robust email alert functionality. This includes setting up triggers and templates to notify users about critical events (e.g., when a rater submits feedback, when the required threshold of responses is met, or when their final report is ready to view).
- **Enhanced Final Report & SWOT Analysis**: Refine the AI report generation to include more depth and new structural sections. A key addition will be a comprehensive SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) synthesized directly from the rater feedback to give the user a strategic overview of their reputation.
- **Payment Gateway Integration**: Implement end-to-end payment functionality using the existing Stripe integration plan. This includes creating checkout flows, securely handling Stripe webhooks, and potentially gating the final "Reputation Audit" AI report behind a paywall.
- **Rater Discount Code**: Generate and display a discount code for the rater upon successful completion of their feedback form, incentivizing them to use the service themselves.
