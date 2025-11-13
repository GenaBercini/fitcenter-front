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
import { FaDumbbell, FaListUl } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfessorProfile() {
  const { user } = useAuth();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgCard = useColorModeValue("white", "gray.800");
  const bgSoftPink = useColorModeValue("pink.50", "pink.900");
  const borderPink = useColorModeValue("pink.300", "pink.600");
  const textSecondary = useColorModeValue("gray.600", "gray.300");

  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: "", typeEx: "" });
  const {
    isOpen: isOpenExercise,
    onOpen: onOpenExercise,
    onClose: onCloseExercise,
  } = useDisclosure();

  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState({
    typeRoutine: "",
    descRoutine: "",
  });
  const [selectedExercises, setSelectedExercises] = useState([]);
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
      if (!res.ok) throw new Error(data.msg);
      setExercises((prev) => [...prev, data.data]);
      setNewExercise({ name: "", typeEx: "" });
      onCloseExercise();
    } catch (err) {
      alert("Error al crear ejercicio: " + err.message);
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
      if (!res.ok) throw new Error(data.msg);
      setRoutines((prev) => [...prev, data.data]);
      setNewRoutine({ typeRoutine: "", descRoutine: "" });
      setSelectedExercises([]);
      onCloseRoutine();
    } catch (err) {
      alert("Error al crear rutina: " + err.message);
    }
  };

  const toggleExercise = (id) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="pink.400" />
      </Flex>
    );
  }

  if (!professor) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="pink.500" fontWeight="bold">
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
        borderColor={borderPink}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <Flex
          bgGradient="linear(to-r, pink.500, pink.400)"
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
              {professor?.first_name} {professor?.last_name}
            </Text>
            <Text fontSize="sm" opacity={0.9}>
              Profesor
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
            <Text>Email: {professor?.email}</Text>
            <Text>Teléfono: {professor?.phone || "No disponible"}</Text>
            <Text>Dirección: {professor?.address || "No disponible"}</Text>
            <Text>Matricula: {professor?.matricula || "No disponible"}</Text>
          </VStack>

          <Divider my={4} />

          <Flex justify="space-between" align="center" mb={4}>
            <HStack>
              <FaDumbbell color="hotpink" />
              <Text fontWeight="bold" color="pink.600" fontSize="lg">
                Ejercicios del Profesor
              </Text>
            </HStack>
            <Button colorScheme="pink" size="sm" onClick={onOpenExercise}>
              Nuevo Ejercicio
            </Button>
          </Flex>

          <SimpleGrid columns={[1, 2]} spacing={3} mb={6}>
            {exercises.length > 0 ? (
              exercises.map((ex) => (
                <Box
                  key={ex.id}
                  bg={bgSoftPink}
                  border="1px solid"
                  borderColor="pink.100"
                  p={3}
                  borderRadius="lg"
                >
                  <Text fontWeight="bold">{ex.name}</Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Tipo: {ex.typeEx}
                  </Text>
                </Box>
              ))
            ) : (
              <Text color="gray.500">No hay ejercicios creados.</Text>
            )}
          </SimpleGrid>

          <Divider my={4} />

          <Flex justify="space-between" align="center" mb={4}>
            <HStack>
              <FaListUl color="hotpink" />
              <Text fontWeight="bold" color="pink.600" fontSize="lg">
                Rutinas Creadas
              </Text>
            </HStack>
            <Button colorScheme="pink" size="sm" onClick={onOpenRoutine}>
              Nueva Rutina
            </Button>
          </Flex>

          <VStack align="stretch" spacing={3}>
            {routines.length > 0 ? (
              routines.map((r, i) => (
                <Box
                  key={i}
                  bg={bgSoftPink}
                  border="1px solid"
                  borderColor="pink.100"
                  p={4}
                  borderRadius="lg"
                >
                  <Text fontWeight="bold">{r.typeRoutine}</Text>
                  <Text fontSize="sm" color={textSecondary}>
                    {r.descRoutine}
                  </Text>

                  {r.exercises && r.exercises.length > 0 && (
                    <Text fontSize="sm" mt={2}>
                      <strong>Ejercicios:</strong>{" "}
                      {r.exercises.map((e) => e.name).join(", ")}
                    </Text>
                  )}
                </Box>
              ))
            ) : (
              <Text color="gray.500">No hay rutinas creadas.</Text>
            )}
          </VStack>
        </Box>
      </Box>
      <Modal isOpen={isOpenExercise} onClose={onCloseExercise} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo Ejercicio</ModalHeader>
          <ModalCloseButton />
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
            <Button variant="ghost" mr={3} onClick={onCloseExercise}>
              Cancelar
            </Button>
            <Button colorScheme="pink" onClick={handleCreateExercise}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenRoutine}
        onClose={onCloseRoutine}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva Rutina</ModalHeader>
          <ModalCloseButton />
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
                {exercises.map((ex) => (
                  <Button
                    key={ex.id}
                    variant={
                      selectedExercises.includes(ex.id) ? "solid" : "outline"
                    }
                    colorScheme="pink"
                    size="sm"
                    onClick={() => toggleExercise(ex.id)}
                  >
                    {ex.name}
                  </Button>
                ))}
              </SimpleGrid>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseRoutine}>
              Cancelar
            </Button>
            <Button colorScheme="pink" onClick={handleCreateRoutine}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
