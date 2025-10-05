import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Import All Necessary Components and Pages
import NavbarMain from "./components/NavbarMain";
import NavbarPrivate from "./components/NavbarPrivate";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CodeReview from "./pages/CodeReview";
import CodeComments from "./pages/CodeComments";
import BugFinder from "./pages/BugFinder";
import MyTeam from "./pages/MyTeam";
import AssignedTasks from "./pages/AssignedTasks";
import Report from "./pages/Report";
import Notice from "./pages/Notice";

// This small helper component is responsible for "catching" the token from the URL
const AuthTokenHandler = () => {
  const location = useLocation();
  const { setToken } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, setToken]);

  return null; // This component renders nothing
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

function PageWrapper({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

function App() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="bg-[#0f0425] min-h-screen" />;
  }

  return (
    <div
      className="bg-[#0f0425] min-h-screen flex flex-col font-sans"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      <AuthTokenHandler />
      <ScrollToTop />
      {token ? <NavbarPrivate /> : <NavbarMain />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/code-review"
              element={
                <PageWrapper>
                  <CodeReview />
                </PageWrapper>
              }
            />
            <Route
              path="/code-comments"
              element={
                <PageWrapper>
                  <CodeComments />
                </PageWrapper>
              }
            />
            <Route
              path="/bug-finder"
              element={
                <PageWrapper>
                  <BugFinder />
                </PageWrapper>
              }
            />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="/my-team"
                element={
                  <PageWrapper>
                    <MyTeam />
                  </PageWrapper>
                }
              />
              <Route
                path="/assigned-tasks"
                element={
                  <PageWrapper>
                    <AssignedTasks />
                  </PageWrapper>
                }
              />
              <Route
                path="/report"
                element={
                  <PageWrapper>
                    <Report />
                  </PageWrapper>
                }
              />
              <Route
                path="/notice"
                element={
                  <PageWrapper>
                    <Notice />
                  </PageWrapper>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
