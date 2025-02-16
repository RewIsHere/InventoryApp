import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FileUploader.module.css";
import ImageIcon from "@Assets/Image.svg?react";

const FileUploader = ({ label = "label", onFilesChange, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(""); // Estado para mostrar error de tipo de archivo
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;
    const validFiles = filterValidFiles(selectedFiles);

    if (validFiles.length > 0) {
      addFiles(validFiles);
      onFilesChange?.(validFiles);
    } else {
      setError("Solo se permiten archivos PNG, JPEG, o JPG.");
    }
    fileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    const validFiles = filterValidFiles(droppedFiles);

    if (validFiles.length > 0) {
      addFiles(validFiles);
      onFilesChange?.(validFiles);
    } else {
      setError("Solo se permiten archivos PNG, JPEG, o JPG.");
    }
  };

  const filterValidFiles = (files) => {
    const validExtensions = ["image/png", "image/jpeg", "image/jpg"];
    return files.filter((file) => validExtensions.includes(file.type));
  };

  const addFiles = (newFiles) => {
    const updatedFiles = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      size: formatFileSize(file.size),
      progress: 0,
    }));
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    simulateUpload(updatedFiles);
  };

  const simulateUpload = (filesToUpload) => {
    filesToUpload.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        progress = Math.min(progress, 100);
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f))
        );
        if (progress >= 100) {
          clearInterval(interval);
          if (files.every((f) => f.progress === 100)) {
            onUploadComplete?.(true);
          }
        }
      }, 300);
    });
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
        onFilesChange?.(updatedFiles.map((f) => f.file));
      }
      return updatedFiles;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  useEffect(() => {
    if (files.every((f) => f.progress === 100)) {
      onUploadComplete?.(true);
    }
  }, [files, onUploadComplete]);

  return (
    <div className={styles.container}>
      {label}
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
        <span className={styles.icon}>
          <ImageIcon />
        </span>
        <p>
          {isDragging
            ? "Suelta los archivos aquí"
            : "Arrastra los archivos aquí o haz clic para seleccionarlos"}
        </p>
      </motion.div>

      {/* Mostrar mensaje de error si los archivos no son válidos */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className={styles.fileList}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
                <div className={styles.cardContent}>
                  <img
                    src={file.url}
                    alt={file.file.name}
                    className={styles.thumbnail}
                  />
                  <div className={styles.details}>
                    <p className={styles.fileName}>{file.file.name}</p>
                    <p className={styles.fileSize}>{file.size}</p>
                  </div>
                  <div className={styles.removeContainer}>
                    <motion.button
                      className={styles.removeButton}
                      onClick={() => removeFile(file.id)}
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      type="button"
                    >
                      ✖️
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
