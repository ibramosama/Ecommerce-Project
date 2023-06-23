import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const token = localStorage.getItem('token')
  let auth = { token: token};
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
}