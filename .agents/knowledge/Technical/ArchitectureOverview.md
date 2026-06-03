# Technical Architecture Overview

This document provides a comprehensive overview of the technical solutions, engineering foundations, and exact dependency configurations of the **Reputation Audit** project.

---

## 1. Core Framework & Runtime

This section details the framework version, underlying engine, compiler configuration, and build runners powering the application.

| Component | Technology | Version | Configuration Details / Developer Notes |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js | `16.1.6` | App Router-based structure. Uses `eslint-config-next` (`16.1.6`). |
| **React Engine** | React / React-DOM | `19.2.3` | React 19 engine. Type definitions target `@types/react` and `@types/react-dom` version `^19`. |
| **React Compiler** | `babel-plugin-react-compiler` | `1.0.0` | React Compiler is enabled via `reactCompiler: true` in `next.config.ts`. |
| **Build & Dev Runner** | Next.js CLI | *Built-in* | Configured scripts in `package.json` for compilation and local execution:<br>• `dev`: `next dev` (runs local development server)<br>• `build`: `next build` (compiles production bundle)<br>• `start`: `next start` (runs built production server) |

---

## 2. Database & Auth SDKs

This section captures the SDKs and drivers utilized to communicate with the Supabase database instance and handle user authentication.

| Package | Version | Purpose & Integration Notes |
| :--- | :--- | :--- |
| `@supabase/supabase-js` | `^2.98.0` | Core JS/TS client for interacting with the Supabase PostgreSQL database instance. |
| `@supabase/ssr` | `^0.9.0` | Server-Side Rendering helper library standardizing auth state persistence, token refresh, and session management using HTTP-only cookies in Next.js Server Actions, Route Handlers, and Middleware. Always leverage server context initialization for secure routes. |

---

## 3. UI & Styling Libraries

This section lists the exact dependencies and utility libraries handling layout, style compilation, icons, and dynamic component classes.

| Library | Version | Role in Project / Architecture Constraints |
| :--- | :--- | :--- |
| `tailwindcss` | `^4` | Utility-first CSS styling framework. Employs CSS-first configuration natively (no `tailwind.config.ts` required) compiled via `@tailwindcss/postcss`. |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin integrating Tailwind CSS v4 into the CSS build flow. |
| `radix-ui` | `^1.4.3` | Headless UI primitives supplying accessible, unstyled core interactive logic. |
| `shadcn` | `^3.8.5` | CLI tool (devDependency) configured via `components.json` for component installation. Sets styles to `new-york` using the `neutral` base color. |
| `lucide-react` | `^0.577.0` | High-quality icon set configured as the default icon library. |
| `class-variance-authority` | `^0.7.1` | Facilitates creation of structured CSS variant mappings for component states. |
| `tailwind-merge` | `^3.5.0` | Dynamically resolves and merges conflicting Tailwind utility classes at runtime. |
| `clsx` | `^2.1.1` | Simple utility for joining class names conditionally. |
| `tw-animate-css` | `^1.4.0` | Utility CSS library that implements transition effects and keyframe animations. |
| `@tailwindcss/typography` | `^0.5.19` | Utility plugin mapping semantic prose styles to rich HTML elements (markdown, text articles). |

---

## 4. Key Configuration Rules

This section describes configuration rules and environment options defined across configuration files.

| Configuration File | Option / Rule | Value | Technical Rationale & Agent Impact Directive |
| :--- | :--- | :--- | :--- |
| **`next.config.ts`** | `reactCompiler` | `true` | Automatically memoizes component trees and rendering logic, mitigating the need for `useMemo` and `useCallback`. |
| **`tsconfig.json`** | `strict` | `true` | Enables strict type-checking checks, guaranteeing code quality and minimizing runtime type issues. |
| **`tsconfig.json`** | `target` | `"ES2017"` | Targets modern JavaScript compilers matching target runtime environments. |
| **`tsconfig.json`** | `moduleResolution` | `"bundler"` | Resolves TypeScript import statements in alignment with modern web bundlers. |
| **`tsconfig.json`** | `paths` | `{"@/*": ["./src/*"]}` | Defines custom path mapping to resolve absolute-like paths referencing the `src` folder. |
| **`components.json`** | `tailwind.config` | `""` *(empty)* | Indicates Tailwind CSS v4 CSS-only configuration model. **CRITICAL: Do not attempt to generate or edit a legacy tailwind.config.ts file.** |
| **`components.json`** | `tailwind.css` | `"src/app/globals.css"` | Identifies the stylesheet entrypoint file containing `@import "tailwindcss";`. |
| **`globals.css`** | CSS Variables | `oklch(...)` based | Defines shadcn theme parameters inside the native OKLCH format. **CRITICAL: To extend themes, brand utilities, or typography rules, append them natively using the `@theme { ... }` directive directly inside this file.** |

---

## 5. Additional Key Dependencies

Other critical production utilities supporting business logic and external services.

| Package | Version | Purpose & Execution Strategy |
| :--- | :--- | :--- |
| `@google/genai` | `^1.43.0` | For executing Gemini API generative AI reasoning tasks. |
| `stripe` | `^20.4.0` | Integrates checkout sessions for the B2B SaaS payment gate. Handles backend webhook processing. |
| `zod` | `^4.3.6` | TypeScript-first schema declaration and validation. Mandatory for validating runtime API payloads. |
| `react-hook-form` | `^7.71.2` | Lightweight form-state management. Used across multi-step wizard layouts. |
| `@hookform/resolvers` | `^5.2.2` | Links `react-hook-form` validation schemas to `zod`. |
| `react-markdown` | `^10.1.0` | Safe rendering of markdown strings inside components (used to display synthesized AI reports). |
| `recharts` | `^3.7.0` | Renders user audit statistics and feedback charts. **Note: Ensure charts are isolated inside client components ('use client') to prevent SSR fiber node mismatch errors.** |
| `resend` | `^6.12.4` | For executing transactional email dispatch to raters using relationship-aware templates. |
| `@vercel/functions` | `^3.6.1` | Provides the serverless runtime `waitUntil` utility to execute background promises without route blocking. |