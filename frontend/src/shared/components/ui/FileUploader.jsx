import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FileUploader.module.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejar la selección de archivos
  const handleFileUpload = (event) => {
    setIsLoading(true); // Activar estado de carga
    setTimeout(() => {
      const selectedFiles = Array.from(event.target.files);
      addFiles(selectedFiles);
      setIsLoading(false); // Desactivar estado de carga
    }, 1000); // Simular un pequeño retraso para mostrar la animación
  };

  // Manejar el arrastre de archivos
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setIsLoading(true); // Activar estado de carga
    setTimeout(() => {
      const droppedFiles = Array.from(event.dataTransfer.files);
      addFiles(droppedFiles);
      setIsLoading(false); // Desactivar estado de carga
    }, 1000); // Simular un pequeño retraso para mostrar la animación
  };

  // Agregar archivos al estado
  const addFiles = (newFiles) => {
    const updatedFiles = newFiles.map((file) => ({
      id: Date.now() + Math.random(), // ID único para cada archivo
      file,
      url: URL.createObjectURL(file), // Crear una URL temporal para la vista previa
      size: formatFileSize(file.size),
    }));
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
  };

  // Eliminar un archivo de la lista
  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.container}>
      {/* Zona de carga */}
      <motion.div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
        <span className={styles.icon}>🖼️</span>
        <p>{isDragging ? "Suelta los archivos aquí" : "Arrastra los archivos aquí o haz clic para seleccionarlos"}</p>
        {isLoading && (
          <motion.div
            className={styles.loader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Cargando...
          </motion.div>
        )}
      </motion.div>

      {/* Lista de archivos cargados */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className={styles.fileList}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                className={styles.card}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <img src={file.url} alt={file.file.name} className={styles.thumbnail} />
                <div className={styles.details}>
                  <p className={styles.fileName}>{file.file.name}</p>
                  <p className={styles.fileSize}>{file.size}</p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFile(file.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  ✖️
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;