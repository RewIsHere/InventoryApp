import React from "react";
import { motion } from "framer-motion";
import styles from "./Skeleton.module.css";

const Skeleton = ({ width = "100%", height = "20px", borderRadius = "4px" }) => {
  return (
    <motion.div
      className={styles.skeleton}
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
      }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeInOut",
      }}
    ></motion.div>
  );
};

export default Skeleton;