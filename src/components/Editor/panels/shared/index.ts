/**
 * Shared UI Components - Central export
 * All reusable form components for panel editors
 * Following DRY principle - import from single location
 */

// Core form inputs
export { Input, default as InputComponent } from './Input';
export { Textarea, default as TextareaComponent } from './Textarea';
export { Select, default as SelectComponent } from './Select';
export { Toggle, default as ToggleComponent } from './Toggle';
export { Slider, default as SliderComponent } from './Slider';
export { ColorPicker, default as ColorPickerComponent } from './ColorPicker';
export { NumberInput, default as NumberInputComponent } from './NumberInput';

// Layout components
export { ButtonGroup, default as ButtonGroupComponent } from './ButtonGroup';
export { TabNavigation, default as TabNavigationComponent } from './TabNavigation';
export { Section, default as SectionComponent } from './Section';
export { SectionHeader, default as SectionHeaderComponent } from './SectionHeader';
export { PanelHeader, default as PanelHeaderComponent } from './PanelHeader';
export { InfoBox, default as InfoBoxComponent } from './InfoBox';
export { PresetButton, default as PresetButtonComponent } from './PresetButton';

// Types
export type { 
  SelectOption, 
  TabConfig, 
  SizeVariant, 
  BaseInputProps, 
  ColorPreset, 
  EffectPreset,
  GridConfig,
} from './types';

// Constants
export {
  inputBaseClasses,
  selectBaseClasses,
  selectArrowSvg,
  toggleActiveClasses,
  toggleInactiveClasses,
  buttonGroupActiveClasses,
  buttonGroupInactiveClasses,
  tabActiveClasses,
  tabInactiveClasses,
  sectionContainerClasses,
  highlightContainerClasses,
  warningContainerClasses,
  infoContainerClasses,
  fadeInClasses,
  quickColorPresets,
  gridColsClasses,
  gapClasses,
} from './constants';
