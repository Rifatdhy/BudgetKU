# Agent instructions

- Gunakan bahasa Indonesia untuk semua respons kepada pengguna, kecuali pengguna meminta bahasa lain.

## Project shape

- This is one Angular application, `budgetku`; application source is under `src/`, browser tests are under `e2e/`, and generated build output is under `dist/`.
- The root component is `src/app/app.ts`, bootstrapped directly by `src/main.ts`; there is no router or backend in the current app.
- Budget state is held in the reactive form in `BudgetPlannerComponent`; data is intentionally in-memory and is lost on reload.

## Commands

- Install dependencies with `npm ci`.
- Run the app with `npm start` (`ng serve`, default URL `http://localhost:4200/`).
- Build with `npm run build`; production is the default Angular configuration.
- Run unit tests with `npm test` (`ng test`, Karma/Jasmine).
- Run end-to-end tests with `npm run test:e2e`. Start the app separately on port `4300` first, because `playwright.config.ts` uses `http://127.0.0.1:4300` and does not define a web server: `npm start -- --port 4300`.
- Playwright runs both Chromium desktop and iPhone 13 mobile projects. Preserve mobile no-overflow coverage when changing layout.

## Implementation constraints

- TypeScript and Angular templates are strict (`strict`, `strictTemplates`, and related checks are enabled). Keep form controls typed and avoid weakening compiler settings.
- Use the existing Angular, RxJS, Karma, and Playwright dependencies. Do not add a dependency for functionality already covered by the platform or installed toolchain.
- Angular schematics are configured to skip generated tests. Add focused tests manually when behavior is non-trivial, rather than relying on generated test files.
- Keep user-facing copy and accessibility labels in Indonesian unless the surrounding feature explicitly requires another language; existing E2E selectors depend on those labels and headings.
- Preserve the existing accessible control structure: real `<button>` elements for actions, visible labels for form fields, and meaningful ARIA names for dynamic category and expense controls.

## Verification

- For form or calculation changes, run `npm test` and the relevant Playwright test or full `npm run test:e2e` suite.
- For visual or responsive changes, run the mobile Playwright project and verify `document.documentElement.scrollWidth` does not exceed the viewport width.
- Treat `dist/` as generated output. Do not edit it as source or include it in implementation changes.
