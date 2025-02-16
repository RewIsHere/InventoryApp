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
import AddProductPage from "./features/products/pages/AddProductPage";
import EditProductPage from "./features/products/pages/EditProductPage";
import Test from "./Test";
import ProductLayout from "./shared/components/layout/ProductLayout";
import ProductDetailsPage from "./features/products/pages/subpages/ProductDetailsPage";
import ProductHistoryPage from "./features/products/pages/subpages/ProductHistoryPage";
import ProductNotesPage from "./features/products/pages/subpages/ProductNotesPage";

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Ruta publicas */}
            <Route path="/test" element={<Test />} />
            <Route
              path="/"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicOnlyRoute>
                  <ResetPassword />
                </PublicOnlyRoute>
              }
            />
            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProductsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute>
                  <AddProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductDetailsPage />} />{" "}
              {/* ⬅️ Página principal (Overview) */}
              <Route path="history" element={<ProductHistoryPage />} />{" "}
              {/* ⬅️ /products/:id/specs */}
              <Route path="notes" element={<ProductNotesPage />} />{" "}
              {/* ⬅️ /products/:id/history */}
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
