import React, { useState, useEffect, useCallback, useRef } from "react";
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
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tabs,
  Tab,
  Stack,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Forum,
  TrendingUp,
  People,
  Message,
  ThumbUp,
  Add,
  Visibility,
  AccountCircle,
  Settings,
  Logout,
  Category,
  MoreVert,
  PushPin,
  Lock,
  LockOpen,
  Edit,
  Delete,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { getTranslations } from "../texts/translations";
import CategoryManager from "./CategoryManager";
import { debounce } from "lodash";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  dislikes: number;
  isPinned: boolean;
  isLocked: boolean;
  isHot: boolean;
  lastActivity: string;
  tags: string[];
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: React.ReactNode;
  color: string;
}

interface ParsedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  likes: number;
  replies: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ParsedCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  icon: string;
  color: string;
}

const ForumMainpage: React.FC = () => {
  const { colors, currentTheme } = useTheme();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const t = getTranslations(language);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(
    user?.role === "BEGINNER" ? 2 : 0
  ); // 0: Recent (default), 1: Hot, 2: Pinned
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [postMenuAnchor, setPostMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  // Ref to store the debounced function
  const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:3001/api/categories/public/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        const transformedCategories: ForumCategory[] = data.categories.map(
          (category: ParsedCategory) => ({
            id: category.id,
            name: category.name,
            description: category.description || "",
            postCount: category.postCount || 0,
            icon: <Forum />, // Default icon, could be enhanced later
            color: category.color || colors.accent,
          })
        );
        setCategories(transformedCategories);
      } else if (response.status === 401) {
        console.error("Authentication failed for categories");
        // Don't show fallback data for auth failures - user needs to login
        setCategories([]);
      } else {
        console.error(
          "Failed to fetch categories:",
          data.error || "Unknown error"
        );
        // Show fallback data for other errors
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to mock data
      setCategories([
        {
          id: "1",
          name: "You",
          description: "General Ubuntu discussions and community chat",
          postCount: 156,
          icon: <Forum />,
          color: colors.accent,
        },
        {
          id: "2",
          name: "Are not",
          description: "Help with installing and setting up Ubuntu",
          postCount: 89,
          icon: <TrendingUp />,
          color: colors.highlight,
        },
        {
          id: "3",
          name: "Supposed to",
          description: "Advanced system management and configuration",
          postCount: 67,
          icon: <People />,
          color: colors.primary,
        },
        {
          id: "4",
          name: "Be here",
          description: "Programming and development discussions",
          postCount: 43,
          icon: <Message />,
          color: colors.secondary,
        },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [colors.accent, colors.highlight, colors.primary, colors.secondary]);

  // Fetch posts from API with pagination and sorting
  const fetchPosts = useCallback(
    async (
      page: number = 1,
      append: boolean = false,
      searchParam: string = ""
    ) => {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const token = localStorage.getItem("authToken");
        const sortParam = selectedTab === 1 ? "hot" : "recent"; // 1 = Hot, 0 = Recent
        const categoryParam = activeCategory || "all";
        const pinnedParam = selectedTab === 2 ? "&pinned=true" : ""; // 2 = Pinned

        const response = await fetch(
          `http://localhost:3001/api/posts?page=${page}&limit=10&sort=${sortParam}&category=${encodeURIComponent(
            categoryParam
          )}${searchParam}${pinnedParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok && data.success) {
          // Transform API data to match ForumPost interface
          const transformedPosts: ForumPost[] = data.posts.map(
            (post: ParsedPost) => ({
              id: post.id,
              title: post.title,
              author: post.author.firstName || post.author.username,
              authorAvatar: (post.author.firstName || post.author.username)
                .charAt(0)
                .toUpperCase(),
              content: post.content,
              category: post.category,
              replies: post.replies,
              views: Math.floor(Math.random() * 200), // Mock views for now
              likes: post.likes,
              dislikes: 0, // Not implemented yet
              isPinned: post.isPinned,
              isLocked: post.isLocked,
              isHot: post.likes > 10, // Consider hot if many likes
              lastActivity: new Date(post.createdAt).toLocaleDateString(),
              tags: post.tags,
            })
          );

          if (append) {
            setPosts((prev) => [...prev, ...transformedPosts]);
          } else {
            setPosts(transformedPosts);
          }

          // Check if there are more posts
          setHasMorePosts(transformedPosts.length === 10);
          setCurrentPage(page);
        } else if (response.status === 401) {
          console.error("Authentication failed for posts");
          setPosts([]);
        } else {
          console.error(
            "Failed to fetch posts:",
            data.error || "Unknown error"
          );
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsSearching(false);
      }
    },
    [selectedTab, activeCategory]
  );

  // Load more posts for pagination
  const loadMorePosts = () => {
    if (!isLoadingMore && hasMorePosts) {
      const searchParam = searchQuery
        ? `&search=${encodeURIComponent(searchQuery)}`
        : "";
      fetchPosts(currentPage + 1, true, searchParam);
    }
  };

  // Search function that performs the actual search
  const performSearch = useCallback(
    (query: string) => {
      setIsSearching(true);
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : "";
      fetchPosts(1, false, searchParam);
    },
    [fetchPosts]
  );

  // Pin/Unpin post function
  const togglePinPost = useCallback(
    async (postId: string, currentPinStatus: boolean) => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:3001/api/posts/${postId}/pin`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isPinned: !currentPinStatus }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Update the post in the local state
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? { ...post, isPinned: !currentPinStatus }
                : post
            )
          );
        } else {
          console.error("Failed to toggle pin status:", data.error);
        }
      } catch (error) {
        console.error("Error toggling pin status:", error);
      }
    },
    []
  );

  // Simple search handler with proper debounce
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);

      // Cancel previous debounced function if it exists
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel();
      }

      // Create new debounced function and store it in ref
      debouncedSearchRef.current = debounce(() => {
        performSearch(query);
      }, 1000);

      // Execute the debounced function
      debouncedSearchRef.current();
    },
    [performSearch]
  );

  // Initial data fetch
  useEffect(() => {
    fetchPosts(1, false, "");
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  // Refetch when tab or category changes
  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    setHasMorePosts(true);
    fetchPosts(1, false, "");
  }, [selectedTab, activeCategory, fetchPosts]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel();
      }
    };
  }, []);

  // No client-side filtering needed - backend handles all filtering and search

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    // Don't clear category filter when switching tabs - only clear when close button is pressed
  };

  const handleCategoryClick = (categoryName: string) => {
    if (activeCategory === categoryName) {
      // Category already active, remove it
      setActiveCategory(null);
    } else {
      // Select new category
      setActiveCategory(categoryName);
    }
    // Don't automatically switch tabs - let user choose Recent/Hot/Pinned
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

  const handlePostMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    postId: string
  ) => {
    event.stopPropagation();
    setPostMenuAnchor(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handlePostMenuClose = () => {
    setPostMenuAnchor(null);
    setSelectedPostId(null);
  };

  const handlePinPost = (postId: string, currentPinStatus: boolean) => {
    togglePinPost(postId, currentPinStatus);
    handlePostMenuClose();
  };

  // Close/Unclose post function
  const toggleClosePost = useCallback(
    async (postId: string, currentLockStatus: boolean) => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:3001/api/posts/${postId}/close`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isLocked: !currentLockStatus }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Update the post in the local state
          setPosts((prev) =>
            prev.map((post) =>
              post.id === postId
                ? { ...post, isLocked: !currentLockStatus }
                : post
            )
          );
        } else {
          console.error("Failed to toggle lock status:", data.error);
        }
      } catch (error) {
        console.error("Error toggling lock status:", error);
      }
    },
    []
  );

  // Delete post function
  const deletePost = useCallback(async (postId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:3001/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the post from the local state
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } else {
        console.error("Failed to delete post:", data.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, []);

  const handleClosePost = (postId: string, currentLockStatus: boolean) => {
    toggleClosePost(postId, currentLockStatus);
    handlePostMenuClose();
  };

  const handleEditPost = (postId: string) => {
    // Navigate to edit post page
    window.location.hash = `#/edit-post/${postId}`;
    handlePostMenuClose();
  };

  const handleDeletePost = (postId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      deletePost(postId);
      handlePostMenuClose();
    }
  };

  const getPostStatusColor = (post: ForumPost) => {
    if (post.isPinned) return colors.accent;
    if (post.isHot) return "#ff6b35";
    return colors.secondary;
  };

  const getPostStatusIcon = (post: ForumPost) => {
    if (post.isPinned) return <PushPin />;
    if (post.isHot) return <TrendingUp />;
    return null;
  };

  // Check if user can see the three-dot menu
  const canShowPostMenu = (post: ForumPost) => {
    if (!user) return false;

    const isAdmin = user.role === "ADMIN";
    const isAuthor = post.author === (user.firstName || user.username);

    return isAdmin || isAuthor;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
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
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo/Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Forum sx={{ color: colors.accent, fontSize: 28 }} />
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
              Ubuntu-Project Forum
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
              Welcome, {user?.firstName || user?.username || "User"}!
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
          onClick={() => {
            window.location.hash = "#/profile";
            handleProfileMenuClose();
          }}
          sx={{
            color: colors.textColorLight,
            "&:hover": {
              backgroundColor: colors.accent + "10",
            },
          }}
        >
          <AccountCircle sx={{ mr: 2, color: colors.accent }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleProfileMenuClose}
          sx={{
            color: colors.textColorLight,
            "&:hover": {
              backgroundColor: colors.accent + "10",
            },
          }}
        >
          <Settings sx={{ mr: 2, color: colors.accent }} />
          Settings
        </MenuItem>
        {user && "role" in user && user.role === "ADMIN" && (
          <MenuItem
            onClick={() => {
              setIsCategoryManagerOpen(true);
              handleProfileMenuClose();
            }}
            sx={{
              color: colors.textColorLight,
              "&:hover": {
                backgroundColor: colors.accent + "10",
              },
            }}
          >
            <Category sx={{ mr: 2, color: colors.accent }} />
            Manage Categories
          </MenuItem>
        )}
        <Divider sx={{ backgroundColor: colors.secondary + "20" }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: colors.textColorLight,
            "&:hover": {
              backgroundColor: "#f44336" + "10",
            },
          }}
        >
          <Logout sx={{ mr: 2, color: "#f44336" }} />
          Logout
        </MenuItem>
      </Menu>

      <Container maxWidth="xl" sx={{ paddingTop: 2, paddingBottom: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                marginTop: 3,
                textAlign: "center",
                color: colors.secondary,
                mb: 4,
              }}
            >
              {t.forum?.subtitle ||
                "Connect, Learn, and Share with the Ubuntu Community"}
            </Typography>

            {/* Search Bar */}
            <Box sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
              <TextField
                fullWidth
                placeholder={
                  t.forum?.searchPlaceholder || "Search discussions..."
                }
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.background.light,
                    borderRadius: 3,
                    "& fieldset": {
                      borderColor: colors.secondary,
                    },
                    "&:hover fieldset": {
                      borderColor: colors.accent,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.accent,
                    },
                    "& input": {
                      color:
                        currentTheme === "darknight"
                          ? colors.textColorLight
                          : colors.textColorDark,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                  endAdornment:
                    searchQuery && isSearching ? (
                      <InputAdornment position="end">
                        <CircularProgress
                          size={20}
                          sx={{ color: colors.accent }}
                        />
                      </InputAdornment>
                    ) : null,
                }}
              />
            </Box>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Main Content */}
          <Box sx={{ flex: { xs: 1, lg: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Tabs - Fixed at top */}
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: colors.background.dark,
                  mb: 3,
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: colors.background.light,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    sx={{
                      "& .MuiTab-root": {
                        color: colors.secondary,
                        "&.Mui-selected": {
                          color: colors.accent,
                        },
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: colors.accent,
                      },
                    }}
                  >
                    <Tab label={t.forum?.tabs?.recent || "Recent"} />
                    <Tab label={t.forum?.tabs?.hot || "Hot"} />
                    <Tab label={t.forum?.tabs?.pinned || "Pinned"} />
                  </Tabs>
                </Paper>
              </Box>

              {/* Forum Posts - Scrollable */}
              <Box
                sx={{
                  maxHeight: "calc(100vh - 200px)",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: colors.background.dark,
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.secondary,
                    borderRadius: "3px",
                    "&:hover": {
                      backgroundColor: colors.accent,
                    },
                  },
                }}
              >
                <Stack spacing={2}>
                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 6,
                        gap: 2,
                      }}
                    >
                      <CircularProgress
                        size={40}
                        sx={{ color: colors.accent }}
                      />
                      <Typography
                        sx={{
                          color: colors.secondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        {isSearching
                          ? "Searching posts..."
                          : "Loading posts..."}
                      </Typography>
                    </Box>
                  ) : (
                    posts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card
                          onClick={() =>
                            (window.location.hash = `#/post/${post.id}`)
                          }
                          sx={{
                            backgroundColor: post.isPinned
                              ? colors.accent + "10"
                              : colors.background.light,
                            borderRadius: 2,
                            border: post.isPinned
                              ? `2px solid ${colors.accent}`
                              : `1px solid ${colors.secondary}20`,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            position: "relative",
                            "&:hover": {
                              borderColor: colors.accent,
                              transform: "translateY(-2px)",
                              boxShadow: `0 8px 25px ${colors.accent}20`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                              }}
                            >
                              {/* Author Avatar */}
                              <Avatar
                                sx={{
                                  bgcolor: colors.accent,
                                  color: colors.textColorLight,
                                  fontWeight: "bold",
                                }}
                              >
                                {post.authorAvatar}
                              </Avatar>

                              {/* Post Content */}
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  {getPostStatusIcon(post) && (
                                    <IconButton
                                      size="small"
                                      sx={{ color: getPostStatusColor(post) }}
                                    >
                                      {getPostStatusIcon(post)}
                                    </IconButton>
                                  )}
                                  {post.isLocked && (
                                    <Chip
                                      label="CLOSED"
                                      size="small"
                                      sx={{
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  )}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: colors.textColorLight,
                                      fontWeight: "bold",
                                      flex: 1,
                                    }}
                                  >
                                    {post.title}
                                  </Typography>
                                  <Chip
                                    label={post.category}
                                    size="small"
                                    sx={{
                                      backgroundColor: colors.accent + "20",
                                      color: colors.accent,
                                      fontWeight: "bold",
                                    }}
                                  />
                                  {canShowPostMenu(post) && (
                                    <IconButton
                                      size="small"
                                      onClick={(e) =>
                                        handlePostMenuOpen(e, post.id)
                                      }
                                      sx={{
                                        color: colors.secondary,
                                        "&:hover": {
                                          backgroundColor: colors.accent + "10",
                                          color: colors.accent,
                                        },
                                      }}
                                    >
                                      <MoreVert />
                                    </IconButton>
                                  )}
                                </Box>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: colors.secondary,
                                    mb: 2,
                                    lineHeight: 1.6,
                                  }}
                                >
                                  {post.content}
                                </Typography>

                                {/* Tags */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    mb: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {post.tags.map((tag) => (
                                    <Chip
                                      key={tag}
                                      label={`#${tag}`}
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          colors.background.medium,
                                        color: colors.textColorLight,
                                        fontSize: "0.75rem",
                                      }}
                                    />
                                  ))}
                                </Box>

                                {/* Post Stats */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: colors.background.medium,
                                      }}
                                    >
                                      <Message sx={{ fontSize: 14 }} />
                                    </Avatar>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: colors.secondary }}
                                    >
                                      {post.replies}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Visibility
                                      sx={{
                                        fontSize: 16,
                                        color: colors.secondary,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{ color: colors.secondary }}
                                    >
                                      {post.views}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <ThumbUp
                                      sx={{
                                        fontSize: 16,
                                        color: colors.accent,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{ color: colors.accent }}
                                    >
                                      {post.likes}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: colors.secondary, ml: "auto" }}
                                  >
                                    {post.lastActivity}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}

                  {/* Load More Button */}
                  {hasMorePosts && !isLoading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <Button
                        variant="outlined"
                        onClick={loadMorePosts}
                        disabled={isLoadingMore}
                        sx={{
                          borderColor: colors.accent,
                          color: colors.accent,
                          "&:hover": {
                            borderColor: colors.accent,
                            backgroundColor: `${colors.accent}10`,
                          },
                        }}
                      >
                        {isLoadingMore ? "Loading..." : "Load More Posts"}
                      </Button>
                    </Box>
                  )}

                  {/* Loading More Indicator */}
                  {isLoadingMore && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 2 }}
                    >
                      <CircularProgress
                        size={24}
                        sx={{ color: colors.accent }}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>
            </motion.div>
          </Box>

          {/* Sidebar - Fixed */}
          <Box
            sx={{
              flex: { xs: 1, lg: 1 },
              position: "sticky",
              top: 80, // Account for sticky tabs
              height: "calc(100vh - 100px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: colors.background.dark,
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: colors.secondary,
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: colors.accent,
                },
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Stack spacing={3}>
                {/* Create New Post Button */}
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => (window.location.hash = "#/create-post")}
                  sx={{
                    backgroundColor: colors.accent,
                    color: colors.textColorLight,
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: colors.highlight,
                    },
                  }}
                >
                  {t.forum?.createPost || "Create New Post"}
                </Button>
                {/* Categories */}
                <Card
                  sx={{
                    backgroundColor: colors.background.light,
                    borderRadius: 2,
                    border: `1px solid ${colors.secondary}20`,
                    maxHeight: showAllCategories ? "none" : 400,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardHeader
                    title={t.forum?.categories?.title || "Categories"}
                    sx={{
                      "& .MuiCardHeader-title": {
                        color: colors.textColorLight,
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <CardContent sx={{ flex: 1, overflow: "hidden", p: 0 }}>
                    {categoriesLoading ? (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography sx={{ color: colors.secondary }}>
                          Loading categories...
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          maxHeight: showAllCategories ? "none" : 300,
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: colors.background.dark,
                            borderRadius: "3px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: colors.secondary + "40",
                            borderRadius: "3px",
                            "&:hover": {
                              backgroundColor: colors.secondary + "60",
                            },
                          },
                        }}
                      >
                        <List sx={{ p: 2 }}>
                          {(showAllCategories
                            ? categories
                            : categories.slice(0, 5)
                          ).map((category) => (
                            <Tooltip
                              key={category.id}
                              title={
                                category.description ||
                                "No description available"
                              }
                              placement="right"
                              arrow
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: colors.background.light,
                                    color: colors.textColorLight,
                                    border: `1px solid ${colors.accent}20`,
                                    fontSize: "0.9rem",
                                    maxWidth: 300,
                                  },
                                },
                                arrow: {
                                  sx: {
                                    color: colors.background.light,
                                  },
                                },
                              }}
                            >
                              <ListItem
                                onClick={() =>
                                  handleCategoryClick(category.name)
                                }
                                sx={{
                                  borderRadius: 1,
                                  mb: 1,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  backgroundColor:
                                    activeCategory === category.name
                                      ? colors.accent + "20"
                                      : "transparent",
                                  border:
                                    activeCategory === category.name
                                      ? `1px solid ${colors.accent}`
                                      : "1px solid transparent",
                                  "&:hover": {
                                    backgroundColor:
                                      activeCategory === category.name
                                        ? colors.accent + "30"
                                        : colors.accent + "10",
                                  },
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: category.color,
                                      color: colors.textColorLight,
                                    }}
                                  >
                                    {category.icon}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={category.name}
                                  secondary={`${category.postCount} posts`}
                                  slotProps={{
                                    primary: {
                                      color: colors.textColorLight,
                                      fontWeight: "bold",
                                    },
                                    secondary: {
                                      color: colors.secondary,
                                    },
                                  }}
                                />
                              </ListItem>
                            </Tooltip>
                          ))}
                        </List>

                        {categories.length > 5 && !showAllCategories && (
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderTop: `1px solid ${colors.secondary}20`,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() => setShowAllCategories(true)}
                              sx={{
                                color: colors.accent,
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: colors.accent + "10",
                                },
                              }}
                            >
                              Load more ({categories.length - 5} more)
                            </Button>
                          </Box>
                        )}

                        {showAllCategories && categories.length > 5 && (
                          <Box
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderTop: `1px solid ${colors.secondary}20`,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() => setShowAllCategories(false)}
                              sx={{
                                color: colors.secondary,
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: colors.secondary + "10",
                                },
                              }}
                            >
                              Show less
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card
                  sx={{
                    backgroundColor: colors.background.light,
                    borderRadius: 2,
                    border: `1px solid ${colors.secondary}20`,
                  }}
                >
                  <CardHeader
                    title={t.forum?.stats?.title || "Community Stats"}
                    sx={{
                      "& .MuiCardHeader-title": {
                        color: colors.textColorLight,
                        fontWeight: "bold",
                      },
                    }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: colors.secondary }}
                        >
                          {t.forum?.stats?.members || "Members"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.accent, fontWeight: "bold" }}
                        >
                          1,234
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: colors.secondary }}
                        >
                          {t.forum?.stats?.posts || "Posts"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.accent, fontWeight: "bold" }}
                        >
                          5,678
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: colors.secondary }}
                        >
                          {t.forum?.stats?.online || "Online Now"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: colors.accent, fontWeight: "bold" }}
                        >
                          89
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
          </Box>
        </Box>
      </Container>

      {/* Post Menu */}
      <Menu
        anchorEl={postMenuAnchor}
        open={Boolean(postMenuAnchor)}
        onClose={handlePostMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.background.light,
            border: `1px solid ${colors.accent}20`,
            mt: 1,
            minWidth: 150,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {selectedPostId &&
          (() => {
            const post = posts.find((p) => p.id === selectedPostId);
            if (!post || !user) return null;

            const isAdmin = user.role === "ADMIN";
            const isAuthor = post.author === (user.firstName || user.username);

            return (
              <>
                {/* Pin/Unpin - Admin only */}
                {isAdmin && (
                  <MenuItem
                    onClick={() => handlePinPost(post.id, post.isPinned)}
                    sx={{
                      color: colors.textColorLight,
                      "&:hover": {
                        backgroundColor: colors.accent + "10",
                      },
                    }}
                  >
                    <PushPin sx={{ mr: 2, color: colors.accent }} />
                    {post.isPinned ? "Unpin Post" : "Pin Post"}
                  </MenuItem>
                )}

                {/* Close/Unclose - Admin only */}
                {isAdmin && (
                  <MenuItem
                    onClick={() => handleClosePost(post.id, post.isLocked)}
                    sx={{
                      color: colors.textColorLight,
                      "&:hover": {
                        backgroundColor: colors.accent + "10",
                      },
                    }}
                  >
                    {post.isLocked ? (
                      <>
                        <LockOpen sx={{ mr: 2, color: colors.accent }} />
                        Open Post
                      </>
                    ) : (
                      <>
                        <Lock sx={{ mr: 2, color: colors.accent }} />
                        Close Post
                      </>
                    )}
                  </MenuItem>
                )}

                {/* Edit - Admin or Author */}
                {(isAdmin || isAuthor) && (
                  <MenuItem
                    onClick={() => handleEditPost(post.id)}
                    sx={{
                      color: colors.textColorLight,
                      "&:hover": {
                        backgroundColor: colors.accent + "10",
                      },
                    }}
                  >
                    <Edit sx={{ mr: 2, color: colors.accent }} />
                    Edit Post
                  </MenuItem>
                )}

                {/* Delete - Admin or Author */}
                {(isAdmin || isAuthor) && (
                  <>
                    <Divider
                      sx={{ backgroundColor: colors.secondary + "20" }}
                    />
                    <MenuItem
                      onClick={() => handleDeletePost(post.id)}
                      sx={{
                        color: "#f44336",
                        "&:hover": {
                          backgroundColor: "#f44336" + "10",
                        },
                      }}
                    >
                      <Delete sx={{ mr: 2, color: "#f44336" }} />
                      Delete Post
                    </MenuItem>
                  </>
                )}
              </>
            );
          })()}
      </Menu>

      {/* Category Manager Dialog */}
      <CategoryManager
        open={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />
    </Box>
  );
};

export default ForumMainpage;
