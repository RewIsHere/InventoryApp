import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/db.js"; // Configuración de Supabase

// Función de Registro de Usuario
const register = async (username, name, surnames, email, password, role = "employee") => {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos (Supabase)
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, name, surnames, email, password: hashedPassword, role }])
        .select(); // `select()` obtiene los datos insertados

    if (error) throw new Error(error.message); // Si hay un error, lanzamos una excepción

    return data[0]; // Retorna el usuario registrado
};

// Función de Login de Usuario
const login = async (email, password) => {
    // Buscar al usuario por su email
    const { data, error } = await supabase
        .from("users")
        .select("id, email, password, username, role") // Seleccionamos los campos necesarios
        .eq("email", email) // Filtramos por email
        .single(); // Usamos .single() para obtener solo un resultado

    if (error || !data) throw new Error("Usuario no encontrado");

    // Verificar si la contraseña ingresada coincide con la encriptada
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    // Crear un token JWT
    const token = jwt.sign({ id: data.id, role: data.role }, process.env.JWT_SECRET, {
        expiresIn: "7d", // El token será válido por 7 días
    });

    // Retornar el token y los detalles del usuario
    return { token, user: { id: data.id, email: data.email, name: data.name, role: data.role } };
};

export { register, login };
