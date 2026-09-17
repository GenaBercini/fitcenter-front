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
import AddMembership from "../components/Dashboard/AddMembership";
import EditMembership from "../components/Dashboard/EditMembership";

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [search, setSearch] = useState("");

  const fetchMemberships = async () => {
    try {
      const res = await fetch("http://localhost:3000/memberships?includeInactive=true");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMemberships(data);
        } else if (Array.isArray(data.data)) {
          setMemberships(data.data);
        } else if (Array.isArray(data.memberships)) {
          setMemberships(data.memberships);
        } else {
          setMemberships([]);
        }
      }
    } catch (err) {
      console.error("Error al obtener membresías:", err);
    }
  };

  const toggleMembership = async (membership) => {
    const res = await fetch(`http://localhost:3000/memberships/${membership.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !membership.disabled }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el estado");
    await fetchMemberships();
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const filtered = memberships.filter((m) => {
    const nameToSearch = m.type || m.name || "";
    return nameToSearch.toLowerCase().includes(search.toLowerCase());
  });

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
          Membresías
        </Heading>

        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por tipo"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <AddMembership onSaved={fetchMemberships} />
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>MEMBRESÍA</Th>
            <Th>PRECIO MENSUAL</Th>
            <Th>ESTADO</Th>
            <Th textAlign="right">EDITOR</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.length > 0 ? (
            filtered.map((m) => (
              <Tr key={m.id}>
                <Td fontWeight="bold">{m.type || m.name}</Td>
                <Td color="gray.600">${m.monthly_price || m.price || "0"}</Td>
                <Td>
                  <Badge colorScheme={m.disabled ? "red" : "green"}>
                    {m.disabled ? "Inactiva" : "Activa"}
                  </Badge>
                  <Switch
                    ml={3}
                    isChecked={!m.disabled}
                    onChange={() => toggleMembership(m).catch(console.error)}
                    aria-label={`Cambiar estado de ${m.type || m.name}`}
                  />
                </Td>
                <Td textAlign="right">
                  <EditMembership membership={m} onSaved={fetchMemberships} />
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} textAlign="center" py={4} color="gray.500">
                No se encontraron membresías.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
