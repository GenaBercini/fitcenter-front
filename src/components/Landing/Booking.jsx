// import React from "react";

// const Turnos = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Vista para sacar turno</h2>
//     </div>
//   );
// };

// export default Turnos;

// import React, { useState } from "react";

// const Booking = () => {
//   const [fecha, setFecha] = useState("");
//   const [hora, setHora] = useState("");
//   const [mensaje, setMensaje] = useState("");

//   const reservarTurno = (e) => {
//     e.preventDefault();

//     // Generamos valores que tu backend espera
//     const entry = `${fecha} ${hora}`;
//     // Como aún no pedimos hora de salida, ponemos la misma (o podrías sumarle 1 hora si quieres)
//     const exit = `${fecha} ${hora}`;

//     fetch("http://localhost:3000/booking", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         activity: "Gym", // de momento lo dejamos fijo
//         entry: entry,
//         exit: exit,
//         userId: 1, // luego lo reemplazamos por el usuario logueado harbia q ver como conectarlo
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => setMensaje("Turno reservado con éxito ✅"))
//       .catch((err) => setMensaje("Error al reservar turno ❌"));
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Reservar Turno</h2>
//       <form onSubmit={reservarTurno}>
//         <div>
//           <label>Fecha: </label>
//           <input
//             type="date"
//             value={fecha}
//             onChange={(e) => setFecha(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Hora: </label>
//           <input
//             type="time"
//             value={hora}
//             onChange={(e) => setHora(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Reservar</button>
//       </form>
//       {mensaje && <p>{mensaje}</p>}
//     </div>
//   );
// };

// export default Booking;
