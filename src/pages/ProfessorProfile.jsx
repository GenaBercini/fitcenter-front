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
  useColorModeValue,
  Spinner,
  useDisclosure,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FaDumbbell, FaListUl, FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfessorProfile() {
  const { user } = useAuth();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingExercise, setEditingExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: "", typeEx: "" });

  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    typeRoutine: "",
    descRoutine: "",
  });
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [editingRoutine, setEditingRoutine] = useState(null);

  const bgCard = "white";
  const bgSoftBlue = "white";
  const borderBlue = "blue.200";
  const textSecondary = "gray.600";

  const {
    isOpen: isOpenExercise,
    onOpen: onOpenExercise,
    onClose: onCloseExercise,
  } = useDisclosure();

  const {
    isOpen: isOpenRoutine,
    onOpen: onOpenRoutine,
    onClose: onCloseRoutine,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const resUser = await fetch(`http://localhost:3000/users/${user.id}`);
        const dataUser = await resUser.json();
        setProfessor(dataUser.data);

        const resEx = await fetch("http://localhost:3000/exercises");
        const dataEx = await resEx.json();
        setExercises(dataEx.data || []);

        const resRoutines = await fetch("http://localhost:3000/routines");
        const dataRoutines = await resRoutines.json();
        setRoutines(dataRoutines.data || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const closeExerciseModal = () => {
    setEditingExercise(null);
    setNewExercise({ name: "", typeEx: "" });
    onCloseExercise();
  };

  const closeRoutineModal = () => {
    setEditingRoutine(null);
    setNewRoutine({ typeRoutine: "", descRoutine: "" });
    setSelectedExercises([]);
    onCloseRoutine();
  };

  const handleCreateExercise = async () => {
    try {
      const res = await fetch("http://localhost:3000/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newExercise,
          professorId: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error creando ejercicio");
      setExercises((prev) => [...prev, data.data]);
      closeExerciseModal();
    } catch (err) {
      alert("Error al crear ejercicio: " + (err.message || err));
    }
  };

  const handleSaveExercise = async () => {
    try {
      if (editingExercise) {
        const res = await fetch(
          `http://localhost:3000/exercises/${editingExercise.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExercise),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error guardando ejercicio");

        setExercises((prev) =>
          prev.map((e) => (e.id === editingExercise.id ? data.data : e))
        );
      } else {
        const res = await fetch("http://localhost:3000/exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newExercise, professorId: user.id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error creando ejercicio");
        setExercises((prev) => [...prev, data.data]);
      }

      setEditingExercise(null);
      setNewExercise({ name: "", typeEx: "" });
      onCloseExercise();
    } catch (err) {
      alert("Error al guardar ejercicio: " + (err.message || err));
    }
  };

  const handleCreateRoutine = async () => {
    try {
      const res = await fetch("http://localhost:3000/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRoutine,
          professorId: user.id,
          exercises: selectedExercises,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error creando rutina");
      setRoutines((prev) => [...prev, data.data]);
      closeRoutineModal();
    } catch (err) {
      alert("Error al crear rutina: " + (err.message || err));
    }
  };

  const handleSaveRoutine = async () => {
    try {
      if (!editingRoutine) return;

      const res = await fetch(
        `http://localhost:3000/routines/${editingRoutine.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newRoutine,
            exercises: selectedExercises,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error guardando rutina");

      setRoutines((prev) =>
        prev.map((r) => (r.id === editingRoutine.id ? data.data : r))
      );

      closeRoutineModal();
    } catch (err) {
      alert("Error al guardar rutina: " + (err.message || err));
    }
  };

  const toggleExercise = (id) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleEditExercise = (exercise) => {
    if (!exercise) return;
    setEditingExercise(exercise);
    setNewExercise({
      name: exercise.name || "",
      typeEx: exercise.typeEx || "",
    });
    onOpenExercise();
  };

  const handleEditRoutine = (routine) => {
    if (!routine) return;
    setEditingRoutine(routine);
    setNewRoutine({
      typeRoutine: routine.typeRoutine || "",
      descRoutine: routine.descRoutine || "",
    });
    setSelectedExercises(
      routine.exercises?.filter(Boolean).map((e) => e.id) || []
    );
    onOpenRoutine();
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!exerciseId) return;
    const ok = window.confirm("¿Eliminar este ejercicio?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al eliminar ejercicio");
      }

      setExercises((prev) => prev.filter((e) => e.id !== exerciseId));

      setSelectedExercises((prev) => prev.filter((id) => id !== exerciseId));
    } catch (err) {
      alert("Error al eliminar ejercicio: " + (err.message || err));
    }
  };

  const handleDeleteRoutine = async (routineId) => {
    if (!routineId) return;
    const ok = window.confirm("¿Eliminar (deshabilitar) esta rutina?");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/routines/${routineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al eliminar rutina");

      setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    } catch (err) {
      alert("Error al eliminar rutina: " + (err.message || err));
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.400" />
      </Flex>
    );
  }

  if (!professor) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="blue.500" fontWeight="bold">
          No se encontró la información del profesor.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50" p={6}>
      <Box
        w="100%"
        maxW="1000px"
        bg={bgCard}
        border="3px solid"
        borderColor={borderBlue}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <Flex
          bgGradient="linear(to-r, blue.500, blue.400)"
          color="white"
          align="center"
          p={6}
          gap={4}
        >
          <Avatar
            size="xl"
            name={professor?.first_name}
            src={
              professor?.image_url ||
              "http://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            }
            border="4px solid white"
          />
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              {professor?.first_name} {professor?.last_name || ""}
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Profesor
            </Text>
          </Box>
        </Flex>

        <Box p={6}>
          <Text
            fontWeight="bold"
            color="blue.600"
            fontSize="lg"
            borderBottom="1px solid"
            borderColor="blue.200"
            pb={1}
            mb={3}
          >
            Información Personal
          </Text>

          <VStack align="start" spacing={1} color={textSecondary} mb={5}>
            <Text>Email: {professor?.email}</Text>
            <Text>Teléfono: {professor?.phone || "No disponible"}</Text>
            <Text>Dirección: {professor?.address || "No disponible"}</Text>
            <Text>Matricula: {professor?.matricula || "No disponible"}</Text>
          </VStack>

          <Divider my={4} />

          <Flex justify="space-between" align="center" mb={4}>
            <HStack>
              <FaDumbbell color="#1E3A8A" />
              <Text fontWeight="bold" fontSize="lg">
                Ejercicios del Profesor
              </Text>
            </HStack>
            <Button colorScheme="blue" size="sm" onClick={onOpenExercise}>
              Nuevo Ejercicio
            </Button>
          </Flex>

          <SimpleGrid columns={[1, 2]} spacing={3} mb={6}>
            {exercises.length > 0 ? (
              exercises.map((ex) =>
                ex ? (
                  <Flex
                    key={ex.id}
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
                      <Text fontWeight="bold">{ex.name || "-"}</Text>
                      <Text fontSize="sm" color={textSecondary}>
                        Tipo: {ex.typeEx || "-"}
                      </Text>
                    </Box>

                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Editar ejercicio"
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEditExercise(ex)}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Eliminar ejercicio"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteExercise(ex.id)}
                      />
                    </HStack>
                  </Flex>
                ) : null
              )
            ) : (
              <Text color="gray.500">No hay ejercicios creados.</Text>
            )}
          </SimpleGrid>

          <Divider my={4} />

          <Flex justify="space-between" align="center" mb={4}>
            <HStack>
              <FaListUl color="#1E3A8A" />
              <Text fontWeight="bold" fontSize="lg">
                Rutinas Creadas
              </Text>
            </HStack>
            <Button colorScheme="blue" size="sm" onClick={onOpenRoutine}>
              Nueva Rutina
            </Button>
          </Flex>

          <VStack align="stretch" spacing={3}>
            {routines.length > 0 ? (
              routines.map((r, i) =>
                r ? (
                  <Flex
                    key={r.id ?? i}
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
                      <Text fontWeight="bold">{r.typeRoutine || "-"}</Text>
                      <Text fontSize="sm" color={textSecondary}>
                        {r.descRoutine || ""}
                      </Text>
                      {r.exercises?.length > 0 && (
                        <Text fontSize="sm" mt={2}>
                          <strong>Ejercicios:</strong>{" "}
                          {Array.isArray(r.exercises) && r.exercises.length > 0
                            ? r.exercises.map((e) => e?.name || "-").join(", ")
                            : "Sin ejercicios"}
                        </Text>
                      )}
                    </Box>

                    <HStack spacing={2}>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Editar rutina"
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEditRoutine(r)}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Eliminar rutina"
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteRoutine(r.id)}
                      />
                    </HStack>
                  </Flex>
                ) : null
              )
            ) : (
              <Text color="gray.500">No hay rutinas creadas.</Text>
            )}
          </VStack>
        </Box>
      </Box>

      <Modal isOpen={isOpenExercise} onClose={closeExerciseModal} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="md" overflow="hidden">
          <ModalHeader
            bg="blue.600"
            color="white"
            fontWeight="bold"
            borderTopRadius="md"
            pb={3}
          >
            {" "}
            {editingExercise ? "Editar Ejercicio" : "Nuevo Ejercicio"}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder="Ej: Sentadillas"
                value={newExercise.name}
                onChange={(e) =>
                  setNewExercise((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo de ejercicio</FormLabel>
              <Input
                placeholder="Ej: Piernas, Brazos..."
                value={newExercise.typeEx}
                onChange={(e) =>
                  setNewExercise((prev) => ({
                    ...prev,
                    typeEx: e.target.value,
                  }))
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              variant="ghost"
              mr={3}
              onClick={closeExerciseModal}
            >
              Cancelar
            </Button>

            {editingExercise ? (
              <HStack spacing={2}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    // delete from modal
                    if (editingExercise?.id)
                      handleDeleteExercise(editingExercise.id);
                    closeExerciseModal();
                  }}
                >
                  Eliminar
                </Button>
                <Button colorScheme="blue" onClick={handleSaveExercise}>
                  Guardar Cambios
                </Button>
              </HStack>
            ) : (
              <Button colorScheme="blue" onClick={handleCreateExercise}>
                Crear
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenRoutine}
        onClose={closeRoutineModal}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent borderRadius="md" overflow="hidden">
          <ModalHeader
            bg="blue.600"
            color="white"
            fontWeight="bold"
            borderTopRadius="md"
            pb={3}
          >
            {editingRoutine ? "Editar Rutina" : "Nueva Rutina"}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Tipo de rutina</FormLabel>
              <Input
                placeholder="Ej: Hipertrofia"
                value={newRoutine.typeRoutine}
                onChange={(e) =>
                  setNewRoutine((prev) => ({
                    ...prev,
                    typeRoutine: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Descripción</FormLabel>
              <Input
                placeholder="Ej: Rutina de fuerza para tren superior"
                value={newRoutine.descRoutine}
                onChange={(e) =>
                  setNewRoutine((prev) => ({
                    ...prev,
                    descRoutine: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Seleccionar ejercicios</FormLabel>
              <SimpleGrid columns={[1, 2]} spacing={2}>
                {exercises.map((ex) =>
                  ex ? (
                    <Button
                      key={ex.id}
                      variant={
                        selectedExercises.includes(ex.id) ? "solid" : "outline"
                      }
                      colorScheme="blue"
                      size="sm"
                      onClick={() => toggleExercise(ex.id)}
                    >
                      {ex.name}
                    </Button>
                  ) : null
                )}
              </SimpleGrid>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              color="red"
              mr={3}
              onClick={closeRoutineModal}
            >
              Cancelar
            </Button>

            {editingRoutine ? (
              <HStack spacing={2}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    if (editingRoutine?.id)
                      handleDeleteRoutine(editingRoutine.id);
                    closeRoutineModal();
                  }}
                >
                  Eliminar
                </Button>
                <Button colorScheme="blue" onClick={handleSaveRoutine}>
                  Guardar Cambios
                </Button>
              </HStack>
            ) : (
              <Button colorScheme="blue" onClick={handleCreateRoutine}>
                Crear
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
