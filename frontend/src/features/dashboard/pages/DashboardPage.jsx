import React from "react";

const DashboardPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>¡Bienvenido al Dashboard!</h1>
      <p>Esta es la página protegida que solo los usuarios autenticados pueden ver.</p>
    </div>
  );
};

export default DashboardPage;