import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
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
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

const SignUp: React.FC = () => {
  const { currentTheme, colors } = useTheme();
  const { language } = useLanguage();
  const { register } = useAuth();
  const t = getTranslations(language);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t.signup.validation.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.signup.validation.emailInvalid;
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = t.signup.validation.required;
    } else if (formData.username.length < 3) {
      newErrors.username = t.signup.validation.usernameMinLength;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t.signup.validation.required;
    } else if (formData.password.length < 6) {
      newErrors.password = t.signup.validation.passwordMinLength;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.signup.validation.required;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.signup.validation.passwordMismatch;
    }

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = t.signup.validation.required;
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = t.signup.validation.required;
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
      const success = await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (success) {
        setSnackbar({
          open: true,
          message: 'Registration successful! Redirecting to forum...',
          severity: 'success',
        });
        
        // Reset form
        setFormData({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
        });
        
        // Redirect to forum after a short delay
        setTimeout(() => {
          window.location.hash = '#/forum';
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: t.signup.error.serverError,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setSnackbar({
        open: true,
        message: t.signup.error.serverError,
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
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            sx={{
              backgroundColor: colors.background.light,
              border: `1px solid ${colors.light}`,
              boxShadow: currentTheme === 'darknight' 
                ? `0 8px 25px ${colors.accent}20`
                : `0 8px 25px ${colors.accent}10`,
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    color: currentTheme === 'darknight' 
                      ? colors.textColorLight 
                      : colors.textColorDark,
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                  }}
                >
                  {t.signup.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.secondary,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    opacity: 0.8,
                  }}
                >
                  {t.signup.subtitle}
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  {/* Name fields */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label={t.signup.form.firstName}
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.light,
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
                          color: currentTheme === 'darknight' 
                            ? colors.textColorLight 
                            : colors.textColorDark,
                        },
                      }}
                    />
                    <TextField
                      label={t.signup.form.lastName}
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent,
                          },
                          '& input': {
                            color: colors.textColorLight,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: currentTheme === 'darknight' 
                            ? colors.textColorLight 
                            : colors.textColorDark,
                        },
                      }}
                    />
                  </Box>

                  {/* Email */}
                  <TextField
                    label={t.signup.form.email}
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: colors.light,
                        },
                        '&:hover fieldset': {
                          borderColor: colors.accent,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: currentTheme === 'darknight' 
                          ? colors.textColorLight 
                          : colors.textColorDark,
                      },
                    }}
                  />

                  {/* Username */}
                  <TextField
                    label={t.signup.form.username}
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    error={!!errors.username}
                    helperText={errors.username}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: colors.light,
                        },
                        '&:hover fieldset': {
                          borderColor: colors.accent,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: currentTheme === 'darknight' 
                          ? colors.textColorLight 
                          : colors.textColorDark,
                      },
                    }}
                  />

                  {/* Password fields */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label={t.signup.form.password}
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={!!errors.password}
                      helperText={errors.password}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent,
                          },
                          '& input': {
                            color: colors.textColorLight,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: currentTheme === 'darknight' 
                            ? colors.textColorLight 
                            : colors.textColorDark,
                        },
                      }}
                    />
                    <TextField
                      label={t.signup.form.confirmPassword}
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.light,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent,
                          },
                          '& input': {
                            color: colors.textColorLight,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: currentTheme === 'darknight' 
                            ? colors.textColorLight 
                            : colors.textColorDark,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    mt: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${colors.light} 30%, ${colors.background.medium} 90%)`,
                    color: currentTheme === 'darknight' 
                      ? colors.textColorLight 
                      : colors.textColorDark,
                    border: `1px solid ${colors.accent}`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${colors.background.dark} 30%, ${colors.light} 90%)`,
                      color: colors.accent,
                      textShadow: currentTheme === 'darknight'
                        ? `0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}`
                        : 'none',
                      boxShadow: currentTheme === 'darknight'
                        ? `0 0 20px ${colors.accent}40`
                        : `0 4px 15px ${colors.accent}30`,
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isLoading ? 'Creating Account...' : t.signup.form.submit}
                </Button>
              </Box>

              {/* Login link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentTheme === 'darknight' 
                      ? colors.textColorLight 
                      : colors.textColorDark,
                    opacity: 0.7,
                  }}
                >
                  {t.signup.form.loginLink}{' '}
                  <Link
                    href="#login"
                    sx={{
                      color: colors.accent,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {t.signup.form.loginText}
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Snackbar for notifications */}
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
            backgroundColor: snackbar.severity === 'success' 
              ? colors.background.dark 
              : '#d32f2f',
            color: colors.textColorLight,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
