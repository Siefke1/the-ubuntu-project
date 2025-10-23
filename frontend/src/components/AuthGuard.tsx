import React from 'react';
import { Box, CircularProgress, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslations } from '../texts/translations';
import { Link } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const { language } = useLanguage();
  const t = getTranslations(language);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: colors.accent,
            mb: 2 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.textColorLight,
            textAlign: 'center'
          }}
        >
          {t.auth?.loading || 'Loading...'}
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: colors.background.light,
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              border: `1px solid ${colors.accent}20`,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: colors.textColorLight,
                fontWeight: 'bold',
                mb: 2,
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.highlight})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.auth?.loginRequired?.title || 'Login Required'}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: colors.secondary,
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {t.auth?.loginRequired?.message || 'You need to be logged in to access this page.'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.accent,
                  color: colors.textColorLight,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: colors.highlight,
                  },
                }}
              >
                {t.auth?.loginRequired?.signup || 'Sign Up'}
              </Button>
              
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.accent,
                  color: colors.accent,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: colors.accent + '10',
                    borderColor: colors.highlight,
                    color: colors.highlight,
                  },
                }}
              >
                {t.auth?.loginRequired?.home || 'Login'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
