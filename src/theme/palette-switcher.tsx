import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { colorPalettes, currentPalette } from './colors';

// This component demonstrates how to switch between color palettes
// You can use this in your app to test different themes
export const PaletteSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = React.useState('earthy');

  const switchPalette = (paletteName: keyof typeof colorPalettes) => {
    // In a real app, you would update the currentPalette here
    // For now, this is just a demo of how the switching would work
    setCurrentTheme(paletteName);
    console.log(`Switched to ${paletteName} palette`);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: currentPalette.background.light }}>
      <Typography variant="h6" sx={{ color: currentPalette.primary, mb: 2 }}>
        Color Palette Switcher
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {Object.keys(colorPalettes).map((paletteName) => (
          <Button
            key={paletteName}
            variant={currentTheme === paletteName ? 'contained' : 'outlined'}
            onClick={() => switchPalette(paletteName as keyof typeof colorPalettes)}
            sx={{
              backgroundColor: currentTheme === paletteName ? currentPalette.accent : 'transparent',
              color: currentPalette.primary,
              borderColor: currentPalette.accent,
              '&:hover': {
                backgroundColor: currentPalette.light,
              },
            }}
          >
            {paletteName.charAt(0).toUpperCase() + paletteName.slice(1)}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default PaletteSwitcher;
