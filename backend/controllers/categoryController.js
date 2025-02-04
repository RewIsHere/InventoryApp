import supabase from "../config/db.js";

// Crear una categoría
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Insertar la categoría en la tabla 'product_categories'
        const { data, error } = await supabase
            .from('product_categories')
            .insert({
                name
            })
            .select(); // Agregar .select() para obtener los datos insertados

        // Verificar si hubo un error durante la inserción
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Verificar si `data` es nulo o vacío
        if (!data || data.length === 0) {
            return res.status(500).json({ error: "No se pudo crear la categoría." });
        }

        // Devolver una respuesta exitosa con los datos de la categoría
        res.status(201).json({ message: "Categoría creada correctamente.", category: data[0] });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Listar categorías
export const listCategories = async (req, res) => {
    const { data, error } = await supabase.from('product_categories').select('*');

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const { error } = await supabase
        .from('product_categories')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Categoría actualizada correctamente.' });
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay productos asociados a la categoría
        const { data: products, error: fetchError } = await supabase
            .from('products')
            .select('id')
            .eq('category_id', id);

        if (fetchError) {
            return res.status(500).json({ error: fetchError.message });
        }

        if (products && products.length > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar la categoría porque tiene productos asociados.'
            });
        }

        // Eliminar la categoría
        const { error: deleteError } = await supabase
            .from('product_categories')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return res.status(500).json({ error: deleteError.message });
        }

        res.status(200).json({ message: 'Categoría eliminada correctamente.' });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};