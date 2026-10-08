---
description: "Record a completed or attempted WBS task and verified results in the canonical AI collaboration log."
name: "Update AI Log"
argument-hint: "Task ID and summary of the AI contribution"
agent: "agent"
---
Update the canonical [AI collaboration log](../../docs/ai/collaboration-log.md) for the specified task using evidence from this conversation and the repository.

- Record the task ID, request, AI contribution, accepted or rejected outcome, verification actually performed, and any human correction.
- Be concise, factual, and transparent. Distinguish attempted work from completed work.
- Never claim a command or test passed unless it was run and passed.
- Do not invent user feedback or verification. If either is unavailable, record it as pending or not provided.
- Append a row to the existing table; preserve prior entries and its format.
- Do not update legacy logs or other documents unless the active task explicitly requires it.

Task details: ${input:task}
