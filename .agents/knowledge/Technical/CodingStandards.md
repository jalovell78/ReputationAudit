---
Feature: Agent Routing & Execution Rules
Status: Stable
Audience: Dev
---

# 1. Model Selection & Context Windows
- **Gemini 3.5 Flash (Low):** Default to this model for all routine code edits, boilerplate generation, markdown/documentation updates, and terminal operations.
- **Gemini 3.5 Flash (Medium):** Utilize only when working on a complex multi-file bug or feature addition where the agent explicitly requires cross-module context.
- **Gemini 3.1 Pro (Low):** Reserve this tier strictly for advanced database schema changes or deep troubleshooting where Flash reasoning fails. Inform the user before escalating.
- **Claude (Thinking Models):** Strictly prohibited for general development tasks to protect compute allowance. Use only if explicitly requested by the User for high-level architectural design.

## 2. Multi-Tenant Isolated Modifications
- **Shared Component Lock:** When editing files inside `src/app/` or `src/components/ui/`, verify if the file is globally shared between 'repstanding' and 'perception_mirror'. 
- **Dynamic Assertions:** Any component rendering brand-specific terminology, visual themes, or email configurations must derive its parameters dynamically from the incoming tenant context. Never hardcode brand assets.

## 3. Testing, Verification, & Database Constraints
- **Prohibition on Automatic Testing:** Do not execute automated test suites or testing scripts. 
- **Manual Verification Loop:** After completing a file modification, provide a brief summary of the exact lines changed and prompt the user to conduct a manual test. The task state remains "Pending User Verification" until feedback is received.
- **NO DIRECT SQL EXECUTION:** You are strictly prohibited from attempting to execute SQL scripts, database migrations, or raw queries directly against the database or via any CLI tooling. 
- **SQL Hand-off Rule:** Whenever a database script or migration file is generated or modified, you must output the clean SQL code block or file path, provide an impact summary, and explicitly prompt the user to run the script manually inside their Supabase dashboard or local console.
- **Hard Stop on Deletions & Drops:** Any command involving `DELETE`, `DROP`, or `TRUNCATE` in database scripts, or the deletion of project files, requires an immediate **Mandatory Turn-Break**. Provide an impact assessment and end your turn. Do not execute or prompt the user without explicit "Go Ahead" approval.

## 4. Git Version Control Safety
- **No Automated Commits/Pushes:** Automated `git commit` or `git push` execution is completely barred.
- **Pre-Push Inventory:** When requested to prepare a deployment, stage the files, run a clean `git status`, summarize the changes, and present the exact proposed commit message. 
- **Mandatory Turn-Break:** You must end your turn immediately after presenting the commit summary. Do not bundle the commit execution inside the summary turn.

## 5. Knowledge Management & Project Synchronization
- **Post-Task Registration:** Upon successful completion of any programming task or schema addition, prompt the user for authorization to update the local documentation matrix.
- **Targets:** Log chronological modifications inside `ChangeLog.md` and keep structural updates tightly synchronized with `project_state.md` and `DataDictionary.md`.