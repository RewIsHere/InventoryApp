import supabase from "../config/db.js";

// Crear una nota
export const createNote = async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase.from('product_notes').insert({
        product_id: id,
        user_id: userId,
        note
    });

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
};

// Listar notas de un producto
export const listNotes = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('product_notes')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Actualizar una nota
export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const { error } = await supabase
        .from('product_notes')
        .update({ note, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: 'Nota actualizada correctamente.' });
};

// Eliminar una nota
export const deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
        .from('product_notes')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: 'Nota eliminada correctamente.' });
};