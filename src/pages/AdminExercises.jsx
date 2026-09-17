import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Flex,
  Badge,
  Switch,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import AddExercise from "../components/Dashboard/AddExercise";
import EditExercise from "../components/Dashboard/EditExercise";

export default function AdminExercises() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");

  const fetchExercises = async () => {
    try {
      const res = await fetch("http://localhost:3000/exercises?includeInactive=true");
      if (res.ok) {
        const data = await res.json();
        setExercises(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Error al obtener ejercicios:", err);
    }
  };

  const toggleExercise = async (exercise) => {
    const res = await fetch(`http://localhost:3000/exercises/${exercise.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !exercise.disabled }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el estado");
    await fetchExercises();
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const filtered = exercises.filter((ex) =>
    ex.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box bg="white" borderRadius="xl" p={6} shadow="sm">
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Heading size="lg" color="gray.800">
          Ejercicios
        </Heading>

        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <AddExercise onSaved={fetchExercises} />
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>EJERCICIO</Th>
            <Th>TIPO DE EJERCICIO</Th>
            <Th>ESTADO</Th>
            <Th textAlign="right">EDITOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((ex) => (
            <Tr key={ex.id}>
              <Td fontWeight="bold">{ex.name}</Td>
              <Td color="gray.600">{ex.typeEx || "-"}</Td>
              <Td>
                <Badge colorScheme={ex.disabled ? "red" : "green"}>
                  {ex.disabled ? "Inactivo" : "Activo"}
                </Badge>
                <Switch
                  ml={3}
                  isChecked={!ex.disabled}
                  onChange={() => toggleExercise(ex).catch(console.error)}
                  aria-label={`Cambiar estado de ${ex.name}`}
                />
              </Td>
              <Td textAlign="right">
                <EditExercise exercise={ex} onSaved={fetchExercises} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
