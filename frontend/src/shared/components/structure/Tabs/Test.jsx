import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails"; // Página de detalles del producto

const App = () => {
  const [activeTab, setActiveTab] = useState("overview"); // Default tab

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "specs", label: "Specs" },
    { key: "reviews", label: "Reviews" },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/products/:id/details/:nombreDelTab"
          element={<ProductDetails tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
