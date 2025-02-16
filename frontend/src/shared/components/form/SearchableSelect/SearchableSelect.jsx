import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importamos AnimatePresence
import { FaChevronDown, FaCheck } from "react-icons/fa"; // Importamos el ícono de la flecha y el check
import styles from "./SearchableSelect.module.css";
import { FaSearch } from "react-icons/fa"; // Importar el ícono de búsqueda

const SearchableSelect = ({
  options,
  onCreateOption,
  placeholder = "Buscar categoría...",
  actionLabel = "Crear nueva categoría",
  label = "Label",
  placeholderSearch = "Buscar categoria...",
  value, // Aceptar el valor seleccionado como prop
  onChange, // Función para manejar cambios en la selección
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
  const containerRef = useRef(null);

  // Sincronizar el estado interno con la prop `value`
  useEffect(() => {
    const selected = options.find((option) => option.value === value);
    setSelectedOption(selected || null);
  }, [value, options]);

  // Función para normalizar cadenas de texto
  const normalizeString = (str) => {
    if (!str || typeof str !== "string") {
      return ""; // Devolver una cadena vacía si el valor no es válido
    }
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Filtrar opciones válidas
  const filteredOptions = options
    .filter((option) => option && typeof option.label === "string") // Filtrar solo opciones válidas
    .filter((option) =>
      normalizeString(option.label).includes(normalizeString(searchTerm))
    );

  // Manejar selección de una opción
  const handleSelect = (option) => {
    setSelectedOption(option); // Actualiza la opción seleccionada
    setSearchTerm(""); // Limpia el término de búsqueda
    setIsOpen(false); // Cierra el menú
    onChange(option.value); // Notifica al padre sobre la selección
  };

  // Manejar creación de una nueva opción
  const handleCreateOption = () => {
    if (searchTerm.trim() !== "") {
      onCreateOption(searchTerm);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  // Cerrar el menú al hacer clic fuera
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.label}>{label}</div>
      {/* Barra para abrir el menú */}
      <motion.div
        className={styles.openMenuBar}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.placeholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {/* Animación de la flecha */}
        <motion.div
          className={styles.arrowIcon}
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }} // Rotación de la flecha
          transition={{ duration: 0.3 }}
        >
          <FaChevronDown /> {/* Icono de la flecha */}
        </motion.div>
      </motion.div>
      {/* Lista desplegable con animación al abrir y cerrar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdownContainer}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} // Añadimos animación de salida
            transition={{ duration: 0.2 }}
          >
            <motion.div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={placeholderSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </motion.div>
            {/* Animamos solo el contenedor de las opciones (dropdownContainer) */}
            <motion.div
              className={styles.optionsWrapper} // Aquí lo envolvemos para aplicar la animación
              initial={{ height: 0 }}
              animate={{
                height: filteredOptions.length > 0 ? "auto" : "30px", // Definimos el tamaño mínimo cuando no hay opciones
              }}
              transition={{
                duration: filteredOptions.length > 0 ? 0.3 : 0.15, // Diferente duración para la expansión y contracción
              }}
            >
              <motion.ul className={styles.optionsList}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <motion.li
                      key={option.value}
                      className={`${styles.optionItem} ${
                        selectedOption && selectedOption.value === option.value
                          ? styles.selectedOption
                          : ""
                      }`} // Aplica clase si es la opción seleccionada
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                      {selectedOption &&
                        selectedOption.value === option.value && (
                          <span className={styles.checkIcon}>
                            <FaCheck />
                          </span>
                        )}
                    </motion.li>
                  ))
                ) : (
                  <motion.li className={styles.noResults}>
                    No hay resultados
                  </motion.li>
                )}
              </motion.ul>
            </motion.div>
            {filteredOptions.length === 0 && (
              <motion.div className={styles.actionContainer}>
                <motion.button
                  className={styles.actionButton}
                  onClick={handleCreateOption}
                  whileTap={{ scale: 0.95 }}
                >
                  + {actionLabel} "{searchTerm}"
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableSelect;
