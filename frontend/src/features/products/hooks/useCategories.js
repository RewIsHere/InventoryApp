// useCategories.js
import { useState, useEffect } from "react";
import { fetchCategories, createCategory } from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar las categorías
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, []);

  // Función para crear una nueva categoría
  const createNewCategory = async (name) => {
    try {
      setLoading(true);
      setError(null);

      // Validar que no haya espacios

      // Validar que la categoría no exista previamente
      const exists = categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase()
      );
      if (exists) {
        setError("La categoría ya existe.");
        return null;
      }

      // Llamar a la API para crear la categoría
      const newCategory = await createCategory(name);

      // Validar que la categoría tenga las propiedades necesarias
      if (!newCategory.name || !newCategory.id) {
        setError("La categoría creada no tiene el formato esperado.");
        return null;
      }

      // Actualizar el estado local con la nueva categoría
      setCategories((prevCategories) => [...prevCategories, newCategory]);

      // Limpiar errores
      setError(null);
      return newCategory;
    } catch (err) {
      setError(err.message || "Ocurrió un error al crear la categoría.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, createNewCategory };
};
