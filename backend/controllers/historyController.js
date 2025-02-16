import supabase from "../config/db.js";
import { historyMessages } from "../utils/historyMessages.js";

export const listHistory = async (req, res) => {
  const { id } = req.params;

  try {
    // Paso 1: Obtener el historial de productos
    const { data: historyData, error: historyError } = await supabase
      .from("product_history")
      .select("id, created_at, action, details, users(name, surnames)")
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    if (historyError) {
      return res.status(500).json({ error: historyError.message });
    }

    // Paso 2: Obtener las categorías (solo los IDs que aparecen en el historial)
    const categoryIds = historyData
      .map((item) => [
        item.details.category_id?.old,
        item.details.category_id?.new,
      ])
      .flat()
      .filter((id) => id); // Eliminar valores nulos o undefined

    const { data: categoriesData, error: categoriesError } = await supabase
      .from("product_categories")
      .select("id, name")
      .in("id", categoryIds); // Filtrar por los IDs de categorías encontrados

    if (categoriesError) {
      return res.status(500).json({ error: categoriesError.message });
    }

    // Paso 3: Transformar los datos del historial para incluir los nombres de las categorías
    const transformedData = historyData.map((item) => {
      // Obtener los nombres de las categorías basados en los IDs antiguos y nuevos
      const categoryOld = categoriesData.find(
        (category) => category.id === item.details.category_id?.old
      );
      const categoryNew = categoriesData.find(
        (category) => category.id === item.details.category_id?.new
      );

      return {
        id: item.id,
        date: item.created_at,
        action: item.action,
        details: historyMessages.has(item.action)
          ? historyMessages.get(item.action)({
              ...item.details,
              category_name_old: categoryOld ? categoryOld.name : null,
              category_name_new: categoryNew ? categoryNew.name : null,
            })
          : "Acción desconocida.",
        user: item.users
          ? `${item.users.name} ${item.users.surnames}`
          : "Usuario desconocido",
      };
    });

    res.status(200).json(transformedData);
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};
