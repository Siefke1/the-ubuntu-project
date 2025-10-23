import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Link,
} from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { getTranslations } from '../texts/translations';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const Login: React.FC = () => {
  const { colors, currentTheme } = useTheme();
  const { language } = useLanguage();
  const { login } = useAuth();
  const t = getTranslations(language);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t.signup.validation.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.signup.validation.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = t.signup.validation.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting to forum...',
          severity: 'success',
        });
        
        // Reset form
        setFormData({
          email: '',
          password: '',
        });
        
        // Redirect to forum after a short delay
        setTimeout(() => {
          window.location.hash = '#/forum';
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: 'Invalid email or password. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: colors.background.light,
            border: `1px solid ${colors.accent}20`,
            boxShadow: `0 20px 40px ${colors.background.dark}40`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.highlight})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.signup?.title || 'Welcome Back'}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: colors.secondary,
                mb: 1,
              }}
            >
              {t.signup?.subtitle || 'Sign in to your account'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label={t.signup.form.email}
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.background.medium,
                  '& fieldset': {
                    borderColor: colors.secondary,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.accent,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                  },
                  '& input': {
                    color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.secondary,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.accent,
                },
              }}
            />

            <TextField
              fullWidth
              label={t.signup.form.password}
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.background.medium,
                  '& fieldset': {
                    borderColor: colors.secondary,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.accent,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                  },
                  '& input': {
                    color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: colors.secondary,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: colors.accent,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                backgroundColor: colors.accent,
                color: colors.textColorLight,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: colors.highlight,
                },
                '&:disabled': {
                  backgroundColor: colors.secondary,
                  color: colors.textColorLight,
                },
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.secondary,
                mb: 2,
              }}
            >
              Don't have an account?{' '}
              <Link
                href="#/signup"
                sx={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: colors.highlight,
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            backgroundColor: snackbar.severity === 'success' ? colors.accent : '#f44336',
            color: colors.textColorLight,
            '& .MuiAlert-icon': {
              color: colors.textColorLight,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
