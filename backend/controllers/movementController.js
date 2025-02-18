import supabase from "../config/db.js";
import { updateProductStock } from "./productController.js";

// Listar movimientos finalizados
export const listMovements = async (req, res) => {
  try {
    const {
      type,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 20;
    const fromIndex = (pageNumber - 1) * pageSize;
    const toIndex = pageNumber * pageSize - 1;

    let query = supabase.from("movements").select(
      `*,
      created_by:users(*),
      details:movement_details(*, product:products(*))`,
      { count: "exact" }
    );

    if (type) query = query.eq("type", type.toUpperCase());

    if (startDate && endDate)
      query = query.range("created_at", startDate, endDate);

    if (search) query = query.eq("id", search);

    query = query.range(fromIndex, toIndex);

    const { data, error, count } = await query;

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({
      movements: data,
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
      const newQuantity = existingProduct.quantity + quantity;
      const { error } = await supabase
        .from("temp_movement_details")
        .update({ quantity: newQuantity })
        .eq("id", existingProduct.id);

      if (error) return res.status(500).json({ error: error.message });

      // Devolver los detalles actualizados del producto
      return res.status(200).json({
        message: "Cantidad del producto actualizada correctamente.",
        product: { barcode, quantity: newQuantity },
      });
    } else {
      // Si el producto no existe, insertarlo
      const { error } = await supabase.from("temp_movement_details").insert({
        temp_movement_id: id,
        barcode,
        quantity,
      });

      if (error) return res.status(500).json({ error: error.message });

      // Devolver los detalles del nuevo producto
      return res.status(201).json({
        message: "Producto escaneado correctamente.",
        product: { barcode, quantity },
      });
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
    const { id } = req.params; // ID del carrito temporal
    const userId = req.user.id;

    console.log("Iniciando confirmación de movimiento. ID del carrito:", id);

    // Validar que el carrito temporal exista, pertenezca al usuario y esté pendiente
    const { data: tempMovement, error: tempError } = await supabase
      .from("temp_movements")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (tempError) {
      console.error(
        "Error al consultar el carrito temporal:",
        tempError.message
      );
      return res.status(500).json({ error: tempError.message });
    }
    if (!tempMovement) {
      console.error("Carrito temporal no encontrado o ya confirmado.");
      return res.status(404).json({
        error:
          "Carrito temporal no encontrado, no pertenece al usuario o ya fue confirmado.",
      });
    }

    console.log("Carrito temporal encontrado:", tempMovement);

    // Obtener los detalles del carrito temporal
    const { data: tempDetails, error: detailsError } = await supabase
      .from("temp_movement_details")
      .select("*")
      .eq("temp_movement_id", id);

    if (detailsError) {
      console.error(
        "Error al obtener los detalles del carrito temporal:",
        detailsError.message
      );
      return res.status(500).json({ error: detailsError.message });
    }
    if (tempDetails.length === 0) {
      console.error("No hay productos escaneados en este carrito.");
      return res
        .status(400)
        .json({ error: "No hay productos escaneados en este carrito." });
    }

    console.log("Detalles del carrito temporal obtenidos:", tempDetails);

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
        console.error(
          "Error al verificar si el producto está registrado:",
          productError.message
        );
        return res.status(500).json({ error: productError.message });
      }

      if (product) {
        registered.push({ ...detail, product_id: product.id });
      } else {
        unregistered.push(detail);
      }
    }

    console.log("Productos registrados:", registered);
    console.log("Productos no registrados:", unregistered);

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

    if (movementError) {
      console.error(
        "Error al crear el movimiento finalizado:",
        movementError.message
      );
      return res.status(500).json({ error: movementError.message });
    }

    const movementId = movement[0].id;
    console.log("Movimiento finalizado creado. ID:", movementId);

    // Guardar los detalles del movimiento para productos registrados
    for (const detail of registered) {
      const { error: registeredInsertError } = await supabase
        .from("movement_details")
        .insert({
          movement_id: movementId,
          product_id: detail.product_id,
          barcode: detail.barcode,
          quantity: detail.quantity,
          status: "REGISTERED",
        });

      if (registeredInsertError) {
        console.error(
          "Error al insertar detalle de producto registrado:",
          registeredInsertError.message
        );
        return res.status(500).json({ error: registeredInsertError.message });
      }

      console.log(
        "Detalle de producto registrado insertado correctamente:",
        detail
      );

      // Llamar a la función updateProductStock del controlador de productos
      await updateProductStock(
        detail.product_id,
        detail.quantity,
        tempMovement.type,
        userId
      );
    }

    console.log("Todos los productos registrados procesados correctamente.");

    // Guardar los productos no registrados en movement_details con STATUS "UNREGISTERED"
    if (unregistered.length > 0) {
      for (const detail of unregistered) {
        console.log("Intentando insertar producto no registrado:", detail);

        const { error: unregisteredInsertError } = await supabase
          .from("movement_details")
          .insert({
            movement_id: movementId,
            product_id: null, // No tiene ID porque no está registrado
            barcode: detail.barcode,
            quantity: detail.quantity,
            status: "UNREGISTERED",
          });

        if (unregisteredInsertError) {
          console.error(
            "Error al insertar detalle de producto no registrado:",
            unregisteredInsertError.message
          );
          return res.status(500).json({
            error:
              "Error al registrar productos no registrados en movement_details.",
          });
        }

        console.log(
          "Producto no registrado insertado correctamente en movement_details:",
          detail
        );

        // También guardarlos en pending_reviews
        const { error: reviewInsertError } = await supabase
          .from("pending_reviews")
          .insert({
            movement_id: movementId,
            barcode: detail.barcode,
            quantity: detail.quantity,
            created_at: new Date(),
            created_by: userId,
          });

        if (reviewInsertError) {
          console.error(
            "Error al insertar en pending_reviews:",
            reviewInsertError.message
          );
          return res
            .status(500)
            .json({ error: "Error al registrar productos no registrados." });
        }

        console.log(
          "Producto no registrado insertado correctamente en pending_reviews:",
          detail
        );
      }
    }

    console.log("Todos los productos no registrados procesados correctamente.");

    // Eliminar el carrito temporal y sus detalles
    const { error: deleteDetailsError } = await supabase
      .from("temp_movement_details")
      .delete()
      .eq("temp_movement_id", id);

    if (deleteDetailsError) {
      console.error(
        "Error al eliminar los detalles del carrito temporal:",
        deleteDetailsError.message
      );
      return res.status(500).json({ error: deleteDetailsError.message });
    }

    const { error: deleteCartError } = await supabase
      .from("temp_movements")
      .delete()
      .eq("id", id);

    if (deleteCartError) {
      console.error(
        "Error al eliminar el carrito temporal:",
        deleteCartError.message
      );
      return res.status(500).json({ error: deleteCartError.message });
    }

    console.log("Carrito temporal eliminado correctamente.");

    // Devolver una respuesta adecuada
    if (unregistered.length > 0) {
      return res.status(200).json({
        message:
          "Movimiento confirmado correctamente, pero hay productos no registrados enviados a revisión pendiente.",
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

// Eliminar un movimiento temporal y sus detalles
export const deleteTempMovement = async (req, res) => {
  try {
    const { id } = req.params; // ID del movimiento temporal
    const userId = req.user.id;

    // Validar que el ID sea un UUID válido
    function isValidUUID(uuid) {
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        uuid
      );
    }

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ error: "ID de movimiento temporal inválido." });
    }
    if (!isValidUUID(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }

    // Verificar si el movimiento temporal existe y pertenece al usuario
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
        error: "Movimiento temporal no encontrado o no pertenece al usuario.",
      });
    }

    // Intentar eliminar los detalles del movimiento temporal
    const { error: detailsDeleteError } = await supabase
      .from("temp_movement_details")
      .delete()
      .eq("temp_movement_id", id);

    if (detailsDeleteError) {
      return res.status(500).json({ error: detailsDeleteError.message });
    }

    console.log("Detalles del movimiento temporal eliminados correctamente.");

    // Eliminar el movimiento temporal
    const { error: movementDeleteError } = await supabase
      .from("temp_movements")
      .delete()
      .eq("id", id);

    if (movementDeleteError) {
      return res.status(500).json({ error: movementDeleteError.message });
    }

    console.log("Movimiento temporal eliminado correctamente.");

    // Respuesta final
    res.status(200).json({
      message: "Movimiento temporal y sus detalles eliminados correctamente.",
    });
  } catch (err) {
    console.error("Error inesperado:", err.message);
    res.status(500).json({ error: "Ocurrió un error inesperado." });
  }
};
