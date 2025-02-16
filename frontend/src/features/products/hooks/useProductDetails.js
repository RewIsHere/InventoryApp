import { useState, useEffect } from "react";
import { getProductById } from "../services/productService"; // Importamos el servicio

const useProductDetails = (productId) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProductById(productId); // Usamos el servicio para obtener el producto
        setProductDetails(data); // Guardamos los detalles del producto en el estado
        setLoading(false); // Cambiamos el estado de carga a false
      } catch (err) {
        setError(err.message); // Guardamos el mensaje de error si la petición falla
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Dependemos del productId para hacer la petición

  return { productDetails, loading, error };
};

export default useProductDetails;
