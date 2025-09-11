// import React, { useEffect, useState } from "react";
// import { FaClipboardList } from "react-icons/fa";
// import "./PageStyles.css";

// const ScheduledAppointments = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/booking")
//       .then((res) => res.json())
//       .then((data) => setBookings(data))
//       .catch((err) => console.error("Error fetching bookings:", err));
//   }, []);

//   return (
//     <div className="page-container">
//       <h2>
//         <FaClipboardList className="icon" />{" "}
//         <span className="pink-text">Turnos</span> Agendados
//       </h2>

//       <div className="card">
//         {bookings.length === 0 ? (
//           <p>No tienes turnos agendados.</p>
//         ) : (
//           <ul>
//             {bookings.map((b) => (
//               <li key={b.id}>
//                 {new Date(b.entry).toLocaleDateString()} -{" "}
//                 {new Date(b.entry).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}{" "}
//                 hs - {b.activity}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ScheduledAppointments;

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/bookings")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando turnos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (appointments.length === 0) return <Text>No tenés turnos agendados.</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        <FaClipboardList style={{ display: "inline", marginRight: "8px" }} />
        Mis{" "}
        <Text as="span" color="pink.500">
          Turnos
        </Text>
      </Heading>

      <VStack spacing={4} align="stretch">
        {appointments.map((appt) => (
          <Box
            key={appt.id}
            bg={useColorModeValue("white", "gray.700")}
            p={4}
            borderRadius="xl"
            shadow="md"
          >
            <Text>
              <strong>Fecha:</strong> {appt.date}
            </Text>
            <Text>
              <strong>Hora:</strong> {appt.time}
            </Text>
            <Text>
              <strong>Instructor:</strong> {appt.instructor}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ScheduledAppointments;
