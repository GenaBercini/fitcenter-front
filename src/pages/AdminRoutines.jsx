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
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import AddRoutine from "../components/Dashboard/AddRoutine";
import EditRoutine from "../components/Dashboard/EditRoutine";

export default function AdminRoutines() {
  const [routines, setRoutines] = useState([]);
  const [search, setSearch] = useState("");

  const fetchRoutines = async () => {
    try {
      const res = await fetch("http://localhost:3000/routines");
      if (res.ok) {
        const data = await res.json();
        setRoutines(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Error al obtener rutinas:", err);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const filtered = routines.filter((r) =>
    r.typeRoutine?.toLowerCase().includes(search.toLowerCase()),
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
          Rutinas
        </Heading>

        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por tipo de rutina"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <AddRoutine onSaved={fetchRoutines} />
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>TIPO DE RUTINA</Th>
            <Th>DESCRIPCIÓN</Th>
            <Th>ESTADO</Th>
            <Th textAlign="right">EDITOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((r) => {
            const isInactive = r.disabled === true || Number(r.disabled) === 1;

            return (
              <Tr key={r.id}>
                <Td fontWeight="bold">{r.typeRoutine}</Td>
                <Td color="gray.600">
                  {r.descRoutine || r.description || "-"}
                </Td>
                <Td>
                  <Badge colorScheme={isInactive ? "red" : "green"}>
                    {isInactive ? "Inactiva" : "Activa"}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <EditRoutine routine={r} onSaved={fetchRoutines} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
