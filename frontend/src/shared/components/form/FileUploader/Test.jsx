import React, { useState } from "react";
import FileUploader from "./shared/components/form/FileUploader";
import Form from "./shared/components/form/Form";
import Button from "./shared/components/buttons/Button";

const App = () => {
  const [files, setFiles] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Archivos a enviar:", files);
    // Aquí puedes enviar los archivos al servidor usando fetch o axios
    // Ejemplo: fetch('/upload', { method: 'POST', body: formData });
  };

  return (
    <div>
      <h1>Subir archivos</h1>
      <Form onSubmit={handleSubmit}>
        <FileUploader onFilesChange={setFiles} />
        <Button type="submit" variant="primary" size="medium">
          Enviar archivos
        </Button>
      </Form>
    </div>
  );
};

export default App;