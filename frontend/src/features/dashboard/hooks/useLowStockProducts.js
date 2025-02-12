import { useState, useEffect } from "react";
import { getLowStockProducts } from "../services/lowStockService";

// Hook personalizado para obtener los productos con stock bajo
const useLowStockProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getLowStockProducts();

        // Validar que los datos sean un objeto con una propiedad 'products'
        if (
          typeof data !== "object" ||
          !data.products ||
          !Array.isArray(data.products)
        ) {
          console.error(
            "Los datos recibidos no tienen la estructura esperada:",
            data
          );
          setError("Los datos recibidos no son válidos.");
          return;
        }

        // Extraer el array de productos del objeto
        const productsArray = data.products;

        // Actualizar el estado con el array de productos
        setProducts(productsArray);
      } catch (err) {
        console.error("Error al obtener productos:", err.message); // Depuración: Captura errores
        setError(err.message || "Ocurrió un error al obtener los productos.");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchProducts();
  }, []);

  // Depuración: Verificar el estado actualizado
  useEffect(() => {
    console.log("Productos actualizados en el estado:", products);
  }, [products]);

  return { products, loading, error };
};

export default useLowStockProducts;
