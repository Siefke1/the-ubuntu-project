const express = require('express');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');

const router = express.Router();
const prisma = new PrismaClient();

// Test endpoint without authentication
router.get('/test', (req, res) => {
  res.json({ message: 'Social routes are working!' });
});

// Get user's friends list
router.get('/friends', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const friends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      }
    });

    // Transform the data to show friend info
    const friendsList = friends.map(friend => {
      return friend.senderId === userId ? friend.receiver : friend.sender;
    });

    res.json({ friends: friendsList });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Get user's following list
router.get('/following', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      }
    });

    const followingList = following.map(follow => follow.following);

    res.json({ following: followingList });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following list' });
  }
});

// Get user's followers list
router.get('/followers', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      }
    });

    const followersList = followers.map(follow => follow.follower);

    res.json({ followers: followersList });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers list' });
  }
});

// Follow a user
router.post('/follow/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId }
    });

    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow relationship
    await prisma.userFollow.create({
      data: {
        followerId,
        followingId
      }
    });

    res.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.delete('/follow/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    if (!follow) {
      return res.status(404).json({ error: 'Not following this user' });
    }

    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// Send friend request
router.post('/friend-request/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if user exists
    const userToRequest = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!userToRequest) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already friends
    const existingFriendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'ACCEPTED' },
          { senderId: receiverId, receiverId: senderId, status: 'ACCEPTED' }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }

    // Check if request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    res.json({ 
      message: 'Friend request sent successfully',
      requestId: friendRequest.id
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Get pending friend requests
router.get('/friend-requests', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        }
      }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
});

// Accept friend request
router.put('/friend-request/:requestId/accept', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;

    const request = await prisma.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Update request status to accepted
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' }
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Decline friend request
router.put('/friend-request/:requestId/decline', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.requestId;

    const request = await prisma.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Update request status to declined
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'DECLINED' }
    });

    res.json({ message: 'Friend request declined' });
  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
});

// Remove friend
router.delete('/friend/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.userId;

    const friendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId, status: 'ACCEPTED' },
          { senderId: friendId, receiverId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    // Delete the friendship
    await prisma.friendRequest.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// Search users
router.get('/search', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true
      },
      take: parseInt(limit)
    });

    res.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get user profile for social features
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;
    
    console.log('Fetching profile for userId:', userId);
    console.log('Current user ID:', currentUserId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.username);

    // Check if current user is following this user
    const isFollowing = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId
        }
      }
    });

    // Check if they are friends
    const friendship = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId, status: 'ACCEPTED' },
          { senderId: userId, receiverId: currentUserId, status: 'ACCEPTED' }
        ]
      }
    });

    // Check if there's a pending friend request
    const pendingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId, status: 'PENDING' },
          { senderId: userId, receiverId: currentUserId, status: 'PENDING' }
        ]
      }
    });

    res.json({
      ...user,
      isFollowing: !!isFollowing,
      isFriend: !!friendship,
      pendingRequest: pendingRequest ? {
        id: pendingRequest.id,
        isSentByMe: pendingRequest.senderId === currentUserId
      } : null
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
