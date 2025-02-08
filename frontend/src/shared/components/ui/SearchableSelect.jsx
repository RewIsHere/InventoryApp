import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./SearchableSelect.module.css";

const SearchableSelect = ({ options, onCreateOption, placeholder = "Buscar...", actionLabel = "Crear nueva categoría" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar opciones basadas en el término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la selección de una opción
  const handleSelect = (option) => {
    console.log("Opción seleccionada:", option);
    setIsOpen(false); // Cerrar el menú después de seleccionar
  };

  // Manejar la creación de una nueva opción
  const handleCreateOption = () => {
    if (searchTerm.trim() !== "") {
      onCreateOption(searchTerm); // Llamar a la función del padre para crear la nueva opción
      setSearchTerm(""); // Limpiar el campo de búsqueda
      setIsOpen(false); // Cerrar el menú
    }
  };

  return (
    <div className={styles.container}>
      {/* Barra de búsqueda */}
      <motion.div
        className={styles.searchBar}
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.98 }}
      >
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </motion.div>

      {/* Lista desplegable */}
      {isOpen && (
        <motion.ul
          className={styles.optionsList}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <motion.li
                key={option.value}
                className={styles.optionItem}
                onClick={() => handleSelect(option)}
                whileHover={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                {option.label}
              </motion.li>
            ))
          ) : (
            <li className={styles.noResults}>No hay resultados</li>
          )}
        </motion.ul>
      )}

      {/* Botón de acción */}
      <motion.button
        className={styles.actionButton}
        onClick={handleCreateOption}
        whileTap={{ scale: 0.95 }}
      >
        {actionLabel}
      </motion.button>
    </div>
  );
};

export default SearchableSelect;