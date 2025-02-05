import supabase from "../config/db.js";

// Listar los productos pendientes de revision
export const listPendingProducts = async (req, res) => {
    try {
        const { barcode, startDate, endDate, movement_id } = req.query;

        let query = supabase.from('pending_reviews').select(`
            *,
            movement:movements(*),
            created_by:users(*)
        `);

        // Filtrar por código de barras
        if (barcode) query = query.eq('barcode', barcode);

        // Filtrar por rango de fechas
        if (startDate && endDate) query = query.range('created_at', startDate, endDate);

        // Filtrar por ID de movimiento
        if (movement_id) query = query.eq('movement_id', movement_id);

        // Ejecutar la consulta
        const { data, error } = await query;

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Obtener los detalles de un producto guardado para revision
export const getPendingProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Consultar el producto pendiente y su movimiento asociado
        const { data, error } = await supabase
            .from('pending_reviews')
            .select(`
                *,
                movement:movements(*),
                created_by:users(*)
            `)
            .eq('id', id)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: "Producto pendiente no encontrado." });

        res.status(200).json(data);
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

export const registerPendingProduct = async (req, res) => {
    try {
        const { id } = req.params; // ID del producto pendiente
        const { name, description, min_stock, category_id } = req.body;
        const userId = req.user.id;

        // Validaciones básicas
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: "El campo 'name' es obligatorio y debe ser una cadena de texto." });
        }
        if (!min_stock || typeof min_stock !== 'number' || min_stock < 0) {
            return res.status(400).json({ error: "El campo 'min_stock' es obligatorio y debe ser un número mayor o igual a cero." });
        }
        if (!category_id || typeof category_id !== 'string') {
            return res.status(400).json({ error: "El campo 'category_id' es obligatorio y debe ser un UUID válido." });
        }

        // Obtener el producto pendiente
        const { data: pending, error: fetchError } = await supabase
            .from('pending_reviews')
            .select('*')
            .eq('id', id)
            .maybeSingle(); // Usar maybeSingle() para evitar errores si no hay resultados

        if (fetchError) return res.status(500).json({ error: fetchError.message });
        if (!pending) {
            return res.status(400).json({ error: "No se encontro ningun producto pendiente con este ID." });
        }

        // Validar que la categoría exista
        const { data: categoryData, error: categoryError } = await supabase
            .from('product_categories')
            .select('id')
            .eq('id', category_id)
            .maybeSingle(); // Usar maybeSingle() para evitar errores si no hay resultados

        if (categoryError) return res.status(500).json({ error: categoryError.message });
        if (!categoryData) return res.status(400).json({ error: "La categoría especificada no existe." });

        // Crear el producto en la base de datos
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
                name,
                description,
                barcode: pending.barcode,
                stock: pending.quantity,
                min_stock,
                category_id,
                created_by: userId
            })
            .select(); // Obtener el producto recién creado

        if (productError) return res.status(500).json({ error: productError.message });

        const productId = product[0].id;

        // Registrar en el historial
        const { error: historyError } = await supabase.from('product_history').insert({
            product_id: productId,
            user_id: userId,
            action: 'product_created_from_pending',
            details: {
                name,
                description,
                barcode: pending.barcode,
                stock: pending.quantity,
                min_stock,
                category_id,
                movement_id: pending.movement_id // Contexto del movimiento
            }
        });

        if (historyError) {
            console.error("Error al registrar el historial:", historyError.message);
            // Continuar aunque falle el historial, ya que el producto se creó correctamente
        }

        // Actualizar el estado del detalle del movimiento
        const { error: detailsError } = await supabase
            .from('movement_details')
            .update({ status: 'REGISTERED', product_id: productId }) // Actualizar estado y product_id
            .eq('barcode', pending.barcode)
            .eq('movement_id', pending.movement_id);

        if (detailsError) return res.status(500).json({ error: detailsError.message });

        // Verificar si quedan productos no registrados en el movimiento
        const { data: remainingUnregistered, error: remainingError } = await supabase
            .from('movement_details')
            .select('*')
            .eq('movement_id', pending.movement_id)
            .eq('status', 'UNREGISTERED');

        if (remainingError) return res.status(500).json({ error: remainingError.message });

        if (remainingUnregistered.length === 0) {
            // Verificar que el movimiento exista y esté en estado COMPLETED_WITH_UNREGISTERED
            const { data: movementData, error: movementFetchError } = await supabase
                .from('movements')
                .select('*')
                .eq('id', pending.movement_id)
                .eq('status', 'COMPLETED_WITH_UNREGISTERED')
                .maybeSingle(); // Usar maybeSingle() para evitar errores si no hay resultados

            if (movementFetchError) return res.status(500).json({ error: movementFetchError.message });
            if (!movementData) {
                return res.status(404).json({ error: "Movimiento no encontrado o no está en estado COMPLETED_WITH_UNREGISTERED." });
            }

            console.log("Actualizando estado del movimiento:", pending.movement_id);

            // Actualizar el estado del movimiento a COMPLETED
            const { error: movementError } = await supabase
                .from('movements')
                .update({ status: 'COMPLETED' })
                .eq('id', pending.movement_id)
                .eq('status', 'COMPLETED_WITH_UNREGISTERED'); // Asegurar que solo se actualicen movimientos en este estado

            if (movementError) return res.status(500).json({ error: movementError.message });
        }

        // Eliminar el producto de la lista de pendientes
        const { error: deleteError } = await supabase
            .from('pending_reviews')
            .delete()
            .eq('id', id);

        if (deleteError) return res.status(500).json({ error: deleteError.message });

        res.status(201).json({ message: "Producto registrado correctamente.", product: product[0] });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};