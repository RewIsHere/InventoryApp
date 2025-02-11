import React from "react";
import Card from "./shared/components/structure/Card"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", flexWrap: "wrap" }}>
      {/* Tarjeta con sombra y radio grande */}
      <Card shadow="lg" radius="xl" isHoverable isPressable>
        <h3>Tarjeta con Sombra y Radio Grande</h3>
        <p>Esta tarjeta tiene sombra y un radio de borde grande.</p>
      </Card>

      {/* Tarjeta sin interactividad (no presionable) */}
      <Card isDisabled>
        <h3>Tarjeta Deshabilitada</h3>
        <p>Esta tarjeta está deshabilitada y no es interactiva.</p>
      </Card>

      {/* Tarjeta con fondo difuso y un pie de página difuso */}
      <Card shadow="sm" radius="md" isBlurred isFooterBlurred>
        <h3>Tarjeta con Fondo y Pie Difuso</h3>
        <p>Esta tarjeta tiene un fondo y pie de página difusos.</p>
      </Card>

      {/* Tarjeta con interactividad */}
      <Card shadow="md" radius="lg" isPressable onPress={() => alert("Card pressed!")}>
        <h3>Tarjeta Interactiva</h3>
        <p>Haz clic en esta tarjeta para ver una acción.</p>
      </Card>

      {/* Tarjeta de ancho completo */}
      <Card shadow="md" radius="lg" fullWidth>
        <h3>Tarjeta de Ancho Completo</h3>
        <p>Esta tarjeta ocupa todo el ancho disponible.</p>
      </Card>
    </div>
  );
};

export default Test;
