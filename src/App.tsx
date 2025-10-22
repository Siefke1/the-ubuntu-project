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
  const { currentTheme, setTheme, colors } = useTheme();

  return (
    <Box
      sx={{
        height: { xs: "100dvh", md: "100vh" },
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        background: `linear-gradient(135deg, ${colors.background.light} 0%, ${colors.background.medium} 100%)`,
      }}
    >
      <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setTheme} />
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
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
            Welcome to the
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
              mb: { xs: 3, md: 4 },
              color: colors.secondary,
              maxWidth: { xs: "90%", md: "700px" },
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
              px: { xs: 2, md: 0 },
              lineHeight: { xs: 1.4, md: 1 },
            }}
          >
            Ever wanted to own a company? Our idea is simple.{" "}
            <Box component="br" sx={{ display: { xs: "none", md: "block" } }} />{" "}
            We founded an online company and for now we provide this platform.
            By signing up, you become an equal shareholder — meaning every bit
            of revenue our little business generates is split equally among all
            of us. Simple as that. No fine print, no tricks.
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
              const aboutSection = document.querySelector(
                '[data-section="about"]'
              );
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
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
        data-section="about"
        sx={{
          height: { xs: "100dvh", md: "100vh" },
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
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
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
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
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
              We believe sustainable wealth isn't about fast profits — it's about
              {" "}<strong>ownership</strong>.{" "}
              <Box
                component="br"
                sx={{ display: { xs: "none", md: "block" } }}
              />{" "}
              Online, that means owning our data and the spaces we build
              together.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
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
              The trade of data for "free" access to services might seem fair,
              <Box
                component="br"
                sx={{ display: { xs: "none", md: "block" } }}
              />{" "}
              but we imagine a space used by everyone, where we actually own the
              data we create — and have the freedom to decide what happens to
              it.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
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
              We've started by creating a Forum, a Discord Server, and a GitHub
              Repository — open spaces that allow us to exchange ideas and
              collaborate. Join if you wish. Every voice helps build what comes
              next.
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
              What can you do?
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
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              If you are looking to help get our business running, we
              have a few ideas we would like to discuss with you. But for
              starters, we have thought of a simple <strong>3-Step-Plan</strong>, on how to
              proceed from here:
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
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: { xs: 1.5, md: 2 },
                        fontWeight: "bold",
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
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
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        lineHeight: { xs: 1.4, md: 1.6 },
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
          height: { xs: "100dvh", md: "100vh" },
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          scrollSnapAlign: "start",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 3,
              px: 2,
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
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ mb: { xs: 1.5, md: 2 } }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: { xs: 1.5, md: 2 },
                        fontWeight: "bold",
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
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
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        lineHeight: { xs: 1.4, md: 1.6 },
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
              How it's going so far?
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
              gap: { xs: 3, md: 4 },
              px: { xs: 2, md: 0 },
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
                    p: { xs: 2, md: 3 },
                    textAlign: "center",
                    background: `linear-gradient(135deg, ${colors.background.dark} 0%, ${colors.light} 100%)`,
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

            {/* About Section 2 */}
            <Box
        sx={{
          height: { xs: "100dvh", md: "100vh" },
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
                mb: { xs: 2, md: 3 },
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                color: colors.textColorLight,
              }}
            >
              Something important to us:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              Our aim is <strong>not</strong> to design a system that ties contribution to
              personal financial reward. We believe that true prosperity exists
              only at the <strong>collective level</strong> — and we are committed to preserving
              that principle. 
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              Also, this doesn't mean there's no hierarchy at all. For now, we — the founders — act as
              administrators of the platform, servers, and repositories, serving
              as the company's functional leadership. In the long run, we aim to
              establish a more distributed model — electing spokespersons by
              area of expertise and making key decisions collectively.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: { xs: 3, md: 4 },
                opacity: 0.6,
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                fontWeight: "bold",
                color:
                  currentTheme === "darknight" ? colors.textColorDark : "#ccc",
                px: { xs: 2, md: 0 },
                lineHeight: { xs: 1.4, md: 1.2 },
              }}
            >
              Working for us is not mandatory and will never be.{" "}
              <Box
                component="br"
                sx={{ display: { xs: "none", md: "block" } }}
              />{" "}
              But we want you to see this as your company as well.
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
              Care to join us?
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
              Worst case this will have zero impact on your life.{" "}
              <Box
                component="br"
                sx={{ display: { xs: "none", md: "block" } }}
              />{" "}
              Best case, we will build something unprecedented.{" "}
              <Box
                component="br"
                sx={{ display: { xs: "none", md: "block" } }}
              />{" "}
              <strong>Our choice.</strong>
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
