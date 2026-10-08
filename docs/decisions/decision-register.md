# Decision Register

Record the status and rationale of project decisions here. Confirmed decisions describe the agreed scope; proposed approaches remain subject to the assessment requirements.

| ID | Decision | Status | Rationale / source | Follow-up |
|---|---|---|---|---|
| D-001 | Use React, TypeScript, and Vite for the frontend. | Confirmed | Existing project configuration and [project context](../project-context.md). | Preserve the established stack. |
| D-002 | Keep the demonstration scoped to one dealership. | Confirmed | Confirmed project scope in [requirements](../requirements.md). | Do not add multi-dealership support without an explicit scope change. |
| D-003 | Use mocked backend behavior behind a service boundary. | Confirmed | Confirmed project scope and [system design](../system-design.md). | Define the minimal contract required by active WBS task 2.3. |
| D-004 | Determine the dashboard's metrics, inventory fields, filters, actions, and workflows. | Open | Detailed assessment requirements have not been recorded. | Confirm and document requirements before feature implementation. |
| D-005 | Decide on routing, persistence, authentication, backend contract, and deployment. | Open | These capabilities are not established as current requirements. | Do not implement unless the product scope explicitly requires them. |
