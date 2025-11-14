"use client"

import {
  Box,
  Button,
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
} from "@chakra-ui/react"
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import AddCategory from "../components/Dashboard/AddCategory";
import EditCategory from "../components/Dashboard/EditCategory";

const Instructors = () => {

    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const [instructors, setInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //PROFESORES

    useEffect(() => {
      fetch("http://localhost:3000/users/role/instructor")
        .then((res) => res.json())
        .then((data) => {
          
          setInstructors(data.data);
          setFilteredInstructors(data.data);
          console.log("DATA", data.data);
        })
        .catch((err) => {
          console.error("Error cargando instructores:", err);
          Swal.fire({ title: "Error", text: err, icon: "error" })
          .then(() => {
            location.reload();
          });
        });
    }, []);


    //FILTRO DE BUSQUEDA
    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
      applyFilters(value);
    };
    
    const applyFilters = (searchValue) => {
      const filtered = instructors.filter((i) => {
        const matchesSearch =
          i.first_name.toLowerCase().includes(searchValue) ||
          i.last_name.toLowerCase().includes(searchValue) ||
          i.email.toLowerCase().includes(searchValue) ||
          String(i.registration_number).toLowerCase().includes(searchValue);
        return matchesSearch;
      });

      setFilteredInstructors(filtered);
    };


  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Instructores</Heading>

          <InputGroup w={400}>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder='Buscar por nombre o matrícula'
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

          <AddCategory/>
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
            {filteredInstructors != undefined &&
              filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor) => (
                  <Tr key={instructor.id}>
                    <Td>{instructor.first_name}</Td>
                    <Td>{instructor.last_name}</Td>
                    <Td>{instructor.phone}</Td>
                    <Td>{instructor.email}</Td>
                    <Td>{instructor.adress}</Td>
                    <Td>{instructor.registration_number}</Td>
                    <Td>{ instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString() : "No se informa"}</Td>
                    <Td><EditCategory category={instructor} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron instructores
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Instructors;