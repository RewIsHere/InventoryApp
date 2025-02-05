export const adminMiddleware = (req, res, next) => {
    // Verificar si el usuario tiene el rol "admin" o "superadmin"
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ error: "Access denied. Admin or superadmin privileges required." });
    }
    next();
};