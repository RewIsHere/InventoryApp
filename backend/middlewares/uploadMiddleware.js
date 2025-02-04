import multer from 'multer';

// Función para filtrar archivos permitidos
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes JPEG, PNG y JPG.'), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño: 5MB
});

export const uploadImageMiddleware = upload.single('image'); // Asegúrate de usar 'image' aquí