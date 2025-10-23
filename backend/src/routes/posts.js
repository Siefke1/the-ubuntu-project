const express = require('express');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const { hasRole, UserRole } = require('../middleware/authorization');
const router = express.Router();
const prisma = new PrismaClient();

// Create a new post
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { title, content, category, tags, isDraft } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    // Find the category by name
    let categoryRecord;
    if (category) {
      categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });
      
      if (!categoryRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category specified'
        });
      }
    } else {
      // Use default category if none specified
      categoryRecord = await prisma.category.findFirst({
        where: { name: 'General Discussion' }
      });
      
      if (!categoryRecord) {
        return res.status(400).json({
          success: false,
          error: 'No default category found. Please contact an administrator.'
        });
      }
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        categoryId: categoryRecord.id,
        tags: tags || [],
        authorId: userId,
        // Note: isDraft field doesn't exist in schema yet, we'll add it later if needed
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category.name,
        tags: post.tags,
        author: post.author,
        likes: post._count.likes,
        replies: post._count.replies,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort || 'recent'; // 'recent' or 'hot'
    const pinned = req.query.pinned; // 'true' to get only pinned posts
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (category && category !== 'all') {
      const decodedCategory = decodeURIComponent(category);
      where.category = {
        name: decodedCategory
      };
    }
    
    // Pinned filtering
    if (pinned === 'true') {
      where.isPinned = true;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
        { author: { username: { contains: search, mode: 'insensitive' } } },
        { author: { firstName: { contains: search, mode: 'insensitive' } } },
        { author: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Determine ordering based on sort parameter
    let orderBy;
    if (sort === 'hot') {
      // For hot posts, we need to order by likes count
      // We'll use a raw query or order by likes relation count
      orderBy = [
        { likes: { _count: 'desc' } },
        { createdAt: 'desc' }
      ];
    } else {
      // Default to recent (chronological)
      orderBy = { createdAt: 'desc' };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          _count: {
            select: {
              likes: true,
              replies: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      success: true,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category.name,
        tags: post.tags,
        author: post.author,
        likes: post._count.likes,
        replies: post._count.replies,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category.name,
        tags: post.tags,
        author: post.author,
        replies: post.replies,
        likes: post._count.likes,
        repliesCount: post._count.replies,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post'
    });
  }
});

// Create a reply to a post
router.post('/:id/reply', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Reply content is required'
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if post is closed/locked
    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        error: 'This post is closed. No new replies are allowed.'
      });
    }

    // Create the reply
    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId: id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reply created successfully',
      reply: {
        id: reply.id,
        content: reply.content,
        author: reply.author,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt
      }
    });

  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reply'
    });
  }
});

// Like/Unlike a post
router.post('/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: id
          }
        }
      });

      res.json({
        success: true,
        message: 'Post unliked',
        liked: false
      });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId,
          postId: id
        }
      });

      res.json({
        success: true,
        message: 'Post liked',
        liked: true
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like/unlike post'
    });
  }
});

// Update post
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;
    const userId = req.user.id;

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check if user can edit this post
    if (existingPost.authorId !== userId) {
      // Get the post author's role to check permissions
      const postAuthor = await prisma.user.findUnique({
        where: { id: existingPost.authorId },
        select: { role: true },
      });

      // Only admins can edit other users' posts
      if (!hasRole(req.user.role, UserRole.ADMIN)) {
        return res.status(403).json({ success: false, error: 'You can only edit your own posts' });
      }
    }

    // Handle category update if provided
    let categoryId = existingPost.categoryId;
    if (category && category !== existingPost.category?.name) {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });
      
      if (!categoryRecord) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category specified'
        });
      }
      categoryId = categoryRecord.id;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        categoryId: categoryId,
        tags: tags || existingPost.tags,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: true,
      },
    });

    // Add repliesCount and likesCount
    const postWithCounts = {
      ...updatedPost,
      category: updatedPost.category.name,
      repliesCount: updatedPost.replies.length,
      likesCount: updatedPost.likes.length,
      likes: undefined,
    };

    res.status(200).json({ success: true, message: 'Post updated successfully', post: postWithCounts });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check if user can delete this post
    if (existingPost.authorId !== userId) {
      // Get the post author's role to check permissions
      const postAuthor = await prisma.user.findUnique({
        where: { id: existingPost.authorId },
        select: { role: true },
      });

      // Only admins can delete other users' posts
      if (!hasRole(req.user.role, UserRole.ADMIN)) {
        return res.status(403).json({ success: false, error: 'You can only delete your own posts' });
      }
    }

    // Delete the post (replies and likes will be cascade deleted)
    await prisma.post.delete({
      where: { id }
    });

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

// Update reply
router.put('/:postId/reply/:replyId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Reply content is required' });
    }

    // Check if reply exists and user is the author
    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: { author: true }
    });

    if (!existingReply) {
      return res.status(404).json({ success: false, error: 'Reply not found' });
    }

    // Check if user can edit this reply
    if (existingReply.authorId !== userId) {
      // Get the reply author's role to check permissions
      const replyAuthor = await prisma.user.findUnique({
        where: { id: existingReply.authorId },
        select: { role: true },
      });

      // Only admins can edit other users' replies
      if (!hasRole(req.user.role, UserRole.ADMIN)) {
        return res.status(403).json({ success: false, error: 'You can only edit your own replies' });
      }
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    res.status(200).json({ success: true, message: 'Reply updated successfully', reply: updatedReply });
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({ success: false, error: 'Failed to update reply' });
  }
});

// Delete reply
router.delete('/:postId/reply/:replyId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user.id;

    // Check if reply exists and user is the author
    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: { author: true }
    });

    if (!existingReply) {
      return res.status(404).json({ success: false, error: 'Reply not found' });
    }

    // Check if user can delete this reply
    if (existingReply.authorId !== userId) {
      // Get the reply author's role to check permissions
      const replyAuthor = await prisma.user.findUnique({
        where: { id: existingReply.authorId },
        select: { role: true },
      });

      // Only admins can delete other users' replies
      if (!hasRole(req.user.role, UserRole.ADMIN)) {
        return res.status(403).json({ success: false, error: 'You can only delete your own replies' });
      }
    }

    await prisma.reply.delete({
      where: { id: replyId }
    });

    res.status(200).json({ success: true, message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete reply' });
  }
});

// Pin/Unpin a post (Admin only)
router.patch('/:id/pin', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Check if user has admin role
    if (!hasRole(req.user.role, UserRole.ADMIN)) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { id } = req.params;
    const { isPinned } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Update the pin status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isPinned: Boolean(isPinned) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Post ${isPinned ? 'pinned' : 'unpinned'} successfully`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        category: updatedPost.category.name,
        tags: updatedPost.tags,
        author: updatedPost.author,
        likes: updatedPost._count.likes,
        replies: updatedPost._count.replies,
        isPinned: updatedPost.isPinned,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt
      }
    });

  } catch (error) {
    console.error('Pin/Unpin post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update pin status'
    });
  }
});

// Close/Unclose a post (Admin only)
router.patch('/:id/close', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Check if user has admin role
    if (!hasRole(req.user.role, UserRole.ADMIN)) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { id } = req.params;
    const { isLocked } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Update the lock status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { isLocked: Boolean(isLocked) },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Post ${isLocked ? 'closed' : 'opened'} successfully`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        category: updatedPost.category.name,
        tags: updatedPost.tags,
        author: updatedPost.author,
        likes: updatedPost._count.likes,
        replies: updatedPost._count.replies,
        isPinned: updatedPost.isPinned,
        isLocked: updatedPost.isLocked,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt
      }
    });

  } catch (error) {
    console.error('Close/Unclose post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update lock status'
    });
  }
});

// Delete a post (Admin or Author)
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check permissions: Admin can delete any post, users can only delete their own
    const isAdmin = hasRole(userRole, UserRole.ADMIN);
    const isAuthor = existingPost.author.id === userId;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own posts'
      });
    }

    // Delete the post (cascade will handle replies and likes)
    await prisma.post.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post'
    });
  }
});

module.exports = router;
