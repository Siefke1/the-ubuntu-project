import { motion } from "framer-motion";
import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
  Link,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown,
  People,
  FlashOn,
  Diversity1,
} from "@mui/icons-material";
import {
  HashRouter as Router,
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import { getTranslations } from "./texts/translations";
// import ThemeSwitcher from "./components/ThemeSwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { lazy, Suspense } from "react";
import AuthGuard from "./components/AuthGuard";

// Lazy load components for code splitting
const SignUp = lazy(() => import("./components/SignUp"));
const Login = lazy(() => import("./components/Login"));
const ForumMainpage = lazy(() => import("./components/ForumMainpage"));
const CreatePost = lazy(() => import("./components/CreatePost"));
const PostView = lazy(() => import("./components/PostView"));

// Loading spinner component
const LoadingSpinner = () => {
  const { colors } = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.background.medium} 50%, ${colors.background.light} 100%)`,
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: colors.accent,
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: colors.textColorLight,
          textAlign: "center",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            color: "red",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { currentTheme, colors } = useTheme();
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Scroll-based light animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector("[data-scroll-container]");
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollProgress = Math.min(scrollTop / scrollHeight, 1);

      document.documentElement.style.setProperty(
        "--scroll-progress",
        scrollProgress.toString()
      );
    };

    const scrollContainer = document.querySelector("[data-scroll-container]");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Box
      data-scroll-container
      sx={{
        height: { xs: "100dvh", md: "100vh" },
        overflowY: "auto",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
        width: "100vw",
        maxWidth: "100vw",
        position: "relative",
      }}
    >
      {/* <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setTheme} /> */}
      <LanguageSwitcher />
      {/* Welcome Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "visible",
          scrollSnapAlign: "start",
          "&::before": {
            content: '""',
            position: "fixed",
            top: "calc(-250px + var(--scroll-progress, 0) * 100vh)",
            right: "calc(-250px + var(--scroll-progress, 0) * -100vw)",
            width: { md: "1400px", xs: "1000px" },
            height: "1400px",
            background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 1,
            transition: "all 0.3s ease-out",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.8rem", md: "3rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: { xs: 1, md: 3 },
              opacity: 0.6,
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
            style={{ marginBottom: 0, lineHeight: 0.3 }}
          >
            {t.welcome.welcome}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "6rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: { xs: 2, md: 3 },
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
          >
            {t.welcome.title}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              color: colors.secondary,
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1 },
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: t.welcome.description }} />
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textAlign: "center" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              // Find the first visible about section (works for both desktop and mobile)
              const aboutSections = document.querySelectorAll(
                '[data-section="about"]'
              );
              if (aboutSections.length > 0) {
                // On mobile, there might be multiple about sections, 
                // but only one is visible at a time due to responsive display
                const visibleSection = Array.from(aboutSections).find(section => {
                  const style = window.getComputedStyle(section);
                  return style.display !== 'none';
                });
                
                if (visibleSection) {
                  visibleSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  // Fallback to first section
                  aboutSections[0].scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              px: { xs: 3, md: 4 },
              py: { xs: 1.5, md: 2 },
              background: `linear-gradient(45deg, ${colors.light} 30%, ${colors.background.medium} 90%)`,
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
              border: `1px solid ${colors.accent}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.background.dark} 30%, ${colors.light} 90%)`,
                color: colors.accent,
                textShadow:
                  currentTheme === "darknight"
                    ? `0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}, 0 0 30px ${colors.accent}`
                    : "none",
                boxShadow:
                  currentTheme === "darknight"
                    ? `0 0 20px ${colors.accent}40`
                    : `0 4px 15px ${colors.accent}30`,
              },
            }}
          >
            {t.welcome.button}
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <IconButton sx={{ color: "#999" }}>
              <KeyboardArrowDown sx={{ fontSize: "2rem" }} />
            </IconButton>
          </motion.div>
        </motion.div>
      </Box>

      {/* About Section - Desktop: Single section, Mobile: Split into 3 sections */}
      {/* Desktop: Single About Section */}
      <Box
        data-section="about"
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          color: "white",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3000px",
            height: "3000px",
            background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              {t.about.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about.paragraph1 }} />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about.paragraph2 }} />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              {t.about.paragraph3}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About Section 1 - Title + Paragraph 1 */}
      <Box
        data-section="about"
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          color: "white",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3000px",
            height: "3000px",
            background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              {t.about.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about.paragraph1 }} />
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About Section 2 - Paragraph 2 */}
      <Box
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          color: "white",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3000px",
            height: "3000px",
            background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about.paragraph2 }} />
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About Section 3 - Paragraph 3 */}
      <Box
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          color: "white",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "3000px",
            height: "3000px",
            background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                textAlign: "center",
                lineHeight: { xs: 1.4, md: 1 },
                mb: { xs: 3, md: 4 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                px: { xs: 2, md: 0 },
              }}
            >
              {t.about.paragraph3}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          scrollSnapAlign: "start",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-100px" }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 2 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              {t.howTo.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 8 },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                maxWidth: { xs: "90%", md: "800px" },
                mx: "auto",
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.howTo.description }} />
            </Typography>
          </motion.div>

          {/* Desktop: Show cards in same section */}
          <Box
            sx={{
              display: { xs: "none", md: "grid" },
              gridTemplateColumns: {
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 6,
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            {[
              {
                icon: (
                  <People sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: t.howTo.cards.signup.title,
                description: t.howTo.cards.signup.description,
              },
              {
                icon: (
                  <Diversity1
                    sx={{ fontSize: "2rem", color: colors.secondary }}
                  />
                ),
                title: t.howTo.cards.friends.title,
                description: t.howTo.cards.friends.description,
              },
              {
                icon: (
                  <FlashOn sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: t.howTo.cards.traffic.title,
                description: t.howTo.cards.traffic.description,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ margin: "-50px" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: colors.background.light,
                    border: `1px solid ${colors.light}`,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        currentTheme === "darknight"
                          ? `0 8px 25px ${colors.accent}40`
                          : `0 8px 25px ${colors.accent}20`,
                      borderColor: colors.accent,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.2, md: 3 } }}>
                    <Box sx={{ mb: { xs: 0.8, md: 2 } }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: { xs: 0.8, md: 2 },
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color:
                          currentTheme === "darknight"
                            ? colors.textColorLight
                            : colors.textColorDark,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.secondary,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        lineHeight: { xs: 1.2, md: 1.6 },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Mobile: Cards Section */}
      <Box
        sx={{
          height: { xs: "90dvh", md: "100vh" },
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          scrollSnapAlign: "start",
          py: { xs: 2, md: 0 },
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: { xs: 2, md: 3 },
              px: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {[
              {
                icon: (
                  <People sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: t.howTo.cards.signup.title,
                description: t.howTo.cards.signup.description,
              },
              {
                icon: (
                  <Diversity1
                    sx={{ fontSize: "2rem", color: colors.secondary }}
                  />
                ),
                title: t.howTo.cards.friends.title,
                description: t.howTo.cards.friends.description,
              },
              {
                icon: (
                  <FlashOn sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: t.howTo.cards.traffic.title,
                description: t.howTo.cards.traffic.description,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ margin: "-50px" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: colors.background.light,
                    border: `1px solid ${colors.light}`,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        currentTheme === "darknight"
                          ? `0 8px 25px ${colors.accent}40`
                          : `0 8px 25px ${colors.accent}20`,
                      borderColor: colors.accent,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.2, md: 3 } }}>
                    <Box sx={{ mb: { xs: 0.8, md: 2 } }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: { xs: 0.8, md: 2 },
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", md: "1.5rem" },
                        color:
                          currentTheme === "darknight"
                            ? colors.textColorLight
                            : colors.textColorDark,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.secondary,
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        lineHeight: { xs: 1.2, md: 1.6 },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-100px" }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 2 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              {t.stats.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 8 },
                color: "#666",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                px: { xs: 2, md: 0 },
              }}
            >
              {t.stats.description}
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 3, md: 4 },
              px: { xs: 2, md: 0 },
            }}
          >
            {[
              { number: "1337", label: t.stats.users },
              { number: "24887", label: t.stats.visits },
              { number: "47.9%", label: t.stats.contribution },
              { number: "0$", label: t.stats.income },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ margin: "-50px" }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 2, md: 3 },
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${
                      currentTheme === "darknight"
                        ? colors.background.light
                        : colors.background.dark
                    } 0%, ${
                      currentTheme === "darknight"
                        ? colors.light
                        : colors.secondary
                    } 100%)`,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: { xs: 0.5, md: 1 },
                      color: colors.textColorLight,
                      fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.textColorLight,
                      fontSize: { xs: "0.9rem", md: "1.2rem" },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* About Section 2 - Desktop: Single section, Mobile: Split into 3 sections */}
      {/* Desktop: Single About2 Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          backgroundColor:
            currentTheme === "darknight" ? "#999" : colors.background.dark,
          color: "white",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color: colors.textColorLight,
              }}
            >
              {t.about2.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about2.paragraph1 }} />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about2.paragraph2 }} />
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              {t.about2.paragraph3}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About2 Section 1 - Title + Paragraph 1 */}
      <Box
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          backgroundColor:
            currentTheme === "darknight" ? "#999" : colors.background.dark,
          color: "white",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color: colors.textColorLight,
              }}
            >
              {t.about2.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about2.paragraph1 }} />
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About2 Section 2 - Paragraph 2 */}
      <Box
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          backgroundColor:
            currentTheme === "darknight" ? "#999" : colors.background.dark,
          color: "white",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.about2.paragraph2 }} />
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Mobile: About2 Section 3 - Paragraph 3 */}
      <Box
        sx={{
          height: "100dvh",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          backgroundColor:
            currentTheme === "darknight" ? "#999" : colors.background.dark,
          color: "white",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              {t.about2.paragraph3}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.light} 100%)`,
          color: "white",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color: colors.textColorLight,
              }}
            >
              {t.cta.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
                opacity: 0.9,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: t.cta.description }} />
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1.5, md: 2 },
                justifyContent: "center",
                flexWrap: "wrap",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                px: { xs: 2, md: 0 },
              }}
            >
              <Button
                component={RouterLink}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.background.dark,
                  color: colors.textColorLight,
                  border: `1px solid ${colors.accent}`,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "300px", sm: "none" },
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: colors.background.medium,
                    color: colors.accent,
                    textShadow:
                      currentTheme === "darknight"
                        ? `0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}`
                        : "none",
                    boxShadow:
                      currentTheme === "darknight"
                        ? `0 0 15px ${colors.accent}40`
                        : `0 4px 15px ${colors.accent}30`,
                  },
                }}
              >
                {t.cta.signup}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.accent,
                  color:
                    currentTheme === "darknight"
                      ? colors.textColorLight
                      : colors.textColorDark,
                  backgroundColor: "transparent",
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: "300px", sm: "none" },
                  "&:hover": {
                    backgroundColor: colors.background.dark,
                    color: colors.accent,
                    textShadow:
                      currentTheme === "darknight"
                        ? `0 0 10px ${colors.accent}, 0 0 20px ${colors.accent}`
                        : "none",
                    boxShadow:
                      currentTheme === "darknight"
                        ? `0 0 15px ${colors.accent}40`
                        : `0 4px 15px ${colors.accent}30`,
                  },
                }}
              >
                {t.cta.about}
              </Button>
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.secondary,
                  fontSize: "0.9rem",
                }}
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: colors.accent,
                    textDecoration: "none",
                    fontWeight: "bold",
                    "&:hover": {
                      color: colors.highlight,
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{ py: 6, backgroundColor: colors.background.dark, color: "white" }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ margin: "-100px" }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#999",
              }}
            >
              {t.footer.copyright}
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppWithRouting />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

function AppWithRouting() {
  const location = useLocation();

  if (location.pathname === "/signup" || location.hash === "#/signup") {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUp />
      </Suspense>
    );
  }

  if (location.pathname === "/login" || location.hash === "#/login") {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    );
  }

  if (location.pathname === "/forum" || location.hash === "#/forum") {
    return (
      <AuthGuard>
        <Suspense fallback={<LoadingSpinner />}>
          <ForumMainpage />
        </Suspense>
      </AuthGuard>
    );
  }

  if (
    location.pathname === "/create-post" ||
    location.hash === "#/create-post"
  ) {
    return (
      <AuthGuard>
        <Suspense fallback={<LoadingSpinner />}>
          <CreatePost />
        </Suspense>
      </AuthGuard>
    );
  }

  if (
    location.pathname.startsWith("/post/") ||
    location.hash.startsWith("#/post/")
  ) {
    return (
      <AuthGuard>
        <Suspense fallback={<LoadingSpinner />}>
          <PostView />
        </Suspense>
      </AuthGuard>
    );
  }

  return <AppContent />;
}

export default App;
