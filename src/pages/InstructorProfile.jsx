import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
  Divider,
  useColorModeValue,
  IconButton,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function InstructorProfile() {
  const { user } = useAuth();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const bgCard = useColorModeValue("white", "gray.800");
  const bgSoftPink = useColorModeValue("pink.50", "pink.900");
  const borderPink = useColorModeValue("pink.300", "pink.600");
  const textMain = useColorModeValue("gray.800", "white");
  const textSecondary = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`http://localhost:3000/users/${user.id}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setInstructor(data.data);
      } catch (error) {
        console.error("Error al cargar el instructor:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [user]);
  const handleDeleteActivity = async (activityId) => {
    if (!activityId) return;
    const ok = window.confirm("¿Eliminar esta actividad?");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:3000/activities/${activityId}`,
        {
          method: "DELETE",
        }
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
  const handleCreateActivity = async () => {
    setLoadingCreate(true);
    try {
      let res;
      if (editingActivity) {
        res = await fetch(
          `http://localhost:3000/activities/${editingActivity.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newActivity,
              instructorId: instructor.id,
              approved: editingActivity.approved,
            }),
          }
        );

        if (!res.ok) {
          const err = await res.text();
          alert("Error al editar actividad: " + err);
        } else {
          setInstructor((prev) => ({
            ...prev,
            activities: prev.activities.map((act) =>
              act.id === editingActivity.id ? { ...act, ...newActivity } : act
            ),
          }));
        }
      } else {
        res = await fetch("http://localhost:3000/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instructorId: instructor.id,
            ...newActivity,
            instructor: `${instructor.first_name} ${instructor.last_name}`,
            approved: false,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          alert("Error al crear actividad: " + err);
        } else {
          const created = await res.json();
          setInstructor((prev) => ({
            ...prev,
            activities: [...(prev.activities || []), created],
          }));
        }
      }

      setNewActivity({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        capacity: "",
      });
      setEditingActivity(null);
      onClose();
    } catch (err) {
      alert("Error en la solicitud.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      name: activity.name || "",
      description: activity.description || "",
      startTime: activity.startTime || "",
      endTime: activity.endTime || "",
      capacity: activity.capacity || "",
    });
    onOpen();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="pink.400" />
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
        borderColor={borderPink}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <Flex
          bgGradient="linear(to-r, blue.500, pink.400)"
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
            color="pink.600"
            fontSize="lg"
            borderBottom="1px solid"
            borderColor="pink.200"
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
            <Text fontWeight="bold" color="pink.600" fontSize="lg">
              Actividades Dictadas
            </Text>
            <Button colorScheme="pink" size="sm" onClick={onOpen}>
              Crear Nueva Actividad
            </Button>
          </Flex>

          <VStack align="stretch" spacing={3}>
            {instructor.activities && instructor.activities.length > 0 ? (
              instructor.activities.map((act, i) => (
                <Flex
                  key={i}
                  justify="space-between"
                  align="center"
                  bg={bgSoftPink}
                  border="1px solid"
                  borderColor="pink.100"
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
                      Instructor:{" "}
                      {act.instructor
                        ? `${act.instructor.first_name} ${act.instructor.last_name}`
                        : `${instructor.first_name} ${instructor.last_name}`}
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
                      colorScheme="pink"
                      variant="outline"
                      onClick={() => handleEditClick(act)}
                    />

                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Eliminar"
                      size="sm"
                      colorScheme="red"
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

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setEditingActivity(null);
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingActivity ? "Editar Actividad" : "Crear Nueva Actividad"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre de la Actividad</FormLabel>
                <Input
                  placeholder="Ej: Crossfit"
                  value={newActivity.name}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  placeholder="Breve descripción"
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>

              <HStack w="100%">
                <FormControl isRequired>
                  <FormLabel>Hora de Inicio</FormLabel>
                  <Input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        startTime: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hora de Fin</FormLabel>
                  <Input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        endTime: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Cupo Máximo</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={newActivity.capacity}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, capacity: e.target.value })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setEditingActivity(null);
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="pink"
              ml={3}
              onClick={handleCreateActivity}
              isLoading={loadingCreate}
            >
              {editingActivity ? "Guardar Cambios" : "Crear Actividad"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
