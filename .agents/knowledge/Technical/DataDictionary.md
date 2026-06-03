# Database Schema Data Dictionary

This document serves as the absolute technical ground truth for the active Reputation Audit production database schema. It covers the existing Supabase PostgreSQL structure, data types, constraints, and Row Level Security (RLS) policies.

---

## Database Table Definitions

### 1. `profiles`
Tracks authenticated user profiles, extending the internal Supabase identity store (`auth.users`).

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK**, **FK** (`auth.users.id` ON DELETE CASCADE), Not Null | Core unique link to Supabase authentication credentials. |
| `email` | `text` | **Unique**, Not Null | Primary user communication and identifier email address. |
| `full_name` | `text` | Nullable | User's full name captured during the registration flow. |
| `created_at` | `timestamp with time zone` | Not Null, Default: `timezone('utc'::text, now())` | Initial profile registration UTC timestamp. |

---

### 2. `audits`
Manages individual evaluation feedback lifecycles, capturing subject predictions and payment access gates.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK**, Default: `gen_random_uuid()`, Not Null | Primary identification token for the audit run. |
| `user_id` | `uuid` | **FK** (`profiles.id` ON DELETE CASCADE), Not Null | Links the audit run back to the subject profile. |
| `status` | `text` | Nullable, Default: `'in_progress'` | Tracks the evaluation collection state (e.g., `'in_progress'`, `'completed'`). |
| `created_at` | `timestamp with time zone` | Not Null, Default: `timezone('utc'::text, now())` | Creation timestamp tracking when the audit wizard was completed. |
| `stripe_session_id` | `text` | Nullable | Internal checkout reference used for payment completion tracking. |
| `payment_status` | `text` | Nullable, Default: `'unpaid'` | State machine value used to gate access to the final generated report. |
| `goal_type` | `text` | Nullable | Strategic context chosen by subject (e.g., `'career_progression'`, `'leadership_mastery'`). |
| `self_audit_responses` | `jsonb` | Nullable | **⚠️ DEPRECATED.** Legacy quantitative dimensions. Do not use for new code features. |
| `self_prediction_text` | `text` | Nullable | Qualitative hypothesis text written by the subject, permanently locked upon report generation. |

---

### 3. `feedback_entries`
Stores anonymous, qualitative feedback datasets provided by invited external raters.

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | **PK**, Default: `gen_random_uuid()`, Not Null | Unique record tracking token for individual rater inputs. |
| `audit_id` | `uuid` | **FK** (`audits.id` ON DELETE CASCADE), Not Null | Connects the entry directly to the parent audit container. |
| `archetype` | `text` | Not Null | Explicit relationship role selector (e.g., `'Close Friend'`, `'Critic/Hater'`, `'Subordinate'`). |
| `rater_name` | `text` | Nullable | Evaluator name (isolated from the subject's UI to protect rater identity). |
| `rater_email` | `text` | Nullable | Contact email address used to target invitation dispatch sequences. |
| `rater_link_id` | `uuid` | **Unique**, Default: `gen_random_uuid()`, Nullable | Secure, zero-knowledge link token used to allow anonymous form submission. |
| `status` | `text` | Nullable, Default: `'pending'` | Submission state tracking (e.g., `'pending'`, `'submitted'`). |
| `original_text` | `text` | Nullable | The unedited raw text submitted directly by the evaluator. |
| `sanitized_text` | `text` | Nullable | Anonymized, LLM-filtered version of the text stripped of identifying phrasing. |
| `created_at` | `timestamp with time zone` | Not Null, Default: `timezone('utc'::text, now())` | Invitation dispatch tracking timestamp. |
| `submitted_at` | `timestamp with time zone` | Nullable | Explicit UTC timestamp recording when the rater submitted the form. |
| `promo_code` | `text` | Nullable | Applied transactional campaign or discount code string if valid. |
| `archetype_group` | `text` | Nullable | Sentiment group mapping tag (e.g., `'manager'`, `'peer'`, `'friend'`). |

---

---
 
 ### 4. `audit_reports`
 Caches the completed, AI-synthesized qualitative evaluation outputs for historical client retrieval.
 
 | Column Name | Data Type | Constraints | Description |
 | :--- | :--- | :--- | :--- |
 | `id` | `uuid` | **PK**, Default: `gen_random_uuid()`, Not Null | Unique identification key for the compiled analysis report. |
 | `audit_id` | `uuid` | **FK** (`audits.id` ON DELETE CASCADE), Not Null | Relates the final artifact back to the master tracking loop. |
 | `report_markdown` | `text` | Not Null | The full, synthesized report text in Markdown. |
 | `perception_gap` | `jsonb` | Nullable | Serialized parameters detailing the structural analysis matrix. |
 | `goal_type` | `text` | Nullable | Inherited context anchor representing the active developmental target profile. |
 | `feedback_count` | `integer` | Not Null, Default: `0` | Total number of external reviews that were included in this specific synthesis run. |
 | `generated_at` | `timestamp with time zone` | Not Null, Default: `timezone('utc'::text, now())` | Static record tracking the date and time of model computation. |
 
 ---
 
+### 5. `rater_responses`
+Stores structured micro-survey scores, attributes, and contextual seeds from external raters.
+
+| Column Name | Data Type | Constraints | Description |
+| :--- | :--- | :--- | :--- |
+| `id` | `uuid` | **PK**, Default: `gen_random_uuid()`, Not Null | Unique identification key for each specific rating entry. |
+| `audit_id` | `uuid` | **FK** (`audits.id` ON DELETE CASCADE), Not Null | Relates the rating back to the parent audit container. |
+| `category_name` | `text` | Not Null | Evaluated developmental dimension name (e.g. *Strategic Impact*). |
+| `quantitative_score` | `integer` | Not Null, CHECK (1-5) | Numeric score selected on the 1–5 slider scale. |
+| `selected_tags` | `text[]` | Nullable | Trait tags chosen from the behavioral chip tag cloud. |
+| `optional_text_seed` | `text` | Nullable | Qualitative contextual feedback written inside the seed box. |
+| `created_at` | `timestamp with time zone` | Not Null, Default: `now()` | Submission timestamp recording when the rater submitted the form. |
+
+---
+
 ## Row Level Security (RLS) Policies
 
 All operational production tables actively enforce Row Level Security limits via the Supabase database engine.
 
 ### `profiles`
 * `Users can view own profile`: `FOR SELECT USING (auth.uid() = id)`
 * `Users can insert own profile`: `FOR INSERT WITH CHECK (auth.uid() = id)`
 * `Users can update own profile`: `FOR UPDATE USING (auth.uid() = id)`
 
 ### `audits`
 * `Users can view own audits`: `FOR SELECT USING (auth.uid() = user_id)`
 * `Users can create own audits`: `FOR INSERT WITH CHECK (auth.uid() = user_id)`
 * `Users can update own audits`: `FOR UPDATE USING (auth.uid() = user_id)`
 
 ### `feedback_entries`
 * `Users can view feedback for their audits`: `FOR SELECT USING (EXISTS (SELECT 1 FROM audits WHERE audits.id = feedback_entries.audit_id AND audits.user_id = auth.uid()))`
 * `Users can insert feedback for their audits`: `FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM audits WHERE audits.id = feedback_entries.audit_id AND audits.user_id = auth.uid()))`
 * `Anonymous raters can view their invite`: `FOR SELECT USING (status = 'pending')`
 * `Anonymous raters can submit feedback`: `FOR UPDATE USING (status = 'pending')`
 
 ### `audit_reports`
 * `Users can view reports for their own audits`: `FOR SELECT USING (EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_reports.audit_id AND audits.user_id = auth.uid()))`
 
+### `rater_responses`
+* `Allow audit owners to select rater responses`: `FOR SELECT USING (EXISTS (SELECT 1 FROM audits WHERE audits.id = rater_responses.audit_id AND audits.user_id = auth.uid()))`
+
 ---
 
 ## Database Defaults & Operational Constraints
 
 * **Identity System**: Primary keys on `profiles` mirror `auth.users(id)` precisely. All other system row elements utilize zero-knowledge UUIDs via `gen_random_uuid()`.
 * **Time Handling**: System storage handles data strictly using the `timestamp with time zone` data type, using `timezone('utc'::text, now())`.
 * **Production System Indexes**:
     * `audit_reports_audit_id_generated_at_idx`: Performance index covering queries pulling `audit_reports(audit_id, generated_at DESC)` to fetch the most recent data block.
     * `feedback_entries.rater_link_id`: Explicit unique structural constraint layout ensuring instant O(1) page access resolution for anonymous tokens.
+    * `rater_responses_audit_id_idx`: Performance index covering query filters targeting `rater_responses(audit_id)`.