export interface ThemePalette {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceLight: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;

  // Primary brand
  primary: string;
  primaryInteractive: string;
  primaryTint: string;

  // Classy Earthy accents
  accentClay: string;          // Artisanal terracotta
  accentClayTint: string;
  accentOchre: string;         // Warm cognac gold
  accentOchreTint: string;
  accentSage: string;          // Silvery eucalyptus / jade
  accentSageTint: string;

  // Functional status
  danger: string;
  dangerTint: string;
  success: string;
  successTint: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDisabled: string;

  // Shadows
  cardShadow: string;
}

/**
 * Dark Theme: "Obsidian & Jade"
 * Deep smoked obsidian titanium backdrop with luminous jade accents and warm cognac details.
 * Sleek, mature, and deeply luxurious.
 */
export const darkPalette: ThemePalette = {
  isDark: true,
  background: '#0D0F0E',        // Deep obsidian stone (not murky green!)
  surface: '#141715',           // Smoked graphite surface
  surfaceLight: '#1B201D',      // Subtle elevated surface
  surfaceElevated: '#232925',   // Floating dialogs & active highlights
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.04)',

  primary: '#387B57',           // Luminous jade emerald
  primaryInteractive: '#46966B',// Vibrant tactile green for buttons/active states
  primaryTint: 'rgba(70, 150, 107, 0.15)',

  accentClay: '#E07A5F',        // Warm artisan terracotta
  accentClayTint: 'rgba(224, 122, 95, 0.14)',
  accentOchre: '#E5A958',       // Warm cognac gold
  accentOchreTint: 'rgba(229, 169, 88, 0.14)',
  accentSage: '#7CB994',        // Silvery eucalyptus
  accentSageTint: 'rgba(124, 185, 148, 0.14)',

  danger: '#E06464',
  dangerTint: 'rgba(224, 100, 100, 0.15)',
  success: '#4BB87E',
  successTint: 'rgba(75, 184, 126, 0.15)',

  textPrimary: '#F5F7F5',       // Crisp porcelain white
  textSecondary: '#9CA7A0',     // Soft titanium mist
  textMuted: '#636F67',         // Subtle charcoal stone
  textDisabled: '#3D4640',

  cardShadow: '#000000',
};

/**
 * Light Theme: "Porcelain & Imperial Pine"
 * Gallery-grade alabaster porcelain canvas with deep imperial forest pine and warm cognac accents.
 * Crisp, airy, high-contrast, and timelessly classy.
 */
export const lightPalette: ThemePalette = {
  isDark: false,
  background: '#F8F9F8',        // Gallery alabaster porcelain (crisp, not yellow/beige!)
  surface: '#FFFFFF',           // Pure crisp white cards
  surfaceLight: '#F0F3F1',      // Glazed stone for inputs/nested pills
  surfaceElevated: '#E6EAE7',   // Elevated chips
  border: 'rgba(0, 0, 0, 0.07)', // Ultra-clean hairline
  borderLight: 'rgba(0, 0, 0, 0.035)',

  primary: '#1F4733',           // Imperial forest pine (deep & authoritative)
  primaryInteractive: '#183B29',// Deep command green
  primaryTint: 'rgba(31, 71, 51, 0.08)',

  accentClay: '#BA5336',        // Rich terracotta clay
  accentClayTint: 'rgba(186, 83, 54, 0.08)',
  accentOchre: '#A87428',       // Warm cognac gold
  accentOchreTint: 'rgba(168, 116, 40, 0.08)',
  accentSage: '#2B5E44',        // High-contrast botanical sage
  accentSageTint: 'rgba(43, 94, 68, 0.08)',

  danger: '#C0392B',
  dangerTint: 'rgba(192, 57, 43, 0.08)',
  success: '#278252',
  successTint: 'rgba(39, 130, 82, 0.09)',

  textPrimary: '#0E1410',       // Deepest charcoal pine (razor-sharp legibility)
  textSecondary: '#47534C',     // Sophisticated botanical slate
  textMuted: '#7A8880',         // Calm stone grey
  textDisabled: '#B0BCB4',

  cardShadow: 'rgba(14, 20, 16, 0.04)',
};

// Default export for backward compatibility
export const Colors = darkPalette;
