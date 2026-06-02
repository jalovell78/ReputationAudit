# Product Architecture & Go-To-Market Playbook: Multi-Tenant Schema Separation

## 1. Executive Summary & Core Concept
This project is an AI-driven, multi-source evaluation and 360-degree feedback platform built on a lean, high-margin B2B SaaS subscription model. 

The application solves a fundamental human problem: the inability to see oneself objectively ("The Perception Gap"). It automates the process of gathering external feedback, structures the raw qualitative metrics, and uses an LLM (Gemini 3.1) to synthesize a highly customized, actionable report for professional coaches and their clients.

To maximize market capture with minimal engineering overhead, the application uses a **Multi-Tenant, Single-Codebase Architecture**. A single codebase running on Next.js, Vercel, and Supabase dynamically updates its branding, theme, copywriting, and database routing based on the incoming domain request (hostname tracking).

---

## 2. Dual-Brand GTM Matrix

The platform splits into two distinct operational faces to target completely different buyer psychologies while running on the exact same underlying technology engine.

| Attribute | Brand A: RepStanding | Brand B: The Perception Mirror |
| :--- | :--- | :--- |
| **Target Domain** | `www.repstanding.com` | `www.theperceptionmirror.com` |
| **Core Target Audience** | Corporate Leaders, Executive Coaches, HR Consultants, Career Transition Specialists | Life Coaches, Mindset Mentors, CBT Therapists, Holistic and Wellness Practitioners |
| **Visual Identity** | Professional, authoritative. Corporate Blues, sharp edges, Slate Grays. | Calm, restorative, organic. Sage Greens, Soft Sands, serif typography, rounded components. |
| **Product Vocabulary** | "360 Performance Audit", "Rater Network", "KPI Alignment", "Critical Blindsspots" | "The Perception Mirror", "Inner Circle", "Growth Alignment", "Hidden Blocks & Shadows" |
| **Sender Address** | `audit@repstanding.com` | `hello@theperceptionmirror.com` |

---

## 3. Core Feature Specifications

To shift the application from a one-off consumer transactional tool to a recurring B2B subscription model, any agent executing code must prioritize these architectural components:

### A. The Coach Dashboard (Multi-Tenancy Layer)
*   **Roster Management:** A unified cockpit for subscribing coaches to add, pause, or manage multiple active clients simultaneously.
*   **Progress Metrics:** Asynchronous polling of rater completion rates per client (e.g., "Client John Doe: 3/5 responses received").
*   **Gatekeeper Control ("The Release Trigger"):** Generated AI reports must never bypass the coach. The final synthesis is delivered to the Coach's portal first. The coach must toggle an `is_released` boolean state before the client can view the report or receive a downloadable PDF artifact.

### B. "Click First, Elaborate Second" (Low-Friction Survey Flow)
To protect completion rates, long-form open-text boxes are replaced with a fast, high-fidelity micro-survey:
*   **The Categorical Slider/Radio Selection:** Raters evaluate the client across core categories using rapid-click 3-tier or 5-tier scales.
*   **The Trait Tag Cloud:** A grid of predefined descriptive attributes (e.g., [Direct & Clear], [Analytical], [Empathetic], [Hesitant]) that acts as conceptual anchors for the LLM.
*   **The Contextual Seed Box:** A single, optional text input at the absolute end of the evaluation asking for a real-world example of professional or personal impact.

### C. The Perception Gap Analytics Engine
*   **Self vs. Peer Baseline:** The client completes a rapid self-assessment matching the exact structured questions sent to their raters.
*   **Variance Calculation:** The backend engine maps the statistical delta between the client’s internal perception and the aggregated external reality to output a visual gap graph.
*   **Dual-Output LLM Prompting:** The underlying Gemini prompt must map the data matrix into two separate outputs:
    1.  *Client-Facing Evaluation:* Constructive, highly descriptive, structured feedback emphasizing developmental themes.
    2.  *Private Coach Insights Guide:* A highly strategic, back-end briefing suggesting specific clinical/coaching exploratory questions based on the client's explicit blind spots.

