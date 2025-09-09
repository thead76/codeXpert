import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import NavbarMain from "./components/NavbarMain";
import NavbarPrivate from "./components/NavbarPrivate";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CodeReview from "./pages/CodeReview";
import CodeComments from "./pages/CodeComments.jsx";
import BugFinder from "./pages/BugFinder";
import ImproveCode from "./pages/ImproveCode";
import Dashboard from "./pages/Dashboard.jsx";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Reusable transition settings
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

// ✅ Wrapper with scroll-to-top AFTER animation
function PageWrapper({ children }) {
  return (
    <motion.div
      {...pageTransition}
      onAnimationComplete={() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      {children}
    </motion.div>
  );
}

function Layout() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="bg-[#0f0425] min-h-screen flex flex-col font-inter">
      {/* ✅ Switch navbar */}
      {user ? <NavbarPrivate /> : <NavbarMain />}

      <main className="flex-1 font-serif">
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
            <Route
              path="/improve-code"
              element={
                <PageWrapper>
                  <ImproveCode />
                </PageWrapper>
              }
            />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PageWrapper>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </PageWrapper>
              }
            />
            {/* Add more private routes: /tasks, /projects, /reports */}
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;
