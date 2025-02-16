import React, { useState } from "react";
import styles from "./ProductNotesPage.module.css";
import NoteCard from "../../components/NoteCard";
import { Card } from "@/shared/components/structure";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale"; // Español
import { formatInTimeZone } from "date-fns-tz"; // Para manejar zonas horarias con formato
import { Form } from "@/shared/components/form";
import Textarea from "@/shared/components/form/TextArea";
import { Button } from "@/shared/components/buttons";
import { useProductNotes } from "../../hooks/useProductNotes"; // Ajusta la ruta al hook

const ProductNotesPage = () => {
  const { notes, loading, error, addNote } = useProductNotes(); // Usa el hook para obtener las notas y crear nuevas notas
  const [newNoteContent, setNewNoteContent] = useState("");
  const [noteError, setNoteError] = useState("");

  const handleNoteChange = (e) => {
    setNewNoteContent(e.target.value);
    if (e.target.value.length < 5) {
      setNoteError("La nota debe tener al menos 5 caracteres.");
    } else {
      setNoteError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recargar la página)
    if (!noteError && newNoteContent.length >= 5) {
      addNote(newNoteContent); // Agrega la nueva nota a la lista
      setNewNoteContent(""); // Limpiar el campo de la nota
    }
  };

  // Zona horaria de Mexico City
  const timeZone = "America/Mexico_City";

  if (loading) {
    return <p>Cargando notas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Formateamos las fechas de las notas
  const formattedNotes = notes.map((note) => {
    // Aseguramos que note.date está en un formato ISO válido
    const dateISO = note.date ? parseISO(note.date) : new Date();

    // Convertimos la fecha a la zona horaria deseada
    const zonedDate = formatInTimeZone(
      dateISO,
      timeZone,
      "yyyy-MM-dd HH:mm:ss"
    );

    // Usamos formatDistanceToNow para calcular el tiempo transcurrido desde la creación de la nota
    const formattedDate = formatDistanceToNow(parseISO(zonedDate), {
      addSuffix: true,
      locale: es,
    });

    return {
      ...note,
      date: formattedDate,
    };
  });

  return (
    <Card className={styles.card}>
      <div className={styles.addNoteContainer}>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <Textarea
            label="Agregar nota"
            placeholder="Escribe algo..."
            value={newNoteContent}
            onChange={handleNoteChange}
            error={noteError}
            size="large"
          />
          <Button size="mediumWidth" type="submit">
            Añadir nota
          </Button>
        </Form>
      </div>

      {/* Comprobación de si no hay notas */}
      {formattedNotes.length > 0 ? (
        <div className={styles.notesList}>
          {formattedNotes.map((note) => (
            <NoteCard
              key={note.id}
              author={note.user}
              date={note.date}
              content={note.note}
            />
          ))}
        </div>
      ) : (
        <p>No hay notas para este producto.</p>
      )}
    </Card>
  );
};

export default ProductNotesPage;
