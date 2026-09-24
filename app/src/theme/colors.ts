export interface ThemePalette {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceLight: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;

  // Primary brand (Deep forest green)
  primary: string;
  primaryInteractive: string;
  primaryTint: string;

  // Earthy accents
  accentClay: string;          // Terracotta / warm clay
  accentClayTint: string;
  accentOchre: string;         // Warm sand / amber
  accentOchreTint: string;
  accentSage: string;          // Moss / eucalyptus
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

export const darkPalette: ThemePalette = {
  isDark: true,
  background: '#14281D',        // Earthy deep forest pine
  surface: '#1B3426',           // Elevated forest card
  surfaceLight: '#234432',      // Nested component background
  surfaceElevated: '#2A513D',   // Modals & elevated cards
  border: 'rgba(92, 150, 116, 0.22)',
  borderLight: 'rgba(92, 150, 116, 0.12)',

  primary: '#2E5B42',           // Signature forest green
  primaryInteractive: '#3C7555',// Lighter interactive green
  primaryTint: 'rgba(60, 117, 85, 0.24)',

  accentClay: '#D6825B',        // Warm terracotta clay
  accentClayTint: 'rgba(214, 130, 91, 0.16)',
  accentOchre: '#D9A75E',       // Warm golden wheat
  accentOchreTint: 'rgba(217, 167, 94, 0.16)',
  accentSage: '#8EBDA0',        // Delicate silvery sage
  accentSageTint: 'rgba(142, 189, 160, 0.16)',

  danger: '#E06464',
  dangerTint: 'rgba(224, 100, 100, 0.18)',
  success: '#52BF84',
  successTint: 'rgba(82, 191, 132, 0.18)',

  textPrimary: '#EDF5EF',
  textSecondary: '#A2B9A9',
  textMuted: '#6E8775',
  textDisabled: '#4A6051',

  cardShadow: '#0A150F',
};

export const lightPalette: ThemePalette = {
  isDark: false,
  background: '#F7F5F0',        // Organic warm linen / oat
  surface: '#FFFFFF',           // Crisp natural ivory card
  surfaceLight: '#EFECE3',      // Soft pebble surface
  surfaceElevated: '#E7E3D6',   // Soft stone
  border: 'rgba(46, 91, 66, 0.12)',
  borderLight: 'rgba(46, 91, 66, 0.06)',

  primary: '#2E5B42',           // Forest botanical green
  primaryInteractive: '#244B36',// Deep rich forest for buttons
  primaryTint: 'rgba(46, 91, 66, 0.09)',

  accentClay: '#B85E38',        // Earthy terracotta
  accentClayTint: 'rgba(184, 94, 56, 0.10)',
  accentOchre: '#A8762D',       // Natural amber wheat
  accentOchreTint: 'rgba(168, 118, 45, 0.10)',
  accentSage: '#3D6C51',        // Soft forest sage
  accentSageTint: 'rgba(61, 108, 81, 0.09)',

  danger: '#BA3B3B',
  dangerTint: 'rgba(186, 59, 59, 0.09)',
  success: '#2B7A4F',
  successTint: 'rgba(43, 122, 79, 0.10)',

  textPrimary: '#16231A',       // Dark cedar espresso
  textSecondary: '#4B5F52',     // Subdued moss slate
  textMuted: '#7D9183',
  textDisabled: '#A8BCAD',

  cardShadow: 'rgba(20, 40, 29, 0.06)',
};

// Default export for backward compatibility
export const Colors = darkPalette;
