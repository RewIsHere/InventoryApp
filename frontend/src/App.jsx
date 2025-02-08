import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import LoginPage from "./features/authentication/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import MainLayout from "./shared/components/layout/MainLayout";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública: Inicio de Sesión */}
          <Route path="/" element={<LoginPage />} />

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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;