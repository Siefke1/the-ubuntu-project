import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { colorPalettes } from '../theme/colors';

interface ThemeSwitcherProps {
  currentTheme: 'darknight' | 'light';
  onThemeChange: (theme: 'darknight' | 'light') => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Try to get scroll from the main container instead of window
      const mainContainer = document.querySelector('[data-scroll-container]') || document.documentElement;
      const scrollPosition = mainContainer.scrollTop || window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.3;
      
      // Show when at the top (first 30% of viewport), hide when scrolled down
      const shouldShow = scrollPosition < threshold;
      
      setIsVisible(shouldShow);
    };

    // Initial check
    handleScroll();

    // Try multiple scroll listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also try on the main container if it exists
    const mainContainer = document.querySelector('[data-scroll-container]');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isVisible]);

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
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
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
