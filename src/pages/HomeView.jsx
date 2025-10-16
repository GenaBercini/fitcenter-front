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
} from "@chakra-ui/react";
import {
  FaUser,
  FaCalendarPlus,
  FaClipboardList,
  FaHistory,
  FaDumbbell,
} from "react-icons/fa";

function HomeView() {
  const navigate = useNavigate();
  const bgCard = useColorModeValue("white", "gray.700");

  const [activity, setActivity] = useState(null);
  const [schedules, setSchedules] = useState([]); // 🆕 ahora es un array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Traemos el usuario en sesión
        const userRes = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const userData = await userRes.json();
        const userId = userData?.data?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        // 🔹 Traer todas las inscripciones del usuario
        const inscriptionRes = await fetch(
          `http://localhost:3000/inscription/${userId}`
        );
        const inscriptionData = await inscriptionRes.json();

        // 🔹 Buscar actividad (solo una) y todos los turnos (varios)
        const activityIns = inscriptionData.data.find(
          (i) => i.type === "activity"
        );
        const scheduleIns = inscriptionData.data.filter(
          (i) => i.type === "schedule"
        );

        setActivity(activityIns?.Activity || null);
        setSchedules(scheduleIns.map((i) => i.Schedule)); // 🆕 guardamos todos
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
    <Box p={6} bg={useColorModeValue("gray.50", "gray.800")} minH="100vh">
      <Heading size="lg">
        ¡Hola{" "}
        <Text as="span" color="pink.500">
          Kevin
        </Text>
        !
      </Heading>

      {/* Atajos */}
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
          onClick={() => navigate("/users")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaUser size={28} color="#E91E63" />
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
          <FaCalendarPlus size={28} color="#E91E63" />
          <Text mt={2}>Reservar turno</Text>
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
          onClick={() => navigate("/activities")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaClipboardList size={28} color="#E91E63" />
          <Text mt={2}>Actividades</Text>
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
          onClick={() => navigate("/historial")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaHistory size={28} color="#E91E63" />
          <Text mt={2}>Historial</Text>
        </Flex>
      </Grid>

      {/* Sección entrenamiento */}
      <Box mt={10}>
        <Heading size="md" mb={4}>
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
            <FaDumbbell size={28} color="#E91E63" />
            <VStack align="start" spacing={0} ml={4}>
              <Text fontWeight="bold">Ver plan actual</Text>
              <Text fontSize="sm" color="gray.500">
                Entrenamiento personalizado
              </Text>
            </VStack>
          </Flex>

          {/* Información de inscripción */}
          <Box w="100%" mt={3}>
            <Text fontWeight="bold" color="pink.500">
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

            <Text fontWeight="bold" color="pink.500" mt={3}>
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
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default HomeView;
