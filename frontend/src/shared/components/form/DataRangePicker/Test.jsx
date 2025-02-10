import React, { useState } from "react";
import DateRangePicker from ".";

const App = () => {
  const [dates, setDates] = useState({ startDate: null, endDate: null });

  // Función para manejar el cambio de fechas
  const handleDateChange = (range) => {
    if (range.startDate && range.endDate) {
      setDates(range); // Actualiza el estado con el rango seleccionado
    } else {
      console.warn("Rango de fechas incompleto:", range);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        Selecciona un rango de fechas
      </h1>
      <DateRangePicker
        label="Rango de fechas"
        onChange={handleDateChange} // Prop para manejar el cambio de fechas
      />
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
          Fechas seleccionadas:
        </h2>
        {dates.startDate && dates.endDate ? (
          <p>
            Desde: {formatDate(dates.startDate)} <br />
            Hasta: {formatDate(dates.endDate)}
          </p>
        ) : (
          <p>No se ha seleccionado un rango de fechas.</p>
        )}
      </div>
    </div>
  );
};

// Función auxiliar para formatear la fecha
const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default App;