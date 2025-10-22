import React, { useState, type ReactNode } from 'react';
import { colorPalettes } from '../theme/colors';
import { ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'darknight' | 'light'>('darknight');
  
  const setTheme = (theme: 'darknight' | 'light') => {
    setCurrentTheme(theme);
  };

  const colors = colorPalettes[currentTheme];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
