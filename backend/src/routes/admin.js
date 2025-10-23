const express = require('express');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin, canManageUsers, UserRole } = require('../middleware/authorization');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/users', passport.authenticate('jwt', { session: false }), canManageUsers, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (role && Object.values(UserRole).includes(role)) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              posts: true,
              replies: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', passport.authenticate('jwt', { session: false }), canManageUsers, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        posts: {
          select: {
            id: true,
            title: true,
            category: true,
            createdAt: true,
            _count: {
              select: {
                likes: true,
                replies: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            posts: true,
            replies: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', passport.authenticate('jwt', { session: false }), canManageUsers, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    // Prevent demoting the last admin
    if (role !== UserRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN },
      });
      
      const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (currentUser?.role === UserRole.ADMIN && adminCount <= 1) {
        return res.status(400).json({ 
          success: false, 
          error: 'Cannot demote the last admin' 
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    res.status(200).json({ 
      success: true, 
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, error: 'Failed to update user role' });
  }
});

// Toggle user active status (admin only)
router.put('/users/:id/status', passport.authenticate('jwt', { session: false }), canManageUsers, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent deactivating the last admin
    if (!isActive) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (user?.role === UserRole.ADMIN) {
        const adminCount = await prisma.user.count({
          where: { 
            role: UserRole.ADMIN,
            isActive: true,
          },
        });

        if (adminCount <= 1) {
          return res.status(400).json({ 
            success: false, 
            error: 'Cannot deactivate the last active admin' 
          });
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        username: true,
        isActive: true,
      },
    });

    res.status(200).json({ 
      success: true, 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle user status' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), canManageUsers, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (user?.role === UserRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false, 
          error: 'Cannot delete the last admin' 
        });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

// Get forum statistics (admin only)
router.get('/stats', passport.authenticate('jwt', { session: false }), requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalPosts,
      totalReplies,
      totalLikes,
      usersByRole,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.post.count(),
      prisma.reply.count(),
      prisma.like.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item.role] = item._count.role;
            return acc;
          }, {}),
        },
        content: {
          posts: totalPosts,
          replies: totalReplies,
          likes: totalLikes,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
