import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default ProtectedRoute;