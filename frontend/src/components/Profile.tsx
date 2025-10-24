import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Edit,
  Lock,
  Description,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const { colors } = useTheme();

  // State for profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for form fields
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for UI
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Validation errors
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "",
    avatar: "",
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProfile(data.user);
        setBio(data.user.bio || "");
        setAvatar(data.user.avatar || "");
      } else {
        console.error("Failed to fetch profile:", data.error);
        setSnackbar({
          open: true,
          message: "Failed to load profile data",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setSnackbar({
        open: true,
        message: "Error loading profile data",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update bio
  const handleUpdateBio = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/auth/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbar({
          open: true,
          message: "Bio updated successfully",
          severity: "success",
        });
        setIsEditingBio(false);
        if (profile) {
          setProfile({ ...profile, bio });
        }
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update bio",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      setSnackbar({
        open: true,
        message: "Error updating bio",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update avatar
  const handleUpdateAvatar = async () => {
    // Basic URL validation - more flexible to handle various image hosting services
    if (avatar && !avatar.match(/^https?:\/\/.+/i)) {
      setErrors(prev => ({ ...prev, avatar: "Please enter a valid HTTPS URL" }));
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/auth/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbar({
          open: true,
          message: "Avatar updated successfully",
          severity: "success",
        });
        setIsEditingAvatar(false);
        if (profile) {
          setProfile({ ...profile, avatar });
        }
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to update avatar",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setSnackbar({
        open: true,
        message: "Error updating avatar",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Reset errors
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      bio: "",
      avatar: "",
    });

    // Validation
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      hasErrors = true;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      hasErrors = true;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3001/api/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSnackbar({
          open: true,
          message: "Password changed successfully",
          severity: "success",
        });
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to change password",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setSnackbar({
        open: true,
        message: "Error changing password",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      bio: "",
      avatar: "",
    });
  };

  // Cancel bio edit
  const handleCancelBioEdit = () => {
    setIsEditingBio(false);
    setBio(profile?.bio || "");
  };

  // Cancel avatar edit
  const handleCancelAvatarEdit = () => {
    setIsEditingAvatar(false);
    setAvatar(profile?.avatar || "");
    setErrors(prev => ({ ...prev, avatar: "" }));
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
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

  if (!profile) {
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
        <Typography variant="h6" sx={{ color: colors.textColorLight }}>
          Profile not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
        color: colors.textColorLight,
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => (window.location.hash = "#/forum")}
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
              variant="h4"
              sx={{
                color: colors.textColorLight,
                fontWeight: "bold",
              }}
            >
              Profile Settings
            </Typography>
          </Box>
        </motion.div>

        <Stack spacing={3}>
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card
              sx={{
                backgroundColor: colors.background.light,
                borderRadius: 3,
                border: `1px solid ${colors.accent}20`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                  <Avatar
                    src={profile.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: colors.accent,
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {profile.firstName?.charAt(0) || profile.username.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    >
                      {profile.firstName || profile.username}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.secondary, mb: 0.5 }}
                    >
                      @{profile.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.secondary }}
                    >
                      {profile.role} • Member since {new Date(profile.createdAt).getFullYear()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ backgroundColor: colors.secondary + "20", my: 3 }} />

                {/* Avatar Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ color: colors.accent, bgcolor: colors.accent + "20" }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: "bold",
                      }}
                    >
                      Profile Picture
                    </Typography>
                    {!isEditingAvatar && (
                      <IconButton
                        size="small"
                        onClick={() => setIsEditingAvatar(true)}
                        sx={{
                          color: colors.accent,
                          "&:hover": {
                            backgroundColor: colors.accent + "10",
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </Box>

                  {isEditingAvatar ? (
                    <Box>
                      <TextField
                        fullWidth
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="Enter image URL (https://...)"
                        error={!!errors.avatar}
                        helperText={errors.avatar}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.background.medium,
                            borderRadius: 2,
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
                              color: colors.textColorLight,
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: colors.secondary,
                          },
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleUpdateAvatar}
                          disabled={isSaving}
                          sx={{
                            backgroundColor: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.highlight,
                            },
                          }}
                        >
                          {isSaving ? "Saving..." : "Save Avatar"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelAvatarEdit}
                          disabled={isSaving}
                          sx={{
                            borderColor: colors.secondary,
                            color: colors.textColorLight,
                            "&:hover": {
                              borderColor: colors.accent,
                              backgroundColor: colors.accent + "10",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        color: avatar ? colors.textColorLight : colors.secondary,
                        fontStyle: avatar ? "normal" : "italic",
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {avatar || "No profile picture set. Click the edit button to add one."}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ backgroundColor: colors.secondary + "20", my: 3 }} />

                {/* Bio Section */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Description sx={{ color: colors.accent }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.textColorLight,
                        fontWeight: "bold",
                      }}
                    >
                      Bio
                    </Typography>
                    {!isEditingBio && (
                      <IconButton
                        size="small"
                        onClick={() => setIsEditingBio(true)}
                        sx={{
                          color: colors.accent,
                          "&:hover": {
                            backgroundColor: colors.accent + "10",
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </Box>

                  {isEditingBio ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: colors.background.medium,
                            borderRadius: 2,
                            "& fieldset": {
                              borderColor: colors.secondary,
                            },
                            "&:hover fieldset": {
                              borderColor: colors.accent,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: colors.accent,
                            },
                            "& textarea": {
                              color: colors.textColorLight,
                            },
                          },
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleUpdateBio}
                          disabled={isSaving}
                          sx={{
                            backgroundColor: colors.accent,
                            "&:hover": {
                              backgroundColor: colors.highlight,
                            },
                          }}
                        >
                          {isSaving ? "Saving..." : "Save Bio"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancelBioEdit}
                          disabled={isSaving}
                          sx={{
                            borderColor: colors.secondary,
                            color: colors.textColorLight,
                            "&:hover": {
                              borderColor: colors.accent,
                              backgroundColor: colors.accent + "10",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        color: bio ? colors.textColorLight : colors.secondary,
                        fontStyle: bio ? "normal" : "italic",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {bio || "No bio added yet. Click the edit button to add one."}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Password Change Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              sx={{
                backgroundColor: colors.background.light,
                borderRadius: 3,
                border: `1px solid ${colors.accent}20`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Lock sx={{ color: colors.accent }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.textColorLight,
                      fontWeight: "bold",
                    }}
                  >
                    Change Password
                  </Typography>
                </Box>

                {!isChangingPassword ? (
                  <Button
                    variant="outlined"
                    onClick={() => setIsChangingPassword(true)}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      "&:hover": {
                        borderColor: colors.accent,
                        backgroundColor: colors.accent + "10",
                      },
                    }}
                  >
                    Change Password
                  </Button>
                ) : (
                  <Box>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.background.medium,
                          "& fieldset": {
                            borderColor: colors.secondary,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.accent,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.accent,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: colors.secondary,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.accent,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.background.medium,
                          "& fieldset": {
                            borderColor: colors.secondary,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.accent,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.accent,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: colors.secondary,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.accent,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: colors.background.medium,
                          "& fieldset": {
                            borderColor: colors.secondary,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.accent,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.accent,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: colors.secondary,
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.accent,
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        sx={{
                          backgroundColor: colors.accent,
                          "&:hover": {
                            backgroundColor: colors.highlight,
                          },
                        }}
                      >
                        {isSaving ? "Changing..." : "Change Password"}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelPasswordChange}
                        disabled={isSaving}
                        sx={{
                          borderColor: colors.secondary,
                          color: colors.textColorLight,
                          "&:hover": {
                            borderColor: colors.accent,
                            backgroundColor: colors.accent + "10",
                          },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Stack>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            backgroundColor: colors.background.light,
            color: colors.textColorLight,
            "& .MuiAlert-icon": {
              color: snackbar.severity === "error" ? "#f44336" : colors.accent,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
