import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack,
  AccountCircle,
  Settings,
  Logout,
  Save,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface PostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isDraft: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
}

const CreatePost: React.FC = () => {
  const { colors, currentTheme } = useTheme();
  const { user, logout } = useAuth();

  const [postData, setPostData] = useState<PostData>({
    title: '',
    content: '',
    category: '',
    tags: [],
    isPinned: false,
    isDraft: false,
  });

  const [newTag, setNewTag] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const open = Boolean(anchorEl);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3001/api/categories/public/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          setCategories(data.categories || []);
          // Set the first category as default if none is selected
          if (data.categories && data.categories.length > 0) {
            setPostData(prev => ({ ...prev, category: data.categories[0].name }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    window.location.hash = '#/';
  };

  const handleInputChange = (field: keyof PostData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPostData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleContentChange = (value?: string) => {
    setPostData(prev => ({
      ...prev,
      content: value || '',
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleSaveDraft = () => {
    setPostData(prev => ({ ...prev, isDraft: true }));
    setSnackbar({
      open: true,
      message: 'Draft saved successfully!',
      severity: 'success',
    });
  };

  const handlePublish = async () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in both title and content.',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          category: postData.category,
          tags: postData.tags,
          isDraft: postData.isDraft,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbar({
          open: true,
          message: 'Post published successfully!',
          severity: 'success',
        });
        
        // Reset form
        setPostData({
          title: '',
          content: '',
          category: categories.length > 0 ? categories[0].name : '',
          tags: [],
          isPinned: false,
          isDraft: false,
        });

        // Redirect to forum after a short delay
        setTimeout(() => {
          window.location.hash = '#/forum';
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to publish post. Please try again.',
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
        color: colors.textColorLight,
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: colors.background.light,
          borderBottom: `1px solid ${colors.accent}20`,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Back Button & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                color: colors.accent,
                '&:hover': {
                  backgroundColor: colors.accent + '10',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: colors.textColorLight,
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.highlight})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create New Post
            </Typography>
          </Box>

          {/* User Profile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: colors.secondary, display: { xs: 'none', sm: 'block' } }}
            >
              {user?.firstName || user?.username || 'User'}
            </Typography>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: colors.accent,
                '&:hover': {
                  backgroundColor: colors.accent + '10',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: colors.accent,
                  color: colors.textColorLight,
                  width: 32,
                  height: 32,
                }}
              >
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.background.light,
            border: `1px solid ${colors.accent}20`,
            mt: 1,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: colors.textColorLight,
            '&:hover': { backgroundColor: colors.accent + '10' },
          }}
        >
          <AccountCircle sx={{ mr: 2, color: colors.accent }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: colors.textColorLight,
            '&:hover': { backgroundColor: colors.accent + '10' },
          }}
        >
          <Settings sx={{ mr: 2, color: colors.accent }} />
          Settings
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.secondary + '20' }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: colors.textColorLight,
            '&:hover': { backgroundColor: '#f44336' + '10' },
          }}
        >
          <Logout sx={{ mr: 2, color: '#f44336' }} />
          Logout
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              backgroundColor: colors.background.light,
              borderRadius: 3,
              border: `1px solid ${colors.accent}20`,
              overflow: 'hidden',
            }}
          >
            {/* Post Form */}
            <Box sx={{ p: 4 }}>
              {/* Title Field */}
              <TextField
                fullWidth
                label="Post Title"
                placeholder="What's your question or topic?"
                value={postData.title}
                onChange={handleInputChange('title')}
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
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
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

              {/* Category and Tags Row */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                  select
                  label="Category"
                  value={postData.category}
                  onChange={handleInputChange('category')}
                  disabled={categoriesLoading}
                  sx={{
                    minWidth: 200,
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
                      color: currentTheme === 'darknight' 
                        ? colors.textColorLight 
                        : colors.textColorDark,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.accent,
                    },
                    '& .MuiSelect-select': {
                      color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                    },
                  }}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <Typography sx={{ color: colors.secondary }}>
                        Loading categories...
                      </Typography>
                    </MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: category.color,
                            }}
                          />
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </TextField>

                <TextField
                  label="Add Tags"
                  placeholder="Type tag and press Enter"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    flex: 1,
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
              </Stack>

              {/* Tags Display */}
              {postData.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.secondary, mb: 1 }}>
                    Tags:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {postData.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{
                          backgroundColor: colors.accent + '20',
                          color: colors.accent,
                          '& .MuiChip-deleteIcon': {
                            color: colors.accent,
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Content Editor */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: colors.textColorLight, mb: 2 }}>
                  Post Content
                </Typography>
                <Box
                  data-color-mode={currentTheme === 'darknight' ? 'dark' : 'light'}
                  sx={{
                    '& .w-md-editor': {
                      backgroundColor: colors.background.medium,
                      border: `1px solid ${colors.secondary}`,
                      borderRadius: 2,
                    },
                    '& .w-md-editor-text-container': {
                      backgroundColor: colors.background.medium,
                    },
                    '& .w-md-editor-text': {
                      color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                    },
                    '& .w-md-editor-preview': {
                      backgroundColor: colors.background.medium,
                      color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                    },
                    '& .wmde-markdown': {
                      color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                    },
                    // Custom toolbar styling for larger, more modern buttons
                    '& .w-md-editor-toolbar': {
                      padding: '12px 16px',
                      backgroundColor: colors.background.light,
                      borderBottom: `1px solid ${colors.secondary}20`,
                    },
                    '& .w-md-editor-toolbar button': {
                      width: '40px',
                      height: '40px',
                      margin: '0 4px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: colors.accent + '20',
                        transform: 'scale(1.05)',
                      },
                      '&.active': {
                        backgroundColor: colors.accent,
                        color: colors.textColorLight,
                      },
                    },
                    '& .w-md-editor-toolbar svg': {
                      width: '18px',
                      height: '18px',
                    },
                  }}
                >
                  <MDEditor
                    value={postData.content}
                    onChange={handleContentChange}
                    height={500}
                    preview="edit"
                    data-color-mode={currentTheme === 'darknight' ? 'dark' : 'light'}
                    toolbarHeight={60}
                    visibleDragbar={false}
                    textareaProps={{
                      placeholder: 'Start writing your post... Use markdown for formatting!',
                      style: {
                        fontSize: '16px',
                        lineHeight: '1.6',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={handleSaveDraft}
                  sx={{
                    borderColor: colors.accent,
                    color: colors.accent,
                    '&:hover': {
                      borderColor: colors.highlight,
                      color: colors.highlight,
                      backgroundColor: colors.accent + '10',
                    },
                  }}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handlePublish}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: colors.accent,
                    color: colors.textColorLight,
                    '&:hover': {
                      backgroundColor: colors.highlight,
                    },
                    '&:disabled': {
                      backgroundColor: colors.secondary,
                    },
                  }}
                >
                  {isLoading ? 'Publishing...' : 'Publish Post'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar */}
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
            backgroundColor: snackbar.severity === 'success' ? colors.accent : 
                            snackbar.severity === 'error' ? '#f44336' : colors.secondary,
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

export default CreatePost;
