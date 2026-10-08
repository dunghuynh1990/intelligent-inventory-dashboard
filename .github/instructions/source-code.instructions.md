---
description: "Use when writing or reviewing application source code, React components, TypeScript, or CSS in this inventory dashboard."
applyTo: "src/**/*.{ts,tsx,css}"
---
# Source Code Instructions

- Use the existing React, TypeScript, and Vite stack; avoid `any` and unnecessary dependencies.
- Keep React components focused on presentation and interaction. Put business rules in pure TypeScript functions and data access behind typed service interfaces.
- Handle asynchronous loading and failures explicitly; do not hide errors behind success-shaped fallback values.
- Preserve semantic HTML, accessibility, keyboard behavior, and responsive layouts.
- Follow the existing CSS conventions and reuse established design tokens where applicable.
- Add or update behavior-focused tests for changed functionality when the test setup is available.
- Run the relevant configured tests, `npm run lint`, and `npm run build`; report actual results.
---
applyTo: "src/**/*.{ts,tsx}"
---