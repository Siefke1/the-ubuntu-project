import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  PersonAdd,
  PersonRemove,
  CheckCircle,
  Cancel,
  Message,
  ThumbUp,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

interface UserProfileData {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  isFollowing: boolean;
  isFriend: boolean;
  pendingRequest?: {
    id: string;
    isSentByMe: boolean;
  } | null;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface UserPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const { colors } = useTheme();
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  // Extract userId from URL if useParams doesn't work
  const getUserIdFromUrl = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    // Use hash if it exists, otherwise use pathname
    const url = hash || path;
    const match = url.match(/\/user\/([^/?#]+)/);
    return match ? match[1] : userId;
  };
  
  const actualUserId = getUserIdFromUrl();
  

  // State
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });


  // Follow/Unfollow user
  const handleFollowToggle = async () => {
    if (!profile) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("authToken");
      const url = profile.isFollowing
        ? `http://localhost:3001/api/social/follow/${actualUserId}`
        : `http://localhost:3001/api/social/follow/${actualUserId}`;
      
      const method = profile.isFollowing ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the profile data to get the updated status from backend
        fetchUserProfile();
        setSnackbar({
          open: true,
          message: profile.isFollowing ? "Unfollowed user" : "Following user",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update follow status",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      setSnackbar({
        open: true,
        message: "Failed to update follow status",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fetch user profile data (simplified version for actions)
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    const response = await fetch(`http://localhost:3001/api/social/user/${encodeURIComponent(actualUserId || "")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.ok) {
      const data = await response.json();
      setProfile(data);
    }
  };

  // Send friend request
  const handleFriendRequest = async () => {
    if (!profile) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/social/friend-request/${actualUserId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the profile data to get the updated pendingRequest from backend
        fetchUserProfile();
        setSnackbar({
          open: true,
          message: "Friend request sent",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to send friend request",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setSnackbar({
        open: true,
        message: "Failed to send friend request",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Accept friend request
  const handleAcceptFriendRequest = async () => {
    if (!profile?.pendingRequest) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/social/friend-request/${profile.pendingRequest.id}/accept`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the profile data to get the updated status from backend
        fetchUserProfile();
        setSnackbar({
          open: true,
          message: "Friend request accepted",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to accept friend request",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setSnackbar({
        open: true,
        message: "Failed to accept friend request",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Decline friend request
  const handleDeclineFriendRequest = async () => {
    if (!profile?.pendingRequest) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/social/friend-request/${profile.pendingRequest.id}/decline`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the profile data to get the updated status from backend
        fetchUserProfile();
        setSnackbar({
          open: true,
          message: "Friend request declined",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to decline friend request",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      setSnackbar({
        open: true,
        message: "Failed to decline friend request",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Remove friend
  const handleRemoveFriend = async () => {
    if (!profile) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/social/friend/${actualUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the profile data to get the updated status from backend
        fetchUserProfile();
        setSnackbar({
          open: true,
          message: "Friend removed",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to remove friend",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setSnackbar({
        open: true,
        message: "Failed to remove friend",
        severity: "error",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    if (!actualUserId) return;
    
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setSnackbar({
            open: true,
            message: "You must be logged in to view user profiles",
            severity: "error",
          });
          setIsLoading(false);
          return;
        }
        
        // Fetch user profile
        const profileResponse = await fetch(`http://localhost:3001/api/social/user/${encodeURIComponent(actualUserId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await profileResponse.json();

        if (profileResponse.ok) {
          setProfile(profileData);
        } else {
          setSnackbar({
            open: true,
            message: profileData.error || "Failed to load user profile",
            severity: "error",
          });
        }

        // Fetch user posts
        const postsResponse = await fetch(`http://localhost:3001/api/posts/user/${actualUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postsData = await postsResponse.json();

        if (postsResponse.ok && postsData.success) {
          setUserPosts(postsData.posts || []);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load user data",
          severity: "error",
        });
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [actualUserId]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Request timed out");
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: "Request timed out. Please check your connection.",
          severity: "error",
        });
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        }}
      >
        <CircularProgress
          size={60}
          sx={{ color: colors.accent }}
        />
      </Box>
    );
  }

  if (!profile && !isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        }}
      >
        <Alert severity="error">User not found</Alert>
      </Box>
    );
  }

  const getDisplayName = () => {
    if (!profile) return "";

    if (profile.firstName && profile.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile.username;
  };

  // Helper function to render follow button
  const renderFollowButton = () => {
    if (!profile) return null;
    
    return (
      <Button
        variant="contained"
        startIcon={profile.isFollowing ? <PersonRemove /> : <PersonAdd />}
        onClick={handleFollowToggle}
        disabled={isActionLoading}
        sx={{
          minWidth: 120,
          height: 40,
          ...(profile.isFollowing ? {
            backgroundColor: colors.background.light,
            border: `2px solid ${colors.accent}`,
            color: colors.accent,
            "&:hover": {
              backgroundColor: colors.accent,
              color: colors.textColorLight,
            },
          } : {
            backgroundColor: colors.accent,
            "&:hover": {
              backgroundColor: colors.highlight,
            },
          }),
        }}
      >
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </Button>
    );
  };

  const getActionButtons = () => {
    if (!profile) return null;

    if (profile.id === currentUser?.id) {
      return null; // Don't show action buttons for own profile
    }


    if (profile.isFriend) {
      return (
        <Button
          variant="outlined"
          startIcon={<PersonRemove />}
          onClick={handleRemoveFriend}
          disabled={isActionLoading}
          sx={{
            minWidth: 140,
            height: 40,
            borderColor: colors.accent,
            color: colors.accent,
            "&:hover": {
              backgroundColor: colors.accent,
              color: colors.textColorLight,
            },
          }}
        >
          Remove Friend
        </Button>
      );
    }

    if (profile.pendingRequest) {
      if (profile.pendingRequest.isSentByMe) {
        return (
          <Stack direction="row" spacing={1}>
            {renderFollowButton()}
            <Button
              variant="outlined"
              disabled
              sx={{
                minWidth: 160,
                height: 40,
                borderColor: "white",
                opacity: 0.6,
                color: "white",
                backgroundColor: "white",
              }}
            >
              Friend Request Sent
            </Button>
          </Stack>
        );
      } else {
        return (
          <Stack direction="row" spacing={1}>
            {renderFollowButton()}
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={handleAcceptFriendRequest}
              disabled={isActionLoading}
              sx={{
                minWidth: 100,
                height: 40,
                backgroundColor: colors.accent,
                "&:hover": {
                  backgroundColor: colors.highlight,
                },
              }}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={handleDeclineFriendRequest}
              disabled={isActionLoading}
              sx={{
                minWidth: 100,
                height: 40,
                borderColor: colors.secondary,
                color: colors.secondary,
                "&:hover": {
                  backgroundColor: colors.secondary,
                  color: colors.textColorLight,
                },
              }}
            >
              Decline
            </Button>
          </Stack>
        );
      }
    }

    return (
      <Stack direction="row" spacing={1}>
        {renderFollowButton()}
        <Button
          variant="outlined"
          startIcon={<Message />}
          onClick={handleFriendRequest}
          disabled={isActionLoading}
          sx={{
            minWidth: 120,
            height: 40,
            borderColor: colors.accent,
            color: colors.accent,
            "&:hover": {
              backgroundColor: colors.accent,
              color: colors.textColorLight,
            },
          }}
        >
          Add Friend
        </Button>
      </Stack>
    );
  };

  if (!profile) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: colors.textColorLight,
                backgroundColor: colors.background.dark,
                "&:hover": {
                  backgroundColor: colors.accent,
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                color: colors.textColorLight,
                fontWeight: "bold",
              }}
            >
              User Profile
            </Typography>
          </Stack>
        </motion.div>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Profile Card */}
          <Box sx={{ width: { xs: "100%", md: "400px" }, flexShrink: 0 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                sx={{
                  backgroundColor: colors.background.dark,
                  border: `1px solid ${colors.light}`,
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar
                      src={profile?.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: "3rem",
                        backgroundColor: colors.accent,
                        border: `3px solid ${colors.light}`,
                      }}
                    >
                      {getDisplayName().charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {getDisplayName()}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.secondary,
                        textAlign: "center",
                      }}
                    >
                      @{profile.username}
                    </Typography>

                    {profile.bio && (
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.textColorLight,
                          textAlign: "center",
                          fontStyle: "italic",
                          mt: 2,
                        }}
                      >
                        "{profile.bio}"
                      </Typography>
                    )}

                    <Divider sx={{ width: "100%", borderColor: colors.light }} />

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "space-around" }}>
                      <Stack alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.accent,
                            fontWeight: "bold",
                          }}
                        >
                          {profile._count.posts}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.secondary }}
                        >
                          Posts
                        </Typography>
                      </Stack>
                      <Stack alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.accent,
                            fontWeight: "bold",
                          }}
                        >
                          {profile._count.followers}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.secondary }}
                        >
                          Followers
                        </Typography>
                      </Stack>
                      <Stack alignItems="center">
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.accent,
                            fontWeight: "bold",
                          }}
                        >
                          {profile._count.following}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.secondary }}
                        >
                          Following
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ width: "100%", borderColor: colors.light }} />

                    {/* Action Buttons */}
                    {getActionButtons()}

                    {/* Join Date */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.secondary,
                        textAlign: "center",
                        mt: 2,
                      }}
                    >
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Posts Section */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                sx={{
                  backgroundColor: colors.background.dark,
                  border: `1px solid ${colors.light}`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.textColorLight,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    Recent Posts
                  </Typography>

                  {userPosts.length === 0 ? (
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.secondary,
                        textAlign: "center",
                        py: 4,
                      }}
                    >
                      No posts yet
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {userPosts.map((post) => (
                        <Paper
                          key={post.id}
                          sx={{
                            p: 2,
                            backgroundColor: colors.background.light,
                            border: `1px solid ${colors.light}`,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: colors.accent,
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: colors.textColorLight,
                              fontWeight: "bold",
                              mb: 1,
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.secondary,
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {post.content}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                backgroundColor: colors.accent,
                                color: colors.textColorLight,
                              }}
                            />
                            <Stack direction="row" spacing={1} alignItems="center">
                              <ThumbUp sx={{ fontSize: "1rem", color: colors.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.secondary }}>
                                {post.likes}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Message sx={{ fontSize: "1rem", color: colors.secondary }} />
                              <Typography variant="caption" sx={{ color: colors.secondary }}>
                                {post.replies}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.secondary,
                                ml: "auto",
                              }}
                            >
                              {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Stack>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
