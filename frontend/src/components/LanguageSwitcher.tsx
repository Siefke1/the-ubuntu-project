import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { Translate } from '@mui/icons-material';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { colorPalettes } from '../theme/colors';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { currentTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const open = Boolean(anchorEl);

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

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  const currentColors = colorPalettes[currentTheme];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    handleClose();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20, // Position at top right corner
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Tooltip 
        title={`Switch Language (${currentLanguage.name})`}
        arrow
      >
        <IconButton
          onClick={handleClick}
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
              transform: 'scale(1.1)',
              boxShadow: `0 0 20px ${currentColors.accent}60`,
            },
            ...(isHovered && {
              textShadow: `0 0 10px ${currentColors.accent}`,
            }),
          }}
        >
          <Translate sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            mt: 1,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={language === lang.code}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>
                {lang.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText 
              primary={lang.name}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.9rem',
                  fontWeight: language === lang.code ? 600 : 400,
                }
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
