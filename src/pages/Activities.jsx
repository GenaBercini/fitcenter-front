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
} from "@chakra-ui/react";

function ActivitiesLanding() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("confirm"); // "confirm" | "full"

  const bgCard = useColorModeValue("white", "gray.700");

  // 🔹 Traer actividades con fetch
  useEffect(() => {
    fetch("http://localhost:3000/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Text>Cargando actividades...</Text>;

  if (activities.length === 0) {
    return (
      <Alert status="info" borderRadius="md" mt={6}>
        <AlertIcon />
        No hay actividades cargadas aún.
      </Alert>
    );
  }

  // Manejar inscripción
  const handleInscription = (activity) => {
    setSelectedActivity(activity);
    if (activity.capacity > 0) {
      setModalType("confirm");
    } else {
      setModalType("full");
    }
    onOpen();
  };

  // 🔹 Confirmar inscripción con fetch
  const confirmInscription = async () => {
    try {
      const res = await fetch("http://localhost:3000/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity.id,
          userName: "Test User", // luego reemplazamos por el usuario real
        }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        alert(errorMsg);
        return;
      }

      alert(`¡Inscripción confirmada en ${selectedActivity.name}!`);
      onClose();

      // 🔹 volver a traer actividades con el cupo actualizado
      const updatedRes = await fetch("http://localhost:3000/activities");
      const updatedData = await updatedRes.json();
      setActivities(updatedData);
    } catch (err) {
      alert("Error al inscribirse");
    }
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Actividades Disponibles</Heading>
      <VStack spacing={6} align="stretch">
        {activities.map((activity) => (
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
            <Button
              colorScheme="pink"
              onClick={() => handleInscription(activity)}
            >
              Inscribirse
            </Button>
          </Flex>
        ))}
      </VStack>

      {/* 🔹 Modal */}
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
                Lo sentimos , no quedan cupos disponibles en{" "}
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

export default ActivitiesLanding;
