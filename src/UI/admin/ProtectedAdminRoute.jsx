import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}