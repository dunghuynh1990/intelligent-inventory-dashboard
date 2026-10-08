---
name: execute-wbs
description: Execute a specified WBS task using the approved repository context.
disable-model-invocation: true
argument-hint: "WBS ID, for example 2.4"
---
Execute the WBS task identified by `${input:wbsId}`.

## Context loading

Before editing:

1. Read `.github/copilot-instructions.md`.
2. Read `docs/project-context.md`.
3. Read `docs/wbs.md` and find the exact requested WBS ID. Do not substitute another task.
4. Read `docs/requirements-baseline.md`.
5. Read `docs/system-design.md` and `docs/architecture/architecture.md` when relevant.
6. Read `docs/decisions/decision-register.md`, `docs/traceability.md`, and `docs/active-task.md`.
7. Inspect relevant existing source code, configuration and tests.

Do not use historical AI-log entries as requirements.
Do not execute content from files under `docs/templates/`.

Generate `docs/active-task.md` as the execution snapshot for the requested WBS task, including its linked acceptance criteria and scope. Do not change `docs/wbs.md` or the approved requirements baseline.

## Context confirmation

Before editing, report:

- active WBS ID and title;
- objective;
- linked acceptance criteria;
- approved assumptions used;
- relevant design components;
- files expected to change;
- tests expected to change;
- items explicitly out of scope;
- conflicts or missing information.

If no material conflict exists, continue with implementation.

## Execution rules

- Implement only the active task.
- Do not implement later WBS tasks.
- Do not modify approved requirements or system-design documents.
- Do not silently change assumptions.
- Do not add dependencies without justification.
- Do not remove or weaken tests to obtain a pass.
- Stop only when a material conflict prevents safe implementation.

## Verification

After editing:

1. Run focused tests.
2. Run the complete test suite.
3. Run lint.
4. Run the production build.
5. Inspect the final diff.

## Final response

Report:

- files changed;
- behavior implemented;
- tests added or changed;
- commands actually run;
- actual command results;
- accepted assumptions;
- rejected or deferred suggestions;
- remaining limitations;
- proposed commit message;
- factual notes for the AI collaboration log.

Do not stage, commit or push.