import { useState } from "react";
import { Box, Image, Text, Container, Heading } from "@chakra-ui/react";
import Carousel from "./Carousel";
import ProductDetail from "./ProductDetail";
import { products } from "../../utils/mocks";

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <Container maxW="container.lg" py={10}>
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
              src={p.image}
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
                ${p.price.toFixed(2)}
              </Text>
            </Box>
          </Box>
        )}
      />

      {/* Modal de detalle */}
      <ProductDetail
        isOpen={isOpen}
        onClose={handleClose}
        product={selectedProduct}
      />
    </Container>
  );
}
