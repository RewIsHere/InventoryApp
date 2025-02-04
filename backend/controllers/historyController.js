import supabase from "../config/db.js";

// Listar historial de un producto
export const listHistory = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('product_history')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};