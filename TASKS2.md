# Mobile-First Editor Overhaul Plan

## Phase 1: Analysis & Audit
- [x] Audit `src/types/config.ts` to understand current configuration structure.
- [x] Audit `src/contexts/EditorContext.tsx` to understand state management and device selection.
- [x] Audit `src/components/Editor/` components (Layout, Sidebars, VisualEditor) to understand current rendering logic.
- [x] Identify how "inheritance" (Desktop -> Tablet -> Mobile) can be implemented or if it already exists.

## Phase 2: Data Structure Updates
- [x] Update `src/types/config.ts` to support distinct configurations for Desktop, Tablet, and Mobile.
    - [x] Ensure backward compatibility or migration strategy.
    - [x] Define `DeviceConfig` type or similar.
    - [x] Add `mobileConfig` and `tabletConfig` to the main configuration or restructure to `config[deviceType]`.

## Phase 3: State Management Updates
- [x] Update `EditorContext` to handle the currently selected device type.
- [x] Implement logic to switch between configurations based on selected device.
- [x] Implement the "inheritance" logic: `getEffectiveConfig(deviceType)` which falls back to Desktop if specific config is missing.

## Phase 4: Editor UI Updates
- [x] Update `EditorLayout` to reflect the selected device mode.
- [x] Update `VisualEditor` (Canvas) to resize/scale based on device type.
- [x] Update `LeftSidebar` (Structure) to show/hide sections relevant to the device (if applicable).
- [x] Update `RightSidebar` (Properties) to bind to the specific device configuration.

## Phase 5: Component Updates (The "Huge Work")
- [x] Update all Landing components (`Header`, `Hero`, `Features`, `Gallery`, `Media`, `Location`, `Footer`) to respect the device-specific configuration.
- [x] Implement specific properties for Mobile/Tablet for each section.
    - [x] Header: Mobile menu styles, logo size, etc.
    - [x] Hero: Stack order, font sizes, padding, image sizing.
    - [x] Features: Grid columns (1 for mobile), spacing.
    - [x] Gallery: Grid columns, image aspect ratios.
    - [x] Media: Video/Image sizing, controls visibility.
    - [x] Location: Map height, address layout.
    - [x] Footer: Stack order, link spacing.

## Phase 6: Global Settings & Themes
- [x] Update `Theme & Colors` to allow device-specific overrides (optional but good).
- [x] Update `Global Effects` for mobile performance (disable heavy effects on mobile?).

## Phase 7: Verification & Polish
- [x] Verify "Real-time" updates in Canvas.
- [x] Verify Persistence (saving/loading).
- [x] Verify Inheritance (changing Desktop updates Mobile if Mobile is "default").
