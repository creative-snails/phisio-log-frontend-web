import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

import AuthModal from "~/components/AuthModal";
import HealthRecordForm from "~/components/forms/HealthRecordForm";
import Layout from "~/components/Layout";
import Home from "~/pages/Home";
import LandingPage from "~/pages/LandingPage";
import Reports from "~/pages/Reports";
import PrivateRoute from "~/routes/PrivateRoute";

function App() {
  const [authOpen, setAuthOpen] = useState<"login" | "signup" | null>(null);
  const handleOpenAuth = (mode?: "login" | "signup") => setAuthOpen(mode ?? "login");
  const handleCloseAuth = () => setAuthOpen(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route
            path="/"
            element={
              <>
                <LandingPage onOpenAuth={handleOpenAuth} />
              </>
            }
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout onOpenAuth={handleOpenAuth}>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/health-record"
            element={
              <PrivateRoute>
                <Layout onOpenAuth={handleOpenAuth}>
                  <HealthRecordForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/health-record/:id/edit"
            element={
              <PrivateRoute>
                <Layout onOpenAuth={handleOpenAuth}>
                  <HealthRecordForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout onOpenAuth={handleOpenAuth}>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
        <AuthModal isOpen={!!authOpen} initialMode={authOpen ?? "login"} onClose={handleCloseAuth} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
