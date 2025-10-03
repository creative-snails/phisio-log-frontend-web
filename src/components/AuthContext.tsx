import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id?: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");

  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
    setLoading(false);
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("auth_user", JSON.stringify(u));
    else localStorage.removeItem("auth_user");
  };

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const fakeUser = { id: "1", name: "Demo User", email: data.email };
      persistUser(fakeUser);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const fakeUser = { id: "2", name: data.name, email: data.email };
      persistUser(fakeUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    persistUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
};
