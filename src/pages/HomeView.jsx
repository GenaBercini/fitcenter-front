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
  const iconColor = "pink.500";

  const [activity, setActivity] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Traemos el usuario en sesión
  //       const userRes = await fetch("http://localhost:3000/users/session", {
  //         credentials: "include",
  //       });
  //       const userData = await userRes.json();
  //       const userId = userData?.data?.id;

  //       if (!userId) {
  //         setLoading(false);
  //         return;
  //       }

  //       // Traer actividad y turno del usuario
  //       const [activityRes, scheduleRes] = await Promise.all([
  //         fetch(`http://localhost:3000/activities/user/${userId}`),
  //         fetch(`http://localhost:3000/schedules/user/${userId}`),
  //       ]);

  //       const activityData = await activityRes.json();
  //       const scheduleData = await scheduleRes.json();

  //       setActivity(activityData?.data || null);
  //       setSchedule(scheduleData?.data || null);
  //     } catch (error) {
  //       console.error(error);
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

        if (!userId) {
          setLoading(false);
          return;
        }

        // 🔹 Obtener todas las inscripciones del usuario
        const inscriptionRes = await fetch(
          `http://localhost:3000/inscription/${userId}`
        );
        const inscriptionData = await inscriptionRes.json();

        // 🔹 Dividir entre actividad y turno
        const activity = inscriptionData.data.find(
          (i) => i.type === "activity"
        );
        const schedule = inscriptionData.data.find(
          (i) => i.type === "schedule"
        );

        setActivity(activity?.Activity || null);
        setSchedule(schedule?.Schedule || null);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              Turno
            </Text>
            {schedule ? (
              <Text>
                Día: {schedule.day} — {schedule.startTime} a {schedule.endTime}
              </Text>
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
