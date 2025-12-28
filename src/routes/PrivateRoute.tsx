import React, { type ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "~/components/AuthContext";

type PrivateRouteProps = {
  children: ReactElement;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
