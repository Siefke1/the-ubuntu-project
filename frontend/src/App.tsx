import React from "react";
import {
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  HashRouter as Router,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { AuthProvider } from "./context/AuthProvider";
import { useTheme } from "./hooks/useTheme";
import { lazy, Suspense } from "react";
import AuthGuard from "./components/AuthGuard";
import HomePage from "./components/HomePage";

// Lazy load components for code splitting
const SignUp = lazy(() => import("./components/SignUp"));
const Login = lazy(() => import("./components/Login"));
const ForumMainpage = lazy(() => import("./components/ForumMainpage"));
const CreatePost = lazy(() => import("./components/CreatePost"));
const PostView = lazy(() => import("./components/PostView"));
const Profile = lazy(() => import("./components/Profile"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const AboutUs = lazy(() => import("./components/AboutUs"));

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

  if (location.pathname === "/profile" || location.hash === "#/profile") {
    return (
      <AuthGuard>
        <Suspense fallback={<LoadingSpinner />}>
          <Profile />
        </Suspense>
      </AuthGuard>
    );
  }

  if (
    location.pathname.startsWith("/user/") ||
    location.hash.startsWith("#/user/")
  ) {
    return (
      <AuthGuard>
        <Suspense fallback={<LoadingSpinner />}>
          <UserProfile />
        </Suspense>
      </AuthGuard>
    );
  }

  if (location.pathname === "/about" || location.hash === "#/about") {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AboutUs />
      </Suspense>
    );
  }

  return <HomePage />;
}

export default App;
