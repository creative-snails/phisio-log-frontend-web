import React, { type ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "~/components/AuthContext";

type PrivateRouteProps = {
  children: ReactElement;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
