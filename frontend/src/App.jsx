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
import UsersPage from "./features/users/pages/UsersPage";
import EditUserPage from "./features/users/pages/EditUserPage";
import AddUserPage from "./features/users/pages/AddUserPage";
import MovementsPage from "./features/movements/pages/MovementsPage";
import RegisterMovement from "./features/movements/pages/RegisterMovement";
import ScanProducts from "./features/movements/pages/ScanProducts";
import MovementDetails from "./features/movements/pages/MovementDetails";
import PendingPage from "./features/pendingreviews/pages/PendingPage";
import PendingDetails from "./features/pendingreviews/pages/PendingDetails";

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

            <Route
              path="/movements"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MovementsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/movements/add"
              element={
                <ProtectedRoute>
                  <RegisterMovement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movements/scan"
              element={
                <ProtectedRoute>
                  <ScanProducts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movements/:id"
              element={
                <ProtectedRoute>
                  <MovementDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pendings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PendingPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pendings/:id"
              element={
                <ProtectedRoute>
                  <PendingDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UsersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/add"
              element={
                <ProtectedRoute>
                  <AddUserPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute>
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
