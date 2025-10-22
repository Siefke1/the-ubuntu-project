import { motion } from "framer-motion";
import React from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import {
  KeyboardArrowDown,
  People,
  FlashOn,
  Diversity1,
} from "@mui/icons-material";
import { ThemeProvider } from "./context/ThemeProvider";
import { useTheme } from "./hooks/useTheme";
import ThemeSwitcher from "./components/ThemeSwitcher";

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
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          color: 'red', 
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { currentTheme, setTheme, colors } = useTheme();

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
      }}
    >
      <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setTheme} />
      {/* Hero Section */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          scrollSnapAlign: "start",
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
              fontSize: { xs: "1.5rem", md: "3rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: 3,
              opacity: 0.6,
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
            style={{ marginBottom: 0, lineHeight: 0.3 }}
          >
            Welcome to the
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "6rem" },
              fontWeight: "bold",
              textAlign: "center",
              mb: 3,
              color:
                currentTheme === "darknight"
                  ? colors.textColorLight
                  : colors.textColorDark,
            }}
          >
            Ubuntu-Project
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
              mb: 4,
              color: colors.secondary,
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Ever wanted to own a company? Our idea is simple. <br /> We founded
            an online company and for now we provide this platform. If you sign
            up on our platform, you become an owner of the company. And whatever
            income our shared little business generates, everyone will get their
            equal share. You, us and everyone else. No smallprint, no catches.
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
            sx={{
              fontSize: "1.2rem",
              px: 4,
              py: 2,
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
            Got your curiosity?
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

      {/* About Section */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
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
                mb: 3,
                fontWeight: "bold",
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              Here's the plan...
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.5rem",
                textAlign: "center",
                lineHeight: 1,
                mb: 4,
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
              }}
            >
              We believe that sustainable wealth isn’t in fast profits — it’s in
              ownership. <br /> Online, that means owning our data and the
              spaces we build together.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.5rem",
                textAlign: "center",
                lineHeight: 1,
                mb: 4,
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
              }}
            >
              The trade of data for “free” access to services might seem fair,
              <br /> but what if there was a space where we own the data we
              create <br /> and could therefore decide what to do with it for
              ourselves?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.5rem",
                textAlign: "center",
                lineHeight: 1,
                mb: 4,
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
              }}
            >
              We’ve started by creating a forum, a Discord Server, and a GitHub
              Repository — open spaces that allow us to exchange ideas and
              collaborate. Join if you wish. Every voice helps build what comes
              next.
            </Typography>
          </motion.div>
        </Container>
      </Box>
      {/* About Section 2 */}
      <Box
        sx={{
          height: "100vh",
          display: "flex",
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
                mb: 3,
                fontWeight: "bold",
                color: colors.textColorLight,
              }}
            >
              Something important to us:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: "1.5rem",
                mb: 4,
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
              }}
            >
              Our aim is not to design a system that ties contribution to
              personal financial reward. We believe that true prosperity exists
              only at the collective level — and we are committed to preserving
              that principle. For us and for you. This doesn’t mean there’s no
              hierarchy at all. For now, we — the founders — act as
              administrators of the platform, servers, and repositories, serving
              as the company’s functional leadership. In the long run, we aim to
              establish a more distributed model — electing spokespersons by
              area of expertise and making key decisions collectively.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 4,
                opacity: 0.6,
                fontSize: "1.5rem",
                fontWeight: "bold",
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
              }}
            >
              Working for us is not mandatory and will never be. <br /> But we
              want you to see this as your company as well.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          height: "100vh",
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
                mb: 2,
                fontWeight: "bold",
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              What can you do?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 8,
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
                opacity: 0.6,
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              So in case you do want to help to get our business started, we
              have a few ideas we would like to discuss with you. But for
              starters, we have thought of a simple 3 step plan, on how to
              proceed from here:
            </Typography>
          </motion.div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {[
              {
                icon: (
                  <People sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: "Sign up",
                description:
                  "Our first goal is to achieve a certain amount of registrated users. Our strength will come from numbers. And our resource will be ourselves.",
              },
              {
                icon: (
                  <Diversity1
                    sx={{ fontSize: "2rem", color: colors.secondary }}
                  />
                ),
                title: "Tell your Friends",
                description:
                  "Tell people about us. There is literally no downside to signing up, there is no mandatory tasks anyone must do. But this is your company now too.",
              },
              {
                icon: (
                  <FlashOn sx={{ fontSize: "2rem", color: colors.secondary }} />
                ),
                title: "Generate traffic",
                description:
                  "One daily visit would already help. You could save us as your browser's homepage. If we have traffic, we have attention and if we have attention we will be able to decide what to do with it.",
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
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
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
                      sx={{ color: colors.secondary }}
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
          height: "100vh",
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
                mb: 2,
                fontWeight: "bold",
                color:
                  currentTheme === "darknight"
                    ? colors.textColorLight
                    : colors.textColorDark,
              }}
            >
              How it's going so far?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 8,
                color: "#666",
              }}
            >
              We have launched in October 2025 and these are our current
              numbers.
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
              gap: 4,
            }}
          >
            {[
              { number: "1337", label: "Registered Users" },
              { number: "24887", label: "Daily Visits" },
              { number: "47.9%", label: "User contribution" },
              { number: "0$", label: "Income generated" },
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
                    p: 3,
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.light} 100%)`,
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      color: colors.textColorLight,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: colors.textColorLight }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          height: "100vh",
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
                mb: 3,
                fontWeight: "bold",
                color: colors.textColorLight,
              }}
            >
              Care to join us?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 4,
                opacity: 0.9,
              }}
            >
              Worst case this will have zero impact on your life. <br /> Best
              case, we will build something unprecedented. <br /> Our choice.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.background.dark,
                  color: colors.textColorLight,
                  border: `1px solid ${colors.accent}`,
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
                Sign up
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
                About Us
              </Button>
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
              © 2024 Your Company. All rights reserved. Built with ❤️ and modern
              web technologies.
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
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
