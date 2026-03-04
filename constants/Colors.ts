/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  // Primary colors
  primary: '#003366', // Donkerblauw - de hoofdkleur van de app
  secondary: '#005580', // Iets lichtere blauw - voor subtiele accenten
  
  // Text colors
  textPrimary: '#FFFFFF', // Witte tekst - goed leesbaar op de donkere achtergrond
  textSecondary: '#FFFFFF', // Lichtblauw-grijs voor minder prominente tekst
  textLight: '#FFFFFF', // Witte tekst voor knoppen en andere accentuele elementen
  
  // UI colors
  background: '#002244', // Donkerblauw - iets donkerder dan primary voor achtergrond
  backgroundSecondary: '#003366', // Hetzelfde als primary, maar kan gebruikt worden voor UI-elementen
  border: '#4F6D7A', // Blauwgrijs voor borders en scheidingen
  
  // Status colors (gebruik tinten van blauw voor consistentie)
  error: '#336699', // Middelblauw - valt nog steeds op, maar past binnen het schema
  success: '#6699CC', // Lichtblauw - geeft een positieve uitstraling zonder uit de toon te vallen

  // Province colors (monochromatisch schema behouden)
  provinces: {
    'DRENTHE': '#004080', // Donkerder blauw voor onderscheid
    'FLEVOLAND': '#336699', // Middelblauw, dezelfde als error voor consistentie
    'FRIESLAND': '#005580', // Iets lichtere tint van blauw
    'GRONINGEN': '#6699CC', // Lichtblauw, consistent met succes kleur
    'GELDERLAND': '#003366', // Hoofdkleur om het rustig te houden
    'LIMBURG': '#4F6D7A', // Blauwgrijs voor afwisseling
    'NOORD-BRABANT': '#002244', // Donkerder blauw voor contrast
    'NOORD-HOLLAND': '#336699', // Middelblauw consistent met de andere kleuren
    'OVERIJSSEL': '#6699CC', // Lichtblauw voor wat helderheid
    'UTRECHT': '#005580', // Iets lichtere tint
    'ZUID-HOLLAND': '#004080', // Donkerder voor contrast
    'ZEELAND': '#4F6D7A' // Blauwgrijs voor balans
  }
};

export default Colors;
