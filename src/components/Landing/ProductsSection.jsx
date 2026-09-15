import { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import Carousel from "./Carousel";
import ProductDetail from "./ProductDetail";
import Swal from "sweetalert2";

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        Swal.fire({ title: "Error", text: err.message, icon: "error" }).then(
          () => {
            location.reload();
          },
        );
      });
  }, []);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  // Filtrado simple por nombre
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container maxW="container.xl" py={6} id="productos-section">
      <VStack spacing={6} align="stretch" mb={6}>
        {/* Encabezado + Buscador */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading size="lg" color="gray.800">
              Productos y Suplementos
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Equipamiento y nutrición para tu entrenamiento
            </Text>
          </Box>

          <InputGroup maxW={{ base: "100%", md: "320px" }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="full"
              bg="white"
              shadow="sm"
            />
          </InputGroup>
        </Flex>
      </VStack>

      {/* Carrusel Reutilizado con Filtrado y Tarjetas de Tamaño Único */}
      {filteredProducts.length > 0 ? (
        <Carousel
          items={filteredProducts}
          renderItem={(p) => (
            <Box
              key={p.id}
              borderWidth="1px"
              rounded="2xl"
              shadow="sm"
              overflow="hidden"
              bg="white"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              h="360px"
              m={2}
              p={3}
              cursor="pointer"
              onClick={() => handleOpenDetail(p)}
              _hover={{ shadow: "md", transform: "translateY(-4px)" }}
              transition="all 0.2s"
            >
              <Box
                h="180px"
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
                borderRadius="xl"
                p={2}
              >
                <Image
                  src={p.img || "https://via.placeholder.com/150"}
                  alt={p.name}
                  maxH="160px"
                  maxW="100%"
                  objectFit="contain"
                />
              </Box>

              <Box
                p={2}
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color="gray.800"
                  noOfLines={2}
                  h="44px"
                >
                  {p.name}
                </Text>
                <Text fontSize="lg" fontWeight="extrabold" color="blue.600">
                  ${p.price.toFixed(2)}
                </Text>
              </Box>
            </Box>
          )}
        />
      ) : (
        <Text textAlign="center" color="gray.500" py={8}>
          No se encontraron productos para "{searchTerm}".
        </Text>
      )}

      <ProductDetail
        isOpen={isOpen}
        onClose={handleClose}
        product={selectedProduct}
      />
    </Container>
  );
}
