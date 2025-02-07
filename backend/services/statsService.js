import supabase from "../config/db.js";

// Servicio para obtener el número total de productos
export const getTotalProductsService = async () => {
    const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact" }); // Contar todos los productos

    if (error) {
        throw new Error("Error fetching total products");
    }

    return { totalProducts: count };
};

// Servicio para obtener el número de productos con stock bajo
export const getTotalLowStockProductsService = async () => {
    const { data, error } = await supabase.rpc("get_low_stock_products_count");
    if (error) {
        console.error("Database error:", error.message); // Registrar el error para depuración
        throw new Error("Error fetching low stock products");
    }
    return { lowStockProducts: data || 0 }; // Asegurarse de devolver 0 si data es null
};

// Servicio para obtener los 5 productos con stock más bajo (stock < min_stock)
export const getLowStockProductsService = async () => {
    try {
        // Llamar la función RPC
        const { data, error } = await supabase.rpc("get_low_stock_products");

        if (error) {
            console.error("Database error:", error.message); // Registrar el error para depuración
            throw new Error("Error fetching low stock products");
        }

        // Formatear los resultados si es necesario
        const formattedProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
            min_stock: product.min_stock,
            category: product.category_name || "No category", // Nombre de la categoría o un valor predeterminado
            image: product.image_url || "No image",                // Primera imagen o null si no hay imágenes
        }));

        return formattedProducts;
    } catch (err) {
        console.error("Unexpected error:", err.message);
        throw err;
    }
};

// Servicio para obtener el número total de entradas y salidas
export const getMovementStatsService = async () => {
    // Contar entradas (type = 'ENTRY')
    const { count: entryCount, error: entryError } = await supabase
        .from("movements")
        .select("*", { count: "exact" })
        .eq("type", "ENTRY");

    if (entryError) {
        throw new Error("Error fetching total entries");
    }

    // Contar salidas (type = 'EXIT')
    const { count: exitCount, error: exitError } = await supabase
        .from("movements")
        .select("*", { count: "exact" })
        .eq("type", "EXIT");

    if (exitError) {
        throw new Error("Error fetching total exits");
    }

    return {
        totalEntries: entryCount || 0,
        totalExits: exitCount || 0,
    };
};

// Servicio para obtener los 5 movimientos más recientes
export const getRecentMovementsService = async () => {
    const { data, error } = await supabase
        .from("movements")
        .select(`
            id,
            type,
            created_by:users(name, surnames),
            details:movement_details(barcode)
        `)
        .order("created_at", { ascending: false }) // Ordenar por fecha descendente (más reciente primero)
        .limit(5); // Limitar a 5 movimientos

    if (error) {
        throw new Error("Error fetching recent movements");
    }

    // Formatear los resultados para incluir solo los campos necesarios
    const formattedMovements = data.map(movement => ({
        id: movement.id,
        type: movement.type,
        createdBy: `${movement.created_by.name} ${movement.created_by.surnames}`, // Nombre completo del usuario
        numberOfProducts: movement.details.length, // Número de productos escaneados
    }));

    return formattedMovements;
};