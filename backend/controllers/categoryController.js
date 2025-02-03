import supabase from "../config/db.js";

// Crear una categoría
export const createCategory = async (req, res) => {
    const { name } = req.body;

    const { data, error } = await supabase.from('product_categories').insert({
        name
    });

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
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
    const { id } = req.params;

    const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Categoría eliminada correctamente.' });
};