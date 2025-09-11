// import React, { useState } from "react";
// import { FaCalendarPlus } from "react-icons/fa";
// import "./PageStyles.css";

// const Booking = () => {
//   const [message, setMessage] = useState("");

//   const handleBooking = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/booking", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activity: "Spinning",
//           entry: "2025-09-01T18:00:00",
//           exit: "2025-09-01T19:00:00",
//         }),
//       });

//       if (!response.ok) throw new Error("Error al reservar");
//       const data = await response.json();
//       setMessage(`Turno reservado: ${data.activity} el ${data.entry}`);
//     } catch (err) {
//       setMessage("No se pudo reservar turno");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="page-container">
//       <h2>
//         <FaCalendarPlus className="icon" />{" "}
//         <span className="pink-text">Reservar</span> Turno
//       </h2>

//       <div className="card">
//         <p>Selecciona fecha y horario para tu turno.</p>
//         <button onClick={handleBooking} className="btn">
//           Reservar ejemplo
//         </button>
//         {message && <p>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Booking;

import React, { useState } from "react";
import {
  Box,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

const Booking = () => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    instructor: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await fetch("http://localhost:3000/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Turno reservado con éxito!");
    } catch (err) {
      console.error("Error reservando:", err);
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} color="pink.500">
        Reservar Turno
      </Heading>

      <Box
        bg={useColorModeValue("white", "gray.700")}
        p={6}
        borderRadius="xl"
        shadow="md"
        maxW="400px"
      >
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Fecha</FormLabel>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Hora</FormLabel>
            <Input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Instructor</FormLabel>
            <Input
              name="instructor"
              value={form.instructor}
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="pink" onClick={handleSubmit}>
            Reservar
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Booking;
