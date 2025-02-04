import supabase from "../config/db.js";

// Listar movimientos finalizados
export const listMovements = async (req, res) => {
    try {
        const { type, startDate, endDate, category } = req.query;

        let query = supabase.from('movements').select(`
            *,
            created_by:users(*),
            details:movement_details(*, product:products(*))
        `);

        // Filtrar por tipo de movimiento
        if (type) query = query.eq('type', type.toUpperCase());

        // Filtrar por rango de fechas
        if (startDate && endDate) query = query.range('created_at', startDate, endDate);

        // Filtrar por categoría de productos
        if (category) query = query.eq('details.product.category_id', category);

        // Ejecutar la consulta
        const { data, error } = await query;

        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Obtener detalles de un movimiento específico
export const getMovementDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Consultar el movimiento y sus detalles
        const { data, error } = await supabase
            .from('movements')
            .select(`
                *,
                created_by:users(*),
                details:movement_details(*, product:products(*))
            `)
            .eq('id', id)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: "Movimiento no encontrado." });

        res.status(200).json(data);
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Iniciar un movimiento temporal
export const startMovement = async (req, res) => {
    try {
        const { type } = req.body;

        // Validaciones
        if (!type || !['ENTRY', 'EXIT'].includes(type.toUpperCase())) {
            return res.status(400).json({ error: "El campo 'type' es obligatorio y debe ser 'ENTRY' o 'EXIT'." });
        }

        const userId = req.user.id;

        // Crear un carrito temporal
        const { data, error } = await supabase
            .from('temp_movements')
            .insert({
                user_id: userId,
                type: type.toUpperCase()
            })
            .select();

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json({ message: "Movimiento iniciado correctamente.", tempMovement: data[0] });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Escanear productos en el carrito temporal
export const scanProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { barcode, quantity } = req.body;

        // Validaciones
        if (!barcode || typeof barcode !== 'number') {
            return res.status(400).json({ error: "El campo 'barcode' es obligatorio y debe ser un número." });
        }
        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: "El campo 'quantity' es obligatorio y debe ser un número mayor que cero." });
        }

        // Verificar si el producto ya fue escaneado en este carrito
        const { data: existingProduct, error: fetchError } = await supabase
            .from('temp_movement_details')
            .select('*')
            .eq('temp_movement_id', id)
            .eq('barcode', barcode)
            .single();

        if (fetchError && fetchError.message !== "No rows found") {
            return res.status(500).json({ error: fetchError.message });
        }

        if (existingProduct) {
            // Si el producto ya existe, actualizar la cantidad
            const { error } = await supabase
                .from('temp_movement_details')
                .update({ quantity: existingProduct.quantity + quantity })
                .eq('id', existingProduct.id);

            if (error) return res.status(500).json({ error: error.message });
        } else {
            // Si el producto no existe, insertarlo
            const { error } = await supabase
                .from('temp_movement_details')
                .insert({
                    temp_movement_id: id,
                    barcode,
                    quantity
                });

            if (error) return res.status(500).json({ error: error.message });
        }

        res.status(201).json({ message: "Producto escaneado correctamente." });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

// Confirmar un movimiento
export const confirmMovement = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el carrito temporal exista
        const { data: tempMovement, error: tempError } = await supabase
            .from('temp_movements')
            .select('*')
            .eq('id', id)
            .single();

        if (tempError || !tempMovement) {
            return res.status(404).json({ error: "Carrito temporal no encontrado." });
        }

        // Obtener los detalles del carrito temporal
        const { data: tempDetails, error: detailsError } = await supabase
            .from('temp_movement_details')
            .select('*')
            .eq('temp_movement_id', id);

        if (detailsError) return res.status(500).json({ error: detailsError.message });
        if (tempDetails.length === 0) {
            return res.status(400).json({ error: "No hay productos escaneados en este carrito." });
        }

        // Separar productos registrados y no registrados
        const registered = [];
        const unregistered = [];

        for (const detail of tempDetails) {
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('id')
                .eq('barcode', detail.barcode)
                .single();

            if (productError && productError.message !== "No rows found") {
                return res.status(500).json({ error: productError.message });
            }

            if (product) {
                registered.push({ ...detail, product_id: product.id });
            } else {
                unregistered.push(detail);
            }
        }

        // Crear el movimiento finalizado
        const { data: movement, error: movementError } = await supabase
            .from('movements')
            .insert({
                type: tempMovement.type,
                created_by: tempMovement.user_id,
                status: 'COMPLETED'
            })
            .select();

        if (movementError) return res.status(500).json({ error: movementError.message });

        // Guardar los detalles del movimiento
        for (const detail of registered) {
            await supabase.from('movement_details').insert({
                movement_id: movement[0].id,
                product_id: detail.product_id,
                barcode: detail.barcode,
                quantity: detail.quantity,
                status: 'REGISTERED'
            });

            // Actualizar el stock del producto
            await updateProductStock(detail.product_id, detail.quantity, tempMovement.type, tempMovement.user_id);
        }

        for (const detail of unregistered) {
            await supabase.from('movement_details').insert({
                movement_id: movement[0].id,
                product_id: null,
                barcode: detail.barcode,
                quantity: detail.quantity,
                status: 'UNREGISTERED'
            });

            // Guardar en la tabla de pendientes
            await supabase.from('pending_reviews').insert({
                movement_id: movement[0].id,
                barcode: detail.barcode,
                quantity: detail.quantity
            });
        }

        // Limpiar el carrito temporal
        await supabase.from('temp_movements').delete().eq('id', id);
        await supabase.from('temp_movement_details').delete().eq('temp_movement_id', id);

        res.status(200).json({ message: "Movimiento confirmado correctamente." });
    } catch (err) {
        console.error("Error inesperado:", err.message);
        res.status(500).json({ error: "Ocurrió un error inesperado." });
    }
};

