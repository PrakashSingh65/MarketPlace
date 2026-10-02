import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthToken } from "../api/axiosClient";
import toast from "react-hot-toast";

/**
 * ProtectedRoute component for Role-Based Access Control (RBAC).
 *
 * @param {Array<string>} allowedRoles - Array of allowed role names (e.g. ['supplier']). If empty, any authenticated user can enter.
 * @param {string} redirectTo - Route path to redirect when authenticated but role is unauthorized (default: '/').
 * @param {string} loginPath - Route path to redirect when unauthenticated (default: '/login').
 * @param {React.ReactNode} children - Optional wrapped children. If omitted, renders nested <Outlet />.
 */
export default function ProtectedRoute({
  allowedRoles = [],
  redirectTo = "/",
  loginPath = "/login",
  children,
}) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const token = getAuthToken() || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const hasNotifiedRef = useRef(false);

  const isAuth = isAuthenticated || !!token;
  const userRole = (user?.role || "").toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  const isRoleUnauthorized =
    !isLoading &&
    isAuth &&
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(userRole) &&
    userRole !== "admin";

  useEffect(() => {
    if (isRoleUnauthorized && !hasNotifiedRef.current) {
      toast.error("Access restricted: Supplier account required.");
      hasNotifiedRef.current = true;
    }
  }, [isRoleUnauthorized]);

  // Still resolving auth state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#070714] text-slate-200">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Non-authenticated user -> redirect to login with return path
  if (!isAuth) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`${loginPath}?redirect=${returnUrl}`}
        replace
        state={{ from: location }}
      />
    );
  }

  // Buyer or unauthorized role -> redirect to home /
  if (isRoleUnauthorized) {
    return <Navigate to={redirectTo} replace />;
  }

  // Authorized
  return children ? children : <Outlet />;
}
