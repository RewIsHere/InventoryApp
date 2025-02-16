import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para acceder al ID de la URL
import {
  getProductNotes,
  createProductNote,
} from "../services/productNotesService"; // Ajusta la ruta según corresponda

export const useProductNotes = () => {
  const { id } = useParams(); // Obtiene el ID del producto desde la URL
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesData = await getProductNotes(id); // Obtiene las notas del producto
        setNotes(notesData); // Establece las notas en el estado
      } catch (err) {
        setError("No se pudo cargar las notas.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNotes(); // Llama a la función para obtener las notas cuando se monta el componente
    }
  }, [id]);

  const addNote = async (noteContent) => {
    try {
      const newNote = await createProductNote(id, noteContent); // Crea la nueva nota
      setNotes((prevNotes) => [newNote, ...prevNotes]); // Agrega la nueva nota al inicio de la lista
    } catch (err) {
      setError("No se pudo agregar la nota.");
    }
  };

  return { notes, loading, error, addNote };
};
