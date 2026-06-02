---
Feature: Product Features Registry & Strategic Roadmap
Status: Stable
Audience: Dev / Sales / Admin
---

# Product Features Registry & Strategic Roadmap

This document outlines the current functional state of the Reputation Audit platform, details upcoming feature milestones, and defines the structural database modifications required for the next phase of development.

---

## 1. Product Concept & Market Positioning
The application resolves "The Perception Gap"—the difference between how an individual views themselves and how the world actually experiences them. By transforming multi-source qualitative feedback into structured, anonymized, and AI-synthesized development reports, the platform provides professional coaches and corporate leaders with an actionable development tool.

The product uses a Multi-Tenant, Single-Codebase Architecture to deploy two distinct brand interfaces from the same underlying engine:
1. **RepStanding:** Targets corporate executive coaches, HR consultants, and leadership teams with authoritative terminology and corporate aesthetics.
2. **The Perception Mirror:** Targets life coaches, mindset mentors, and wellness practitioners with soft, organic aesthetics and introspective terminology.

---

## 2. Core Feature Backlog & Current Status

### Phase 1: Core Feedback Engine (CURRENT BASELINE)
* **User Authentication:** Fully operational via Supabase Auth, capturing client profile details on onboarding.
* **Multi-Tenant Landing Pages:** Implemented full-page Component Delegation for `RepStanding` (corporate style) and `The Perception Mirror` (introspective layout), dynamically selected at runtime based on tenant headers.
* **Audit Setup Wizard:** Subject configuration flow enabling strategic development goal selection and nomination of up to 20 rater emails.
* **Rater Feedback Interface:** Dynamic, anonymous external evaluator text submission flow.
* **Feedback Sanitization:** Automated LLM-driven filtering layer that strips identifying language or explicit names from raw text inputs to protect evaluator anonymity.
* **Hypothesis UI & Locking:** Subject prediction interface. Captures what the client expects raters to say and permanently locks the row data via Supabase RLS the moment the report is initialized to preserve psychological integrity.
* **The AI Synthesis Report:** Serverless generation engine translating unstructured text blocks into scannable markdown sections including "The Hard Truth", "The Perception Gap", and "Phantom Insecurities".

### Phase 2: High-Margin B2B & Conversion Optimizations (NEXT ITERATION)
* **Stripe Webhook Integration:** Completing the checkout session pipeline to automatically gate final report rendering based on payment success state.
* **Automated Milestone Email Alerts:** Transactional email dispatches triggered on lifecycle achievements (e.g., notifying a subject when feedback thresholds are achieved).
* **AI SWOT Analysis Section:** Integrating a strategic Strengths, Weaknesses, Opportunities, and Threats quadrant into the core markdown generation prompt.

---

## 3. Upcoming Database Schema Additions (The Delta Blueprint)

The following schema extensions must be implemented to support the multi-tenant upgrade, the coach-gatekeeper model, and low-friction survey structures. Do not apply these to the live environment until explicit migration steps are requested.

### Table Modifications to Execute:
1. **`profiles` Table Update:** Append a `platform_source` text column containing a check constraint limiting inputs strictly to ('repstanding', 'perception_mirror').
2. **`audits` Table Update:** - Append a `platform_source` text column with the dual-brand check constraint.
   - Append a `coach_id` UUID column acting as a foreign key referencing `profiles(id)`.
   - Append an `is_released` boolean column defaulting to `false`. This serves as the coach-gatekeeper switch; clients cannot query or view a generated report until their managing coach toggles this true.

### New Tables to Construct:
1. **`rater_responses` Table:** Built to replace high-friction open text inputs with rapid-click metrics.
   - `id`: UUID (Primary Key, Default: gen_random_uuid).
   - `audit_id`: UUID (Foreign Key referencing audits(id) ON DELETE CASCADE).
   - `category_name`: TEXT (Not Null, e.g., 'Leadership Mastery').
   - `quantitative_score`: INT (Not Null, mapping 3-tier or 5-tier selection scores).
   - `selected_tags`: TEXT[] (Nullable array storing clicked trait tags used as context anchors for the report prompt).
   - `optional_text_seed`: TEXT (Nullable single string open-text input captured at the end of the survey flow).
   - `created_at`: TIMESTAMPTZ (Default: now()).

---

## 4. Long-Term Roadmap & Evolution Ideas
* **The Coach Dashboard Cockpit:** A centralized B2B roster interface allowing executive and wellness mentors to manage multiple active client audits simultaneously.
* **Asynchronous Completion Progress Tracker:** Real-time completion bars visible on the dashboard showing active response ratios (e.g., "Client A: 4 of 8 responses logged") without revealing rater identity.
* **Dual-Output Prompt Splitting:** Upgrading the synthesis engine to compile a comprehensive, development-focused report for the client alongside a private, back-end Strategic Insights Guide delivered exclusively to the coach to outline tactical coaching inquiries.