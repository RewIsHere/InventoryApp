import React from "react";
import ImageGallery from "./shared/components/data-display/ImageGallery";

const App = () => {
  const images = [
    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/11/pikachu-pokemon-escarlata-purpura-2888180.jpg",
    "https://preview.redd.it/14ztnza9f3681.jpg?auto=webp&s=b6dd58e1e9ff55c27ad786644f8c9f71e88ac68c",
    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/11/pikachu-pokemon-escarlata-purpura-2888180.jpg",
    "https://preview.redd.it/14ztnza9f3681.jpg?auto=webp&s=b6dd58e1e9ff55c27ad786644f8c9f71e88ac68c",
    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/11/pikachu-pokemon-escarlata-purpura-2888180.jpg",
    "https://preview.redd.it/14ztnza9f3681.jpg?auto=webp&s=b6dd58e1e9ff55c27ad786644f8c9f71e88ac68c",
    "https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/11/pikachu-pokemon-escarlata-purpura-2888180.jpg",
  ];

  return (
    <div>
      <h1>Galería de Imágenes</h1>
      <ImageGallery images={images} />
    </div>
  );
};

export default App;