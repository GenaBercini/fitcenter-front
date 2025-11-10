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
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react"
import Swal from "sweetalert2";
import AddProduct from "../components/Dashboard/AddProduct";
import { useEffect, useState } from "react";
import EditProduct from "../components/Dashboard/EditProduct";
import { SearchIcon } from "@chakra-ui/icons";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showActive, setShowActive] = useState(true);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch("http://localhost:3000/products")
        .then((res) => res.json())
        .then((data) => {
          
          setProducts(data.data);
          setFilteredProducts(data.data);
          console.log("DATA", data.data);
          console.log("PRODUCTS", products);
        })
        .catch((err) => {
          console.error("Error cargando productos:", err);
          Swal.fire({ title: "Error", text: err, icon: "error" })
          .then(() => {
            location.reload();
          });
        });
    }, []);


    //FILTRO DE BUSQUEDA Y PRECIO
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setSearchTerm(value);
      applyFilters(value, minPrice, maxPrice);
    };

    const handleMinPrice = (e) => {
      const value = e.target.value;
      setMinPrice(value);
      applyFilters(searchTerm, value, maxPrice);
    };

    const handleMaxPrice = (e) => {
      const value = e.target.value;
      setMaxPrice(value);
      applyFilters(searchTerm, minPrice, value);
    };

    
    const applyFilters = (searchValue, min, max) => {
      const filtered = products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchValue) ||
          p.category.name.toLowerCase().includes(searchValue) ||
          p.description.toLowerCase().includes(searchValue);

        const matchesPrice =
          (!min || p.price >= parseFloat(min)) &&
          (!max || p.price <= parseFloat(max));

        return matchesSearch && matchesPrice;
      });

      setFilteredProducts(filtered);
    };

  
  return (
    <Box bg={"white"} p={3} borderRadius={"10px"}>
      <Stack width="full" gap="5">
        <Flex justifyContent={"space-between"}>
          <Heading size="xl">Productos</Heading>

          <InputGroup w={400}>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder='Buscar por nombre, categoría o descripción'
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

            <Input
              w={100}
              type="number"
              placeholder="Precio min"
              value={minPrice}
              onChange={handleMinPrice}
            />

            <Input
              w={100}
              type="number"
              placeholder="Precio max"
              value={maxPrice}
              onChange={handleMaxPrice}
            />


          <AddProduct/>
        </Flex>

        <Table size="md" variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Categoría</Th>
              <Th>Descripción</Th>
              <Th>Stock</Th>
              <Th>Precio</Th>
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.name}</Td>
                    <Td>{product.category.name}</Td>
                    <Td>{product.description}</Td>
                    <Td>{product.stock}</Td>
                    <Td>${product.price}</Td>
                    <Td><EditProduct product={product} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" py={5}>
                    No se encontraron productos
                  </Td>
                </Tr>
              )}
              

          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}

export default Products;