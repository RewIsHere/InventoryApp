import express from "express";
import cors from "cors";
//import authRoutes from "./routes/auth.routes.js";
//import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
//app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
