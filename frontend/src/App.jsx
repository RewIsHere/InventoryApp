import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import LoginPage from "@Auth/pages/LoginPage";
import ForgotPassword from "@Auth/pages/ForgotPassword";
import ResetPassword from "@Auth/pages/ResetPassword";
import DashboardPage from "@Dashboard/pages/DashboardPage";
import ProductsPage from "@Products/pages/ProductsPage";
import ProtectedRoute from "@Components/ProtectedRoute";
import PublicOnlyRoute from "@Components/PublicOnlyRoute"; // Importar el nuevo componente
import MainLayout from "@Layout/MainLayout";
import { ToastProvider } from "./shared/context/ToastContext";
import Test from "./Test";

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Ruta publicas */}
            <Route path="/" element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>} />
            <Route path="/forgot-password" element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>} />
            <Route path="/reset-password" element={
              <PublicOnlyRoute>
                <ResetPassword />
              </PublicOnlyRoute>} />
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>} />
            <Route path="/products" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProductsPage />
                  </MainLayout>
                </ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
