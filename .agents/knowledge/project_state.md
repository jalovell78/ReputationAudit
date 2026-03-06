# Project State: Reputation Audit

## Architecture
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Authentication**: Supabase Auth (Server & Client)
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Styling**: Tailwind CSS + shadcn/ui (Dark Mode focused)
- **Payments**: Stripe Integration (Checkout & Webhooks)
- **Icons**: Lucide React
- **File Structure**:
  - `src/app/`: Core routing and page components.
  - `src/components/ui/`: Reusable shadcn/ui components.
  - `src/lib/supabase/`: Supabase client initialization (server/client/middleware).
  - `src/lib/emailTemplates.ts`: Core matrix of 30 relationship-aware email templates.
  - `supabase/migrations/`: Database schema and RLS policies.
  - `.agents/knowledge/`: Persistent project documentation (Knowledge Items).

## Completed Features
- **User Authentication**:
  - Secure signup with Full Name capture.
  - Integrated login and logout functionality on the dashboard.
- **Dashboard UI**:
  - Overview of active and completed audits.
  - Real-time progress tracking for rater responses.
  - Integrated "Start New Audit" flow.
- **Audit Setup Wizard**:
  - **Step 1**: Objective selection (e.g., Leadership, Social Intelligence).
  - **Step 2**: Rater nomination (up to 20 emails).
- **Rater Feedback Interface**:
  - Dynamic display of Subject Name and Development Goal for context.
  - Centered Anonymity Guarantee ("Your identity is strictly masked").
  - Guided feedback via positive and negative prompt examples.
  - Vertical spacing and high-contrast UI polish.
- **Dispatch Hub (Rater Invitations)**:
  - **Dynamic Template Matrix**: 30 unique, relationship-aware email templates (5 Goals x 6 Roles) implemented in `src/lib/emailTemplates.ts`.
  - **Context-Aware Mapping**: Automatically maps `goal_type` and `archetype_group` to the correct subject line and body copy.
  - **Database personalization**: Retrieves the user's first name from the `profiles` table for a custom "Thank you" closing.
  - **Plain-Text Optimization**: High-visibility "100% PRIVACY GUARANTEE:" section, optimized for `mailto` link compatibility in all major email clients.
  - **Hydration Stability**: Implemented a `mounted` state pattern to prevent SSR/CSR mismatches during page load.
- **Homepage Messaging**:
  - Pivoted to a professional development theme: "The Shortcut to Strategic Self Improvement."
  - Professional branding focused on "Reputation Mastery" and "Growth Roadmaps."
  - Clean typography with all hyphens and em-dashes removed for readability.

## Active Issues
- **AI Synthesis Utility**: The logic for sanitizing and summarizing feedback into a "Radical Truth" report is in early stages.
- **Verification of Rater UX**: Need to confirm the seamlessness of the transition from the invitation link to the `FeedbackForm`.

## Next Iteration
- **Perception Gap Deep-Dive**: Implement AI synthesis for the Radar Chart data to highlight discrepancies between self-assessment and rater perception.
- **AI Actionable Steps**: Build the logic to generate specific, personalized improvement steps based on the audit results.
- **Production Testing**: Final comprehensive check of the end-to-end flow from Audit Creation to Dispatch and Feedback Submission.
