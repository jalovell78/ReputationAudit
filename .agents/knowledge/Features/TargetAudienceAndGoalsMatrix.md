# Strategic Target Audience & Product Goal Matrix

This document outlines the operational differences, audience psychologies, and distinct growth goal architectures for **RepStanding** and **The Perception Mirror**. It serves as the design specification for multi-tenant route configurations, dynamic copy matrices, and machine-learning evaluation prompts.

---

## 1. Core Platform Persona & Positioning

The single-codebase architecture uses dynamic runtime isolation to split the underlying feedback engine into two separate market-facing facades. Each brand adapts its visual language, terminology, and goal tracks to align with distinct buyer psychologies.

| Attribute | Brand A: RepStanding | Brand B: The Perception Mirror |
| :--- | :--- | :--- |
| **Primary Domain** | `www.repstanding.com` | `www.theperceptionmirror.com` |
| **Core Target Audience** | • Corporate Executives & Leaders<br>• Executive Coaches & Mentors<br>• HR Consultants & Directors<br>• Startup Founders & Entrepreneurs | • Life Coaches & Holistic Practitioners<br>• Relationship & Mindset Mentors<br>• CBT Therapists & Wellness Guides<br>• Self-Actualization Seekers |
| **Visual Aesthetic** | Professional, high-contrast, authoritative.<br>• Corporate Slate Grays & Indigo accents.<br>• Sharp, rigid dashboard geometries. | Calm, restorative, editorial, organic.<br>• Soft Sands & Sage Green accents.<br>• Flowing, rounded components & Serif typography. |
| **Tone & Vocabulary** | Transactional, strategic, performance-driven.<br>• *Audit, Raters, Performance Target, Blindspots* | Transformational, introspective, relational.<br>• *Reflection, Inner Circle, Growth Goal, Shadows* |
| **Sender Interface** | `audit@repstanding.com` | `hello@theperceptionmirror.com` |

---

## 2. Dynamic Goal Configurations

To minimize user onboarding friction and maximize contextual depth, each tenant exposes four curated development paths. These paths map cleanly to the unique psychological pain points of their respective audiences and feed directly into the downstream LLM analysis engine.

### A. RepStanding: Corporate Optimization Tracks
*Designed to optimize professional equity, structural team performance, and commercial execution.*

1. **Executive Presence & Influence**
   * **Key Metrics:** Room command, gravitas, stakeholder alignment, and upward management.
   * **Description:** Project authority, align conflicting stakeholders, and communicate effectively across leadership levels.
2. **High-Performance Leadership**
   * **Key Metrics:** Cross-functional execution, team scaling, velocity, and friction elimination.
   * **Description:** Scale high-output teams, drive strategic clarity, and unlock execution performance.
3. **Strategic Impact & Innovation**
   * **Key Metrics:** Vision signaling, systemic long-term planning, and milestone scaling.
   * **Description:** Move past tactical firefighting, signal organizational vision, and drive long-term business outcomes.
4. **Career Progression Velocity**
   * **Key Metrics:** Promotional optics, skill visibility, and corporate mobility patterns.
   * **Description:** Build organizational readiness, uncover hidden mobility blocks, and accelerate time-to-promotion.

### B. The Perception Mirror: Introspective Growth Tracks
*Designed for deep internal discovery, relational exploration, and somatic/psychological awareness.*

1. **Shadow Integration & Blindspots**
   * **Key Metrics:** Phantom insecurities, self-sabotaging patterns, and defensive projections.
   * **Description:** Bring hidden behavioral blocks to light, dismantle limiting paradigms, and achieve self-acceptance.
2. **Relational Resonance & Empathy**
   * **Key Metrics:** Conscious listening, emotional safety boundaries, and defensive wall reduction.
   * **Description:** Deepen interpersonal communication, build authentic trust, and cultivate meaningful relationships.
3. **Purpose & Core Alignment**
   * **Key Metrics:** Authenticity indexing, intent-to-action coherence, and stagnation removal.
   * **Description:** Align daily habits with core values, bridge internal intent with action, and step out of stagnation.
4. **Conscious Presence & Expression**
   * **Key Metrics:** Grounded visibility, vulnerability integration, and authentic voice presence.
   * **Description:** Cultivate personal grounding, conquer the fear of visibility, and speak your truth clearly.

---

## 3. Dynamic Rater Archetype Configurations

To decouple rater terminology and maintain brand identity during the roster nomination phase, each tenant provides custom rater archetypes that match its positioning:

### A. RepStanding: Corporate Roster Archetypes
*Terminologies optimized for professional, corporate, and external stakeholder relationships.*

*   **Manager / Board Member** (`manager`)
*   **Peer / Cross-Functional Colleague** (`peer`)
*   **Direct Report / Team Member** (`direct_report`)
*   **Client / Customer / Stakeholder** (`client`)
*   **Industry Mentor / Advisor** (`mentor`)
*   **Challenger / Constructive Critic** (`challenger`)

### B. The Perception Mirror: Introspective/Wellness Roster Archetypes
*Terminologies optimized for personal, emotional, familial, and coaching relationships.*

*   **Spouse / Romantic Partner** (`partner`)
*   **Close Friend / Trusted Confidant** (`friend`)
*   **Family Member / Sibling / Parent** (`family`)
*   **Mentor / Spiritual Guide / Coach** (`guide`)
*   **Creative Collaborator / Peer** (`collaborator`)
*   **Loving Challenger / Accountability Partner** (`loving_challenger`)

---

## 4. Downstream Architectural Constraints

### LLM Prompt Tuning Integration
The downstream generative AI synthesis engine must dynamically intercept the selected `goal_type` to adjust its analytical framework:
* **Corporate Core (`repstanding`):** Evaluates behavioral traits through an efficiency, corporate optics, and talent retention lens.
* **Wellness Core (`perception_mirror`):** Evaluates traits through an introspective, emotional intelligence, and growth-oriented lens.

### Database Reference Mapping
All configurations must be mapped inside `src/lib/tenant.ts` under a centralized dictionary structure to dynamically distribute card layout copy, survey categories, and tag cloud attribute chips during runtime execution.