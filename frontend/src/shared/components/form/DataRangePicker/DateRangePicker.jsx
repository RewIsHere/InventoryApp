import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./DateRangePicker.module.css";

export default function DateRangePicker({ onChange }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [direction, setDirection] = useState("next");
  const [isNavigating, setIsNavigating] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState("bottom");
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Manejar clics fuera del calendario
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsCalendarOpen(false);
        setIsSelecting(false); // Reiniciar selección al cerrar
        setHoveredDate(null); // Limpiar fecha hover
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ajustar posición del calendario
  useEffect(() => {
    if (calendarRef.current && isCalendarOpen) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < calendarRect.height && spaceAbove > calendarRect.height) {
        setCalendarPosition("top");
      } else {
        setCalendarPosition("bottom");
      }

      if (calendarPosition === "top") {
        window.scrollTo({ top: window.scrollY, behavior: "instant" });
      }
    }
  }, [isCalendarOpen]);

  // Obtener días del mes actual
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift(prevDate);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // Manejar clic en una fecha
  const handleDateClick = (date) => {
    if (!isSelecting || !selectedRange.startDate) {
      setSelectedRange({ startDate: date, endDate: null });
      setIsSelecting(true);
    } else {
      const range = {
        startDate: selectedRange.startDate,
        endDate: date,
      };
      setSelectedRange(range);
      setIsSelecting(false);
      setIsCalendarOpen(false);

      // Emitir el rango de fechas al componente padre
      if (onChange) {
        onChange(range);
      }
    }

    if (date.getMonth() !== currentMonth.getMonth()) {
      setDirection(date.getMonth() < currentMonth.getMonth() ? "prev" : "next");
      setIsNavigating(true);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  // Verificar si una fecha está en el rango
  const isDateInRange = (date) => {
    if (!selectedRange.startDate || !selectedRange.endDate) {
      if (isSelecting && selectedRange.startDate && hoveredDate) {
        return (
          (date >= selectedRange.startDate && date <= hoveredDate) ||
          (date <= selectedRange.startDate && date >= hoveredDate)
        );
      }
      return false;
    }
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (date) => {
    return (
      date.toDateString() === selectedRange.startDate?.toDateString() ||
      date.toDateString() === selectedRange.endDate?.toDateString()
    );
  };

  // Verificar si una fecha pertenece al mes actual
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Navegar entre meses
  const navigateMonth = (direction) => {
    setDirection(direction);
    setIsNavigating(true);
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Formatear fecha como día/mes/año
  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className={styles.relativeContainer}>
      <input
        ref={inputRef}
        type="text"
        value={
          selectedRange.startDate && selectedRange.endDate
            ? `${formatDate(selectedRange.startDate)} - ${formatDate(selectedRange.endDate)}`
            : "Selecciona las fechas"
        }
        onClick={() => setIsCalendarOpen((prev) => !prev)}
        className={styles.dateRangePickerInput}
        readOnly
      />
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            ref={calendarRef}
            className={`${styles.calendarContainer} absolute z-10 p-4 rounded-lg bg-gray-800 shadow-xl border border-gray-600 w-full max-w-xs ${
              calendarPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: calendarPosition === "top" ? -30 : 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: calendarPosition === "top" ? -30 : 30,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 20,
              duration: 0.25,
            }}
          >
            <div className={styles.header}>
              <button onClick={() => navigateMonth("prev")} className={styles.button}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <motion.h2
                className="text-lg font-semibold text-white"
                key={currentMonth.toISOString()}
                initial={isNavigating ? { x: direction === "prev" ? -50 : 50 } : {}}
                animate={{ x: 0 }}
                exit={isNavigating ? { x: direction === "prev" ? 50 : -50 } : {}}
                transition={{ duration: 0.2 }}
                onAnimationComplete={() => setIsNavigating(false)}
              >
                {currentMonth.toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </motion.h2>
              <button onClick={() => navigateMonth("next")} className={styles.button}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays estáticos */}
            <div className={styles.weekDaysContainer}>
              {weekDays.map((day) => (
                <div key={day} className={styles.weekDay}>
                  {day}
                </div>
              ))}
            </div>

            {/* Contenido animado del calendario */}
            <motion.div
              className={styles.calendar}
              key={currentMonth.toISOString()}
              initial={isNavigating ? { x: direction === "prev" ? -200 : 200 } : {}}
              animate={{ x: 0 }}
              exit={isNavigating ? { x: direction === "prev" ? 200 : -200 } : {}}
              transition={{ duration: 0.2 }}
            >
              {getDaysInMonth(currentMonth).map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`${
                    styles.dayButton
                  } ${isCurrentMonth(date) ? "text-gray-900" : "text-gray-400"} ${
                    isDateSelected(date) ? styles.selectedDate : ""
                  } ${isDateInRange(date) && !isDateSelected(date) ? styles.inRange : ""} ${
                    isSelecting &&
                    hoveredDate?.toDateString() === date.toDateString() &&
                    !isDateSelected(date)
                      ? styles.hoveredDate
                      : ""
                  }`}
                >
                  {date.getDate()}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}