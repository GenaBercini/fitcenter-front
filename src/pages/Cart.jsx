import React from "react";
import { Flex, Box, Stack, HStack, Button, Heading } from "@chakra-ui/react";
import { useCart } from "../components/Landing/cartContext.jsx";// <- importá el hook

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotal } = useCart();

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        border="1px solid #ccc"
        w="100%"
        maxW="900px"
      >
        <Heading as="h2" size="3xl" textAlign="center" mb={4}>
          Tu carrito
        </Heading>

        {/* Lista de productos */}
        <Stack spacing={4}>
          {cart.length === 0 ? (
            <Box textAlign="center" fontSize="lg" color="gray.500">
              No hay productos en el carrito
            </Box>
          ) : (
            cart.map((product) => (
              <Flex
                key={product.id}
                border="1px solid #ccc"
                p={4}
                borderRadius="md"
                justify="space-between"
                align="center"
              >
                <Box>
                  {product.name} — ${product.price}
                </Box>
                <HStack spacing={2}>
                  {/* Restar cantidad */}
                  <Button
                    size="sm"
                    bg="red"
                    color="white"
                    _hover={{ bg: "red.600" }}
                    fontSize="lg"
                    onClick={() => decreaseQuantity(product.id)}
                  >
                    -
                  </Button>
                  <Box fontWeight="bold" minW="20px" textAlign="center">
                    {product.quantity}
                  </Box>
                  {/* Sumar cantidad */}
                  <Button
                    size="sm"
                    bg="green"
                    color="white"
                    _hover={{ bg: "green.600" }}
                    fontSize="lg"
                    onClick={() => increaseQuantity(product.id)}
                  >
                    +
                  </Button>
                  {/* Eliminar producto */}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Eliminar
                  </Button>
                </HStack>
              </Flex>
            ))
          )}
        </Stack>

        {/* Total */}
        <Flex justify="flex-end" mt={4} mb={2}>
          <Box fontWeight="bold" fontSize="lg" pr="8">
            Total: ${getTotal()}
          </Box>
        </Flex>

        {/* Botón de compra */}
        <Button
          bg="blue"
          size="lg"
          _hover={{ bg: "blue.600" }}
          width="100%"
          mt={6}
        >
          Comprar
        </Button>
      </Box>
    </Flex>
  );
}
