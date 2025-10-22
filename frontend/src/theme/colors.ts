// Color palette configuration
export const colorPalettes = {
  // Original earthy palette
  // Dark nighty theme with glowing accents
  darknight: {
    primary: '#e8e8e8',       // Light grey text
    secondary: '#a0a0a0',     // Medium grey text
    accent: '#4a9eff',        // Bright blue for glows
    highlight: '#66b3ff',     // Lighter blue glow
    light: '#2a2a2a',         // Dark grey
    textColorLight: '#e8e8e8', // Light text for dark backgrounds
    textColorDark: '#1a1a1a',  // Dark text for light backgrounds
    background: {
      light: '#1a1a1a',      // Very dark grey
      medium: '#0f0f0f',      // Almost black
      dark: '#000000'         // Pure black
    }
  },
  
  // Light theme - Clean and bright
  light: {
    primary: '#2c3e50',       // Dark blue-grey text
    secondary: '#5d6d7e',     // Medium grey text
    accent: '#3498db',        // Blue accent
    highlight: '#85c1e9',     // Light blue
    light: '#ecf0f1',         // Very light grey
    textColorLight: '#ffffff', // Light text for dark backgrounds
    textColorDark: '#2c3e50',  // Dark text for light backgrounds
    background: {
      light: '#ffffff',      // Pure white
      medium: '#f8f9fa',     // Off-white
      dark: '#2c3e50'        // Dark blue-grey
    }
  }
}

// Current active palette - change this to switch themes
// Try: colorPalettes.darknight, colorPalettes.light
export const currentPalette = colorPalettes.darknight

// Helper function to get colors with fallbacks
export const getColor = (colorKey: keyof typeof currentPalette) => {
  return currentPalette[colorKey]
}

// Export the current palette for easy access
export const colors = currentPalette
