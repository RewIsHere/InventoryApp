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

// movementController.js

export const registerPendingProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, min_stock, category_id } = req.body;
        const userId = req.user.id;

        // Validaciones
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
            .single();

        if (fetchError) return res.status(500).json({ error: fetchError.message });
        if (!pending) return res.status(404).json({ error: "Producto pendiente no encontrado." });

        // Validar que la categoría exista
        const { data: categoryData, error: categoryError } = await supabase
            .from('product_categories')
            .select('id')
            .eq('id', category_id)
            .single();

        if (categoryError || !categoryData) {
            return res.status(400).json({ error: "La categoría especificada no existe." });
        }

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

        // Registrar en el historial
        const productId = product[0].id;
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
            .update({ status: 'REGISTERED', product_id: productId })
            .eq('barcode', pending.barcode)
            .eq('movement_id', pending.movement_id);

        if (detailsError) return res.status(500).json({ error: detailsError.message });

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