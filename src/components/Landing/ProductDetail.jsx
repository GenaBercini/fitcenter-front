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
            <Image
              src={product.img || "https://via.placeholder.com/600x300?text=Sin+imagen"}
              alt={product.name || "Imagen del producto"}
              h="260px"
              w="100%"
              maxH="300px"
              objectFit="cover"
              borderRadius="md"
              fallbackSrc="https://via.placeholder.com/600x300?text=Sin+imagen"
            />
            <Text fontSize="2xl" fontWeight="bold">
              ${Number(product.price || 0).toFixed(2)}
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
