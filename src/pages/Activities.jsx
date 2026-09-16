import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Container,
  Flex,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [userInscriptions, setUserInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const toast = useToast();

  const loadData = async () => {
    try {
      const resAct = await fetch("http://localhost:3000/activities");
      if (resAct.ok) {
        const dataAct = await resAct.json();
        setActivities(Array.isArray(dataAct) ? dataAct : []);
      }

      if (user?.id) {
        const resIns = await fetch(
          `http://localhost:3000/inscription/${user.id}`,
        );
        if (resIns.ok) {
          const dataIns = await resIns.json();
          setUserInscriptions(Array.isArray(dataIns.data) ? dataIns.data : []);
        }
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleEnroll = async (activityId) => {
    if (!user?.id) return;
    setProcessingId(activityId);

    try {
      const res = await fetch("http://localhost:3000/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          activityId: activityId,
          type: "activity",
        }),
      });

      if (!res.ok) {
        let responseData = {};
        try {
          responseData = await res.json();
        } catch {
          // Si no es json
        }
        const errMsg =
          responseData.message || "Error al procesar la inscripción.";

        toast({
          title: "No se pudo inscribir",
          description:
            errMsg === "You already have an activity"
              ? "Ya tienes una actividad registrada. Cancela tu inscripción actual para elegir otra."
              : errMsg,
          status: "warning",
          duration: 3500,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Inscripción registrada",
        status: "success",
        duration: 2000,
      });

      await loadData();
    } catch (err) {
      toast({
        title: "Error de red",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (inscriptionId) => {
    if (!inscriptionId) return;
    setProcessingId(inscriptionId);

    try {
      const res = await fetch(
        `http://localhost:3000/inscription/${inscriptionId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        toast({
          title: "No se pudo cancelar",
          status: "error",
          duration: 3000,
        });
        return;
      }

      toast({
        title: "Inscripción cancelada",
        status: "info",
        duration: 2000,
      });

      await loadData();
    } catch (err) {
      toast({
        title: "Error al dar de baja",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const categories = ["Todos", "Hilado", "CrossFit", "Yoga", "Zumba"];

  const filtered =
    filter === "Todos"
      ? activities
      : activities.filter(
          (a) => String(a?.name).toLowerCase() === filter.toLowerCase(),
        );

  // Verificar si el usuario ya tiene CUALQUIER actividad inscripta
  const hasAnyActivityInscription = userInscriptions.some(
    (i) => i && i.type === "activity",
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" py={8} translate="no">
      <Container maxW="6xl">
        <Heading size="xl" mb={2} color="gray.800">
          Actividades Disponibles
        </Heading>

        {hasAnyActivityInscription && (
          <Text fontSize="sm" color="blue.600" mb={6} fontWeight="medium">
            * Ya estás inscripto en una actividad. Si deseas cambiarte, primero
            cancela tu inscripción actual.
          </Text>
        )}

        <HStack spacing={3} mb={8} overflowX="auto" pb={2}>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              borderRadius="full"
              colorScheme={filter === cat ? "blue" : "gray"}
              variant={filter === cat ? "solid" : "outline"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </HStack>

        <VStack spacing={4} align="stretch">
          {filtered.map((act) => {
            if (!act || !act.id) return null;

            // Buscar inscripción existente específica para esta actividad
            const activeIns = userInscriptions.find(
              (i) =>
                i &&
                i.type === "activity" &&
                (i.activityId === act.id || i.Activity?.id === act.id),
            );

            const isEnrolledInThis = Boolean(activeIns);
            const isBusy =
              processingId === act.id ||
              (activeIns && processingId === activeIns.id);

            return (
              <Box
                key={String(act.id)}
                p={5}
                bg="white"
                borderRadius="xl"
                shadow="sm"
                borderWidth="1px"
                borderColor={isEnrolledInThis ? "blue.300" : "gray.200"}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  flexWrap="wrap"
                  gap={4}
                >
                  <Box>
                    <HStack spacing={2} mb={1}>
                      <Text fontSize="lg" fontWeight="bold" color="blue.700">
                        {String(act.name || "")}
                      </Text>
                      {isEnrolledInThis ? (
                        <Badge colorScheme="green">Inscripto</Badge>
                      ) : null}
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      Descripción:{" "}
                      {String(act.description || "Sin descripción")}
                    </Text>

                    <Text fontSize="xs" color="gray.400" mt={1}>
                      Horario: {String(act.startTime || "--")} -{" "}
                      {String(act.endTime || "--")}
                    </Text>
                  </Box>

                  <Box>
                    {isEnrolledInThis ? (
                      <Button
                        colorScheme="red"
                        variant="outline"
                        size="md"
                        isLoading={isBusy}
                        onClick={() => handleCancel(activeIns.id)}
                      >
                        Cancelar inscripción
                      </Button>
                    ) : (
                      <Button
                        colorScheme="blue"
                        size="md"
                        isLoading={isBusy}
                        isDisabled={hasAnyActivityInscription} // Deshabilitado si ya tiene otra actividad
                        onClick={() => handleEnroll(act.id)}
                      >
                        Inscribirse
                      </Button>
                    )}
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Container>
    </Box>
  );
}
