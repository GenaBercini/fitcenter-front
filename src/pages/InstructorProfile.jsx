import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
  Divider,
  IconButton,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CreateActivityModal from "./CreateActivityModal";

export default function InstructorProfile() {
  const { user } = useAuth();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingActivity, setEditingActivity] = useState(null);

  const bgCard = "white";
  const bgSoftBlue = "white";
  const borderBlue = "blue.200";
  const textMain = "blue.800";
  const textSecondary = "gray.600";

  const fetchInstructor = async () => {
    try {
      if (!user?.id) return;
      const res = await fetch(`http://localhost:3000/users/${user.id}`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      const activitiesRes = await fetch(
        `http://localhost:3000/activities?instructorId=${user.id}`,
      );
      if (!activitiesRes.ok) {
        throw new Error(`Error HTTP: ${activitiesRes.status}`);
      }
      const activities = await activitiesRes.json();
      setInstructor({
        ...data.data,
        activities: (Array.isArray(activities) ? activities : []).filter(
          (activity) =>
            String(activity.instructorId) === String(user.id) ||
            String(activity.instructor?.id) === String(user.id),
        ),
      });
    } catch (error) {
      console.error("Error al cargar el instructor:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructor();
  }, [user]);

  const handleDeleteActivity = async (activityId) => {
    if (!activityId) return;
    const ok = window.confirm("¿Eliminar esta actividad?");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:3000/activities/${activityId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al eliminar actividad");
      }
      setInstructor((prev) => ({
        ...prev,
        activities: prev.activities.filter((a) => a.id !== activityId),
      }));
    } catch (err) {
      alert("Error al eliminar actividad: " + err.message);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    onOpen();
  };

  const handleCreateClick = () => {
    setEditingActivity(null);
    onOpen();
  };

  const renderInstructorName = (act) => {
    if (act.instructor && typeof act.instructor === "object") {
      return `${act.instructor.first_name || ""} ${act.instructor.last_name || ""}`.trim();
    }
    if (typeof act.instructor === "string") {
      return act.instructor;
    }
    return `${instructor?.first_name || ""} ${instructor?.last_name || ""}`.trim();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.400" />
      </Flex>
    );
  }

  if (!instructor) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text fontSize="xl">Cargando perfil...</Text>
      </Flex>
    );
  }

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50" p={6}>
      <Box
        w="100%"
        maxW="800px"
        bg={bgCard}
        border="3px solid"
        borderColor={borderBlue}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <Flex
          bgGradient="linear(to-r, blue.500, gray.700)"
          color="white"
          align="center"
          p={6}
          gap={4}
        >
          <Avatar
            size="xl"
            name={instructor.first_name}
            src={
              instructor.image_url ||
              "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            }
            border="4px solid white"
          />
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              {instructor.first_name}
              {instructor.last_name ? ` ${instructor.last_name}` : ""}
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Instructor
            </Text>
          </Box>
        </Flex>

        <Box p={6}>
          <Text
            fontWeight="bold"
            color="gray.700"
            fontSize="lg"
            borderBottom="1px solid"
            borderColor="blue.300"
            pb={1}
            mb={3}
          >
            Información Personal
          </Text>

          <VStack align="start" spacing={1} color={textSecondary} mb={5}>
            <Text>Email: {instructor.email}</Text>
            <Text>Teléfono: {instructor.phone || "No disponible"}</Text>
            <Text>Dirección: {instructor.address || "No disponible"}</Text>
          </VStack>

          <Divider my={4} />

          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="bold" color="gray.700" fontSize="lg">
              Actividades Dictadas
            </Text>
            <Button colorScheme="blue" size="sm" onClick={handleCreateClick}>
              Crear Nueva Actividad
            </Button>
          </Flex>

          <VStack align="stretch" spacing={3}>
            {instructor.activities && instructor.activities.length > 0 ? (
              instructor.activities.map((act) => (
                <Flex
                  key={act.id}
                  justify="space-between"
                  align="center"
                  bg={bgSoftBlue}
                  border="1px solid"
                  borderColor="blue.100"
                  p={4}
                  borderRadius="lg"
                  _hover={{ boxShadow: "md", transform: "scale(1.01)" }}
                  transition="all 0.15s"
                >
                  <Box>
                    <Text fontWeight="bold" color={textMain}>
                      {act.name}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Instructor: {renderInstructorName(act)}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Cupo: {act.capacity || "-"} |{" "}
                      {act.startTime && act.endTime
                        ? `${act.startTime} - ${act.endTime}`
                        : "Horario no definido"}
                    </Text>
                    {act.approved === false && (
                      <Text color="orange.500" fontSize="sm">
                        (Pendiente de aprobación)
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<FaEdit />}
                      aria-label="Editar"
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleEditClick(act)}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Eliminar"
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => handleDeleteActivity(act.id)}
                    />
                  </HStack>
                </Flex>
              ))
            ) : (
              <Text color="gray.500">No hay actividades registradas.</Text>
            )}
          </VStack>
        </Box>
      </Box>

      <CreateActivityModal
        isOpen={isOpen}
        onClose={onClose}
        instructorId={instructor.id}
        editingActivity={editingActivity}
        onActivitySaved={fetchInstructor}
      />
    </Flex>
  );
}
