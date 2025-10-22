import { createContext } from 'react';
import { colorPalettes } from '../theme/colors';

type Theme = 'darknight' | 'light';

export interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof colorPalettes.darknight;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
