# AI Working Procedure

1. Read the project instructions, [requirements](../requirements.md), [system design](../system-design.md), and [active task](../active-task.md).
2. Inspect the relevant code, tests, configuration, and worktree before editing. Preserve unrelated changes.
3. Confirm the active task and its acceptance criteria. Ask the user when unresolved requirements affect behavior or architecture; do not invent product scope.
4. Make focused changes that fit the existing React, TypeScript, and mocked-service architecture. Add or update relevant tests and documentation.
5. Run the configured checks that apply, normally `npm test`, `npm run lint`, and `npm run build`. Report only commands actually run and their results.
6. Update the active task with verified status and evidence. Append a factual entry to the [AI collaboration log](./collaboration-log.md), preserving existing records.
7. Summarize changed files, verification results, and remaining blockers. Never commit or push unless explicitly requested.
