import React, { useState, useEffect } from "react";
import Skeleton from "./shared/components/structure/Skeleton";

const Test = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos una API con tiempo variable entre 1 y 3 segundos
    const fetchData = () => {
      setTimeout(() => {
        setData(["Elemento 1", "Elemento 2", "Elemento 3"]);
        setIsLoading(false);
      }, Math.random() * 2000 + 1000); // Tiempo entre 1 y 3 segundos
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ejemplo de Skeleton con API</h1>

      <h3>📋 Lista de elementos:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {isLoading
          ? [...Array(3)].map((_, index) => (
              <Skeleton key={index} isLoading={isLoading}>
                <li style={{ padding: "10px", background: "#f0f0f0", borderRadius: "8px" }}>Cargando...</li>
              </Skeleton>
            ))
          : data.map((item, index) => <li key={index}>{item}</li>)}
      </ul>

      <h3>⚫ Círculo:</h3>
      <Skeleton isLoading={isLoading}>
        <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#ddd" }} />
      </Skeleton>

      <h3>🏀 Óvalo:</h3>
      <Skeleton isLoading={isLoading}>
        <div style={{ width: "200px", height: "50px", borderRadius: "50px", background: "#ddd" }} />
      </Skeleton>
    </div>
  );
};

export default Test;
