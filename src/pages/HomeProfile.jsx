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
  Container,
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
        // Obtener usuario en sesión
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

        // Comprobar si falta completar información
        const incompleteFields = [
          "first_name",
          "last_name",
          "email",
          "address",
          "phone",
        ].some((key) => !userInfo[key] || userInfo[key].trim() === "");
        setMissingData(incompleteFields);

        // Traer inscripciones
        const inscriptionRes = await fetch(
          `http://localhost:3000/inscription/${userInfo.id}`,
        );
        const inscriptionData = await inscriptionRes.json();

        const activityIns = inscriptionData.data.find(
          (i) => i.type === "activity",
        );
        const scheduleIns = inscriptionData.data.filter(
          (i) => i.type === "schedule",
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
      <Flex align="center" justify="center" h="100vh" bg={bgPage}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box bg={bgPage} minH="100vh" py={8}>
      <Container maxW="7xl">
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
              py={2}
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

        {/* Atajos principales */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={6}
          mt={6}
        >
          {/* Tarjeta Perfil -> Redirige exactamente a /profile */}
          <Flex
            bg={bgCard}
            p={6}
            borderRadius="2xl"
            align="center"
            justify="center"
            flexDir="column"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            cursor="pointer"
            onClick={() => navigate("/profile")}
            _hover={{ transform: "translateY(-4px)", shadow: "md" }}
            transition="all 0.2s"
          >
            <FaUser size={28} color="#3182ce" />
            <Text mt={3} fontWeight="bold" color={textColor}>
              Perfil
            </Text>
          </Flex>

          <Flex
            bg={bgCard}
            p={6}
            borderRadius="2xl"
            align="center"
            justify="center"
            flexDir="column"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            cursor="pointer"
            onClick={() => navigate("/schedule")}
            _hover={{ transform: "translateY(-4px)", shadow: "md" }}
            transition="all 0.2s"
          >
            <FaCalendarPlus size={28} color="#3182ce" />
            <Text mt={3} fontWeight="bold" color={textColor}>
              Reservar turno
            </Text>
          </Flex>

          <Flex
            bg={bgCard}
            p={6}
            borderRadius="2xl"
            align="center"
            justify="center"
            flexDir="column"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            cursor="pointer"
            onClick={() => navigate("/activities")}
            _hover={{ transform: "translateY(-4px)", shadow: "md" }}
            transition="all 0.2s"
          >
            <FaClipboardList size={28} color="#3182ce" />
            <Text mt={3} fontWeight="bold" color={textColor}>
              Actividades
            </Text>
          </Flex>

          <Flex
            bg={bgCard}
            p={6}
            borderRadius="2xl"
            align="center"
            justify="center"
            flexDir="column"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            cursor="pointer"
            onClick={() => navigate("/routine")}
            _hover={{ transform: "translateY(-4px)", shadow: "md" }}
            transition="all 0.2s"
          >
            <FaHistory size={28} color="#3182ce" />
            <Text mt={3} fontWeight="bold" color={textColor}>
              Rutinas
            </Text>
          </Flex>
        </Grid>

        {/* Sección entrenamiento */}
        <Box mt={10}>
          <Heading size="md" mb={4} color={textColor}>
            Entrenamiento
          </Heading>
          <Flex
            bg={bgCard}
            p={6}
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            flexDir="column"
            alignItems="flex-start"
          >
            <Flex align="center" mb={4}>
              <FaDumbbell size={28} color="#3182ce" />
              <VStack align="start" spacing={0} ml={4}>
                <Text fontWeight="bold" fontSize="lg" color={textColor}>
                  Ver plan actual
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Entrenamiento personalizado
                </Text>
              </VStack>
            </Flex>

            {/* Información de inscripción */}
            <Box w="100%" mt={2}>
              <Text fontWeight="bold" color="blue.500">
                Actividad
              </Text>
              {activity ? (
                <Text color={textColor}>
                  {activity.name} — {activity.startTime} a {activity.endTime} -{" "}
                  {activity.description}
                </Text>
              ) : (
                <Text color="gray.500">
                  No estás inscripto a ninguna actividad
                </Text>
              )}

              <Text fontWeight="bold" color="blue.500" mt={4}>
                Turnos
              </Text>
              {schedules.length > 0 ? (
                <VStack align="start" spacing={1} mt={1}>
                  {schedules.map((s, index) => (
                    <Text key={index} color={textColor}>
                      Día: {s.day} — {s.startTime} a {s.endTime}
                    </Text>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.500">No estás inscripto a ningún turno</Text>
              )}

              <Text fontWeight="bold" color="blue.500" mt={4}>
                Rutina
              </Text>
              {currentRoutine ? (
                <Text
                  cursor="pointer"
                  color="blue.500"
                  fontWeight="medium"
                  textDecoration="underline"
                  onClick={() => {
                    setSelectedRoutine(currentRoutine);
                    onOpen();
                  }}
                >
                  {currentRoutine.Routine.typeRoutine} — Ver ejercicios
                </Text>
              ) : (
                <Text color="gray.500">
                  No estás inscripto a ninguna rutina.
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      </Container>

      {/* MODAL DE RUTINA */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Ejercicios de la rutina</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRoutine?.Exercises?.length > 0 ? (
              <VStack align="start" spacing={3}>
                {selectedRoutine.Exercises.map((ex, i) => (
                  <Box key={i} p={4} borderRadius="lg" bg="gray.100" w="100%">
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
              <Text color="gray.500">
                No hay ejercicios cargados en esta rutina.
              </Text>
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
