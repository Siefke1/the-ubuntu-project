import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Category,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface CategoryData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  allowedRoles: string[];
  isPublic: boolean;
  requiresApproval: boolean;
}

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ open, onClose }) => {
  const { colors, currentTheme } = useTheme();
  
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState<CategoryData>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: colors.accent,
    isActive: true,
    sortOrder: 0,
    allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
    isPublic: true,
    requiresApproval: false,
  });

  // Fetch categories
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: colors.accent,
      isActive: true,
      sortOrder: categories.length,
      allowedRoles: ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
      isPublic: true,
      requiresApproval: false,
    });
    setEditingCategory(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryData) => {
    setFormData(category);
    setEditingCategory(category);
    setIsCreateDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory 
        ? `http://localhost:3001/api/admin/categories/${editingCategory.id}`
        : 'http://localhost:3001/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        setIsCreateDialogOpen(false);
        setEditingCategory(null);
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          await fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleInputChange = (field: keyof CategoryData, value: string | string[] | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const roleOptions = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'CONTRIBUTOR', label: 'Contributor' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  const colorOptions = [
    { value: colors.accent, label: 'Accent' },
    { value: colors.highlight, label: 'Highlight' },
    { value: colors.primary, label: 'Primary' },
    { value: colors.secondary, label: 'Secondary' },
    { value: '#ff6b35', label: 'Orange' },
    { value: '#4caf50', label: 'Green' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#9c27b0', label: 'Purple' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.light,
          color: colors.textColorLight,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ 
        color: colors.textColorLight,
        borderBottom: `1px solid ${colors.secondary}20`,
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Category sx={{ color: colors.accent }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Category Management
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pb: 2 }}>
        {isLoading ? (
          <Typography sx={{ color: colors.secondary, textAlign: 'center', py: 4 }}>
            Loading categories...
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, mt: 2 }}>
            {categories.map((category) => (
              <Box key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      backgroundColor: colors.background.medium,
                      border: `1px solid ${colors.secondary}20`,
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: category.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textColorLight,
                            fontWeight: 'bold',
                          }}
                        >
                          {category.icon || category.name.charAt(0)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: colors.textColorLight, fontWeight: 'bold' }}>
                            {category.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.secondary }}>
                            {category.slug}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: colors.textColorLight, mb: 2 }}>
                        {category.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: colors.secondary, display: 'block', mb: 1 }}>
                          Allowed Roles:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {category.allowedRoles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              size="small"
                              sx={{
                                backgroundColor: colors.accent + '20',
                                color: colors.accent,
                                fontSize: '0.7rem',
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {category.isPublic ? (
                          <Chip icon={<Visibility />} label="Public" size="small" color="success" />
                        ) : (
                          <Chip icon={<VisibilityOff />} label="Private" size="small" color="warning" />
                        )}
                        {category.requiresApproval && (
                          <Chip label="Moderated" size="small" color="info" />
                        )}
                        {!category.isActive && (
                          <Chip label="Inactive" size="small" color="error" />
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditCategory(category)}
                        sx={{ color: colors.accent }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteCategory(category.id!)}
                        sx={{ color: '#f44336' }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Box>
            ))}
            
            {/* Add Category Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    backgroundColor: colors.background.medium,
                    border: `2px dashed ${colors.accent}40`,
                    borderRadius: 2,
                    height: '100%',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: colors.accent,
                      backgroundColor: colors.accent + '10',
                    },
                  }}
                  onClick={handleCreateCategory}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Add
                      sx={{
                        fontSize: 48,
                        color: colors.accent,
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: 'bold',
                        mb: 1,
                      }}
                    >
                      Add New Category
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                      }}
                    >
                      Click to create a new category
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: colors.secondary }}>
          Close
        </Button>
      </DialogActions>

      {/* Create/Edit Category Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.background.light,
            color: colors.textColorLight,
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.textColorLight }}>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>

        <DialogContent sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
                  '& textarea': {
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

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Icon"
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                placeholder="e.g., Forum, Code, Settings"
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

              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: currentTheme === 'darknight' 
                    ? colors.textColorLight 
                    : colors.textColorDark,
                }}>
                  Color
                </InputLabel>
                <Select
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  variant="outlined"
                  sx={{
                    color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.light,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.accent,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.accent,
                    },
                  }}
                >
                  {colorOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: 1,
                            backgroundColor: option.value,
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel sx={{ 
                color: currentTheme === 'darknight' 
                  ? colors.textColorLight 
                  : colors.textColorDark,
              }}>
                Allowed Roles
              </InputLabel>
              <Select
                multiple
                value={formData.allowedRoles}
                onChange={(e) => handleInputChange('allowedRoles', e.target.value)}
                variant="outlined"
                sx={{
                  color: currentTheme === 'darknight' ? colors.textColorLight : colors.textColorDark,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.light,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.accent,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.accent,
                  },
                }}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: colors.accent,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: colors.accent,
                        },
                      }}
                    />
                  }
                  label="Public Category (visible to everyone)"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requiresApproval}
                      onChange={(e) => handleInputChange('requiresApproval', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: colors.accent,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: colors.accent,
                        },
                      }}
                    />
                  }
                  label="Requires Approval (posts need admin approval)"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: colors.accent,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: colors.accent,
                        },
                      }}
                    />
                  }
                  label="Active Category"
                />
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setIsCreateDialogOpen(false)}
            sx={{ color: colors.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            sx={{
              backgroundColor: colors.accent,
              color: colors.textColorLight,
              '&:hover': {
                backgroundColor: colors.highlight,
              },
            }}
          >
            {editingCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CategoryManager;
