/**
 * Panel Hooks - Central export for all panel-related hooks
 * DRY principle - Import hooks from single location
 */

export { useConfigSection, default as useConfigSectionHook } from './useConfigSection';
export { useTabNavigation, default as useTabNavigationHook } from './useTabNavigation';
export { useNestedConfig, default as useNestedConfigHook } from './useNestedConfig';
