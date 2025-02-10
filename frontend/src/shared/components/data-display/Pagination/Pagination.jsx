import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importar los íconos
import styles from "./Pagination.module.css";

const Pagination = ({ totalPages }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const buttonsRef = useRef([]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      searchParams.set("page", page);
      navigate(`?${searchParams.toString()}`);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(" ... ");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(" ... ");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(" ... ");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(" ... ");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getPageNumbers();

  useEffect(() => {
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  return (
    <div className={styles.paginationContainer}>
      {/* Reemplazar el texto con el ícono de flecha izquierda */}
      <motion.button
        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaChevronLeft /> {/* Flecha izquierda */}
      </motion.button>

      <div className={styles.pages}>
        {/* Fondo animado alineado correctamente con escalado */}
        <motion.div
          className={styles.pageActiveBackground}
          layout
          layoutId="bubble"
          initial={false}
          animate={{
            x: buttonsRef.current[visiblePages.indexOf(currentPage)]?.offsetLeft || 0,
            width: buttonsRef.current[visiblePages.indexOf(currentPage)]?.offsetWidth || 45,
            scale: 1.1, // Añadimos el efecto de escalado
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {visiblePages.map((page, index) => {
          const key = typeof page === "number" ? `page-${page}` : `ellipsis-${index}`;

          if (page === "...") {
            return (
              <span key={key} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={key}
              ref={(el) => (buttonsRef.current[index] = el)}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Reemplazar el texto con el ícono de flecha derecha */}
      <motion.button
        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaChevronRight /> {/* Flecha derecha */}
      </motion.button>
    </div>
  );
};

export default Pagination;
