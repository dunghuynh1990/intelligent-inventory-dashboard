---
applyTo: "src/**/*.{tsx,css}"
---

# React implementation instructions

- Keep business calculations outside React components.
- Components must not directly access mock data or localStorage.
- Access inventory data through InventoryService.
- Represent loading, empty, no-result and service-error states explicitly.
- Use semantic HTML and accessible labels.
- Keep components small enough to explain during the assessment.
- Avoid premature abstraction and unnecessary design-system packages.
- Do not introduce state-management libraries unless existing React state is insufficient.
- Do not display actions for non-aging vehicles.
- Preserve the previous successful state when a save operation fails.

---
applyTo: "src/**/*.tsx"
---