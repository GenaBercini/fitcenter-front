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
import AddSchedule from "../components/Dashboard/AddSchedule";
import EditSchedule from "../components/Dashboard/EditSchedule";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [search, setSearch] = useState("");

  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${API_URL}/schedule`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Error al obtener turnos:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filtered = schedules.filter((s) =>
    s.day?.toLowerCase().includes(search.toLowerCase()),
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
          Turnos
        </Heading>

        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por día"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <AddSchedule onSaved={fetchSchedules} />
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>DÍA</Th>
            <Th>HORARIO</Th>
            <Th>CUPO</Th>
            <Th>ESTADO</Th>
            <Th textAlign="right">EDITOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((s) => (
            <Tr key={s.id}>
              <Td fontWeight="bold">{s.day}</Td>
              <Td color="gray.600">
                {s.startTime || "--"} - {s.endTime || "--"}
              </Td>
              <Td fontWeight="medium">{s.capacity ?? "--"}</Td>
              <Td>
                <Badge colorScheme={s.active !== false ? "green" : "red"}>
                  {s.active !== false ? "Activo" : "Inactivo"}
                </Badge>
              </Td>
              <Td textAlign="right">
                <EditSchedule schedule={s} onSaved={fetchSchedules} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
