import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCart } from "../../context/cartContext";

export default function ProductDetail({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAdd = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }
      setQuantity(1);
      onClose();
    } catch (error) {
      console.error("Error agregando al carrito:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Contenedor estandarizado para centrar la imagen sin recortar */}
            <Box
              h="260px"
              w="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.50"
              borderRadius="lg"
              p={3}
            >
              <Image
                src={product.img}
                alt={product.name}
                maxH="240px"
                maxW="100%"
                objectFit="contain"
              />
            </Box>

            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              ${product.price.toFixed(2)}
            </Text>
            <Text color="gray.600">{product.description}</Text>
            {product.stock !== undefined && (
              <Text color="gray.500" fontSize="sm">
                Stock disponible: {product.stock}
              </Text>
            )}
            <HStack pt={2}>
              <Text fontWeight="medium">Cantidad:</Text>
              <NumberInput
                size="sm"
                maxW="100px"
                max={product.stock || 10}
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(Number(value))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleAdd}>
            Agregar al carrito
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
