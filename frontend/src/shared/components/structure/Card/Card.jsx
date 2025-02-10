import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Card.module.css";

const Card = ({
  children,
  shadow = "none",
  radius = "none",
  fullWidth = false,
  isHoverable = false,
  isPressable = false,
  isBlurred = false,
  isFooterBlurred = false,
  isDisabled = false,
  disableAnimation = false,
  disableRipple = false,
  allowTextSelectionOnPress = false,
  classNames = {},
  onPress,
  onPressStart,
  onPressEnd,
  onPressChange,
  onPressUp,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = (e) => {
    setIsPressed(true);
    onPressStart?.(e);
    onPressChange?.(true);
  };

  const handlePressEnd = (e) => {
    setIsPressed(false);
    onPressEnd?.(e);
    onPressChange?.(false);
  };

  const handlePressUp = (e) => {
    onPressUp?.(e);
  };

  const handleClick = (e) => {
    if (!isDisabled) onPress?.(e);
  };

  return (
    <motion.div
      className={`
        ${styles.card} 
        ${styles[shadow]} 
        ${styles[radius]} 
        ${fullWidth ? styles.fullWidth : ""} 
        ${isHoverable ? styles.hoverable : ""} 
        ${isPressable ? styles.pressable : ""} 
        ${isBlurred ? styles.blurred : ""} 
        ${isFooterBlurred ? styles.footerBlurred : ""} 
        ${isDisabled ? styles.disabled : ""} 
        ${allowTextSelectionOnPress ? styles.allowTextSelectionOnPress : ""}
        ${classNames.base || ""}
      `}
      initial={disableAnimation ? {} : { opacity: 0, y: 20 }}
      animate={disableAnimation ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileTap={isPressable && !disableAnimation ? { scale: 0.98 } : {}}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onMouseUpCapture={handlePressUp}
      onClick={handleClick}
      style={{ userSelect: allowTextSelectionOnPress ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
