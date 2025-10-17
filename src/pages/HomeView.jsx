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
      {/* 🔹 Encabezado con nombre + alerta si faltan datos */}
      <Flex align="center" justify="space-between" flexWrap="wrap">
        <Heading size="lg" color={textColor}>
          ¡Hola{" "}
          <Text as="span" color="pink.500">
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
          <Text mt={2}>Rutinas</Text>
        </Flex>
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
            <FaDumbbell size={28} color="#E91E63" />
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
