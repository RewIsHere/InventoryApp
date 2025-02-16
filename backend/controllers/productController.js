import supabase from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Crear un producto
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      barcode,
      stock,
      min_stock,
      status,
      category_id,
    } = req.body; // Agregar category_id
    const userId = req.user.id;

    // Validar que category_id esté presente
    if (!category_id) {
      return res
        .status(400)
        .json({ error: "El campo category_id es obligatorio." });
    }

    // Verificar si la categoría existe
    const { data: categoryData, error: categoryError } = await supabase
      .from("product_categories")
      .select("id")
      .eq("id", category_id)
      .single();

    if (categoryError || !categoryData) {
      return res
        .status(400)
        .json({ error: "La categoría especificada no existe." });
    }

    // Verificar si el código de barras ya existe en la base de datos
    const { data: existingProduct, error: barcodeError } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", barcode); // Verificar si el barcode ya existe

    // Log de detalles de error
    if (barcodeError) {
      console.error("Error al verificar el código de barras:", barcodeError);
      return res
        .status(500)
        .json({ error: "Error al verificar el código de barras." });
    }

    // Verificar si el array `existingProduct` contiene algún elemento
    if (existingProduct && existingProduct.length > 0) {
      return res.status(400).json({
        error: "El código de barras ya está registrado en otro producto.",
      });
    }

    // Insertar el producto en la tabla 'products'
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        barcode, // Usar directamente el barcode como texto
        stock,
        min_stock,
        status,
        category_id, // Incluir category_id en la inserción
        created_by: userId,
      })
      .select(); // Asegurarse de obtener los datos insertados

    // Verificar si hubo un error durante la inserción
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Verificar si `data` es nulo o vacío
    if (!data || data.length === 0) {
      return res.status(500).json({ error: "No se pudo crear el producto." });
    }

    // Obtener el ID del producto recién creado
    const productId = data[0].id;

    // Registrar en el historial
    const { error: historyError } = await supabase
      .from("product_history")
      .insert({
        product_id: productId,
        user_id: userId,
        action: "product_created",
        details: {
          name,
          description,
          barcode,
          stock,
          min_stock,
          status,
          category_id,
        }, // Incluir category_id en el historial
      });

    // Verificar si hubo un error al registrar el historial
    if (historyError) {
      console.error("Error al registrar el historial:", historyError.message);
      // Continuar aunque falle el historial, ya que el producto se creó correctamente
    }

    // Devolver una respuesta exitosa
    res
      .status(201)
      .json({ message: "Producto creado correctamente.", product: data[0] });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Listar productos
// Controlador: Listar productos (con o sin filtros)
export const listProducts = async (req, res) => {
  try {
    const {
      status,
      category,
      sort,
      stock_alert,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 20;
    const fromIndex = (pageNumber - 1) * pageSize;
    const toIndex = pageNumber * pageSize - 1;

    let query = supabase.from("products").select(
      `*,
        product_images (
          id,
          image_url,
          uploaded_at
        ),
        product_categories!inner (
          name
        )
      `,
      { count: "exact" }
    );

    if (status && status !== "all") {
      query = query.eq("status", status.toUpperCase());
    }

    if (category && category !== "all") {
      query = query.eq("product_categories.name", category);
    }

    if (stock_alert && stock_alert !== "all") {
      const rpcQuery = await supabase.rpc("get_products_by_stock_alert", {
        alert_type: stock_alert,
      });
      if (rpcQuery.error) {
        return res.status(500).json({ error: rpcQuery.error.message });
      }
      const productIds = rpcQuery.data.map((product) => product.id);
      query = query.in("id", productIds);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%`);
    }

    if (sort) {
      switch (sort) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "stock_asc":
          query = query.order("stock", { ascending: true });
          break;
        case "stock_desc":
          query = query.order("stock", { ascending: false });
          break;
      }
    }

    query = query.range(fromIndex, toIndex);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formattedData = data.map((product) => {
      const mostRecentImage = product.product_images.reduce(
        (mostRecent, currentImage) => {
          if (
            !mostRecent ||
            new Date(currentImage.uploaded_at) >
              new Date(mostRecent.uploaded_at)
          ) {
            return currentImage;
          }
          return mostRecent;
        },
        null
      );

      const { product_images, product_categories, ...restOfProduct } = product;

      return {
        ...restOfProduct,
        category: product_categories?.name || "Sin categoría",
        image: mostRecentImage
          ? { id: mostRecentImage.id, url: mostRecentImage.image_url }
          : null,
      };
    });

    res.status(200).json({
      products: formattedData,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, barcode, min_stock, category_id } = req.body; // Incluye category_id
    const userId = req.user.id;

    // Obtener el producto existente
    const { data: oldProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    const updates = {};
    const historyDetails = {};

    // Validar y aplicar cambios
    if (name && name !== oldProduct.name) {
      updates.name = name;
      historyDetails.name = { old: oldProduct.name, new: name };
    }
    if (description && description !== oldProduct.description) {
      updates.description = description;
      historyDetails.description = {
        old: oldProduct.description,
        new: description,
      };
    }
    if (barcode && barcode !== oldProduct.barcode) {
      updates.barcode = barcode;
      historyDetails.barcode = { old: oldProduct.barcode, new: barcode };
    }
    if (min_stock && min_stock !== oldProduct.min_stock) {
      updates.min_stock = min_stock;
      historyDetails.min_stock = { old: oldProduct.min_stock, new: min_stock };
    }
    if (category_id && category_id !== oldProduct.category_id) {
      updates.category_id = category_id;
      historyDetails.category_id = {
        old: oldProduct.category_id,
        new: category_id,
      };
    }

    // Verificar si hay cambios
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No hay cambios para aplicar." });
    }

    // Marcar la fecha de actualización
    updates.updated_at = new Date().toISOString();

    // Actualizar el producto
    const { error: updateError } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Registrar en el historial
    await supabase.from("product_history").insert({
      product_id: id,
      user_id: userId,
      action: "product_updated",
      details: historyDetails,
    });

    res.status(200).json({ message: "Producto actualizado correctamente." });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Eliminar registros relacionados en otras tablas
    await supabase.from("product_history").delete().eq("product_id", id);
    await supabase.from("product_images").delete().eq("product_id", id);
    await supabase.from("product_notes").delete().eq("product_id", id);

    // Eliminar el producto
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) throw new Error(deleteError.message);

    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

// Ajustar stock
export const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { adjustment, reason } = req.body;
  const userId = req.user.id;

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const newStock = product.stock + adjustment;

  if (newStock < 0) {
    return res.status(400).json({ error: "El stock no puede ser menor a 0" });
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  // Registrar en el historial
  await supabase.from("product_history").insert({
    product_id: id,
    user_id: userId,
    action: "stock_adjustment",
    details: { old_stock: product.stock, newStock, reason },
  });

  res.status(200).json({ message: "Stock ajustado correctamente." });
};

// productController.js

export const updateProductStock = async (productId, quantity, type, userId) => {
  try {
    // Validaciones
    if (!productId || typeof productId !== "string") {
      throw new Error(
        "El campo 'productId' es obligatorio y debe ser un UUID válido."
      );
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      throw new Error(
        "El campo 'quantity' es obligatorio y debe ser un número mayor que cero."
      );
    }
    if (!type || !["ENTRY", "EXIT"].includes(type.toUpperCase())) {
      throw new Error(
        "El campo 'type' es obligatorio y debe ser 'ENTRY' o 'EXIT'."
      );
    }
    if (!userId || typeof userId !== "string") {
      throw new Error(
        "El campo 'userId' es obligatorio y debe ser un UUID válido."
      );
    }

    // Determinar la operación y la acción
    const operation = type === "ENTRY" ? "+" : "-";
    const action = type === "ENTRY" ? "stock_added" : "stock_removed";

    // Obtener el stock actual para validar que no sea negativo
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (fetchError) {
      console.error("Error al obtener el producto:", fetchError.message);
      throw new Error("No se pudo encontrar el producto.");
    }

    // Calcular el nuevo stock
    let newStock;
    if (type === "ENTRY") {
      newStock = product.stock + quantity;
    } else {
      newStock = product.stock - quantity;

      // Validar que el stock no sea negativo
      if (newStock < 0) {
        throw new Error("El stock no puede ser negativo.");
      }
    }

    // Actualizar el stock del producto usando una consulta SQL directa
    const { error: stockError } = await supabase.rpc("update_stock", {
      product_id: productId,
      quantity_change: quantity,
      operation: operation,
    });

    if (stockError) {
      console.error("Error al actualizar el stock:", stockError.message);
      throw new Error("Ocurrió un error al actualizar el stock del producto.");
    }

    // Registrar en el historial
    const { error: historyError } = await supabase
      .from("product_history")
      .insert({
        product_id: productId,
        user_id: userId,
        action,
        details: { quantity, type },
      });

    if (historyError) {
      console.error(
        "Error al registrar en el historial:",
        historyError.message
      );
      throw new Error(
        "Ocurrió un error al registrar el historial del producto."
      );
    }
  } catch (err) {
    console.error("Error inesperado en updateProductStock:", err.message);
    throw err;
  }
};

// Activar/Desactivar un producto
export const toggleProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'ACTIVE' o 'INACTIVE'
  const userId = req.user.id;

  const { error } = await supabase
    .from("products")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  // Registrar en el historial
  await supabase.from("product_history").insert({
    product_id: id,
    user_id: userId,
    action: "status_updated",
    details: { status },
  });

  res
    .status(200)
    .json({ message: `Producto ${status.toLowerCase()} correctamente.` });
};

export const getProductDetails = async (req, res) => {
  const { id } = req.params;

  // Obtener el producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `*, 
      category:product_categories(*),
      images:product_images(*),
      notes:product_notes(*),
      history:product_history(*)`
    )
    .eq("id", id)
    .single();

  if (productError)
    return res.status(500).json({ error: productError.message });
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado." });

  // Obtener el autor usando el created_by (UUID del autor)
  const { data: author, error: authorError } = await supabase
    .from("users")
    .select("id, name")
    .eq("id", product.created_by)
    .single();

  if (authorError) return res.status(500).json({ error: authorError.message });

  // Incluir el nombre del autor en la respuesta
  const productWithAuthor = {
    ...product,
    created_by: author ? author.name : "Desconocido", // Agregamos el nombre del autor
  };

  res.status(200).json(productWithAuthor);
};

// Subir una imagen
export const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file; // Obtenido del middleware de multer
    const userId = req.user.id;

    console.log("Archivo recibido:", file); // Log adicional

    // Verificar si se proporcionó un archivo
    if (!file) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ninguna imagen." });
    }

    // Validar el tipo MIME del archivo
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error:
          "Tipo de archivo no soportado. Solo se permiten imágenes JPEG, PNG y JPG.",
      });
    }

    // Generar un nombre único para el archivo
    const fileExtension = file.originalname.split(".").pop(); // Obtener la extensión del archivo
    const uniqueFileName = `${uuidv4()}.${fileExtension}`; // Generar un nombre único

    // Subir la imagen a Supabase Storage
    const filePath = `public/${id}/${uniqueFileName}`;
    const uploadResponse = await supabase.storage
      .from("product_images")
      .upload(filePath, file.buffer);

    // Manejar errores al subir la imagen
    if (uploadResponse.error) {
      return res.status(500).json({ error: uploadResponse.error.message });
    }

    // Obtener la URL pública de la imagen
    const imageUrl = supabase.storage
      .from("product_images")
      .getPublicUrl(filePath).data.publicUrl;

    // Registrar la imagen en la tabla 'product_images'
    await supabase.from("product_images").insert({
      product_id: id,
      uploaded_by: userId,
      image_url: imageUrl,
    });

    // Registrar en el historial
    await supabase.from("product_history").insert({
      product_id: id,
      user_id: userId,
      action: "image_uploaded",
      details: { image_url: imageUrl },
    });

    // Devolver una respuesta exitosa
    res
      .status(201)
      .json({ message: "Imagen subida correctamente.", url: imageUrl });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Eliminar una imagen
export const deleteImage = async (req, res) => {
  const { id, imageId } = req.params;
  const userId = req.user.id;

  const { data: image, error: fetchError } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  // Eliminar la imagen del bucket de Supabase Storage
  const filePath = image.image_url.split("/").pop(); // Extraer el nombre del archivo
  const { error: storageError } = await supabase.storage
    .from("product_images")
    .remove([`public/${id}/${filePath}`]);

  if (storageError)
    return res.status(500).json({ error: storageError.message });

  // Eliminar la referencia de la base de datos
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (deleteError) return res.status(500).json({ error: deleteError.message });

  // Registrar en el historial
  await supabase.from("product_history").insert({
    product_id: id,
    user_id: userId,
    action: "image_deleted",
    details: { image_url: image.image_url },
  });

  res.status(200).json({ message: "Imagen eliminada correctamente." });
};

// Listar imágenes de un producto
export const listProductImages = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("uploaded_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};
