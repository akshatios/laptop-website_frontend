import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Saved from "../pages/Saved";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ProductDetail from "../pages/ProductDetail";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import Login from "../pages/Login";
import GoogleCallback from "../pages/GoogleCallback";
import AdminApp from "../admin/AdminApp";

const isAdminLoggedIn = () => !!localStorage.getItem('admin_token');

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={isAdminLoggedIn() ? <Navigate to="/admin" replace /> : <Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
