export const historyMessages = new Map([
  [
    "product_created",
    (details) =>
      `Se creó el producto "${details.name}" con código de barras ${details.barcode}. Stock inicial: ${details.stock}. Mínimo de stock: ${details.min_stock}.`,
  ],

  [
    "product_updated",
    (details) => {
      let changes = [];

      // Verificar cambios en nombre, barcode, descripción
      if (details.name && details.name.old !== details.name.new)
        changes.push(`Nombre: "${details.name.old}" → "${details.name.new}"`);
      if (details.barcode && details.barcode.old !== details.barcode.new)
        changes.push(
          `Código de barras: "${details.barcode.old}" → "${details.barcode.new}"`
        );
      if (
        details.description &&
        details.description.old !== details.description.new
      )
        changes.push(
          `Descripción: "${details.description.old}" → "${details.description.new}"`
        );

      // Verificar cambios en la categoría (nombre de la categoría)
      if (
        details.category_id &&
        details.category_id.old !== details.category_id.new
      ) {
        changes.push(
          `Categoría: "${details.category_name_old}" → "${details.category_name_new}"`
        );
      }

      if (
        details.min_stock &&
        details.min_stock.old !== details.min_stock.new
      ) {
        changes.push(
          `Stock mínimo: "${details.min_stock.old}" → "${details.min_stock.new}"`
        );
      }
      return changes.length > 0
        ? `Se actualizó el producto. Cambios:\n- ${changes.join("\n- ")}`
        : "No hubo cambios en el producto.";
    },
  ],

  [
    "stock_adjustment",
    (details) =>
      `Se ajustó el stock de ${details.old_stock} a ${details.newStock} (Razón: ${details.reason}).`,
  ],

  [
    "stock_added",
    (details) =>
      `Se agregó stock: ${details.quantity} unidades. Tipo de movimiento: ${details.type}.`,
  ],

  [
    "stock_removed",
    (details) =>
      `Se quitó stock: ${details.quantity} unidades. Tipo de movimiento: ${details.type}.`,
  ],

  ["image_uploaded", (details) => `Se subió una nueva imagen del producto.`],

  ["image_deleted", (details) => `Se eliminó una imagen del producto.`],

  [
    "status_updated",
    (details) => `El estado del producto cambió a "${details.status}".`,
  ],

  [
    "product_created_from_pending",
    (details) =>
      `Se creó el producto "${details.name}" desde pendiente de revisión. Código de barras: ${details.barcode}. Stock inicial: ${details.stock}. Movimiento asociado: ${details.movement_id}.`,
  ],
]);
