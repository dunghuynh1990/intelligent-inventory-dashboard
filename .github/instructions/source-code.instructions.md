---
description: "Use when writing or reviewing non-React TypeScript modules, domain logic, or service code in the inventory dashboard."
applyTo: "src/**/*.ts"
---
# Source Code Instructions

- Use the existing React, TypeScript, and Vite stack; avoid `any` and unnecessary dependencies.
- Keep TypeScript modules focused. Put business rules in pure functions and data access behind typed service interfaces.
- Handle asynchronous loading and failures explicitly; do not hide errors behind success-shaped fallback values.
- Avoid unnecessary type assertions.
- Add or update unit tests for changed logic or service contracts.