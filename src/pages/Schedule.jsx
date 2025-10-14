import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  VStack,
  Select,
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
} from "@chakra-ui/react";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [userTurns, setUserTurns] = useState([]); // turnos del usuario (por día)
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("confirm");

  const bgCard = useColorModeValue("white", "gray.700");

  // // 🔹 Fetch de turnos
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Traer usuario en sesión
  //       const userRes = await fetch("http://localhost:3000/users/session", {
  //         credentials: "include",
  //       });
  //       const userData = await userRes.json();
  //       const userId = userData?.data?.id;

  //       // Traer todos los turnos
  //       const res = await fetch("http://localhost:3000/schedule");
  //       const data = await res.json();

  //       setSchedules(data);
  //       setFilteredSchedules(data);

  //       // Simular que ya tiene un turno (cuando se conecte real, esto vendrá del backend)
  //       if (userId) {
  //         const scheduleRes = await fetch(
  //           `http://localhost:3000/schedules/user/${userId}`
  //         );
  //         const userSchedule = await scheduleRes.json();
  //         if (userSchedule?.data) {
  //           setUserTurns([userSchedule.data.day]); // guardamos el día ocupado
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error al cargar turnos:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const userData = await userRes.json();
        const userId = userData?.data?.id;

        const res = await fetch("http://localhost:3000/schedule");
        const data = await res.json();
        setSchedules(data);
        setFilteredSchedules(data);

        // Obtener turnos del usuario desde inscripciones
        if (userId) {
          const insRes = await fetch(
            `http://localhost:3000/inscription/${userId}`
          );
          const insData = await insRes.json();
          const userSchedules = insData.data
            .filter((i) => i.type === "schedule")
            .map((i) => i.Schedule.day);
          setUserTurns(userSchedules);
        }
      } catch (err) {
        console.error("Error al cargar turnos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Filtrar por día
  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    if (day === "") {
      setFilteredSchedules(schedules);
    } else {
      setFilteredSchedules(schedules.filter((s) => s.day === day));
    }
  };

  // 🔹 Abrir modal de inscripción
  const handleInscription = (schedule) => {
    setSelectedSchedule(schedule);
    if (schedule.capacity > 0) {
      setModalType("confirm");
    } else {
      setModalType("full");
    }
    onOpen();
  };

  // 🔹 Confirmar inscripción
  // const confirmInscription = async () => {
  //   try {
  //     const res = await fetch("http://localhost:3000/inscriptions", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         type: "schedule",
  //         scheduleId: selectedSchedule.id,
  //         userName: "Test User", // luego se reemplaza por el real
  //       }),
  //     });

  //     if (!res.ok) {
  //       const msg = await res.text();
  //       alert(msg);
  //       return;
  //     }

  //     alert(`¡Te inscribiste al turno del ${selectedSchedule.day}!`);
  //     onClose();

  //     // 🔹 Refrescar datos
  //     const updatedRes = await fetch("http://localhost:3000/schedule");
  //     const updatedData = await updatedRes.json();
  //     setSchedules(updatedData);
  //     setFilteredSchedules(
  //       selectedDay
  //         ? updatedData.filter((s) => s.day === selectedDay)
  //         : updatedData
  //     );

  //     // Guardar el día ocupado
  //     setUserTurns((prev) => [...prev, selectedSchedule.day]);
  //   } catch (err) {
  //     alert("Error al inscribirse al turno");
  //   }
  // };

  const confirmInscription = async () => {
    try {
      const userRes = await fetch("http://localhost:3000/users/session", {
        credentials: "include",
      });
      const userData = await userRes.json();
      const userId = userData?.data?.id;

      const res = await fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          scheduleId: selectedSchedule.id,
          type: "schedule",
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg);
        return;
      }

      alert(`¡Te inscribiste al turno del ${selectedSchedule.day}!`);
      onClose();

      // Actualizar lista
      const updatedRes = await fetch("http://localhost:3000/schedule");
      const updatedData = await updatedRes.json();
      setSchedules(updatedData);
      setFilteredSchedules(
        selectedDay
          ? updatedData.filter((s) => s.day === selectedDay)
          : updatedData
      );
      setUserTurns((prev) => [...prev, selectedSchedule.day]);
    } catch (err) {
      alert("Error al inscribirse al turno");
    }
  };

  if (loading) return <Text>Cargando turnos...</Text>;

  if (schedules.length === 0) {
    return (
      <Alert status="info" borderRadius="md" mt={6}>
        <AlertIcon />
        No hay turnos cargados aún.
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Turnos Disponibles</Heading>

      {/* 🔹 Filtro por día */}
      <Select
        placeholder="Filtrar por día"
        value={selectedDay}
        onChange={handleDayChange}
        mb={6}
        maxW="250px"
      >
        <option value="Lunes">Lunes</option>
        <option value="Martes">Martes</option>
        <option value="Miércoles">Miércoles</option>
        <option value="Jueves">Jueves</option>
        <option value="Viernes">Viernes</option>
        <option value="Sábado">Sábado</option>
        <option value="Domingo">Domingo</option>
      </Select>

      <VStack spacing={6} align="stretch">
        {filteredSchedules.map((schedule) => {
          const hasTurn = userTurns.includes(schedule.day);
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
                  Día: {schedule.day}
                </Text>
                <Text>
                  Horario: {schedule.startTime} - {schedule.endTime}
                </Text>
                <Text>Cupo disponible: {schedule.capacity}</Text>
              </Box>
              <Button
                colorScheme="pink"
                onClick={() => handleInscription(schedule)}
                isDisabled={hasTurn}
              >
                {hasTurn ? "Ya tenés turno ese día" : "Inscribirse"}
              </Button>
            </Flex>
          );
        })}
      </VStack>

      {/* 🔹 Modal */}
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
                <Button colorScheme="pink" ml={3} onClick={confirmInscription}>
                  Confirmar
                </Button>
              </>
            ) : (
              <Button colorScheme="pink" onClick={onClose}>
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
