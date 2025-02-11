import React, { createContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/toast/Toast";
import styles from "../components/toast/Toast/Toast.module.css";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Función para agregar una nueva notificación
  const addNotification = (message, type = "success", duration = 3000) => {
    const id = Date.now(); // ID único para cada notificación
    setNotifications((prev) => [
      ...prev,
      { id, message, type, isVisible: true },
    ]);

    // Ocultar automáticamente después de `duration` milisegundos
    setTimeout(() => removeNotification(id), duration);
  };

  // Función para eliminar una notificación
  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ addNotification }}>
      {children}
      {/* Renderizar todas las notificaciones */}
      <div className={styles.toastWrapper}>
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <Toast
              key={notification.id}
              notification={notification}
              onRemove={() => removeNotification(notification.id)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};