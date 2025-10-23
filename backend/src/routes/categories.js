const express = require('express');
const { PrismaClient, UserRole } = require('@prisma/client');
const passport = require('passport');
const { requireAdmin } = require('../middleware/authorization');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware for authentication (all routes below require auth)
router.use(passport.authenticate('jwt', { session: false }));

// Get categories for authenticated users (all roles)
router.get('/public/list', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        isPublic: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        color: true,
        postCount: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Middleware to ensure only ADMINs can access routes below
router.use(requireAdmin);

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    // Update postCount for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await prisma.post.count({
          where: { categoryId: category.id }
        });
        
        // Update the cached count if it's different
        if (category.postCount !== postCount) {
          await prisma.category.update({
            where: { id: category.id },
            data: { postCount }
          });
        }

        return {
          ...category,
          postCount
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get a single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      color,
      isActive,
      sortOrder,
      allowedRoles,
      isPublic,
      requiresApproval
    } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required'
      });
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name or slug already exists'
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        color: color || '#6366f1',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        allowedRoles: allowedRoles || ['BEGINNER', 'CONTRIBUTOR', 'ADMIN'],
        isPublic: isPublic !== undefined ? isPublic : true,
        requiresApproval: requiresApproval || false
      }
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      icon,
      color,
      isActive,
      sortOrder,
      allowedRoles,
      isPublic,
      requiresApproval
    } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if another category with same name or slug exists
    if (name || slug) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(name ? [{ name }] : []),
                ...(slug ? [{ slug }] : [])
              ]
            }
          ]
        }
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          error: 'Another category with this name or slug already exists'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (allowedRoles !== undefined) updateData.allowedRoles = allowedRoles;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (requiresApproval !== undefined) updateData.requiresApproval = requiresApproval;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with existing posts. Please move or delete the posts first.'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});


module.exports = router;
