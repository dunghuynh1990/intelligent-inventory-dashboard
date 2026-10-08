---
name: verify-task
description: Verify the active WBS task without expanding scope
agent: agent
---

Verify the implementation against `docs/wbs-current-task.md`.

Do not add features.

Perform these checks:

1. Compare each exit criterion with the current implementation.
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