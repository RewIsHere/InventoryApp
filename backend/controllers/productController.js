import supabase from "../config/db.js";

// Crear un producto
export const createProduct = async (req, res) => {
    const { name, description, barcode, min_stock, status } = req.body;
    const userId = req.user.id;

    const { data, error } = await supabase.from('products').insert({
        name,
        description,
        barcode,
        min_stock,
        status,
        created_by: userId
    });

    if (error) return res.status(500).json({ error: error.message });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: data[0].id,
        user_id: userId,
        action: 'product_created',
        details: { name, description, barcode, min_stock, status }
    });

    res.status(201).json(data);
};

// Listar productos
// Controlador: Listar productos (con o sin filtros)
export const listProducts = async (req, res) => {
    const { status, category, sort, stock_alert } = req.query;

    let query = supabase.from('products').select('*');

    // Filtro por estado
    if (status && status !== 'all') {
        query = query.eq('status', status.toUpperCase());
    }

    // Filtro por categoría
    if (category) {
        query = query.eq('category_id', category);
    }

    // Filtro por alerta de stock (dinámico basado en min_stock)
    if (stock_alert && stock_alert !== 'all') {
        switch (stock_alert) {
            case 'low':
                query = query.lte('stock', supabase.helpers.raw('min_stock')); // Stock <= min_stock
                break;
            case 'out_of_stock':
                query = query.eq('stock', 0); // Sin stock
                break;
            case 'normal':
                query = query.gt('stock', supabase.helpers.raw('min_stock')); // Stock > min_stock
                break;
        }
    }

    // Ordenar resultados
    if (sort) {
        switch (sort) {
            case 'name_asc':
                query = query.order('name', { ascending: true });
                break;
            case 'name_desc':
                query = query.order('name', { ascending: false });
                break;
            case 'stock_asc':
                query = query.order('stock', { ascending: true });
                break;
            case 'stock_desc':
                query = query.order('stock', { ascending: false });
                break;
        }
    }

    // Ejecutar la consulta
    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, barcode, min_stock, status } = req.body;
    const userId = req.user.id;

    const { data: oldProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    const updates = {};
    const historyDetails = {};

    if (name && name !== oldProduct.name) {
        updates.name = name;
        historyDetails.name = { old: oldProduct.name, new: name };
    }

    if (description && description !== oldProduct.description) {
        updates.description = description;
        historyDetails.description = { old: oldProduct.description, new: description };
    }

    if (barcode && barcode !== oldProduct.barcode) {
        updates.barcode = barcode;
        historyDetails.barcode = { old: oldProduct.barcode, new: barcode };
    }

    if (min_stock && min_stock !== oldProduct.min_stock) {
        updates.min_stock = min_stock;
        historyDetails.min_stock = { old: oldProduct.min_stock, new: min_stock };
    }

    if (status && status !== oldProduct.status) {
        updates.status = status;
        historyDetails.status = { old: oldProduct.status, new: status };
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No hay cambios para aplicar.' });
    }

    updates.updated_at = new Date().toISOString();

    const { error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: id,
        user_id: userId,
        action: 'product_updated',
        details: historyDetails
    });

    res.status(200).json({ message: 'Producto actualizado correctamente.' });
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Eliminar registros relacionados en otras tablas
        await supabase.from('product_history').delete().eq('product_id', id);
        await supabase.from('product_images').delete().eq('product_id', id);
        await supabase.from('product_notes').delete().eq('product_id', id);

        // Eliminar el producto
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (deleteError) throw new Error(deleteError.message);

        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ajustar stock
export const adjustStock = async (req, res) => {
    const { id } = req.params;
    const { adjustment, reason } = req.body;
    const userId = req.user.id;

    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    const newStock = product.stock + adjustment;

    const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: id,
        user_id: userId,
        action: 'stock_adjustment',
        details: { old_stock: product.stock, new_stock, reason }
    });

    res.status(200).json({ message: 'Stock ajustado correctamente.' });
};

// Activar/Desactivar un producto
export const toggleProductStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' o 'INACTIVE'
    const userId = req.user.id;

    const { error } = await supabase
        .from('products')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: id,
        user_id: userId,
        action: 'status_updated',
        details: { status }
    });

    res.status(200).json({ message: `Producto ${status.toLowerCase()} correctamente.` });
};

export const getProductDetails = async (req, res) => {
    const { id } = req.params;

    // Obtener el producto
    const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            images:product_images(*),
            notes:product_notes(*),
            history:product_history(*)
        `)
        .eq('id', id)
        .single();

    if (productError) return res.status(500).json({ error: productError.message });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });

    res.status(200).json(product);
};

// Subir una imagen
export const uploadImage = async (req, res) => {
    const { id } = req.params;
    const file = req.files?.image; // Asegúrate de usar un middleware como multer
    const userId = req.user.id;

    if (!file) return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });

    const { data, error } = await supabase.storage
        .from('product_images')
        .upload(`public/${id}/${file.name}`, file.data);

    if (error) return res.status(500).json({ error: error.message });

    const imageUrl = supabase.storage
        .from('product_images')
        .getPublicUrl(`public/${id}/${file.name}`).data.publicUrl;

    await supabase.from('product_images').insert({
        product_id: id,
        uploaded_by: userId,
        image_url: imageUrl
    });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: id,
        user_id: userId,
        action: 'image_uploaded',
        details: { image_url: imageUrl }
    });

    res.status(201).json({ message: 'Imagen subida correctamente.', url: imageUrl });
};

// Eliminar una imagen
export const deleteImage = async (req, res) => {
    const { id, imageId } = req.params;
    const userId = req.user.id;

    const { data: image, error: fetchError } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('id', imageId)
        .single();

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    // Eliminar la imagen del bucket de Supabase Storage
    const filePath = image.image_url.split('/').pop(); // Extraer el nombre del archivo
    const { error: storageError } = await supabase.storage
        .from('product_images')
        .remove([`public/${id}/${filePath}`]);

    if (storageError) return res.status(500).json({ error: storageError.message });

    // Eliminar la referencia de la base de datos
    const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

    if (deleteError) return res.status(500).json({ error: deleteError.message });

    // Registrar en el historial
    await supabase.from('product_history').insert({
        product_id: id,
        user_id: userId,
        action: 'image_deleted',
        details: { image_url: image.image_url }
    });

    res.status(200).json({ message: 'Imagen eliminada correctamente.' });
};

// Listar imágenes de un producto
export const listProductImages = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('uploaded_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
};