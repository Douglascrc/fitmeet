import { useAuth } from "@/hooks/UseAuth";
import { Navigate, Outlet } from "react-router";

export function PrivateRoutes() {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
