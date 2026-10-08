---
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Testing instructions

- Use Vitest.
- Use React Testing Library for component behavior.
- Prefer accessible queries such as `getByRole` and `getByLabelText`.
- Test observable behavior rather than internal component state.
- Keep pure business-rule tests separate from React component tests.
- Use table-driven tests for related boundary values where readable.
- Cover required boundaries explicitly.
- Do not use snapshots as the primary proof of behavior.
- Do not reduce assertions merely to make a failing test pass.
- Every test name must state the expected behavior.
- Use a fixed injected reference date for age-related tests.
- Include invalid and future dates where the relevant acceptance criteria require them.
- For service failures, assert the user-visible result or preserved state.


---
applyTo: "**/*.{test,spec}.{ts,tsx}"
---