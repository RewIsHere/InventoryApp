import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importamos AnimatePresence y motion
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ images }) => {
  // Generar IDs únicos una sola vez al inicio
  const imagesWithIds = React.useMemo(
    () =>
      images.map((url, index) => ({
        id: `image-${index}-${Date.now()}`, // ID único basado en el índice y la marca de tiempo
        url,
      })),
    [images]
  );

  const [selectedImage, setSelectedImage] = useState(imagesWithIds[0]); // Imagen seleccionada inicialmente
  const [visibleIndex, setVisibleIndex] = useState(0); // Índice inicial de las miniaturas visibles

  // Manejar el clic en una miniatura
  const handleThumbnailClick = (image) => {
    setSelectedImage(image); // Actualizar la imagen seleccionada
  };

  // Desplazar hacia arriba (mostrar imágenes anteriores)
  const scrollUp = () => {
    if (visibleIndex > 0) {
      setVisibleIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Desplazar hacia abajo (mostrar imágenes siguientes)
  const scrollDown = () => {
    if (visibleIndex + 5 < imagesWithIds.length) {
      setVisibleIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className={styles.galleryContainer}>
      {/* Imagen principal */}
      <div className={styles.mainImageContainer}>
        <AnimatePresence mode="wait"> {/* Añadimos AnimatePresence */}
          <motion.img
            key={selectedImage.id} // Clave única para identificar la imagen
            src={selectedImage.url}
            alt="Main"
            className={styles.mainImage}
            initial={{ opacity: 0, scale: 0.95 }} // Estado inicial de la animación
            animate={{ opacity: 1, scale: 1 }} // Estado final de la animación
            exit={{ opacity: 0, scale: 0.95 }} // Estado de salida de la animación
            transition={{ duration: 0.2, ease: "easeInOut" }} // Duración y tipo de transición
          />
        </AnimatePresence>
      </div>

      {/* Lista de miniaturas */}
      {imagesWithIds.length > 1 && (
        <div className={styles.thumbnailListContainer} key={visibleIndex}>
          {/* Flecha hacia arriba */}
          <button
            className={`${styles.scrollButton} ${styles.scrollUp}`}
            onClick={scrollUp}
            disabled={visibleIndex === 0}
          >
            ▲
          </button>

          {/* Miniaturas visibles */}
          <div className={styles.thumbnailList}>
            {imagesWithIds.slice(visibleIndex, visibleIndex + 5).map((image) => (
              <div
                key={image.id} // Usamos el ID único como clave
                className={`${styles.thumbnailContainer} ${
                  selectedImage.id === image.id ? styles.selected : ""
                }`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img src={image.url} alt={`Thumbnail ${image.id}`} className={styles.thumbnail} />
              </div>
            ))}
          </div>

          {/* Flecha hacia abajo */}
          <button
            className={`${styles.scrollButton} ${styles.scrollDown}`}
            onClick={scrollDown}
            disabled={visibleIndex + 5 >= imagesWithIds.length}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;