import { useState } from "react";
import { Box, Image, Text, Container } from "@chakra-ui/react";
import Carousel from "./Carousel";
import ProductDetail from "./ProductDetail";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetch(`${API_URL}/products`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.msg || "No se pudieron cargar los productos");
          return data;
        })
        .then((data) => {       
          setProducts(Array.isArray(data.data) ? data.data : []);
        })
        .catch((err) => {
          console.error("Error cargando productos:", err);
          setProducts([]);
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
    <Container maxW="container.lg" py={10}>
      {products.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No hay productos disponibles.
        </Text>
      ) : (
        <Carousel
          items={products}
          visibleCount={3}
          renderItem={(p) => (
            <Box
              key={p.id}
              maxW="sm"
              borderWidth="1px"
              rounded="lg"
              shadow="md"
              overflow="hidden"
              bg="white"
              display="flex"
              flexDirection="column"
              m={2}
              cursor="pointer"
              onClick={() => handleOpenDetail(p)}
            >
              <Image
                src={p.img}
                alt={p.name}
                objectFit="cover"
                h="200px"
                w="100%"
              />
              <Box
                p={4}
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {p.name}
                </Text>
                <Text fontSize="lg" color="gray.600">
                  ${Number(p.price || 0).toFixed(2)}
                </Text>
              </Box>
            </Box>
          )}
        />
      )}
      <ProductDetail
        isOpen={isOpen}
        onClose={handleClose}
        product={selectedProduct}
      />
    </Container>
  );
}
