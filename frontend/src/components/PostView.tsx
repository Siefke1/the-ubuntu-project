import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack,
  AccountCircle,
  Settings,
  Logout,
  ThumbUp,
  Reply,
  Send,
  Message,
  Edit,
  Delete,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

interface Author {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
}

interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  likes: number;
  repliesCount: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info";
}

const PostView: React.FC = () => {
  const { colors, currentTheme } = useTheme();
  const { user, logout } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [isEditingReply, setIsEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const open = Boolean(anchorEl);

  // Get post ID from URL hash
  const getPostIdFromUrl = () => {
    const hash = window.location.hash;
    const match = hash.match(/#\/post\/([^/]+)/);
    return match ? match[1] : null;
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    window.location.hash = "#/";
  };

  const fetchPost = async (postId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.post);
      } else {
        throw new Error(data.error || "Failed to fetch post");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      setSnackbar({
        open: true,
        message: "Failed to load post. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/posts/${post.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes: data.liked ? prev.likes + 1 : prev.likes - 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!post || !replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/posts/${post.id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: replyContent.trim(),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setReplyContent("");
        setShowReplyForm(false);
        setSnackbar({
          open: true,
          message: "Reply posted successfully!",
          severity: "success",
        });
        // Refresh post to get new reply
        fetchPost(post.id);
      } else {
        throw new Error(data.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Failed to post reply. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Edit post
  const handleEditPost = () => {
    if (post) {
      setEditContent(post.content);
      setIsEditingPost(true);
    }
  };

  const handleSavePostEdit = async () => {
    if (!post || !editContent.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: editContent,
          category: post.category,
          tags: post.tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPost(data.post);
        setIsEditingPost(false);
        setEditContent("");
        setSnackbar({
          open: true,
          message: "Post updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update post",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Update post error:", error);
      setSnackbar({
        open: true,
        message: "Failed to update post",
        severity: "error",
      });
    }
  };

  const handleCancelPostEdit = () => {
    setIsEditingPost(false);
    setEditContent("");
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!post || !confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: "Post deleted successfully!",
          severity: "success",
        });
        // Redirect to forum after a short delay
        setTimeout(() => {
          window.location.hash = "#/forum";
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to delete post",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Delete post error:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete post",
        severity: "error",
      });
    }
  };

  // Edit reply
  const handleEditReply = (replyId: string, content: string) => {
    setEditContent(content);
    setIsEditingReply(replyId);
  };

  const handleSaveReplyEdit = async (replyId: string) => {
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/posts/${post?.id}/reply/${replyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the reply in the post state
        if (post) {
          const updatedReplies = post.replies.map(reply => 
            reply.id === replyId ? data.reply : reply
          );
          setPost({ ...post, replies: updatedReplies });
        }
        setIsEditingReply(null);
        setEditContent("");
        setSnackbar({
          open: true,
          message: "Reply updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update reply",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Update reply error:", error);
      setSnackbar({
        open: true,
        message: "Failed to update reply",
        severity: "error",
      });
    }
  };

  const handleCancelReplyEdit = () => {
    setIsEditingReply(null);
    setEditContent("");
  };

  // Delete reply
  const handleDeleteReply = async (replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/posts/${post?.id}/reply/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove the reply from the post state
        if (post) {
          const updatedReplies = post.replies.filter(reply => reply.id !== replyId);
          setPost({ ...post, replies: updatedReplies, repliesCount: updatedReplies.length });
        }
        setSnackbar({
          open: true,
          message: "Reply deleted successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to delete reply",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Delete reply error:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete reply",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const postId = getPostIdFromUrl();
    if (postId) {
      fetchPost(postId);
    } else {
      setSnackbar({
        open: true,
        message: "Post not found",
        severity: "error",
      });
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: colors.accent }} />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: colors.textColorLight }}>
          Post not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.background.dark,
        color: colors.textColorLight,
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: colors.background.light,
          borderBottom: `1px solid ${colors.accent}20`,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Back Button & Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                color: colors.accent,
                "&:hover": {
                  backgroundColor: colors.accent + "10",
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                color: colors.textColorLight,
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${colors.accent}, ${colors.highlight})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Post Discussion
            </Typography>
          </Box>

          {/* User Profile Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.secondary,
                display: { xs: "none", sm: "block" },
              }}
            >
              {user?.firstName || user?.username || "User"}
            </Typography>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: colors.accent,
                "&:hover": {
                  backgroundColor: colors.accent + "10",
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
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: colors.textColorLight,
            "&:hover": { backgroundColor: colors.accent + "10" },
          }}
        >
          <AccountCircle sx={{ mr: 2, color: colors.accent }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: colors.textColorLight,
            "&:hover": { backgroundColor: colors.accent + "10" },
          }}
        >
          <Settings sx={{ mr: 2, color: colors.accent }} />
          Settings
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.secondary + "20" }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: colors.textColorLight,
            "&:hover": { backgroundColor: "#f44336" + "10" },
          }}
        >
          <Logout sx={{ mr: 2, color: "#f44336" }} />
          Logout
        </MenuItem>
      </Menu>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Sidebar - Author Info (1/3 width) */}
            <Box sx={{ flex: { xs: 1, lg: 1 }, maxWidth: { lg: '400px' } }}>
              <Card
                sx={{
                  backgroundColor: colors.background.light,
                  borderRadius: 3,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  position: 'sticky',
                  top: 20,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: colors.accent,
                        color: colors.textColorLight,
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        mb: 2,
                      }}
                    >
                      {post.author.firstName?.charAt(0) || post.author.username.charAt(0)}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 0.5,
                      }}
                    >
                      {post.author.firstName || post.author.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.secondary, textAlign: 'center' }}
                    >
                      @{post.author.username}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3, backgroundColor: colors.secondary + '30' }} />

                  {/* Author Stats */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.secondary }}>
                        Member Since
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textColorLight, fontWeight: 'bold' }}>
                        {new Date(post.author.id).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.secondary }}>
                        Posts
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textColorLight, fontWeight: 'bold' }}>
                        {Math.floor(Math.random() * 50) + 10}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.secondary }}>
                        Replies
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textColorLight, fontWeight: 'bold' }}>
                        {Math.floor(Math.random() * 200) + 50}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: colors.secondary }}>
                        Likes Received
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.textColorLight, fontWeight: 'bold' }}>
                        {Math.floor(Math.random() * 500) + 100}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3, backgroundColor: colors.secondary + '30' }} />

                  {/* Author Bio */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: colors.textColorLight, fontWeight: 'bold', mb: 1 }}>
                      About
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.secondary, lineHeight: 1.6 }}>
                      {post.author.bio || 'Active community member passionate about Ubuntu and open source software.'}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3, backgroundColor: colors.secondary + '30' }} />

                  {/* Recent Activity */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: colors.textColorLight, fontWeight: 'bold', mb: 2 }}>
                      Recent Activity
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="caption" sx={{ color: colors.secondary }}>
                        • Posted in General Discussion
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.secondary }}>
                        • Replied to "Installation Help"
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.secondary }}>
                        • Liked "Ubuntu 24.04 Tips"
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Right Content - Post (2/3 width) */}
            <Box sx={{ flex: { xs: 1, lg: 2 } }}>
              {/* Main Post */}
              <Card
                sx={{
                  backgroundColor: colors.background.light,
                  borderRadius: 3,
                  border: 'none',
                  mb: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  overflow: "hidden",
                }}
              >
            <CardHeader
              sx={{ pb: 2, pt: 3, px: 3 }}
              avatar={
                <Avatar
                  sx={{
                    bgcolor: colors.accent,
                    color: colors.textColorLight,
                    width: 48,
                    height: 48,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {post.author.firstName?.charAt(0) ||
                    post.author.username.charAt(0)}
                </Avatar>
              }
              title={
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: colors.textColorLight,
                      fontWeight: "bold",
                      mb: 1,
                      fontSize: '1.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.secondary, fontSize: '0.9rem' }}
                  >
                    by {post.author.firstName || post.author.username} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
              action={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ThumbUp />}
                    onClick={handleLike}
                    sx={{
                      color: colors.accent,
                      borderColor: colors.accent,
                      fontSize: '0.8rem',
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: colors.accent + "10",
                      },
                    }}
                  >
                    {post.likes}
                  </Button>
                </Box>
              }
            />
            <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
              {/* Category and Tags */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    backgroundColor: colors.accent + "20",
                    color: colors.accent,
                    fontWeight: "bold",
                    fontSize: '0.8rem',
                    height: 28,
                  }}
                />
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      backgroundColor: colors.background.medium,
                      color: colors.textColorLight,
                      fontSize: "0.8rem",
                      height: 28,
                    }}
                  />
                ))}
              </Box>
              
              {/* Post Content */}
              <Box
                sx={{
                  backgroundColor: colors.background.light,
                  borderRadius: 2,
                  p: 3,
                  border: `1px solid ${colors.secondary}20`,
                }}
                data-color-mode={
                  currentTheme === "darknight" ? "dark" : "light"
                }
              >
                {isEditingPost ? (
                  <Box
                    sx={{
                      "& .w-md-editor": {
                        backgroundColor: colors.background.medium,
                        border: `1px solid ${colors.secondary}`,
                        borderRadius: 2,
                      },
                      "& .w-md-editor-text-container": {
                        backgroundColor: colors.background.medium,
                      },
                      "& .w-md-editor-text": {
                        color: colors.textColorLight,
                      },
                      "& .w-md-editor-preview": {
                        backgroundColor: colors.background.medium,
                        color: colors.textColorLight,
                      },
                      "& .wmde-markdown": {
                        color: colors.textColorLight,
                      },
                      "& .w-md-editor-toolbar": {
                        padding: '12px 16px',
                        backgroundColor: colors.background.medium,
                        borderBottom: `1px solid ${colors.secondary}20`,
                      },
                      "& .w-md-editor-toolbar button": {
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
                      "& .w-md-editor-toolbar svg": {
                        width: '18px',
                        height: '18px',
                      },
                    }}
                  >
                    <MDEditor
                      value={editContent}
                      onChange={(value) => setEditContent(value || "")}
                      height={400}
                      preview="edit"
                      data-color-mode={
                        currentTheme === "darknight" ? "dark" : "light"
                      }
                      toolbarHeight={60}
                      visibleDragbar={false}
                      textareaProps={{
                        placeholder: "Edit your post content...",
                        style: {
                          fontSize: "16px",
                          lineHeight: "1.6",
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      "& .wmde-markdown": {
                        color: colors.textColorLight,
                        fontSize: '1.1rem',
                        lineHeight: 1.7,
                        backgroundColor: 'transparent', // Remove any background
                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                          color: colors.textColorLight,
                          marginTop: '2rem',
                          marginBottom: '1rem',
                          fontWeight: 'bold',
                        },
                        "& p": {
                          marginBottom: '1.2rem',
                          fontSize: '1.1rem',
                        },
                        "& code": {
                          backgroundColor: colors.background.dark,
                          color: colors.accent,
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: '0.9em',
                          fontWeight: '500',
                        },
                        "& pre": {
                          backgroundColor: colors.background.dark,
                          border: `1px solid ${colors.secondary}40`,
                          borderRadius: '8px',
                          padding: '1.5rem',
                          overflow: 'auto',
                          margin: '1.5rem 0',
                        },
                        "& blockquote": {
                          borderLeft: `4px solid ${colors.accent}`,
                          paddingLeft: '1.5rem',
                          marginLeft: 0,
                          margin: '1.5rem 0',
                          fontStyle: 'italic',
                          color: colors.secondary,
                          backgroundColor: colors.background.dark + '50',
                          padding: '1rem 1.5rem',
                          borderRadius: '6px',
                        },
                        "& ul, & ol": {
                          paddingLeft: '1.5rem',
                          marginBottom: '1.2rem',
                        },
                        "& li": {
                          marginBottom: '0.5rem',
                        },
                      },
                    }}
                  >
                    <MDEditor.Markdown source={post.content} />
                  </Box>
                )}
                
                {/* Edit Post Actions */}
                {isEditingPost && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancelPostEdit}
                      sx={{
                        borderColor: colors.secondary,
                        color: colors.secondary,
                        '&:hover': {
                          backgroundColor: colors.secondary + '10',
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSavePostEdit}
                      disabled={!editContent.trim()}
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
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Post Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 3, borderTop: `1px solid ${colors.secondary}20` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ThumbUp />}
                    onClick={handleLike}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      '&:hover': {
                        backgroundColor: colors.accent + '10',
                        borderColor: colors.accent,
                      },
                    }}
                  >
                    Like ({post.likes})
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Message />}
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      '&:hover': {
                        backgroundColor: colors.accent + '10',
                        borderColor: colors.accent,
                      },
                    }}
                  >
                    Reply
                  </Button>
                  {/* Edit/Delete buttons for post author */}
                  {user && post.author.id === user.id && (
                    <>
                      <IconButton
                        onClick={handleEditPost}
                        sx={{
                          color: colors.highlight,
                          '&:hover': {
                            backgroundColor: colors.highlight + '10',
                          },
                        }}
                        title="Edit post"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={handleDeletePost}
                        sx={{
                          color: '#f44336',
                          '&:hover': {
                            backgroundColor: '#f44336' + '10',
                          },
                        }}
                        title="Delete post"
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: colors.secondary }}>
                  {post.repliesCount} replies
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Replies */}
          <Typography
            variant="h6"
            sx={{ color: colors.textColorLight, mb: 3, fontWeight: "bold", fontSize: '1.3rem' }}
          >
            Replies ({post.repliesCount})
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {post.replies.map((reply, index) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    backgroundColor: colors.background.light,
                    borderRadius: 2,
                    p: 2,
                    border: `1px solid ${colors.secondary}20`,
                    '&:hover': {
                      backgroundColor: colors.background.medium,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Author Info - Left Side */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                      <Avatar
                        sx={{
                          bgcolor: colors.accent,
                          color: colors.textColorLight,
                          width: 36,
                          height: 36,
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          mb: 1,
                        }}
                      >
                        {reply.author.firstName?.charAt(0) || reply.author.username.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.textColorLight,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: '0.75rem',
                        }}
                      >
                        {reply.author.firstName || reply.author.username}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: colors.secondary, 
                          fontSize: '0.7rem',
                          textAlign: 'center',
                        }}
                      >
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    {/* Reply Content - Right Side */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {isEditingReply === reply.id ? (
                        <Box
                          sx={{
                            "& .w-md-editor": {
                              backgroundColor: colors.background.medium,
                              border: `1px solid ${colors.secondary}`,
                              borderRadius: 2,
                            },
                            "& .w-md-editor-text-container": {
                              backgroundColor: colors.background.medium,
                            },
                            "& .w-md-editor-text": {
                              color: colors.textColorLight,
                            },
                            "& .w-md-editor-preview": {
                              backgroundColor: colors.background.medium,
                              color: colors.textColorLight,
                            },
                            "& .wmde-markdown": {
                              color: colors.textColorLight,
                            },
                            "& .w-md-editor-toolbar": {
                              padding: '8px 12px',
                              backgroundColor: colors.background.medium,
                              borderBottom: `1px solid ${colors.secondary}20`,
                            },
                            "& .w-md-editor-toolbar button": {
                              width: '32px',
                              height: '32px',
                              margin: '0 2px',
                              borderRadius: '6px',
                              fontSize: '14px',
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
                            "& .w-md-editor-toolbar svg": {
                              width: '14px',
                              height: '14px',
                            },
                          }}
                        >
                          <MDEditor
                            value={editContent}
                            onChange={(value) => setEditContent(value || "")}
                            height={150}
                            preview="edit"
                            data-color-mode={
                              currentTheme === "darknight" ? "dark" : "light"
                            }
                            toolbarHeight={40}
                            visibleDragbar={false}
                            textareaProps={{
                              placeholder: "Edit your reply...",
                              style: {
                                fontSize: "14px",
                                lineHeight: "1.5",
                              },
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          data-color-mode={
                            currentTheme === "darknight" ? "dark" : "light"
                          }
                          sx={{
                            "& .wmde-markdown": {
                              color: colors.textColorLight,
                              fontSize: '0.95rem',
                              lineHeight: 1.5,
                              backgroundColor: 'transparent',
                              "& p": {
                                marginBottom: '0.75rem',
                              },
                              "& code": {
                                backgroundColor: colors.background.dark,
                                color: colors.accent,
                                padding: "2px 4px",
                                borderRadius: "3px",
                                fontSize: '0.85em',
                                fontWeight: '500',
                              },
                              "& pre": {
                                backgroundColor: colors.background.dark,
                                border: `1px solid ${colors.secondary}40`,
                                borderRadius: '4px',
                                padding: '0.75rem',
                                overflow: 'auto',
                                fontSize: '0.85rem',
                              },
                              "& blockquote": {
                                borderLeft: `3px solid ${colors.accent}`,
                                paddingLeft: '0.75rem',
                                marginLeft: 0,
                                margin: '0.75rem 0',
                                fontStyle: 'italic',
                                color: colors.secondary,
                                backgroundColor: colors.background.dark + '30',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '3px',
                              },
                            },
                          }}
                        >
                          <MDEditor.Markdown source={reply.content} />
                        </Box>
                      )}
                      
                      {/* Edit/Delete buttons for reply author */}
                      {user && reply.author.id === user.id && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                          {isEditingReply === reply.id ? (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={handleCancelReplyEdit}
                                sx={{
                                  borderColor: colors.secondary,
                                  color: colors.secondary,
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    backgroundColor: colors.secondary + '10',
                                  },
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleSaveReplyEdit(reply.id)}
                                disabled={!editContent.trim()}
                                sx={{
                                  backgroundColor: colors.accent,
                                  color: colors.textColorLight,
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  '&:hover': {
                                    backgroundColor: colors.highlight,
                                  },
                                  '&:disabled': {
                                    backgroundColor: colors.secondary,
                                  },
                                }}
                              >
                                Save
                              </Button>
                            </>
                          ) : (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleEditReply(reply.id, reply.content)}
                                sx={{
                                  color: colors.highlight,
                                  '&:hover': {
                                    backgroundColor: colors.highlight + '10',
                                  },
                                }}
                                title="Edit reply"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteReply(reply.id)}
                                sx={{
                                  color: '#f44336',
                                  '&:hover': {
                                    backgroundColor: '#f44336' + '10',
                                  },
                                }}
                                title="Delete reply"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Sticky Reply Form Overlay */}
      {showReplyForm && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: colors.background.light,
            borderTop: `1px solid ${colors.secondary}30`,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: colors.textColorLight, fontWeight: "bold", fontSize: '1.2rem' }}
                >
                  Write a Reply
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setShowReplyForm(false)}
                  sx={{
                    color: colors.secondary,
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      backgroundColor: colors.secondary + '10',
                    },
                  }}
                >
                  ✕
                </Button>
              </Box>
              <Box
                data-color-mode={
                  currentTheme === "darknight" ? "dark" : "light"
                }
                sx={{
                  "& .w-md-editor": {
                    backgroundColor: colors.background.medium,
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: 2,
                  },
                  "& .w-md-editor-text-container": {
                    backgroundColor: colors.background.medium,
                  },
                  "& .w-md-editor-text": {
                    color: colors.textColorLight,
                  },
                  "& .w-md-editor-preview": {
                    backgroundColor: colors.background.medium,
                    color: colors.textColorLight,
                  },
                  "& .wmde-markdown": {
                    color: colors.textColorLight,
                  },
                  "& .w-md-editor-toolbar": {
                    padding: '12px 16px',
                    backgroundColor: colors.background.medium,
                    borderBottom: `1px solid ${colors.secondary}20`,
                  },
                  "& .w-md-editor-toolbar button": {
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
                  "& .w-md-editor-toolbar svg": {
                    width: '18px',
                    height: '18px',
                  },
                }}
              >
                <MDEditor
                  value={replyContent}
                  onChange={(value) => setReplyContent(value || "")}
                  height={250}
                  preview="edit"
                  data-color-mode={
                    currentTheme === "darknight" ? "dark" : "light"
                  }
                  toolbarHeight={60}
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: "Start writing your reply... Use markdown for formatting!",
                    style: {
                      fontSize: "16px",
                      lineHeight: "1.6",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<Send />}
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim() || isSubmittingReply}
                  sx={{
                    backgroundColor: colors.accent,
                    color: colors.textColorLight,
                    fontSize: '0.9rem',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: colors.highlight,
                    },
                    "&:disabled": {
                      backgroundColor: colors.secondary,
                    },
                  }}
                >
                  {isSubmittingReply ? "Posting..." : "Post Reply"}
                </Button>
              </Box>
            </Box>
          </Container>
        </motion.div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            backgroundColor:
              snackbar.severity === "success"
                ? colors.accent
                : snackbar.severity === "error"
                ? "#f44336"
                : colors.secondary,
            color: colors.textColorLight,
            "& .MuiAlert-icon": {
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

export default PostView;
