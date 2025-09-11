// import React from "react";

// const HistorialCompra = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Historial de compras</h2>
//     </div>
//   );
// };

// export default HistorialCompra;

import React, { useEffect, useState } from "react";

const PurchaseHistory = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/appointments/history/1") // <-- ESTE HAY Q IMPLEMENTARLO EN EL BACK
      .then((res) => res.json())
      .then((data) => setHistorial(data))
      .catch((err) => console.error("Error cargando historial:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Historial de Turnos</h2>
      {historial.length === 0 ? (
        <p>No hay historial disponible.</p>
      ) : (
        <ul>
          {historial.map((h) => (
            <li key={h.id}>
              {h.fecha} - {h.hora} ({h.actividad})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PurchaseHistory;
