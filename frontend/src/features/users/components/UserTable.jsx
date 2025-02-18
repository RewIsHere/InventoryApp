import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../shared/stores/userStore";
import { Table } from "@/shared/components/data-display";
import { Button } from "@/shared/components/buttons";
import { Modal } from "@/shared/components/structure";
import { useDeleteUser } from "../hooks/useDeleteUser"; // Importa el hook de eliminación
import { ToastContext } from "../../../shared/context/ToastContext"; // Importa el contexto de notificaciones
import styles from "./UserTable.module.css";

const UserTable = () => {
  const [searchParams] = useSearchParams();
  const { users, fetchUsers, loading: usersLoading } = useUserStore();
  const navigate = useNavigate(); // Usamos navigate para redirigir

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar el modal
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para almacenar el ID del usuario seleccionado

  const { deleteUser, loading: deletingUser } = useDeleteUser(); // Hook para eliminar usuario
  const { addNotification } = useContext(ToastContext); // Para agregar notificaciones

  useEffect(() => {
    const filters = Object.fromEntries(searchParams.entries());
    fetchUsers(filters);
  }, [fetchUsers, searchParams]);

  const columns = [
    { key: "username", label: "Usuario" },
    { key: "name", label: "Nombre" },
    { key: "surnames", label: "Apellidos" },
    { key: "role", label: "Rol" },
    { key: "actions", label: "Acciones" },
  ];

  const handleEditClick = (user) => {
    navigate(`/users/${user.id}/edit`); // Redirigir a la página de edición del usuario
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId); // Establecer el ID del usuario seleccionado
    setIsDeleteModalOpen(true); // Abrir el modal de confirmación
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      try {
        const response = await deleteUser(selectedUserId); // Llamar al hook de eliminación
        setIsDeleteModalOpen(false); // Cerrar el modal
        fetchUsers(); // Recargar los usuarios después de la eliminación

        // Mostrar la notificación con el mensaje de la API
        addNotification(
          response.message || response.error || "Error desconocido",
          "success"
        );
      } catch (error) {
        setIsDeleteModalOpen(false); // Cerrar el modal
        // Mostrar el error que vino de la API
        addNotification(error.message || "Error desconocido", "error");
      }
    }
  };

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {usersLoading ? (
        <p>Cargando...</p>
      ) : (
        <Table
          columns={columns}
          data={users}
          allData={users}
          onSelectRows={() => {}}
          renderActions={(user) => (
            <div>
              <button
                className={styles.actionsButton}
                onClick={() => handleEditClick(user)} // Ahora redirige a la página de edición
              >
                Editar
              </button>
              <button
                className={styles.actionsButton}
                onClick={() => handleDeleteClick(user.id)} // Abrir el modal de eliminación
              >
                Eliminar
              </button>
            </div>
          )}
        />
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <h3>¿Estás seguro de que deseas eliminar este usuario?</h3>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deletingUser}
          >
            {deletingUser ? "Eliminando..." : "Confirmar Eliminación"}
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;
