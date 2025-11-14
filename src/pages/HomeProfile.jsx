import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  VStack,
  useColorModeValue,
  Spinner,
  Badge,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaUser,
  FaCalendarPlus,
  FaClipboardList,
  FaHistory,
  FaDumbbell,
  FaExclamationTriangle,
} from "react-icons/fa";

function HomeView() {
  const navigate = useNavigate();
  const bgCard = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");

  const [activity, setActivity] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missingData, setMissingData] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);

  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Obtener usuario en sesión
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const userData = await userRes.json();
        const userInfo = userData?.data;

        if (!userInfo) {
          setLoading(false);
          return;
        }

        setUser(userInfo);

        //  Comprobar si falta completar información
        const incompleteFields = [
          "first_name",
          "last_name",
          "email",
          "address",
          "phone",
        ].some((key) => !userInfo[key] || userInfo[key].trim() === "");
        setMissingData(incompleteFields);

        //  Traer inscripciones
        const inscriptionRes = await fetch(
          `http://localhost:3000/inscription/${userInfo.id}`
        );
        const inscriptionData = await inscriptionRes.json();

        const activityIns = inscriptionData.data.find(
          (i) => i.type === "activity"
        );
        const scheduleIns = inscriptionData.data.filter(
          (i) => i.type === "schedule"
        );

        setActivity(activityIns?.Activity || null);
        setSchedules(scheduleIns.map((i) => i.Schedule));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={6} bg={bgPage} minH="100vh">
      {/* Encabezado con nombre + alerta si faltan datos */}
      <Flex align="center" justify="space-between" flexWrap="wrap">
        <Heading size="lg" color={textColor}>
          ¡Hola{" "}
          <Text as="span" color="blue.500">
            {user?.first_name || "usuario"}
          </Text>
          !
        </Heading>

        {missingData && (
          <HStack
            bg={useColorModeValue("yellow.100", "yellow.700")}
            borderRadius="lg"
            px={3}
            py={1}
            spacing={2}
            mt={{ base: 3, md: 0 }}
            shadow="sm"
          >
            <FaExclamationTriangle color="#D69E2E" />
            <Text
              fontSize="sm"
              color={useColorModeValue("yellow.800", "yellow.200")}
              fontWeight="medium"
            >
              Faltan completar datos del perfil
            </Text>
          </HStack>
        )}
      </Flex>

      {/*  Atajos principales */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mt={6}>
        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/perfil")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaUser size={28} color="#393bd3ff" />
          <Text mt={2}>Perfil</Text>
        </Flex>

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/schedule")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaCalendarPlus size={28} color="#393bd3ff" />
          <Text mt={2}>Reservar turno</Text>
        </Flex>
        {/* <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => {
            if (
              user?.membershipType !== "Basic" &&
              user?.membershipType !== "Premium"
            ) {
              alert(
                "Necesitas membresía Basic o Premium para reservar turnos."
              );
              return;
            }
            navigate("/schedule");
          }}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaCalendarPlus size={28} color="#393bd3ff" />
          <Text mt={2}>Reservar turno</Text>

          {user?.membershipType === "Guest" && (
            <Badge colorScheme="yellow" mt={2}>
              Requiere membresía Basic
            </Badge>
          )}
        </Flex> */}

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/activities")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaClipboardList size={28} color="#393bd3ff" />
          <Text mt={2}>Actividades</Text>
        </Flex>

        {/* ACTIVIDADES → Premium */}
        {/* <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => {
            if (user?.membershipType !== "Premium") {
              alert(
                "Necesitas una membresía Premium para acceder a actividades."
              );
              return;
            }
            navigate("/activities");
          }}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaClipboardList size={28} color="#393bd3ff" />
          <Text mt={2}>Actividades</Text>

          {user?.membershipType !== "Premium" && (
            <Badge colorScheme="yellow" mt={2}>
              Requiere membresía Premium
            </Badge>
          )}
        </Flex> */}

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/routine")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaHistory size={28} color="#393bd3ff" />
          <Text mt={2}>Rutinas</Text>
        </Flex>

        {/* RUTINAS → Basic o Premium */}
        {/* <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => {
            if (
              user?.membershipType !== "Basic" &&
              user?.membershipType !== "Premium"
            ) {
              alert("Necesitas membresía Basic o Premium para ver rutinas.");
              return;
            }
            navigate("/routine");
          }}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaHistory size={28} color="#393bd3ff" />
          <Text mt={2}>Rutinas</Text>

          {user?.membershipType === "Guest" && (
            <Badge colorScheme="yellow" mt={2}>
              Requiere membresía Classic
            </Badge>
          )}
        </Flex> */}
      </Grid>

      {/*  Sección entrenamiento */}
      <Box mt={10}>
        <Heading size="md" mb={4} color={textColor}>
          Entrenamiento
        </Heading>
        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          shadow="md"
          flexDir="column"
          alignItems="flex-start"
        >
          <Flex align="center" mb={3}>
            <FaDumbbell size={28} color="#393bd3ff" />
            <VStack align="start" spacing={0} ml={4}>
              <Text fontWeight="bold" color={textColor}>
                Ver plan actual
              </Text>
              <Text fontSize="sm" color="gray.500">
                Entrenamiento personalizado
              </Text>
            </VStack>
          </Flex>

          {/* Información de inscripción */}
          <Box w="100%" mt={3}>
            <Text fontWeight="bold" color="blue.500">
              Actividad
            </Text>
            {activity ? (
              <Text>
                {activity.name} — {activity.startTime} a {activity.endTime} -{" "}
                {activity.description}
              </Text>
            ) : (
              <Text color="gray.500">
                No estás inscripto a ninguna actividad
              </Text>
            )}
            {/* <Text fontWeight="bold" color="blue.500">
              Actividad
            </Text>

            {user?.membershipType !== "Premium" ? (
              <Text color="gray.500" fontStyle="italic">
                No tienes acceso a actividades con tu membresía actual.
              </Text>
            ) : activity ? (
              <Text>
                {activity.name} — {activity.startTime} a {activity.endTime} -{" "}
                {activity.description}
              </Text>
            ) : (
              <Text color="gray.500">
                No estás inscripto a ninguna actividad
              </Text>
            )} */}

            {/* TURNOS */}
            {/* <Text fontWeight="bold" color="blue.500" mt={3}>
              Turnos
            </Text>

            {user?.membershipType === "Guest" ? (
              <Text color="gray.500" fontStyle="italic">
                No tienes acceso a reservar turnos con tu membresía actual.
              </Text>
            ) : schedules.length > 0 ? (
              <VStack align="start" spacing={1} mt={1}>
                {schedules.map((s, index) => (
                  <Text key={index}>
                    Día: {s.day} — {s.startTime} a {s.endTime}
                  </Text>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">No estás inscripto a ningún turno</Text>
            )} */}
            <Text fontWeight="bold" color="blue.500" mt={3}>
              Turnos
            </Text>
            {schedules.length > 0 ? (
              <VStack align="start" spacing={1} mt={1}>
                {schedules.map((s, index) => (
                  <Text key={index}>
                    Día: {s.day} — {s.startTime} a {s.endTime}
                  </Text>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500">No estás inscripto a ningún turno</Text>
            )}

            <Text fontWeight="bold" color="blue.500" mt={3}>
              Rutina
            </Text>
            {currentRoutine ? (
              <Text
                cursor="pointer"
                color="blue.500.400"
                textDecoration="underline"
                onClick={() => {
                  setSelectedRoutine(currentRoutine);
                  onOpen();
                }}
              >
                {currentRoutine.Routine.typeRoutine} — Ver ejercicios
              </Text>
            ) : (
              <Text color="gray.500">No estás inscripto a ninguna rutina.</Text>
            )}

            {/* {currentRoutine ? (
              <Text
                cursor="pointer"
                color="blue.500.400"
                textDecoration="underline"
                onClick={() => {
                  setSelectedRoutine(currentRoutine);
                  onOpen();
                }}
              >
                {currentRoutine.Routine.typeRoutine} — Ver ejercicios
              </Text>
            ) : user?.membershipType === "Guest" ? (
              <Text color="gray.500" fontStyle="italic">
                No tienes acceso a rutinas con tu membresía actual.
              </Text>
            ) : (
              <Text color="gray.500">No estás inscripto a ninguna rutina.</Text>
            )} */}
          </Box>
        </Flex>
      </Box>
      {/* ================ MODAL DE RUTINA ================== */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ejercicios de la rutina</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoutine?.Exercises?.length > 0 ? (
              <VStack align="start" spacing={3}>
                {selectedRoutine.Exercises.map((ex, i) => (
                  <Box key={i} p={3} borderRadius="md" bg="gray.100" w="100%">
                    <Text fontWeight="bold">{ex.name}</Text>
                    <Text fontSize="sm">Series: {ex.series}</Text>
                    <Text fontSize="sm">Repeticiones: {ex.repetitions}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {ex.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No hay ejercicios cargados en esta rutina.</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default HomeView;
