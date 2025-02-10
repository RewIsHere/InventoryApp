import React from "react";
import ImageBox from "./shared/components/structure/ImageBox"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <h2>Prueba de ImageBox</h2>

      <ImageBox
        src="https://www.mundodeportivo.com/alfabeta/hero/2024/08/estos-son-los-mejores-momentos-de-pikachu-en-el-anime.jpg?width=768&aspect_ratio=16:9&format=nowebp"
        alt="Imagen 1"
        size="150px" // Puedes ajustar el tamaño aquí
        borderRadius="15px" // Puedes ajustar el radio del borde aquí
      />

      <ImageBox
        src="https://www.mundodeportivo.com/alfabeta/hero/2024/08/estos-son-los-mejores-momentos-de-pikachu-en-el-anime.jpg?width=768&aspect_ratio=16:9&format=nowebp"
        alt="Imagen 2"
        size="200px"
        borderRadius="20px"
      />

      <ImageBox
        src="https://www.mundodeportivo.com/alfabeta/hero/2024/08/estos-son-los-mejores-momentos-de-pikachu-en-el-anime.jpg?width=768&aspect_ratio=16:9&format=nowebp"
        alt="Imagen 3"
        size="100px"
        borderRadius="25px"
      />
    </div>
  );
};

export default Test;
