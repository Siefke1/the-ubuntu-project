import React, { useState } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { colorPalettes } from '../theme/colors';

interface ThemeSwitcherProps {
  currentTheme: 'darknight' | 'light';
  onThemeChange: (theme: 'darknight' | 'light') => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'darknight' ? 'light' : 'darknight';
    onThemeChange(newTheme);
  };

  const currentColors = colorPalettes[currentTheme];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip 
        title={currentTheme === 'darknight' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        arrow
      >
        <IconButton
          onClick={toggleTheme}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            backgroundColor: currentColors.background.light,
            color: currentColors.primary,
            border: `2px solid ${currentColors.accent}`,
            width: 56,
            height: 56,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: currentColors.accent,
              color: currentColors.background.light,
              transform: 'scale(1.1) rotate(180deg)',
              boxShadow: `0 0 20px ${currentColors.accent}60`,
            },
            ...(isHovered && {
              textShadow: `0 0 10px ${currentColors.accent}`,
            }),
          }}
        >
          {currentTheme === 'darknight' ? (
            <LightMode sx={{ fontSize: 28 }} />
          ) : (
            <DarkMode sx={{ fontSize: 28 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeSwitcher;
