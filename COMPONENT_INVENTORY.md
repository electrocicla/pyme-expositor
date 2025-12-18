# Component Inventory & Audit

This file records each UI component, responsibilities, current status, and follow-up tasks. Use this as the single source-of-truth when triaging, assigning, and tracking component-level technical debt.

## How to use
- Each component entry includes: path, short description, existing tests (yes/no), a11y notes, lint/type concerns, and recommended actions.
- The audit will proceed module-by-module (Editor → Landing → ReactBits → others). Each component will get a small issue/PR with a focused fix or improvement.

---

## Summary (initial scan)
- Editor components (src/components/Editor/...) — Main configuration UI for the page builder. Many small, focused components (Inputs, Toggles, ColorPicker, CollapsiblePanel). Priorities: add unit tests, check keyboard accessibility, and reduce duplicated logic in form controls.
- Landing components (src/components/Landing/...) — Public site sections (Hero, Features, Gallery). Priorities: lazy-load heavy media, ensure proper image sizes and srcsets, add tests for content rendering and a11y landmarks.
- ReactBits (src/components/ReactBits/...) — Visual effects and helpers (AnimatedGradient, FloatingParticles, Cursor effects). Priorities: isolate heavy canvas/animation code and lazy-load; ensure effects are disabled for reduced-motion preferences.

---

## Initial component entries
### Editor
- `src/components/Editor/EditorLayout.tsx`
  - Role: Editor shell, composes Left/Right sidebars and canvas.
  - Tests: no
  - Notes: verify keyboard focus management, ensure no global side-effects.
  - Actions: add snapshot/integration tests, audit focus trapping and a11y labels.

- `src/components/Editor/LeftSidebar.tsx`, `RightSidebar.tsx`, `Sidebar.tsx`
  - Role: Panels and navigation inside editor.
  - Tests: no
  - Notes: ensure ARIA roles for navigation and controls, keyboard shortcuts are documented.
  - Actions: add unit tests for opening/closing panels; add aria roles and keyboard support.

- `src/components/Editor/panels/shared/Input.tsx`, `Select.tsx`, `Toggle.tsx` etc.
  - Role: Reusable form controls used across the editor.
  - Tests: mostly no
  - Notes: verify prop types, ensure label association for inputs, add stories/tests.
  - Actions: centralize shared control props into typed interfaces, add tests and accessibility checks.

### Landing
- `src/components/Landing/HeroSection.tsx`
  - Role: Hero: main marketing section with media and text.
  - Tests: no
  - Notes: large media present — lazy-load, use width/height or intrinsic sizing to avoid CLS.
  - Actions: implement responsive srcset, placeholder (LQIP) and lazy load; add a11y checks for headings.

- `src/components/Landing/GallerySection.tsx`
  - Role: Gallery/carousel.
  - Tests: no
  - Notes: carousel accessibility (keyboard, announce slide changes), image optimization.
  - Actions: verify Swiper usage accessibility, add aria-live for updates, add tests.

### ReactBits (visual helpers)
- Files like `AnimatedGradient.tsx`, `FloatingParticles.tsx`, `NoiseBackground.tsx`.
  - Role: purely visual effects; can be heavy.
  - Notes: respect `prefers-reduced-motion`, lazy-load or conditionally mount only on larger viewports.
  - Actions: add checks for reduced motion, consider moving to dynamic imports.

---

## Next steps (in-progress)
1. Programmatically enumerate all components and produce a checklist (done for main groups; proceeding file-by-file). — IN-PROGRESS
2. For each component: open file, look for missing types, missing tests, accessibility issues, heavy dependencies, and create focused task(s).
3. Prioritize fixes (low-risk fixes first: lint auto-fixes, tests) and then address chunking/performance and larger refactors.

---

I'll update this file as I audit each component and create per-component issues/PRs with small, focused changes.
