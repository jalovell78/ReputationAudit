# Product Lifecycle & User Process Flow Architecture

This document serves as the absolute functional ground truth for the end-to-end user journey across both platform nodes (`RepStanding` and `The Perception Mirror`). It details user interactions, visual checkpoints, terminology translations, and corresponding backend expectations.

---

## 1. Core Terminology Map
To maintain structural isolation between the corporate and holistic configurations, all UI surfaces must dynamically map nomenclature based on the active `platform_source`:

| System Trigger Context | Brand A: RepStanding | Brand B: The Perception Mirror |
| :--- | :--- | :--- |
| **Primary Process Identifier**| Audit Request / Evaluation | Reflection Request / Mirror |
| **Output Artifact Name** | Reputation Audit Report | Your Perception Mirror |
| **External Evaluators** | Raters / Network Partners | Reflection Partners / Inner Circle |
| **System Framework Goal** | Professional Development Target | Development Objective / Growth Goal |

---

## 2. End-to-End Operational Lifecycle

### Stage 1: The Practitioner/User Core Dashboard
* **User Action:** User authenticates via Supabase Auth and lands on the primary overview deck.
* **UI Components:** * Chronological historical listing of all past evaluations/reflections.
    * Status badges indicating current loop progression (`in_progress`, `completed`).
    * Call-to-Action handler to initialize a new runtime loop ("Begin Reflection" / "Start New Audit").
* **Database Reference:** Select query filtering `audits` and `audit_reports` where `user_id = auth.uid()` and matches the current `platform_source`.

### Stage 2: The Assessment Configuration Wizard (Step 1 of 2)
* **User Action:** User initiates the multi-step setup wizard to configure their current growth roadmap.
* **UI Components:** * Dynamic card selection layout presenting explicit path profiles:
        * *Professional Alignment / Leadership Mastery*
        * *Conscious Leadership / Career Progression*
        * *Personal Growth*
        * *Social Intelligence*
    * Selection updates contextual hooks so Gemini tailors specific downstream evaluation prompts and final summary sections to this specific goal anchor.
* **Database Reference:** Writes tracking parameters directly into `audits.goal_type`.

### Stage 3: The Inner Circle Nomination Vault (Step 2 of 2)
* **User Action:** User inputs names, emails, and behavioral archetypes for their evaluator network.
* **UI Components:** * Dynamic multi-row input constructor supporting between 1 and 20 individual targets.
    * Archetype/Role dropdown definitions mapping specific evaluation perspectives (e.g., *Family Member*, *Close Friend*, *Direct Report*, *Client/Customer*).
    * Primary activation control node ("Launch Mirror with X Partners" / "Initialize Audit Hub").
* **Database Reference:** Generates safe multi-row insertions into the `feedback_entries` table. For each row, the system auto-generates a unique zero-knowledge tracking code into `feedback_entries.rater_link_id`.

### Stage 4: Self-Reflection Baseline & Collection Monitoring
* **User Action:** User returns to the main cockpit where the newly initialized request is anchored at the top. While waiting for external collection, they record their personal prediction baseline.
* **UI Components:** * **The Psychological Baseline Box:** A qualitative text entry workspace asking the user to predict what strengths and hidden shadow behaviors their inner circle will highlight.
    * **The Interactive Progress Matrix:** A progress bar computing active completion rates (`0%` to `100%`) alongside an asynchronous tracking indicator (e.g., "0 / 3 Received") mapping active submissions without breaking rater anonymity boundaries.
* **Database Reference:** * Saving thoughts updates `audits.self_prediction_text`. *(Note: This data row is permanently immutable via RLS/API logic once the report compilation sequence triggers to preserve psychological integrity).*
    * Progress ratios calculate count state transformations inside `feedback_entries` tracking where `status = 'submitted'`.

### Stage 5: The Communication Dispatch Hub
* **User Action:** User clicks "View Dispatch Hub & Links" to access distribution networks for their external reviewers.
* **UI Components:** * Individual tracking panels matching the designated rater rosters.
    * **The Anonymous Link Layer:** High-visibility display fields housing the unique, un-indexed external URL route (e.g., `theperceptionmirror.com/rate/[rater_link_id]`).
    * **The Integration Actions:** One-click clipboard copy utility next to a dedicated native Mail action node (`mailto:` configuration triggering relationship-aware, contextually wrapped invitation copy matrices).
* **Database Reference:** Queries individual `feedback_entries` tied to the parent asset container token.

### Stage 6: LLM Synthesis Artifact Delivery
* **User Action:** Once minimum validation response criteria are met, the processing layer computes the data payload, and the user opens their final actionable summary report.
* **UI Components:** * Fully integrated markdown canvas rendering deep thematic feedback partitions.
    * Core analytical headers: "1. The Hard Truth", "2. The Perception Gap (comprising Phantom Insecurities & Blindspots)", and empowerments targeting the user's unique advantages.
    * Responsive layout component fully adopting theme styling parameters (e.g., soft warm cream ambient backgrounds and elegant serif fonts under the wellness brand node vs. structured deep corporate slate profiles under the corporate node).
* **Database Reference:** Server-side fetch processing records stored in `audit_reports` mapping to the active tracking block container.