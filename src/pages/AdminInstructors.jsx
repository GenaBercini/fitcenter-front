"use client";

import {
  Box,
  Flex,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import AddCategory from "../components/Dashboard/AddCategory";
import EditCategory from "../components/Dashboard/EditCategory";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/users/role/instructor")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data || [];
        setInstructors(list);
        setFilteredInstructors(list);
      })
      .catch((err) => {
        console.error("Error cargando instructores:", err);
        Swal.fire({
          title: "Error",
          text: "Error al cargar instructores",
          icon: "error",
        });
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value);
  };

  const applyFilters = (searchValue) => {
    const filtered = instructors.filter((i) => {
      const firstName = i?.first_name?.toLowerCase() || "";
      const lastName = i?.last_name?.toLowerCase() || "";
      const email = i?.email?.toLowerCase() || "";
      const regNum = String(i?.registration_number || "").toLowerCase();

      return (
        firstName.includes(searchValue) ||
        lastName.includes(searchValue) ||
        email.includes(searchValue) ||
        regNum.includes(searchValue)
      );
    });

    setFilteredInstructors(filtered);
  };

  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"} align="center">
          <Heading size="xl">Instructores</Heading>

          <InputGroup w={400}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nombre o matrícula"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

          <AddCategory />
        </Flex>

        <Table size="md" variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Teléfono</Th>
              <Th>Email</Th>
              <Th>Dirección</Th>
              <Th>Matrícula</Th>
              <Th>Desde</Th>
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredInstructors && filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor) => (
                <Tr key={instructor.id || instructor.email}>
                  <Td>{instructor.first_name || "-"}</Td>
                  <Td>{instructor.last_name || "-"}</Td>
                  <Td>{instructor.phone || "-"}</Td>
                  <Td>{instructor.email || "-"}</Td>
                  <Td>{instructor.adress || instructor.address || "-"}</Td>
                  <Td>{instructor.registration_number || "-"}</Td>
                  <Td>
                    {instructor.createdAt
                      ? new Date(instructor.createdAt).toLocaleDateString()
                      : "No se informa"}
                  </Td>
                  <Td>
                    <EditCategory category={instructor} />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={8} textAlign="center" py={5}>
                  No se encontraron instructores
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Stack>
    </Box>
  );
};

export default Instructors;
