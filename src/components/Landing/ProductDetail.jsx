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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ProductDetail({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity });
    setQuantity(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            <Image
              src={product.image}
              alt={product.name}
              w="100%"
              maxH="300px"
              objectFit="cover"
              borderRadius="md"
            />
            <Text fontSize="2xl" fontWeight="bold">
              ${product.price.toFixed(2)}
            </Text>
            <Text color="gray.600">{product.description}</Text>
            {product.stock !== undefined && (
              <Text color="gray.500">Stock disponible: {product.stock}</Text>
            )}
            <HStack>
              <Text>Cantidad:</Text>
              <NumberInput
                size="sm"
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
