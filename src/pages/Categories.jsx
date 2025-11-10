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

const Categories = () => {

    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //CATEGORIAS

    useEffect(() => {
      fetch("http://localhost:3000/categories")
        .then((res) => res.json())
        .then((data) => {
          
          setCategories(data.data);
          setFilteredCategories(data.data);
          console.log("DATA", data.data);
        })
        .catch((err) => {
          console.error("Error cargando categorías:", err);
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
      const filtered = categories.filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchValue);

        return matchesSearch;
      });

      setFilteredCategories(filtered);
    };

  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Categorías</Heading>

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
              <Th>Categoría</Th>
              <Th>Imagen</Th>
              <Th>Activa</Th>
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <Tr key={category.id}>
                    <Td>{category.name}</Td>
                    <Td>{category.img && (
                        <img
                        src={
                        category.img instanceof File
                            ? URL.createObjectURL(category.img)   // si es File, mostrar vista previa
                            : "http://localhost:3000/uploads/" + category.img // si es string, usar URL del servidor
                        }
                        alt="Vista previa"
                        style={{ width: "80px", borderRadius: "8px"}}
                        />
                    )}</Td>
                    <Td>{ Number(category.disabled) == "0" ? "Activa" : "Inactiva"}</Td>
                    <Td><EditCategory category={category} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron categorías
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Categories;