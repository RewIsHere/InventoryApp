import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Pagination.module.css";

const Pagination = ({ totalPages }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    searchParams.set("page", page);
    navigate(`?${searchParams.toString()}`);
  };

  // Generar los números de página visibles
  const getVisiblePages = () => {
    const visiblePages = [];
    if (totalPages <= 5) {
      // Si hay 5 o menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Mostrar un rango dinámico alrededor de la página actual
      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        visiblePages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationContainer}>
      {/* Botón Anterior */}
      <motion.button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Anterior
      </motion.button>

      {/* Números de Página */}
      <div className={styles.pages}>
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={index} className={styles.ellipsis}>
                ...
              </span>
            );
          }
          return (
            <motion.button
              key={page}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              onClick={() => handlePageChange(page)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {page}
            </motion.button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <motion.button
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Siguiente
      </motion.button>
    </div>
  );
};

export default Pagination;