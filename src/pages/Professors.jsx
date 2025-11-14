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

const Professors = () => {

    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const [professors, setProfessors] = useState([]);
    const [filteredProfessors, setFilteredProfessors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //PROFESORES

    useEffect(() => {
      fetch("http://localhost:3000/users/role/professor")
        .then((res) => res.json())
        .then((data) => {
          
          setProfessors(data.data);
          setFilteredProfessors(data.data);
          console.log("DATA", data.data);
        })
        .catch((err) => {
          console.error("Error cargando profesores:", err);
          Swal.fire({ title: "Error", text: "No se pudieron cargar los profesores. Intente nuevamente.", icon: "error" })
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
      const filtered = professors.filter((p) => {
        const matchesSearch =
          p.first_name.toLowerCase().includes(searchValue) ||
          p.last_name.toLowerCase().includes(searchValue) ||
          p.email.toLowerCase().includes(searchValue) ||
          String(p.registration_number).toLowerCase().includes(searchValue);
        return matchesSearch;
      });

      setFilteredProfessors(filtered);
    };


  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Profesores</Heading>

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
            {filteredProfessors != undefined &&
              filteredProfessors.length > 0 ? (
                filteredProfessors.map((professor) => (
                  <Tr key={professor.id}>
                    <Td>{professor.first_name}</Td>
                    <Td>{professor.last_name}</Td>
                    <Td>{professor.phone}</Td>
                    <Td>{professor.email}</Td>
                    <Td>{professor.adress}</Td>
                    <Td>{professor.registration_number}</Td>
                    <Td>{ professor.createdAt ? new Date(professor.createdAt).toLocaleDateString() : "No se informa"}</Td>
                    <Td><EditCategory category={professor} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron profesores
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Professors;