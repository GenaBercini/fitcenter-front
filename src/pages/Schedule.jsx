import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Container,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

function Schedule() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [userTurns, setUserTurns] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("confirm");

  const bgCard = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.50", "gray.800");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const userData = await userRes.json();
        const id = userData?.data?.id;
        setUserId(id);

        const schRes = await fetch("http://localhost:3000/schedule");
        const schData = await schRes.json();
        setSchedules(schData);

        if (id) {
          const insRes = await fetch(`http://localhost:3000/inscription/${id}`);
          const insData = await insRes.json();
          const turns = insData.data
            .filter((i) => i.type === "schedule")
            .map((i) => ({
              id: i.id,
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
    if (schedule.capacity > 0) setModalType("confirm");
    else setModalType("full");
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
      setUserTurns((prev) => [
        ...prev,
        {
          id: data.inscription.id,
          day: selectedSchedule.day,
          startTime: selectedSchedule.startTime,
          endTime: selectedSchedule.endTime,
        },
      ]);

      const updatedRes = await fetch("http://localhost:3000/schedule");
      const updatedData = await updatedRes.json();
      setSchedules(updatedData);
    } catch (err) {
      showFeedback("error", "Error al inscribirse al turno");
    }
  };

  const handleCancelTurn = async (turnId) => {
    try {
      const res = await fetch(`http://localhost:3000/inscription/${turnId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        showFeedback("error", data.message || "Error al cancelar el turno");
        return;
      }

      showFeedback("success", "Turno cancelado con éxito");
      setUserTurns((prev) => prev.filter((t) => t.id !== turnId));

      const updatedRes = await fetch("http://localhost:3000/schedule");
      const updatedData = await updatedRes.json();
      setSchedules(updatedData);
    } catch (err) {
      showFeedback("error", "Error al cancelar el turno");
    }
  };

  if (loading) return <Text p={6}>Cargando turnos...</Text>;

  return (
    <Box bg={bgPage} minH="100vh" py={6}>
      <Container maxW="7xl">
        {/* Botón Volver al Panel */}
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate("/home")}
          mb={4}
          colorScheme="blue"
        >
          Volver al Panel
        </Button>

        <Heading mb={6}>Turnos Disponibles</Heading>

        <HStack spacing={2} mb={6} overflowX="auto" py={1}>
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
              borderRadius="full"
              size="sm"
              onClick={() => setSelectedFilter(day)}
            >
              {day}
            </Button>
          ))}
        </HStack>

        {userTurns.length > 0 && (
          <Alert status="success" borderRadius="xl" mb={4}>
            <AlertIcon />
            Estás inscripto en:
            <Box ml={2}>
              {userTurns.map((t) => (
                <Text key={t.id} fontWeight="semibold">
                  {t.day}: {t.startTime} - {t.endTime}
                </Text>
              ))}
            </Box>
          </Alert>
        )}

        {feedback && (
          <Alert status={feedback.type} borderRadius="xl" mb={4}>
            <AlertIcon />
            {feedback.message}
          </Alert>
        )}

        {schedules.length === 0 ? (
          <Alert status="info" borderRadius="xl">
            <AlertIcon />
            No hay turnos cargados aún.
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredSchedules.map((schedule) => {
              const hasTurn = userTurns.some((t) => t.day === schedule.day);
              const currentTurn = userTurns.find(
                (t) =>
                  t.day === schedule.day &&
                  t.startTime === schedule.startTime &&
                  t.endTime === schedule.endTime,
              );

              return (
                <Flex
                  key={schedule.id}
                  bg={bgCard}
                  p={5}
                  borderRadius="2xl"
                  shadow="sm"
                  borderWidth="1px"
                  borderColor="gray.100"
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
                    <Text fontSize="sm" color="gray.500">
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
                      isDisabled={hasTurn || userTurns.length >= 3}
                    >
                      {hasTurn
                        ? "Ya tenés turno ese día"
                        : userTurns.length >= 3
                          ? "Máx. 3 turnos"
                          : "Inscribirse"}
                    </Button>
                  )}
                </Flex>
              );
            })}
          </VStack>
        )}
      </Container>

      {/* Modal Confirmación */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
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
