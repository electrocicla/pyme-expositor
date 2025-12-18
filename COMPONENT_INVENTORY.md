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
### Top-level components
- `src/components/Dashboard.tsx`
  - Role: Main dashboard page component.
  - Tests: no
  - Notes: Check for proper routing and state management.
  - Actions: Add tests, ensure accessibility.

- `src/components/DemoPage.tsx`
  - Role: Demo page component.
  - Tests: no
  - Notes: Verify demo functionality.
  - Actions: Add tests.

- `src/components/Login.tsx`
  - Role: Login form component.
  - Tests: no
  - Notes: Ensure secure handling, accessibility.
  - Actions: Add tests, check a11y.

- `src/components/ThemeProvider.tsx`
  - Role: Provides theme context.
  - Tests: no
  - Notes: Check theme switching.
  - Actions: Add tests.

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

### Editor Panels
- `src/components/Editor/panels/EffectsPanel/`
  - Role: Panel for effects configuration.
  - Tests: no
  - Notes: Check for heavy computations.
  - Actions: Add tests, optimize.

- `src/components/Editor/panels/FeaturesPanel/`
  - Role: Features panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/FooterPanel/`
  - Role: Footer configuration panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/GalleryPanel/`
  - Role: Gallery panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/HeaderPanel/`
  - Role: Header panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/HeroPanel/`
  - Role: Hero panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/LocationPanel/`
  - Role: Location panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/MediaPanel/`
  - Role: Media panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/SectionsPanel/`
  - Role: Sections panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/ThemePanel/`
  - Role: Theme panel.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/HeroMediaGallery.tsx`
  - Role: Hero media gallery component.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/LogoSelector.tsx`
  - Role: Logo selector.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Editor/panels/MediaSelector.tsx`
  - Role: Media selector.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

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

- `src/components/Landing/FeaturesSection.tsx`
  - Role: Features section.
  - Tests: no
  - Notes: 
  - Actions: Add tests, check a11y.

- `src/components/Landing/FooterSection.tsx`
  - Role: Footer section.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Landing/HeaderSection.tsx`
  - Role: Header section.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Landing/LocationSection.tsx`
  - Role: Location section.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/Landing/BackgroundEffects.tsx`
  - Role: Background effects.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add reduced motion check.

- `src/components/Landing/CursorEffects.tsx`
  - Role: Cursor effects.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add reduced motion check.

### ReactBits (visual helpers)
- `src/components/ReactBits/AnimatedGradient.tsx`
  - Role: Animated gradient effect.
  - Tests: no
  - Notes: Heavy animation, respect reduced motion.
  - Actions: Lazy load, add reduced motion check.

- `src/components/ReactBits/AnimatedGrid.tsx`
  - Role: Animated grid.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/AnimateOnScroll.tsx`
  - Role: Animate on scroll.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/AuroraBackground.tsx`
  - Role: Aurora background effect.
  - Tests: no
  - Notes: Heavy, respect reduced motion.
  - Actions: Lazy load.

- `src/components/ReactBits/ClickSpark.tsx`
  - Role: Click spark effect.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/ElectricBorder.tsx`
  - Role: Electric border.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/FadeIn.tsx`
  - Role: Fade in animation.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/FloatingParticles.tsx`
  - Role: Floating particles.
  - Tests: no
  - Notes: Heavy, respect reduced motion.
  - Actions: Lazy load.

- `src/components/ReactBits/GeometricBackground.tsx`
  - Role: Geometric background.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/GlassCard.tsx`
  - Role: Glass card effect.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/GlitterCursor.tsx`
  - Role: Glitter cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/GlowBorderCard.tsx`
  - Role: Glow border card.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/GradientBorderCard.tsx`
  - Role: Gradient border card.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/GradientOrbsBackground.tsx`
  - Role: Gradient orbs background.
  - Tests: no
  - Notes: Heavy.
  - Actions: Lazy load.

- `src/components/ReactBits/HeroMediaSlider.tsx`
  - Role: Hero media slider.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/HoverCard.tsx`
  - Role: Hover card.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/Magnet.tsx`
  - Role: Magnet effect.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/MeshGradient.tsx`
  - Role: Mesh gradient.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/NeonCursor.tsx`
  - Role: Neon cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/NoiseBackground.tsx`
  - Role: Noise background.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/ParallaxSection.tsx`
  - Role: Parallax section.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/PixelCard.tsx`
  - Role: Pixel card.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/RippleCursor.tsx`
  - Role: Ripple cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/SplashCursor.tsx`
  - Role: Splash cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/SpotlightCursor.tsx`
  - Role: Spotlight cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/StaggerContainer.tsx`
  - Role: Stagger container.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/StarBorder.tsx`
  - Role: Star border.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/StarfieldBackground.tsx`
  - Role: Starfield background.
  - Tests: no
  - Notes: Heavy.
  - Actions: Lazy load.

- `src/components/ReactBits/TiltCard.tsx`
  - Role: Tilt card.
  - Tests: no
  - Notes: 
  - Actions: Add tests.

- `src/components/ReactBits/TrailCursor.tsx`
  - Role: Trail cursor.
  - Tests: no
  - Notes: Respect reduced motion.
  - Actions: Add check.

- `src/components/ReactBits/WavesBackground.tsx`
  - Role: Waves background.
  - Tests: no
  - Notes: Heavy.
  - Actions: Lazy load.

### New ReactBits Components (2025-12-18)
- `src/components/ReactBits/TypewriterText.tsx`
  - Role: Animated typewriter effect with customizable speed, delay, loop, and cursor options.
  - Tests: yes (10 tests - comprehensive coverage of props, callbacks, loop behavior, accessibility)
  - Notes: Performance optimized, respects reduced motion, includes accessibility features.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/WaveSeparator.tsx`
  - Role: SVG wave separators between sections with multiple variants and animations.
  - Tests: yes (14 tests - rendering, variants, animations, accessibility, cleanup)
  - Notes: Lightweight SVG-based, multiple variants, smooth animations.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/Lightbox.tsx`
  - Role: Modal image/video viewer with keyboard navigation, zoom, and rotation controls.
  - Tests: yes (26 tests - modal functionality, navigation, zoom, keyboard controls, accessibility)
  - Notes: Full accessibility support, keyboard navigation, touch gestures.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/VideoHero.tsx`
  - Role: Video background hero component with overlay content and playback controls.
  - Tests: yes (23 tests - video background, controls, loading states, error handling)
  - Notes: Optimized video loading, fallback support, accessibility compliant.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/KenBurns.tsx`
  - Role: Ken Burns effect for smooth image zoom and pan animations.
  - Tests: yes (11 tests - rendering, props, styling, loading states, error handling)
  - Notes: Smooth animations, respects reduced motion, optimized performance.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/ParticleOverlay.tsx`
  - Role: Animated floating particles background effect with customizable density and colors.
  - Tests: yes (8 tests - canvas rendering, custom props, performance)
  - Notes: Canvas-based, respects reduced motion, performance optimized.
  - Actions: None - fully tested and production ready.

- `src/components/ReactBits/MasonryGallery.tsx`
  - Role: Responsive masonry layout gallery with lazy loading and hover effects.
  - Tests: yes (18 tests - responsive layout, image loading, click handling, lazy loading)
  - Notes: Responsive design, lazy loading, accessibility compliant.
  - Actions: None - fully tested and production ready.

---

## Next steps (in-progress)
1. Programmatically enumerate all components and produce a checklist (done for main groups; proceeding file-by-file). — COMPLETED
2. For each component: open file, look for missing types, missing tests, accessibility issues, heavy dependencies, and create focused task(s).
3. Prioritize fixes (low-risk fixes first: lint auto-fixes, tests) and then address chunking/performance and larger refactors.

---

I'll update this file as I audit each component and create per-component issues/PRs with small, focused changes.
