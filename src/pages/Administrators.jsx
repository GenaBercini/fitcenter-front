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

const Administrators = () => {

    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //PROFESORES

    useEffect(() => {
      fetch("http://localhost:3000/users/role/admin")
        .then((res) => res.json())
        .then((data) => {
          
          setAdmins(data.data);
          setFilteredAdmins(data.data);
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
      const filtered = admins.filter((a) => {
        const matchesSearch =
          a.first_name.toLowerCase().includes(searchValue) ||
          a.last_name.toLowerCase().includes(searchValue) ||
          a.email.toLowerCase().includes(searchValue);
        return matchesSearch;
      });

      setFilteredAdmins(filtered);
    };


  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Administradores</Heading>

          <InputGroup w={400}>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder='Buscar por nombre'
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
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            { filteredAdmins != undefined &&
            filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <Tr key={admin.id}>
                    <Td>{admin.first_name}</Td>
                    <Td>{admin.last_name}</Td>
                    <Td>{admin.phone}</Td>
                    <Td>{admin.email}</Td>
                    <Td>{admin.adress}</Td>
                    <Td><EditCategory category={admin} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron administradores
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Administrators;