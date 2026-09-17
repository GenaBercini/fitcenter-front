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
import AddClass from "../components/Dashboard/AddClass";
import EditClass from "../components/Dashboard/EditClass";

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:3000/activities?includeInactive=true");
      if (res.ok) {
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error("Error al obtener clases:", err);
    }
  };

  const toggleClass = async (activity) => {
    const res = await fetch(`http://localhost:3000/activities/${activity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !activity.disabled }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el estado");
    await fetchClasses();
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const filtered = classes.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
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
          Clases
        </Heading>

        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por clase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <AddClass onSaved={fetchClasses} />
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>CLASE</Th>
            <Th>HORARIO</Th>
            <Th>CUPO</Th>
            <Th>ESTADO</Th>
            <Th textAlign="right">EDITOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((c) => {
            const isInactive = c.disabled === true || Number(c.disabled) === 1;

            return (
              <Tr key={c.id}>
                <Td fontWeight="bold">{c.name}</Td>
                <Td color="gray.600">
                  {c.startTime || "--"} - {c.endTime || "--"}
                </Td>
                <Td>{c.capacity || "-"}</Td>
                <Td>
                  <Badge colorScheme={isInactive ? "red" : "green"}>
                    {isInactive ? "Inactiva" : "Activa"}
                  </Badge>
                  <Switch
                    ml={3}
                    isChecked={!isInactive}
                    onChange={() => toggleClass(c).catch(console.error)}
                    aria-label={`Cambiar estado de ${c.name}`}
                  />
                </Td>
                <Td textAlign="right">
                  <EditClass cls={c} />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
