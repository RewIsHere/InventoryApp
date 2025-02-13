import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi"; // Importamos ambos íconos
import styles from "./Searchbar.module.css";

const Searchbar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      onSearch?.(query.trim()); // Llamamos a onSearch con el texto ingresado
    }
  };

  const handleIconClick = () => {
    if (query.trim() !== "") {
      onSearch?.(query.trim()); // Llamamos a onSearch con el texto ingresado
    }
  };

  const handleClear = () => {
    setQuery(""); // Limpiar el input
    onSearch?.(""); // Llamamos a onSearch con una cadena vacía para eliminar el parámetro search de la URL
  };

  return (
    <motion.div
      className={styles.searchContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FiSearch className={styles.searchIcon} onClick={handleIconClick} />
      <motion.input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
      />
      {query && <FiX className={styles.clearIcon} onClick={handleClear} />}
    </motion.div>
  );
};

export default Searchbar;
