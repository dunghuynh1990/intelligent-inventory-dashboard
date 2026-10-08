---
name: verify-task
description: "Verify the active WBS task against its exit criteria without changing files."
argument-hint: "Optional WBS ID; defaults to docs/active-task.md"
agent: agent
---

Verify the implementation against `docs/active-task.md` and its linked task in `docs/wbs.md` and `docs/requirements-baseline.md`.

Do not edit files or add features. If a WBS ID is supplied, confirm it matches the active-task snapshot; report a mismatch instead of silently switching tasks.

Perform these checks:

1. Compare each active-task exit criterion with the current implementation.
2. Inspect changed source and test files.
3. Identify unsupported assumptions.
4. Identify implementation outside the active task.
5. Run the relevant tests.
6. Run `npm test`.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Inspect the Git diff for:
   - secrets
   - debug logging
   - commented-out code
   - unrelated changes
   - unexplained dependencies
   - weakened tests

Report:

- PASS or FAIL for each exit criterion
- Command results
- Defects that must be fixed
- Improvements that can be deferred
- Whether the task is ready for human review and commit

Do not commit or push.