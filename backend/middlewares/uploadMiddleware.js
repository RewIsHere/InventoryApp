import multer from 'multer';

// Configuración de almacenamiento temporal
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage });

export const uploadImageMiddleware = upload.single('image'); // Campo 'image' en el formulario