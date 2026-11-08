# BudgetKu UX Hardening Implementation Plan

> **For agentic workers:** Implement task-by-task with test-first verification.

**Goal:** Protect destructive reset actions and close the accessibility and UI consistency gaps found in the frontend audit.

**Architecture:** Keep the existing Angular reactive-form model and visual system. Add a small native `<dialog>` flow owned by `BudgetPlannerComponent`, move repeated visual values into global CSS custom properties, and keep feedback in an existing live region.

**Tech Stack:** Angular 20, TypeScript, reactive forms, Jasmine, Playwright, CSS.

**Spec:** The approved UX hardening design from the preceding audit conversation.

## Global Constraints

- Preserve BudgetKu's light, calm, utilitarian visual direction.
- Keep all user-facing copy in Indonesian.
- Do not add dependencies.
- Preserve mobile no-overflow coverage.
- Keep controls keyboard accessible with visible focus states.

## Review Focus

- Escape and cancel must leave budget data unchanged.
- Confirming reset must clear data and return focus to income.
- Reset feedback must be announced without relying on color.
- Form metadata must remain stable across repeated category and expense rows.
- Reduced-motion users must not receive decorative transitions.

### Task 1: Reset confirmation behavior

**Files:**
- Modify: `src/app/app.spec.ts`
- Modify: `src/app/app.ts`
- Modify: `src/app/app.html`

- [ ] Add tests for opening/canceling reset and confirming reset.
- [ ] Run the focused tests and observe the expected failure.
- [ ] Implement the dialog state, Escape handling, reset confirmation, live feedback, and focus restoration.
- [ ] Run the focused tests again.

### Task 2: Form metadata and copy

**Files:**
- Modify: `src/app/app.html`
- Modify: `src/app/category-card/category-card.html`
- Modify: `src/app/app.ts`
- Modify: `e2e/budgetku.spec.ts`

- [ ] Add stable `name` and `autocomplete` attributes to all fields.
- [ ] Change loading copy to `Menghitung…` and update E2E selectors.
- [ ] Add E2E coverage for canceling and confirming reset.

### Task 3: CSS system cleanup

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/app.css`

- [ ] Add semantic color custom properties.
- [ ] Replace repeated application colors with tokens.
- [ ] Keep one focus-ring definition and one reduced-motion rule.
- [ ] Add dialog and skip-link styles consistent with the existing system.

### Task 4: Verification

- [ ] Run `npm run build`.
- [ ] Run `npm test`; record environment blockers if Chrome is unavailable.
- [ ] Run `npm run test:e2e` across desktop and mobile projects.
- [ ] Run the Impeccable detector on changed UI files.
- [ ] Inspect the final diff for accidental changes.
