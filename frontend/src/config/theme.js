// Theme configuration constants
export const THEME_CONFIG = {
  // Default colors
  DEFAULT_BACKGROUND: '#f9fafb',
  DEFAULT_CHAT_BACKGROUND: '#ffffff',
  
  // Color wheel colors with tints
  COLOR_WHEEL: [
    { name: 'black', base: '#000000', tints: ['#000002', '#1a1a1a', '#333333', '#4d4d4d', '#000000'] },
    { name: 'gray', base: '#808080', tints: ['#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6'] },
    { name: 'red', base: '#FF0000', tints: ['#FF0000', '#F44336', '#E57373', '#EF9A9A', '#FFCDD2'] },
    { name: 'red-orange', base: '#FF4500', tints: ['#FF4500', '#FF5722', '#FF8A65', '#FFAB91', '#FFCCBC'] },
    { name: 'orange', base: '#FFA500', tints: ['#FFA500', '#FF9800', '#FFB74D', '#FFCC80', '#FFE0B2'] },
    { name: 'yellow-orange', base: '#FF8C00', tints: ['#FF8C00', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2'] },
    { name: 'yellow', base: '#FFD700', tints: ['#FFD700', '#FFE135', '#FFEB3B', '#FFF176', '#FFF9C4'] },
    { name: 'yellow-green', base: '#9ACD32', tints: ['#9ACD32', '#ADFF2F', '#B8E994', '#C8E6C9', '#E8F5E8'] },
    { name: 'green', base: '#00FF00', tints: ['#00FF00', '#32CD32', '#66BB6A', '#81C784', '#A5D6A7'] },
    { name: 'blue-green', base: '#20B2AA', tints: ['#20B2AA', '#48C9B0', '#76D7C4', '#A3E4D7', '#D1F2EB'] },
    { name: 'blue', base: '#0000FF', tints: ['#0000FF', '#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB'] },
    { name: 'blue-violet', base: '#8A2BE2', tints: ['#8A2BE2', '#9C27B0', '#BA68C8', '#CE93D8', '#E1BEE7'] },
    { name: 'violet', base: '#800080', tints: ['#800080', '#9C27B0', '#BA68C8', '#CE93D8', '#E1BEE7'] },
    { name: 'red-violet', base: '#C71585', tints: ['#C71585', '#E91E63', '#F06292', '#F8BBD9', '#FCE4EC'] },
  ],
  
  // Preset background colors for main app
  PRESET_BACKGROUNDS: [
    { name: 'Default', value: '#f9fafb' },
    { name: 'Light Blue', value: '#eff6ff' },
    { name: 'Light Green', value: '#f0fdf4' },
    { name: 'Light Purple', value: '#faf5ff' },
    { name: 'Light Pink', value: '#fdf2f8' },
    { name: 'Light Yellow', value: '#fefce8' },
    { name: 'Dark Blue', value: '#1e3a8a' },
    { name: 'Dark Green', value: '#14532d' },
    { name: 'Dark Purple', value: '#581c87' },
    { name: 'Dark Gray', value: '#374151' },
  ],
  
  // Preset chat background colors
  PRESET_CHAT_BACKGROUNDS: [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f9fafb' },
    { name: 'Light Blue', value: '#eff6ff' },
    { name: 'Light Green', value: '#f0fdf4' },
    { name: 'Light Purple', value: '#faf5ff' },
    { name: 'Light Pink', value: '#fdf2f8' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Dark Blue', value: '#1e3a8a' },
    { name: 'Dark Green', value: '#14532d' },
    { name: 'Dark Purple', value: '#581c87' },
  ],
  
  // Local storage keys
  STORAGE_KEYS: {
    DARK_MODE: 'isDarkMode',
    BACKGROUND_COLOR: 'backgroundColor',
    CHAT_BACKGROUND_COLOR: 'chatBackgroundColor',
  },
  
  // Animation durations
  TRANSITIONS: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  // Breakpoints for responsive design
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
};

// Helper functions
export const getColorFromWheel = (colorName, tintIndex = 0) => {
  const colorGroup = THEME_CONFIG.COLOR_WHEEL.find(c => c.name === colorName);
  return colorGroup ? colorGroup.tints[tintIndex] : null;
};

export const getAllColorsFromWheel = () => {
  return THEME_CONFIG.COLOR_WHEEL.flatMap(colorGroup => colorGroup.tints);
};

export const isLightColor = (hexColor) => {
  // Convert hex to RGB and calculate brightness
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export const getContrastColor = (hexColor) => {
  return isLightColor(hexColor) ? '#000000' : '#ffffff';
};

export const validateHexColor = (color) => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
};

export const normalizeHexColor = (color) => {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color;
  return `#${color}`;
};