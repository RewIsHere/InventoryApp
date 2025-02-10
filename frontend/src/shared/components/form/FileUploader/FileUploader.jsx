import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FileUploader.module.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    console.log("Archivos seleccionados para cargar:", selectedFiles);
    addFiles(selectedFiles);

    // Resetear el valor del input para permitir la subida del mismo archivo
    fileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    console.log("Archivos soltados:", droppedFiles);
    addFiles(droppedFiles);
  };

  const addFiles = (newFiles) => {
    const updatedFiles = newFiles.map((file) => ({
      id: Date.now() + Math.random(), // Nuevo ID único para cada archivo
      file,
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
      progress: 0,
    }));

    console.log("Archivos añadidos:", updatedFiles);
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    simulateUpload(updatedFiles);
  };

  const simulateUpload = (filesToUpload) => {
    filesToUpload.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progress = Math.min(progress, 100); // Asegurarse de que no exceda el 100%
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f))
        );
        if (progress >= 100) {
          clearInterval(interval);
          console.log(`Carga completa para el archivo: ${file.file.name}`);
        }
      }, 300); // Incremento de 10% cada 300 ms (total: 3 segundos)
    });
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        console.log("Eliminando archivo:", fileToRemove.file.name);
        URL.revokeObjectURL(fileToRemove.url);
      }
      return updatedFiles;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.container}>
      {/* Zona de arrastre y carga */}
      <motion.div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
        <span className={styles.icon}>🖼️</span>
        <p>
          {isDragging
            ? "Suelta los archivos aquí"
            : "Arrastra los archivos aquí o haz clic para seleccionarlos"}
        </p>
      </motion.div>

      {/* Lista de archivos */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className={styles.fileList}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  className={styles.card}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Barra de progreso */}
                  <AnimatePresence>
                    {file.progress < 100 && (
                      <motion.div
                        className={styles.progressBarBackground}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }} // Animación de desvanecimiento
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.div
                          className={styles.progressBarFill}
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${file.progress}%`, // Calcula dinámicamente el ancho
                          }}
                          transition={{
                            duration: 0.3, // Duración de la animación (ajustada al tiempo de simulación)
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Contenido del Card */}
                  <div className={styles.cardContent}>
                    <img src={file.url} alt={file.file.name} className={styles.thumbnail} />
                    <div className={styles.details}>
                      <p className={styles.fileName}>{file.file.name}</p>
                      <p className={styles.fileSize}>{file.size}</p>
                    </div>
                    {file.progress < 100 ? (
                      <div className={styles.progressContainer}>
                        <svg className={styles.spinner} viewBox="0 0 36 36">
                          <circle
                            className={styles.progressRing}
                            cx="18"
                            cy="18"
                            r="16"
                            strokeDasharray="100"
                            strokeDashoffset={100 - file.progress}
                            transition={{ duration: 0.3, ease: "linear" }}
                          />
                        </svg>
                        <p className={styles.progressText}>{file.progress}%</p>
                      </div>
                    ) : null}

                    {/* Botón de eliminar */}
                    {file.progress === 100 && (
                      <motion.button
                        className={styles.removeButton}
                        onClick={() => removeFile(file.id)}
                        whileTap={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        ✖️
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;