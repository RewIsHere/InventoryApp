import supabase from "../config/db.js";

// Crear una nota
export const createNote = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto
        const { note } = req.body;
        const userId = req.user.id;

        // Insertar la nota en la tabla 'product_notes'
        const { data, error } = await supabase
            .from('product_notes')
            .insert({
                product_id: id,
                user_id: userId,
                note
            })
            .select(); // Agregar .select() para obtener los datos insertados

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Verificar si `data` es nulo o vacío
        if (!data || data.length === 0) {
            return res.status(500).json({ error: "No se pudo crear la nota." });
        }

        // Devolver una respuesta exitosa con los datos de la nota
        res.status(201).json({ message: "Nota creada correctamente.", note: data[0] });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Listar notas de un producto
export const listNotes = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto
        const { data, error } = await supabase
            .from('product_notes')
            .select('*')
            .eq('product_id', id)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Actualizar una nota
export const updateNote = async (req, res) => {
    try {
        const { productId, noteId } = req.params; // ID del producto y ID de la nota
        const { note } = req.body;
        const userId = req.user.id;

        // Obtener la nota existente para verificar el propietario
        const { data: existingNote, error: fetchError } = await supabase
            .from('product_notes')
            .select('id, user_id, product_id')
            .eq('id', noteId)
            .single();

        if (fetchError) {
            return res.status(404).json({ error: "La nota no existe." });
        }

        // Verificar que la nota pertenezca al producto correcto
        if (existingNote.product_id !== productId) {
            return res.status(400).json({ error: "La nota no pertenece a este producto." });
        }

        // Verificar que el usuario sea el propietario de la nota
        if (existingNote.user_id !== userId) {
            return res.status(403).json({ error: "No tienes permiso para actualizar esta nota." });
        }

        // Actualizar la nota
        const { error } = await supabase
            .from('product_notes')
            .update({ note, updated_at: new Date().toISOString() })
            .eq('id', noteId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ message: "Nota actualizada correctamente." });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Eliminar una nota
export const deleteNote = async (req, res) => {
    try {
        const { productId, noteId } = req.params; // ID del producto y ID de la nota
        const userId = req.user.id;

        // Obtener la nota existente para verificar el propietario
        const { data: existingNote, error: fetchError } = await supabase
            .from('product_notes')
            .select('id, user_id, product_id')
            .eq('id', noteId)
            .single();

        if (fetchError) {
            return res.status(404).json({ error: "La nota no existe." });
        }

        // Verificar que la nota pertenezca al producto correcto
        if (existingNote.product_id !== productId) {
            return res.status(400).json({ error: "La nota no pertenece a este producto." });
        }

        // Verificar que el usuario sea el propietario de la nota
        if (existingNote.user_id !== userId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta nota." });
        }

        // Eliminar la nota
        const { error } = await supabase
            .from('product_notes')
            .delete()
            .eq('id', noteId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ message: "Nota eliminada correctamente." });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};