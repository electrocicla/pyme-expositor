# Mobile-First Editor Overhaul Plan

## Phase 1: Analysis & Audit
- [ ] Audit `src/types/config.ts` to understand current configuration structure.
- [ ] Audit `src/contexts/EditorContext.tsx` to understand state management and device selection.
- [ ] Audit `src/components/Editor/` components (Layout, Sidebars, VisualEditor) to understand current rendering logic.
- [ ] Identify how "inheritance" (Desktop -> Tablet -> Mobile) can be implemented or if it already exists.

## Phase 2: Data Structure Updates
- [ ] Update `src/types/config.ts` to support distinct configurations for Desktop, Tablet, and Mobile.
    - [ ] Ensure backward compatibility or migration strategy.
    - [ ] Define `DeviceConfig` type or similar.
    - [ ] Add `mobileConfig` and `tabletConfig` to the main configuration or restructure to `config[deviceType]`.

## Phase 3: State Management Updates
- [ ] Update `EditorContext` to handle the currently selected device type.
- [ ] Implement logic to switch between configurations based on selected device.
- [ ] Implement the "inheritance" logic: `getEffectiveConfig(deviceType)` which falls back to Desktop if specific config is missing.

## Phase 4: Editor UI Updates
- [ ] Update `EditorLayout` to reflect the selected device mode.
- [ ] Update `VisualEditor` (Canvas) to resize/scale based on device type.
- [ ] Update `LeftSidebar` (Structure) to show/hide sections relevant to the device (if applicable).
- [ ] Update `RightSidebar` (Properties) to bind to the specific device configuration.

## Phase 5: Component Updates (The "Huge Work")
- [ ] Update all Landing components (`Header`, `Hero`, `Features`, `Gallery`, `Media`, `Location`, `Footer`) to respect the device-specific configuration.
- [ ] Implement specific properties for Mobile/Tablet for each section.
    - [ ] Header: Mobile menu styles, logo size, etc.
    - [ ] Hero: Stack order, font sizes, padding, image sizing.
    - [ ] Features: Grid columns (1 for mobile), spacing.
    - [ ] Gallery: Grid columns, image aspect ratios.
    - [ ] Media: Video/Image sizing, controls visibility.
    - [ ] Location: Map height, address layout.
    - [ ] Footer: Stack order, link spacing.

## Phase 6: Global Settings & Themes
- [ ] Update `Theme & Colors` to allow device-specific overrides (optional but good).
- [ ] Update `Global Effects` for mobile performance (disable heavy effects on mobile?).

## Phase 7: Verification & Polish
- [ ] Verify "Real-time" updates in Canvas.
- [ ] Verify Persistence (saving/loading).
- [ ] Verify Inheritance (changing Desktop updates Mobile if Mobile is "default").
