import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";

import "~/App.css";
import { AuthProvider } from "~/components/AuthContext";
import AuthModal from "~/components/AuthModal";
import HealthRecordForm from "~/components/forms/HealthRecordForm";
import Layout from "~/components/Layout";
import Home from "~/pages/Home";
import LandingPage from "~/pages/LandingPage";
import Reports from "~/pages/Reports";

function App() {
  const [authOpen, setAuthOpen] = useState<"login" | "signup" | null>(null);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page for unauthenticated users */}
          <Route
            path="/"
            element={
              <>
                <LandingPage onOpenAuth={(mode) => setAuthOpen(mode ?? "login")} />
                <AuthModal isOpen={!!authOpen} initialMode={authOpen ?? "login"} onClose={() => setAuthOpen(null)} />
              </>
            }
          />

          {/* Protected routes wrapped with PrivateRoute */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/health-record"
            element={
              <PrivateRoute>
                <Layout>
                  <HealthRecordForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/health-record/:id/edit"
            element={
              <PrivateRoute>
                <Layout>
                  <HealthRecordForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Layout>
                  <Reports />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
