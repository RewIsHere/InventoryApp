import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../shared/components/structure/Tabs"; // Componente Tabs

// Componentes específicos de cada tab
import Overview from "./Overview";
import Specs from "./Specs";
import Reviews from "./Reviews";

const ProductDetails = ({ tabs, activeTab, onTabChange }) => {
  const { id, nombreDelTab } = useParams(); // Extraer parámetros de la URL

  // Cambiar la pestaña activa al cargar la página
  useEffect(() => {
    if (nombreDelTab) {
      onTabChange(nombreDelTab);
    }
  }, [nombreDelTab, onTabChange]);

  return (
    <div>
      <h1>Product Details - ID: {id}</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      <div>
        {/* Solo mostrar contenido del tab activo */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "specs" && <Specs />}
        {activeTab === "reviews" && <Reviews />}
      </div>
    </div>
  );
};

export default ProductDetails;
