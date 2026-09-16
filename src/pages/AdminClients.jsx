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

const Clients = () => {

    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //PROFESORES

    useEffect(() => {
      fetch("http://localhost:3000/users/role/client")
        .then((res) => res.json())
        .then((data) => {
          
          setClients(data.data);
          setFilteredClients(data.data);
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
      const filtered = clients.filter((c) => {
        const matchesSearch =
          c.first_name.toLowerCase().includes(searchValue) ||
          c.last_name.toLowerCase().includes(searchValue) ||
          c.email.toLowerCase().includes(searchValue);
        return matchesSearch;
      });

      setFilteredClients(filtered);
    };


  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Clientes</Heading>

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
              <Th>Membresía</Th>
              <Th>Vto. membresía</Th>
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            { filteredClients != undefined &&
            filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <Tr key={client.id}>
                    <Td>{client.first_name}</Td>
                    <Td>{client.last_name}</Td>
                    <Td>{client.phone}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.adress}</Td>
                    <Td>{client.membershipType}</Td>
                    <Td>{ client.membershipEndDate ? new Date(client.membershipEndDate).toLocaleDateString() : "No se informa"}</Td>
                    <Td><EditCategory category={client} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron clientes
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Clients;