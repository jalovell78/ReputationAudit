---
Feature: Multi-Tenant Middleware & Hostname Routing
Status: Stable
Audience: Dev
---

# Technical Architecture Specification: Hostname Routing

This document defines how the single-codebase architecture dynamically detects, isolates, and renders themes and configurations for both brand tenants at runtime.

---

## 1. Domain Resolution Architecture
The system intercepts incoming HTTP requests at the edge via Next.js Middleware to resolve the tenant context before hitting application routes.

* **RepStanding Domain:** www.repstanding.com (and its development/staging equivalents) maps to the database string token 'repstanding'.
* **The Perception Mirror Domain:** www.theperceptionmirror.com (and its development/staging equivalents) maps to the database string token 'perception_mirror'.

---

## 2. Next.js Middleware Implementation Pattern
The agent must structure host identification using custom request headers within src/middleware.ts. This ensures downstream Server Components and API Routes can instantly read the active platform source without executing window-location client checks.

The implementation must parse the incoming request host header. If the domain contains 'theperceptionmirror.com' or 'perception-mirror', assign the context variable to 'perception_mirror'. Otherwise, default the fallback tracking state to 'repstanding'. Append this token to the request headers as 'x-tenant-source' before executing NextResponse.next() so it feeds forward natively. Ensure the middleware config matcher explicitly bypasses static asset paths, images, and API endpoints.

---

## 3. Dynamic UI Branding & Theme Injection
UI views must remain entirely generic. Component styling profiles must read the resolved header token to toggle layout aesthetics. Because the project leverages Tailwind CSS v4, dynamic style application must be driven via semantic data attributes or context mappings rather than JavaScript configuration utilities.

### Theme Hook Implementation Rule
When designing custom layout wrappers, use a top-level layout property to fetch the 'x-tenant-source' header. Set this value as a root custom data attribute directly on the html element (e.g., data-tenant={tenant}).

### Tailwind v4 Stylesheet Target Matching
Inside src/app/globals.css, utilize the root data attribute selection parameters to modify color schemes, gamut variables, and structural typography natively. 

Define your default theme variables directly under the @theme rule for core primary colors and standard brand display fonts. Right below that, use the standard CSS attribute selector html[data-tenant="perception_mirror"] to overwrite those same theme configuration tokens with sage greens, serif layouts, and custom wellness palettes. This forces Tailwind v4 to handle the brand swap natively at the compiler layer.

---

## 4. Multi-Tenant Database Isolation Rules
Whenever querying Supabase data rows via API Route Handlers or Server Actions, queries must strictly explicitly pass the tenant context to prevent data leak loops across tenant entities.

* **Filter Constraint Requirement:** Every data select, write, or modification sequence interacting with multi-tenant enabled tables (such as profiles or audits) must strictly specify the active platform_source filter argument to respect customer security lines.