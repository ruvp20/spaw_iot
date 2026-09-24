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
  accentClay: string;          // Artisanal terracotta / cinnamon
  accentClayTint: string;
  accentOchre: string;         // Warm tonic amber / honey
  accentOchreTint: string;
  accentSage: string;          // Botanical bay leaf / eucalyptus
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
  background: '#0D0F0E',        // Deep obsidian stone
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
 * Light Theme: "Cream White & Brown Tonic"
 * Velvety clotted cream white canvas with deep roasted espresso tonic brown, warm cognac honey, and spiced clay.
 * Warm, artisanal, tactile, and deeply sophisticated.
 */
export const lightPalette: ThemePalette = {
  isDark: false,
  background: '#FBF9F5',        // Velvety warm cream white
  surface: '#FFFFFF',           // Pure ivory snow white cards
  surfaceLight: '#F3EDE3',      // Soft toasted oat / steamed crema for nested chips & steppers
  surfaceElevated: '#EBE3D5',   // Warm toasted almond for floating dialogs
  border: 'rgba(92, 58, 33, 0.10)', // Delicate roasted tonic brown hairline
  borderLight: 'rgba(92, 58, 33, 0.05)',

  primary: '#5C3A21',           // Roasted espresso tonic brown
  primaryInteractive: '#482B17',// Deep rich espresso for buttons & active highlights
  primaryTint: 'rgba(92, 58, 33, 0.09)', // Silky crema wash

  accentClay: '#B85835',        // Spiced cinnamon terracotta
  accentClayTint: 'rgba(184, 88, 53, 0.09)',
  accentOchre: '#BD7E32',       // Golden tonic amber honey
  accentOchreTint: 'rgba(189, 126, 50, 0.10)',
  accentSage: '#58735A',        // Dried botanical bay leaf / olive
  accentSageTint: 'rgba(88, 115, 90, 0.09)',

  danger: '#BD3737',
  dangerTint: 'rgba(189, 55, 55, 0.08)',
  success: '#2B7A45',
  successTint: 'rgba(43, 122, 69, 0.09)',

  textPrimary: '#231812',       // Deep roasted espresso bean (crisp, warm, high-contrast)
  textSecondary: '#5E4C41',     // Warm roasted mocha
  textMuted: '#8D7B6F',         // Soft toasted hazelnut taupe
  textDisabled: '#C2B5AA',

  cardShadow: 'rgba(46, 28, 16, 0.05)',
};

// Default export for backward compatibility
export const Colors = darkPalette;
