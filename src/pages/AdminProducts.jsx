"use client"

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
    useEffect(() => {
      fetch("http://localhost:3000/products?includeInactive=true")
        .then((res) => res.json())
        .then((data) => {
          
          setProducts(data.data);
          setFilteredProducts(data.data);
          console.log("DATA", data.data);
        })
        .catch((err) => {
          console.error("Error cargando productos:", err);
          Swal.fire({ title: "Error", text: err, icon: "error" })
          .then(() => {
            location.reload();
          });
        });
    }, []);

    const toggleProduct = async (product) => {
      const res = await fetch(`http://localhost:3000/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: !product.disabled }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      const data = await res.json();
      const updatedProducts = products.map((item) =>
        item.id === data.data.id ? { ...item, ...data.data } : item,
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    };


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
        const categoryName = p.category?.name || "";
        const description = p.description || "";
        const matchesSearch =
          (p.name || "").toLowerCase().includes(searchValue) ||
          categoryName.toLowerCase().includes(searchValue) ||
          description.toLowerCase().includes(searchValue);

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
              <Th>Estado</Th>
              <Th>Editar</Th>
            </Tr>
          </Thead>

          <Tbody>
            { filteredProducts != undefined &&
            filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.name}</Td>
                    <Td>{product.category?.name || "Sin categoría"}</Td>
                    <Td>{product.description || "-"}</Td>
                    <Td>{product.stock}</Td>
                    <Td>${product.price}</Td>
                    <Td>
                      <Switch
                        isChecked={!product.disabled}
                        onChange={() => toggleProduct(product).catch(console.error)}
                        aria-label={`Cambiar estado de ${product.name}`}
                      />
                    </Td>
                    <Td><EditProduct product={product} /></Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="7" textAlign="center" py={5}>
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