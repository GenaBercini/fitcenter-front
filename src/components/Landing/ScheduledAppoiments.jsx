// import React from "react";

// const TurnosAgendados = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Turnos agendados</h2>
//     </div>
//   );
// };

// export default TurnosAgendados;

import React, { useEffect, useState } from "react";

const ScheduledAppointments = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/booking")
      .then((res) => res.json())
      .then((data) => setTurnos(data))
      .catch((err) => console.error("Error cargando turnos:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Turnos Agendados</h2>
      {turnos.length === 0 ? (
        <p>No hay turnos agendados</p>
      ) : (
        <ul>
          {turnos.map((t) => (
            <li key={t.id}>
              {t.activity} - {t.entry} → {t.exit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledAppointments;
