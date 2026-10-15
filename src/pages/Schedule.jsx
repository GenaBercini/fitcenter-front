import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Spinner,
} from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [userTurns, setUserTurns] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("confirm");
  const bgCard = useColorModeValue("white", "gray.700");

  const [selectedFilter, setSelectedFilter] = useState("Todos");

  // Cargar usuario, grilla de turnos e inscripciones del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/users/session`, {
          credentials: "include",
        });
        const userData = await userRes.json();
        const id = userData?.data?.id;
        setUserId(id);

        const schRes = await fetch(`${API_URL}/schedule`);
        const schData = await schRes.json();
        setSchedules(Array.isArray(schData) ? schData : []);

        if (id) {
          const insRes = await fetch(`${API_URL}/inscription/${id}`);
          const insData = await insRes.json();
          const rawData = insData?.data || [];

          const turns = rawData
            .filter((i) => i.type === "schedule" && i.Schedule)
            .map((i) => ({
              id: i.id, // ID de la inscripción (para poder hacer DELETE)
              scheduleId: i.scheduleId,
              day: i.Schedule.day,
              startTime: i.Schedule.startTime,
              endTime: i.Schedule.endTime,
            }));
          setUserTurns(turns);
        }
      } catch (err) {
        console.error("Error al cargar turnos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSchedules =
    selectedFilter === "Todos"
      ? schedules
      : schedules.filter((s) => s.day === selectedFilter);

  const handleInscription = (schedule) => {
    setSelectedSchedule(schedule);
    if (schedule.capacity > 0) {
      setModalType("confirm");
    } else {
      setModalType("full");
    }
    onOpen();
  };

  const confirmInscription = async () => {
    if (userTurns.length >= 3) {
      showFeedback(
        "error",
        "Ya tienes 3 turnos activos. No puedes inscribirte a más.",
      );
      onClose();
      return;
    }

    if (userTurns.some((t) => t.day === selectedSchedule.day)) {
      showFeedback("error", "Ya tienes un turno asignado para este día.");
      onClose();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          scheduleId: selectedSchedule.id,
          type: "schedule",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        showFeedback("error", data.message || "Error al inscribirse al turno");
        return;
      }

      showFeedback(
        "success",
        `Inscripción confirmada al turno del ${selectedSchedule.day} (${selectedSchedule.startTime}-${selectedSchedule.endTime})`,
      );
      onClose();

      // Guardamos la nueva inscripción con su ID correspondiente
      const newInscriptionId = data.inscription?.id || data.data?.id;
      setUserTurns((prev) => [
        ...prev,
        {
          id: newInscriptionId,
          scheduleId: selectedSchedule.id,
          day: selectedSchedule.day,
          startTime: selectedSchedule.startTime,
          endTime: selectedSchedule.endTime,
        },
      ]);

      // Refrescar capacidades
      const updatedRes = await fetch(`${API_URL}/schedule`);
      const updatedData = await updatedRes.json();
      if (Array.isArray(updatedData)) setSchedules(updatedData);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Error al inscribirse al turno");
    }
  };

  const handleCancelTurn = async (turnId) => {
    try {
      const res = await fetch(`${API_URL}/inscription/${turnId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        showFeedback("error", data.message || "Error al cancelar el turno");
        return;
      }

      showFeedback("success", "Turno cancelado con éxito");
      setUserTurns((prev) => prev.filter((t) => t.id !== turnId));

      // Refrescar capacidades en la grilla
      const updatedRes = await fetch(`${API_URL}/schedule`);
      const updatedData = await updatedRes.json();
      if (Array.isArray(updatedData)) setSchedules(updatedData);
    } catch (err) {
      console.error(err);
      showFeedback("error", "Error al cancelar el turno");
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (schedules.length === 0) {
    return (
      <Alert status="info" borderRadius="md" m={6}>
        <AlertIcon />
        No hay turnos cargados aún en la base de datos.
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Turnos Disponibles</Heading>

      {/* Filtro por día */}
      <HStack spacing={4} mb={6} flexWrap="wrap">
        {[
          "Todos",
          "Lunes",
          "Martes",
          "Miercoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ].map((day) => (
          <Button
            key={day}
            variant={selectedFilter === day ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setSelectedFilter(day)}
            mb={{ base: 2, md: 0 }}
          >
            {day}
          </Button>
        ))}
      </HStack>

      {/* Turnos actuales del usuario */}
      {userTurns.length > 0 && (
        <Alert status="success" borderRadius="md" mb={4}>
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Tus turnos reservados:</Text>
            {userTurns.map((t) => (
              <Text key={t.id}>
                • {t.day}: {t.startTime} a {t.endTime}
              </Text>
            ))}
          </Box>
        </Alert>
      )}

      {/* Feedback contextual */}
      {feedback && (
        <Alert status={feedback.type} borderRadius="md" mb={4}>
          <AlertIcon />
          {feedback.message}
        </Alert>
      )}

      {/* Grilla de turnos */}
      <VStack spacing={4} align="stretch">
        {filteredSchedules.map((schedule) => {
          const hasTurnSameDay = userTurns.some((t) => t.day === schedule.day);
          const currentTurn = userTurns.find(
            (t) =>
              t.scheduleId === schedule.id ||
              (t.day === schedule.day &&
                t.startTime === schedule.startTime &&
                t.endTime === schedule.endTime),
          );

          return (
            <Flex
              key={schedule.id}
              bg={bgCard}
              p={5}
              borderRadius="xl"
              shadow="md"
              justify="space-between"
              align="center"
            >
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {schedule.day}
                </Text>
                <Text color="gray.600">
                  Horario: {schedule.startTime} - {schedule.endTime}
                </Text>
                <Text color={schedule.capacity > 0 ? "green.500" : "red.500"}>
                  Cupo disponible: {schedule.capacity}
                </Text>
              </Box>

              {currentTurn ? (
                <Button
                  colorScheme="red"
                  onClick={() => handleCancelTurn(currentTurn.id)}
                >
                  Cancelar turno
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => handleInscription(schedule)}
                  isDisabled={
                    hasTurnSameDay ||
                    userTurns.length >= 3 ||
                    schedule.capacity <= 0
                  }
                >
                  {hasTurnSameDay
                    ? "Ya tenés turno ese día"
                    : userTurns.length >= 3
                      ? "Máx. 3 turnos"
                      : schedule.capacity <= 0
                        ? "Agotado"
                        : "Inscribirse"}
                </Button>
              )}
            </Flex>
          );
        })}
      </VStack>

      {/* Modal de confirmación */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === "confirm"
              ? "Confirmar inscripción"
              : "Cupo completo"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === "confirm" && selectedSchedule && (
              <Text>
                ¿Deseas inscribirte al turno del{" "}
                <strong>{selectedSchedule.day}</strong> de{" "}
                {selectedSchedule.startTime} a {selectedSchedule.endTime}?
              </Text>
            )}
            {modalType === "full" && selectedSchedule && (
              <Text>
                Lo sentimos, no quedan cupos disponibles para el turno del{" "}
                <strong>{selectedSchedule.day}</strong>.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            {modalType === "confirm" ? (
              <>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="blue" ml={3} onClick={confirmInscription}>
                  Confirmar
                </Button>
              </>
            ) : (
              <Button colorScheme="blue" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Schedule;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   Heading,
//   VStack,
//   useColorModeValue,
//   Alert,
//   AlertIcon,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   useDisclosure,
//   HStack, // usado para los filtros tipo botón
// } from "@chakra-ui/react";

// function Schedule() {
//   const [schedules, setSchedules] = useState([]);
//   const [userTurns, setUserTurns] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [feedback, setFeedback] = useState(null);

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [modalType, setModalType] = useState("confirm");
//   const bgCard = useColorModeValue("white", "gray.700");

//   // Filtro con botones
//   const [selectedFilter, setSelectedFilter] = useState("Todos");

//   // Cargar usuario + turnos
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userRes = await fetch("http://localhost:3000/users/session", {
//           credentials: "include",
//         });
//         const userData = await userRes.json();
//         const id = userData?.data?.id;
//         setUserId(id);

//         const schRes = await fetch("http://localhost:3000/schedule");
//         const schData = await schRes.json();
//         setSchedules(schData);

//         if (id) {
//           const insRes = await fetch(`http://localhost:3000/inscription/${id}`);
//           const insData = await insRes.json();
//           const turns = insData.data
//             .filter((i) => i.type === "schedule")
//             .map((i) => ({
//               id: i.id,
//               day: i.Schedule.day,
//               startTime: i.Schedule.startTime,
//               endTime: i.Schedule.endTime,
//             }));
//           setUserTurns(turns);
//         }
//       } catch (err) {
//         console.error("Error al cargar turnos:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Mostrar cartelito de feedback con estilos Chakra
//   const showFeedback = (type, message) => {
//     setFeedback({ type, message });
//     setTimeout(() => setFeedback(null), 3000);
//   };

//   //  Filtrar dinámicamente según el botón seleccionado
//   const filteredSchedules =
//     selectedFilter === "Todos"
//       ? schedules
//       : schedules.filter((s) => s.day === selectedFilter);

//   // Abrir modal de inscripción
//   const handleInscription = (schedule) => {
//     setSelectedSchedule(schedule);
//     if (schedule.capacity > 0) {
//       setModalType("confirm");
//     } else {
//       setModalType("full");
//     }
//     onOpen();
//   };

//   // Confirmar inscripción
//   const confirmInscription = async () => {
//     if (userTurns.length >= 3) {
//       showFeedback(
//         "error",
//         "Ya tienes 3 turnos activos. No puedes inscribirte a más."
//       );
//       onClose();
//       return;
//     }

//     if (userTurns.some((t) => t.day === selectedSchedule.day)) {
//       showFeedback("error", "Ya tienes un turno asignado para este día.");
//       onClose();
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:3000/inscription", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           scheduleId: selectedSchedule.id,
//           type: "schedule",
//         }),
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         showFeedback("error", data.message || "Error al inscribirse al turno");
//         return;
//       }

//       showFeedback(
//         "success",
//         `Inscripción confirmada al turno del ${selectedSchedule.day} (${selectedSchedule.startTime}-${selectedSchedule.endTime})`
//       );
//       onClose();
//       setUserTurns((prev) => [
//         ...prev,
//         {
//           id: data.inscription.id,
//           day: selectedSchedule.day,
//           startTime: selectedSchedule.startTime,
//           endTime: selectedSchedule.endTime,
//         },
//       ]);

//       // Actualizar capacidad
//       const updatedRes = await fetch("http://localhost:3000/schedule");
//       const updatedData = await updatedRes.json();
//       setSchedules(updatedData);
//     } catch (err) {
//       showFeedback("error", "Error al inscribirse al turno");
//     }
//   };

//   // Cancelar inscripción
//   const handleCancelTurn = async (turnId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/inscription/${turnId}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         showFeedback("error", data.message || "Error al cancelar el turno");
//         return;
//       }

//       showFeedback("success", "Turno cancelado con éxito");
//       setUserTurns((prev) => prev.filter((t) => t.id !== turnId));

//       const updatedRes = await fetch("http://localhost:3000/schedule");
//       const updatedData = await updatedRes.json();
//       setSchedules(updatedData);
//     } catch (err) {
//       showFeedback("error", "Error al cancelar el turno");
//     }
//   };

//   if (loading) return <Text>Cargando turnos...</Text>;

//   if (schedules.length === 0) {
//     return (
//       <Alert status="info" borderRadius="md" mt={6}>
//         <AlertIcon />
//         No hay turnos cargados aún.
//       </Alert>
//     );
//   }

//   return (
//     <Box p={6}>
//       <Heading mb={6}>Turnos Disponibles</Heading>

//       {/* Nuevo filtro con botones (reemplaza el Select anterior) */}
//       <HStack spacing={4} mb={6}>
//         {[
//           "Todos",
//           "Lunes",
//           "Martes",
//           "Miercoles",
//           "Jueves",
//           "Viernes",
//           "Sábado",
//           // "Domingo",
//         ].map((day) => (
//           <Button
//             key={day}
//             variant={selectedFilter === day ? "solid" : "outline"}
//             colorScheme="blue"
//             onClick={() => setSelectedFilter(day)}
//           >
//             {day}
//           </Button>
//         ))}
//       </HStack>

//       {/*  Cartel con los turnos actuales del usuario */}
//       {userTurns.length > 0 && (
//         <Alert status="success" borderRadius="md" mb={3}>
//           <AlertIcon />
//           Estás inscripto en:
//           <Box ml={2}>
//             {userTurns.map((t) => (
//               <Text key={t.id}>
//                 {t.day}: {t.startTime} - {t.endTime}
//               </Text>
//             ))}
//           </Box>
//         </Alert>
//       )}

//       {/*  Feedback de acciones debajo del cartel verde */}
//       {feedback && (
//         <Alert status={feedback.type} borderRadius="md" mb={4}>
//           <AlertIcon />
//           {feedback.message}
//         </Alert>
//       )}

//       {/* Lista de turnos */}
//       <VStack spacing={6} align="stretch">
//         {filteredSchedules.map((schedule) => {
//           const hasTurn = userTurns.some((t) => t.day === schedule.day);
//           const currentTurn = userTurns.find(
//             (t) =>
//               t.day === schedule.day &&
//               t.startTime === schedule.startTime &&
//               t.endTime === schedule.endTime
//           );

//           return (
//             <Flex
//               key={schedule.id}
//               bg={bgCard}
//               p={5}
//               borderRadius="xl"
//               shadow="md"
//               justify="space-between"
//               align="center"
//             >
//               <Box>
//                 <Text fontSize="lg" fontWeight="bold">
//                   {schedule.day}
//                 </Text>
//                 <Text>
//                   Horario: {schedule.startTime} - {schedule.endTime}
//                 </Text>
//                 <Text>Cupo disponible: {schedule.capacity}</Text>
//               </Box>

//               {currentTurn ? (
//                 <Button
//                   colorScheme="red"
//                   onClick={() => handleCancelTurn(currentTurn.id)}
//                 >
//                   Cancelar turno
//                 </Button>
//               ) : (
//                 <Button
//                   colorScheme="blue"
//                   onClick={() => handleInscription(schedule)}
//                   isDisabled={hasTurn || userTurns.length >= 3}
//                 >
//                   {hasTurn
//                     ? "Ya tenés turno ese día"
//                     : userTurns.length >= 3
//                     ? "Máx. 3 turnos"
//                     : "Inscribirse"}
//                 </Button>
//               )}
//             </Flex>
//           );
//         })}
//       </VStack>

//       {/* Modal de confirmación */}
//       <Modal isOpen={isOpen} onClose={onClose} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             {modalType === "confirm"
//               ? "Confirmar inscripción"
//               : "Cupo completo"}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {modalType === "confirm" && selectedSchedule && (
//               <Text>
//                 ¿Deseas inscribirte al turno del{" "}
//                 <strong>{selectedSchedule.day}</strong> de{" "}
//                 {selectedSchedule.startTime} a {selectedSchedule.endTime}?
//               </Text>
//             )}
//             {modalType === "full" && selectedSchedule && (
//               <Text>
//                 Lo sentimos, no quedan cupos disponibles para el turno del{" "}
//                 <strong>{selectedSchedule.day}</strong>.
//               </Text>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             {modalType === "confirm" ? (
//               <>
//                 <Button variant="ghost" onClick={onClose}>
//                   Cancelar
//                 </Button>
//                 <Button colorScheme="blue" ml={3} onClick={confirmInscription}>
//                   Confirmar
//                 </Button>
//               </>
//             ) : (
//               <Button colorScheme="blue" onClick={onClose}>
//                 Cerrar
//               </Button>
//             )}
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// }

// export default Schedule;
