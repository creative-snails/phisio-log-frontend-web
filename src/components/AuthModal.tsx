import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoginForm from "./signup/LoginForm";
import SignupForm from "./signup/SignupForm";

import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) setMode(initialMode);
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
    navigate("/home");
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="auth-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <FiX />
        </button>

        <div className="auth-modal-header">
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>
            Sign In
          </button>
          <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>
            Sign Up
          </button>
        </div>

        <div className="auth-modal-body">
          {mode === "login" ? (
            <>
              <LoginForm onSuccess={handleSuccess} />
              <p className="switch-text">
                Don’t have an account?{" "}
                <button className="link-btn" onClick={() => setMode("signup")}>
                  Create account
                </button>
              </p>
            </>
          ) : (
            <>
              <SignupForm onSuccess={handleSuccess} />
              <p className="switch-text">
                Already have an account?{" "}
                <button className="link-btn" onClick={() => setMode("login")}>
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
