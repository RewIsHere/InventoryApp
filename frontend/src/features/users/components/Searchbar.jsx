import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import styles from "./Searchbar.module.css";

const Searchbar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === "") {
      onSearch?.("");
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      onSearch?.(query.trim());
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Evita que el evento se propague
    if (query.trim() !== "") {
      onSearch?.(query.trim());
    }
  };

  const handleClear = (e) => {
    e.stopPropagation(); // Evita que el evento se propague
    setQuery("");
    onSearch?.("");
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
        onKeyUp={handleKeyUp}
        className={styles.searchInput}
      />
      {query && <FiX className={styles.clearIcon} onClick={handleClear} />}
    </motion.div>
  );
};

export default Searchbar;
