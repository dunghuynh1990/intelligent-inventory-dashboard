# Source-of-Truth Order

When information conflicts, use this order:

1. Assignment brief
2. Approved requirements and acceptance criteria
3. Approved assumptions and exclusions
4. Approved system design
5. Active WBS task
6. Existing implementation
7. Copilot suggestions

Copilot suggestions are never authoritative.

If two approved documents conflict:

- Do not choose silently.
- Do not change either document.
- Report the conflict before implementation.
- Continue only with work that is unaffected by the conflict.


# Document Authority

The following documents form the approved implementation context.

| Document | Purpose | Authority |
|---|---|---|
| `docs/project-context.md` | Project objectives, boundaries and source-of-truth order | Authoritative |
| `docs/requirements.md` | Approved requirements, acceptance criteria, assumptions and exclusions | Authoritative |
| `docs/system-design.md` | Approved architecture, components, contracts and data flow | Authoritative |
| `docs/decisions/decision-register.md` | Approved, deferred and rejected decisions | Authoritative according to decision status |
| `docs/traceability.md` | Mapping between WBS tasks, acceptance criteria and verification | Authoritative |
| `docs/active-task.md` | The only WBS task currently authorized for execution | Authoritative for current execution |
| `docs/templates/wbs-task-template.md` | Template for preparing future tasks | Reference only |
| `docs/ai/working-procedure.md` | Human and AI working procedure | Process guidance |
| `docs/ai/collaboration-log.md` | Factual evidence of actual AI interactions | Evidence only |

## Conflict handling

Use the following precedence:

1. Assignment brief
2. Approved requirements and acceptance criteria
3. Approved assumptions and exclusions
4. Approved system design
5. Applied decisions
6. Active WBS task
7. Existing implementation
8. Copilot suggestions

If authoritative documents conflict, Copilot must stop only the affected
part of the task and report the conflict.

Reference templates, historical logs and proposed decisions must not
override authoritative documents.