import supabase from "../config/db.js";
import { updateProductStock } from "./productController.js";

// Listar movimientos finalizados
export const listMovements = async (req, res) => {
  try {
    const { type, startDate, endDate, category } = req.query;

    let query = supabase.from("movements").select(`
            *,
            created_by:users(*),
            details:movement_details(*, product:products(*))
        `);

    // Filtrar por tipo de movimiento
    if (type) query = query.eq("type", type.toUpperCase());

    // Filtrar por rango de fechas
    if (startDate && endDate)
      query = query.range("created_at", startDate, endDate);

    // Filtrar por categoría de productos
    if (category) query = query.eq("details.product.category_id", category);

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
      .from("movements")
      .select(
        `
                *,
                created_by:users(*),
                details:movement_details(*, product:products(*))
            `
      )
      .eq("id", id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data)
      return res.status(404).json({ error: "Movimiento no encontrado." });

    res.status(200).json(data);
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

//  Detectar Movimientos No Confirmados (Paso 1)
export const getPendingMovement = async (req, res) => {
  try {
    const userId = req.user.id;

    // Consultar movimientos temporales del usuario
    const { data, error } = await supabase
      .from("temp_movements")
      .select(
        `
                *,
                details:temp_movement_details(*)
            `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }) // Ordenar por fecha descendente
      .limit(1); // Obtener solo el último movimiento temporal

    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0)
      return res
        .status(404)
        .json({ message: "No hay movimientos pendientes." });

    res.status(200).json(data[0]);
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
    if (!type || !["ENTRY", "EXIT"].includes(type.toUpperCase())) {
      return res.status(400).json({
        error: "El campo 'type' es obligatorio y debe ser 'ENTRY' o 'EXIT'.",
      });
    }

    const userId = req.user.id;

    // Crear un carrito temporal
    const { data, error } = await supabase
      .from("temp_movements")
      .insert({
        user_id: userId,
        type: type.toUpperCase(),
      })
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({
      message: "Movimiento iniciado correctamente.",
      tempMovement: data[0],
    });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Escanear productos en el carrito temporal
export const scanProducts = async (req, res) => {
  try {
    const { id } = req.params; // ID del movimiento temporal
    const { barcode, quantity } = req.body;

    // Validaciones
    if (!barcode) {
      return res
        .status(400)
        .json({ error: "El campo 'barcode' es obligatorio." });
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        error:
          "El campo 'quantity' es obligatorio y debe ser un número mayor que cero.",
      });
    }

    // Verificar si el producto ya fue escaneado en este carrito
    const { data: existingProduct, error: fetchError } = await supabase
      .from("temp_movement_details")
      .select("*")
      .eq("temp_movement_id", id)
      .eq("barcode", barcode)
      .maybeSingle(); // Usamos .maybeSingle() en lugar de .single()

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    if (existingProduct) {
      // Si el producto ya existe, actualizar la cantidad
      const { error } = await supabase
        .from("temp_movement_details")
        .update({ quantity: existingProduct.quantity + quantity })
        .eq("id", existingProduct.id);

      if (error) return res.status(500).json({ error: error.message });

      res
        .status(200)
        .json({ message: "Cantidad del producto actualizada correctamente." });
    } else {
      // Si el producto no existe, insertarlo
      const { error } = await supabase.from("temp_movement_details").insert({
        temp_movement_id: id,
        barcode,
        quantity,
      });

      if (error) return res.status(500).json({ error: error.message });

      res.status(201).json({ message: "Producto escaneado correctamente." });
    }
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Actualizar cantidad de un producto escaneado en el carrito temporal
export const updateScannedProductQuantity = async (req, res) => {
  try {
    const { temp_movement_id, barcode } = req.params;
    const { quantity } = req.body;

    // Validaciones
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "La cantidad debe ser un número mayor que cero." });
    }

    // Verificar si el producto existe en el carrito temporal
    const { data: existingProduct, error: fetchError } = await supabase
      .from("temp_movement_details")
      .select("*")
      .eq("temp_movement_id", temp_movement_id)
      .eq("barcode", barcode)
      .single();

    if (fetchError && fetchError.message !== "No rows found") {
      return res.status(500).json({ error: fetchError.message });
    }
    if (!existingProduct) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito temporal." });
    }

    // Actualizar la cantidad del producto
    const { error } = await supabase
      .from("temp_movement_details")
      .update({ quantity })
      .eq("id", existingProduct.id);

    if (error) return res.status(500).json({ error: error.message });

    res
      .status(200)
      .json({ message: "Cantidad del producto actualizada correctamente." });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// Eliminar un producto escaneado del carrito temporal
export const deleteScannedProduct = async (req, res) => {
  try {
    const { temp_movement_id, barcode } = req.params;

    // Verificar si el producto existe en el carrito temporal
    const { data: existingProduct, error: fetchError } = await supabase
      .from("temp_movement_details")
      .select("*")
      .eq("temp_movement_id", temp_movement_id)
      .eq("barcode", barcode)
      .single();

    if (fetchError && fetchError.message !== "No rows found") {
      return res.status(500).json({ error: fetchError.message });
    }
    if (!existingProduct) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito temporal." });
    }

    // Eliminar el producto del carrito temporal
    const { error } = await supabase
      .from("temp_movement_details")
      .delete()
      .eq("id", existingProduct.id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: "Producto eliminado correctamente." });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};
// Confirmar un movimiento
export const confirmMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validar que el carrito temporal exista, pertenezca al usuario y esté pendiente
    const { data: tempMovement, error: tempError } = await supabase
      .from("temp_movements")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (tempError) {
      return res.status(500).json({ error: tempError.message });
    }
    if (!tempMovement) {
      return res.status(404).json({
        error:
          "Carrito temporal no encontrado, no pertenece al usuario o ya fue confirmado.",
      });
    }

    // Obtener los detalles del carrito temporal
    const { data: tempDetails, error: detailsError } = await supabase
      .from("temp_movement_details")
      .select("*")
      .eq("temp_movement_id", id);

    if (detailsError)
      return res.status(500).json({ error: detailsError.message });
    if (tempDetails.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay productos escaneados en este carrito." });
    }

    // Separar productos registrados y no registrados
    const registered = [];
    const unregistered = [];

    for (const detail of tempDetails) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id")
        .eq("barcode", detail.barcode)
        .maybeSingle();

      if (productError && productError.message !== "No rows found") {
        return res.status(500).json({ error: productError.message });
      }

      if (product) {
        registered.push({ ...detail, product_id: product.id });
      } else {
        unregistered.push(detail);
      }
    }

    // Determinar el estado del movimiento
    const movementStatus =
      unregistered.length > 0 ? "COMPLETED_WITH_UNREGISTERED" : "COMPLETED";

    // Crear el movimiento finalizado
    const { data: movement, error: movementError } = await supabase
      .from("movements")
      .insert({
        type: tempMovement.type,
        created_by: userId,
        status: movementStatus, // Asegúrate de que este valor sea válido
      })
      .select();

    if (movementError)
      return res.status(500).json({ error: movementError.message });

    const movementId = movement[0].id;

    // Guardar los detalles del movimiento para productos registrados
    for (const detail of registered) {
      await supabase.from("movement_details").insert({
        movement_id: movementId,
        product_id: detail.product_id,
        barcode: detail.barcode,
        quantity: detail.quantity,
        status: "REGISTERED",
      });

      // Llamar a la función updateProductStock del controlador de productos
      await updateProductStock(
        detail.product_id,
        detail.quantity,
        tempMovement.type,
        userId
      );
    }

    // Guardar los detalles del movimiento para productos no registrados
    for (const detail of unregistered) {
      await supabase.from("movement_details").insert({
        movement_id: movementId,
        product_id: null,
        barcode: detail.barcode,
        quantity: detail.quantity,
        status: "UNREGISTERED",
      });
    }

    // Eliminar el carrito temporal y sus detalles
    await supabase
      .from("temp_movement_details")
      .delete()
      .eq("temp_movement_id", id);
    await supabase.from("temp_movements").delete().eq("id", id);

    // Si hay productos no registrados, indicar que el usuario debe tomar una acción
    if (unregistered.length > 0) {
      return res.status(200).json({
        message:
          "Movimiento confirmado correctamente, pero hay productos no registrados pendientes.",
        unregisteredProducts: unregistered.map((p) => ({
          barcode: p.barcode,
          quantity: p.quantity,
        })),
      });
    }

    res.status(200).json({ message: "Movimiento confirmado correctamente." });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

// 5. Detectar Movimientos Incompletos (Paso 2 Pendiente)
export const getIncompleteMovements = async (req, res) => {
  try {
    const userId = req.user.id;

    // Consultar movimientos con productos no registrados pendientes
    const { data: incompleteMovements, error: fetchError } = await supabase
      .from("movements")
      .select(
        `
                *,
                details:movement_details(*)
            `
      )
      .eq("created_by", userId)
      .eq("status", "COMPLETED_WITH_UNREGISTERED");

    if (fetchError) return res.status(500).json({ error: fetchError.message });
    if (!incompleteMovements || incompleteMovements.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay movimientos incompletos pendientes." });
    }

    // Filtrar solo los productos no registrados que no están en pending_reviews
    const movementsWithUnregistered = [];
    for (const movement of incompleteMovements) {
      const filteredDetails = [];
      for (const detail of movement.details) {
        if (detail.status === "UNREGISTERED") {
          // Verificar si el producto ya está en pending_reviews
          const { data: existingReview, error: reviewError } = await supabase
            .from("pending_reviews")
            .select("*")
            .eq("movement_id", movement.id)
            .eq("barcode", detail.barcode)
            .maybeSingle();
          if (reviewError && reviewError.message !== "No rows found") {
            return res.status(500).json({ error: reviewError.message });
          }
          if (!existingReview) {
            filteredDetails.push(detail);
          }
        }
      }
      if (filteredDetails.length > 0) {
        movementsWithUnregistered.push({
          ...movement,
          details: filteredDetails,
        });
      }
    }

    if (movementsWithUnregistered.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay movimientos incompletos pendientes." });
    }

    res.status(200).json(movementsWithUnregistered);
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};

export const handleUnregisteredProducts = async (req, res) => {
  try {
    const { id } = req.params; // ID del movimiento
    const userId = req.user.id;

    // Validar que el ID del movimiento sea un UUID válido
    function isValidUUID(uuid) {
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        uuid
      );
    }

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "ID de movimiento inválido." });
    }
    if (!isValidUUID(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }

    // Obtener los detalles del movimiento
    const { data: movementDetails, error: detailsError } = await supabase
      .from("movement_details")
      .select("*")
      .eq("movement_id", id)
      .eq("status", "UNREGISTERED");

    if (detailsError)
      return res.status(500).json({ error: detailsError.message });
    if (!movementDetails || movementDetails.length === 0) {
      return res.status(404).json({
        error: "No hay productos no registrados pendientes en este movimiento.",
      });
    }

    let productsSaved = false; // Bandera para rastrear inserciones

    // Procesar los productos no registrados
    for (const detail of movementDetails) {
      // Validar los datos
      if (detail.barcode.trim() === "") {
        return res
          .status(400)
          .json({ error: "El campo 'barcode' debe ser una cadena no vacía." });
      }
      if (typeof detail.quantity !== "number" || detail.quantity <= 0) {
        return res
          .status(400)
          .json({ error: "El campo 'quantity' debe ser un número positivo." });
      }

      // Verificar si el producto ya está en pending_reviews
      const { data: existingReview, error: reviewError } = await supabase
        .from("pending_reviews")
        .select("*")
        .eq("movement_id", id)
        .eq("barcode", detail.barcode)
        .maybeSingle();

      if (reviewError && reviewError.message !== "No rows found") {
        return res.status(500).json({ error: reviewError.message });
      }

      console.log("Producto ya en pending_reviews:", !!existingReview);

      if (!existingReview) {
        const { error: insertError } = await supabase
          .from("pending_reviews")
          .insert({
            movement_id: id,
            barcode: detail.barcode,
            quantity: detail.quantity,
            created_by: userId,
          });

        if (insertError) {
          return res.status(500).json({ error: insertError.message });
        }

        productsSaved = true; // Marcar que se guardó un producto
      }
    }

    // Actualizar el estado del movimiento si no quedan productos pendientes
    const { data: remainingUnregistered, error: remainingError } =
      await supabase
        .from("movement_details")
        .select("*")
        .eq("movement_id", id)
        .eq("status", "UNREGISTERED");

    if (remainingError)
      return res.status(500).json({ error: remainingError.message });

    if (remainingUnregistered.length === 0) {
      await supabase
        .from("movements")
        .update({ status: "COMPLETED" })
        .eq("id", id);
    }

    if (!productsSaved) {
      return res.status(400).json({
        error:
          "Todos los productos ya fueron guardados para revisión previamente.",
      });
    }

    res.status(200).json({
      message:
        "Productos no registrados guardados para revisión correctamente.",
    });
  } catch (err) {
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};
