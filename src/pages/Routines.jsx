"use client";

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
  Input,
  Divider,
  Container,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

function Routines() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [currentInscription, setCurrentInscription] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState(null);

  const {
    isOpen: isInscriptionOpen,
    onOpen: onInscriptionOpen,
    onClose: onInscriptionClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const bgCard = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          const id = userData?.data?.id;
          setUserId(id);
        }

        const routinesRes = await fetch("http://localhost:3000/routines");
        if (!routinesRes.ok)
          throw new Error("No se pudo obtener la lista de rutinas");

        const routinesData = await routinesRes.json();
        // Garantiza que el estado sea un Array válido
        setRoutines(Array.isArray(routinesData.data) ? routinesData.data : []);
      } catch (err) {
        console.error("Error al cargar usuario o rutinas", err);
        // Asigna array vacío para evitar TypeError en .filter() si falla el fetch
        setRoutines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchInscriptions = async () => {
      try {
        const inscRes = await fetch(
          `http://localhost:3000/inscription/${userId}`,
        );
        if (!inscRes.ok) return;

        const inscData = await inscRes.json();
        const inscriptionsArray = inscData.data || [];

        const routineInsc = inscriptionsArray.find(
          (i) => i.type === "routine" && i.Routine,
        );

        setCurrentInscription(routineInsc || null);
      } catch (err) {
        console.error("Error al cargar inscripciones", err);
      }
    };

    fetchInscriptions();
  }, [userId]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  if (loading) return <Text p={6}>Cargando rutinas...</Text>;

  // Filtrado seguro con fallback por si routines fuese nulo
  const filteredRoutines = (routines || []).filter((r) => {
    const typeMatch = r.typeRoutine
      ?.toLowerCase()
      .includes(filter.toLowerCase());
    const profMatch =
      r.professor &&
      `${r.professor.first_name} ${r.professor.last_name || ""}`
        .trim()
        .toLowerCase();
    return typeMatch || profMatch;
  });

  const openDetails = (routine) => {
    setSelectedRoutine(routine);
    onDetailsOpen();
  };

  const openInscription = (routine) => {
    setSelectedRoutine(routine);
    onInscriptionOpen();
  };

  const confirmRoutineInscription = async () => {
    try {
      const res = await fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          routineId: selectedRoutine.id,
          type: "routine",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showFeedback(
          "error",
          data.message || "Error al inscribirse en la rutina",
        );
        return;
      }

      showFeedback(
        "success",
        `¡Inscripción confirmada en la rutina ${selectedRoutine.typeRoutine}!`,
      );

      setCurrentInscription({
        Routine: selectedRoutine,
        id: data.inscription.id,
      });

      const updatedRes = await fetch("http://localhost:3000/routines");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setRoutines(Array.isArray(updatedData.data) ? updatedData.data : []);
      }

      onInscriptionClose();
    } catch (error) {
      console.error(error);
      showFeedback("error", "Error al realizar la inscripción");
    }
  };

  const handleCancelInscription = async () => {
    try {
      if (!currentInscription) return;

      const res = await fetch(
        `http://localhost:3000/inscription/${currentInscription.id}`,
        { method: "DELETE" },
      );

      const data = await res.json();

      if (!res.ok) {
        showFeedback(
          "error",
          data.message || "Error al cancelar la inscripción",
        );
        return;
      }

      showFeedback("success", "Inscripción cancelada con éxito");
      setCurrentInscription(null);

      const updatedRes = await fetch("http://localhost:3000/routines");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setRoutines(Array.isArray(updatedData.data) ? updatedData.data : []);
      }
    } catch (err) {
      showFeedback("error", "Error al cancelar la inscripción");
    }
  };

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

        <Heading mb={6}>Rutinas Disponibles</Heading>

        <Flex justify="flex-start" mb={6}>
          <Input
            placeholder="Filtrar por tipo o profesor"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            maxW="320px"
            bg="white"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            borderRadius="lg"
          />
        </Flex>

        {currentInscription && currentInscription.Routine && (
          <Alert status="success" borderRadius="xl" mb={4}>
            <AlertIcon />
            Ya estás inscripto en:{" "}
            <strong style={{ marginLeft: "4px" }}>
              {currentInscription.Routine.typeRoutine}
            </strong>
          </Alert>
        )}

        {feedback && (
          <Alert status={feedback.type} borderRadius="xl" mb={4}>
            <AlertIcon />
            {feedback.message}
          </Alert>
        )}

        {routines.length === 0 ? (
          <Alert status="info" borderRadius="xl">
            <AlertIcon />
            No hay rutinas cargadas aún.
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredRoutines.map((routine) => (
              <Flex
                key={routine.id}
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
                    {routine.typeRoutine}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Instructor:{" "}
                    {routine.professor
                      ? `${routine.professor.first_name} ${
                          routine.professor.last_name || ""
                        }`.trim()
                      : "No asignado"}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Descripción: {routine.descRoutine}
                  </Text>
                </Box>

                <Flex gap={2}>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => openDetails(routine)}
                  >
                    Ver ejercicios
                  </Button>

                  {currentInscription &&
                  currentInscription.Routine &&
                  currentInscription.Routine.id === routine.id ? (
                    <Button colorScheme="red" onClick={handleCancelInscription}>
                      Cancelar inscripción
                    </Button>
                  ) : (
                    <Button
                      colorScheme="blue"
                      onClick={() => openInscription(routine)}
                      isDisabled={!!currentInscription}
                    >
                      Inscribirse
                    </Button>
                  )}
                </Flex>
              </Flex>
            ))}
          </VStack>
        )}
      </Container>

      {/* Modal Detalles */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            {selectedRoutine?.typeRoutine || "Detalle de rutina"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoutine ? (
              <>
                <Text mb={2}>
                  <strong>Instructor:</strong>{" "}
                  {selectedRoutine.professor
                    ? `${selectedRoutine.professor.first_name} ${selectedRoutine.professor.last_name}`
                    : "No asignado"}
                </Text>

                <Text mb={4}>
                  <strong>Descripción:</strong> {selectedRoutine.descRoutine}
                </Text>

                <Divider mb={4} />

                <Text fontWeight="bold" mb={2}>
                  Ejercicios:
                </Text>
                {selectedRoutine.exercises &&
                selectedRoutine.exercises.length > 0 ? (
                  selectedRoutine.exercises.map((ex) => (
                    <Box
                      key={ex.id}
                      p={3}
                      bg="gray.50"
                      borderRadius="xl"
                      mb={2}
                    >
                      <Text fontWeight="semibold">{ex.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Tipo: {ex.typeEx}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">No hay ejercicios cargados.</Text>
                )}
              </>
            ) : (
              <Text>Cargando datos...</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDetailsClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Confirmación */}
      <Modal isOpen={isInscriptionOpen} onClose={onInscriptionClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Confirmar Inscripción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoutine && (
              <Text>
                ¿Deseas inscribirte en{" "}
                <strong>{selectedRoutine.typeRoutine}</strong> con el instructor{" "}
                {selectedRoutine.professor
                  ? `${selectedRoutine.professor.first_name} ${selectedRoutine.professor.last_name}`
                  : "No asignado"}
                ?
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onInscriptionClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={confirmRoutineInscription}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Routines;
