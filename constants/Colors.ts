const dark = {
  primary: '#003366',
  secondary: '#005580',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0C4D8',
  textMuted: 'rgba(255,255,255,0.5)',
  textLight: '#FFFFFF',
  background: '#002244',
  backgroundSecondary: '#003366',
  border: '#4F6D7A',
  error: '#FF6B6B',
  success: '#6699CC',
};

const light = {
  primary: '#003366',
  secondary: '#005580',
  textPrimary: '#002244',
  textSecondary: '#4F6D7A',
  textMuted: 'rgba(0,34,68,0.5)',
  textLight: '#FFFFFF',
  background: '#F0F4F8',
  backgroundSecondary: '#E8EEF5',
  border: '#B0C4D8',
  error: '#CC3333',
  success: '#339966',
};

const provinces = {
  DRENTHE: '#8E44AD',
  FLEVOLAND: '#2980B9',
  FRIESLAND: '#16A085',
  GRONINGEN: '#27AE60',
  GELDERLAND: '#F39C12',
  LIMBURG: '#C0392B',
  'NOORD-BRABANT': '#E74C3C',
  'NOORD-HOLLAND': '#8E44AD',
  OVERIJSSEL: '#D35400',
  UTRECHT: '#1ABC9C',
  'ZUID-HOLLAND': '#E67E22',
  ZEELAND: '#3498DB',
};

// Flat spread of dark for backward compat with existing components
export const Colors = {
  ...dark,
  light,
  dark,
  provinces,
};

export default Colors;
