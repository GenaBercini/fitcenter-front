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
} from "@chakra-ui/react";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentInscription, setCurrentInscription] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [feedback, setFeedback] = useState(null); // 🔹 mensaje de éxito/error

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("confirm");
  const bgCard = useColorModeValue("white", "gray.700");

  //  Obtener usuario y actividades
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const userData = await userRes.json();
        const id = userData?.data?.id;
        setUserId(id);

        const actRes = await fetch("http://localhost:3000/activities");
        const actData = await actRes.json();
        setActivities(actData);
      } catch (err) {
        console.error("Error al cargar usuario o actividades", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  //  Obtener inscripciones
  useEffect(() => {
    if (!userId) return;

    const fetchInscriptions = async () => {
      try {
        const inscRes = await fetch(
          `http://localhost:3000/inscription/${userId}`
        );
        const inscData = await inscRes.json();
        const inscriptionsArray = inscData.data || [];
        const activityInsc = inscriptionsArray.find(
          (i) => i.type === "activity" && i.Activity
        );
        setCurrentInscription(activityInsc || null);
      } catch (err) {
        console.error("Error al cargar inscripciones", err);
      }
    };

    fetchInscriptions();
  }, [userId]);

  //  Mostrar feedback temporal
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  if (loading) return <Text>Cargando actividades...</Text>;

  if (activities.length === 0) {
    return (
      <Alert status="info" borderRadius="md" mt={6}>
        <AlertIcon />
        No hay actividades cargadas aún.
      </Alert>
    );
  }

  // Filtro
  const filteredActivities =
    selectedFilter === "Todos"
      ? activities
      : activities.filter(
          (a) => a.name.toLowerCase() === selectedFilter.toLowerCase()
        );

  //  Modal
  const handleInscription = (activity) => {
    setSelectedActivity(activity);
    if (activity.capacity > 0) setModalType("confirm");
    else setModalType("full");
    onOpen();
  };

  const confirmInscription = async () => {
    try {
      const res = await fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          activityId: selectedActivity.id,
          type: "activity",
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        showFeedback("error", data.message || "Error al inscribirse");
        return;
      }

      showFeedback(
        "success",
        `¡Inscripción confirmada en ${selectedActivity.name}!`
      );
      onClose();
      setCurrentInscription({
        Activity: selectedActivity,
        id: data.inscription.id,
      });

      const updatedRes = await fetch("http://localhost:3000/activities");
      const updatedData = await updatedRes.json();
      setActivities(updatedData);
    } catch (err) {
      showFeedback("error", "Error al inscribirse en la actividad");
    }
  };

  const handleCancelInscription = async () => {
    try {
      if (!currentInscription) return;
      const res = await fetch(
        `http://localhost:3000/inscription/${currentInscription.id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) {
        showFeedback("error", data.message || "Error al cancelar inscripción");
        return;
      }

      showFeedback("success", "Inscripción cancelada con éxito");
      setCurrentInscription(null);

      const updatedRes = await fetch("http://localhost:3000/activities");
      const updatedData = await updatedRes.json();
      setActivities(updatedData);
    } catch (err) {
      showFeedback("error", "Error al cancelar la inscripción");
    }
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Actividades Disponibles</Heading>

      {/*  Filtros */}
      <HStack spacing={4} mb={6}>
        {["Todos", "Spinning", "CrossFit", "Yoga", "Zumba"].map((name) => (
          <Button
            key={name}
            variant={selectedFilter === name ? "solid" : "outline"}
            colorScheme="pink"
            onClick={() => setSelectedFilter(name)}
          >
            {name}
          </Button>
        ))}
      </HStack>

      {/* 🔹 Cartel de inscripción actual */}
      {currentInscription && currentInscription.Activity && (
        <Alert status="success" borderRadius="md" mb={2}>
          <AlertIcon />
          Ya estás inscripto en:{" "}
          <strong style={{ marginLeft: "4px" }}>
            {currentInscription.Activity.name}
          </strong>
        </Alert>
      )}

      {/* Cartel de feedback */}
      {feedback && (
        <Alert
          status={feedback.type}
          borderRadius="md"
          mb={4}
          transition="all 0.3s"
        >
          <AlertIcon />
          {feedback.message}
        </Alert>
      )}

      {/*  Lista de actividades */}
      <VStack spacing={6} align="stretch">
        {filteredActivities.map((activity) => (
          <Flex
            key={activity.id}
            bg={bgCard}
            p={5}
            borderRadius="xl"
            shadow="md"
            justify="space-between"
            align="center"
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {activity.name}
              </Text>
              <Text>Instructor: {activity.instructor}</Text>
              <Text>
                Horario: {activity.startTime} - {activity.endTime}
              </Text>
              <Text>Cupo disponible: {activity.capacity}</Text>
            </Box>

            {currentInscription &&
            currentInscription.Activity &&
            currentInscription.Activity.id === activity.id ? (
              <Button colorScheme="red" onClick={handleCancelInscription}>
                Cancelar inscripción
              </Button>
            ) : (
              <Button
                colorScheme="pink"
                onClick={() => handleInscription(activity)}
                isDisabled={!!currentInscription}
              >
                Inscribirse
              </Button>
            )}
          </Flex>
        ))}
      </VStack>

      {/*  Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === "confirm"
              ? "Confirmar Inscripción"
              : "Cupo Completo"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === "confirm" && selectedActivity && (
              <Text>
                ¿Deseas inscribirte en <strong>{selectedActivity.name}</strong>{" "}
                con el instructor {selectedActivity.instructor}?
              </Text>
            )}
            {modalType === "full" && selectedActivity && (
              <Text>
                Lo sentimos, no quedan cupos disponibles en{" "}
                <strong>{selectedActivity.name}</strong>.
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

export default Activities;
