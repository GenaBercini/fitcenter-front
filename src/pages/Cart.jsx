import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Stack,
  HStack,
  VStack,
  Button,
  Heading,
  Text,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useCart } from "../context/cartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeProductCompletely,
    checkoutCart,
    fetchActiveCart,
  } = useCart();
  const { user,  openAuthModal, } = useAuth();
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const accent = useColorModeValue("blue.600", "blue.400");

  useEffect(() => {
    const loadCart = async () => {
      if (!user) return;
      setLoading(true);
      await fetchActiveCart();
      setLoading(false);
    };
    loadCart();
  }, [user]);

  const handleCheckout = async () => {
    try {
      const url = await checkoutCart();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Error al iniciar checkout:", err);
    }
  };

  if (!user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <VStack spacing={4}>
          <Text fontSize="lg">Para ver tu carrito, iniciá sesión.</Text>
          <Button
            colorScheme="blue"
            onClick={() =>  openAuthModal()}
          >
            Loguearse
          </Button>
        </VStack>
      </Flex>
    );
  }

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Cargando carrito...</Text>
      </Flex>
    );
  }

  if (!cart) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <Text fontSize="lg" color="gray.500">
          No se encontró un carrito activo.
        </Text>
      </Flex>
    );
  }

  const items = cart.items || [];

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bg}
      p={{ base: 4, md: 8 }}
    >
      <Box
        bg={cardBg}
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        boxShadow="2xl"
        w="100%"
        maxW="1000px"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={10} color={textColor}>
          🛍️ Tu carrito de compras
        </Heading>

        {items.length === 0 ? (
          <VStack spacing={4} py={10}>
            <Text color="gray.500" fontSize="lg">
              Tu carrito está vacío
            </Text>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={() => (window.location.href = "/")}
            >
              Ver productos
            </Button>
          </VStack>
        ) : (
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={10}
            align="flex-start"
          >
            <Stack spacing={5} flex="2">
              {items.filter(item => item.product).map((item) => (
                <Flex
                  key={item.id}
                  bg={"gray.100"}
                  borderRadius="xl"
                  p={4}
                  align="center"
                  justify="space-between"
                  transition="all 0.2s"
                  _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
                >
                  <HStack spacing={4} align="center">
                    <Image
                      src={item.product.img || "https://via.placeholder.com/80"}
                      alt={item.product.name}
                      boxSize="80px"
                      borderRadius="lg"
                      objectFit="cover"
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="lg">
                        {item.product.name}
                      </Text>
                      <Text color="gray.500">
                        ${item.product.price.toFixed(2)}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={4} align="center">
                    <HStack
                      spacing={2}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="lg"
                      px={2}
                      py={1}
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => decreaseQuantity(item.product.id)}
                        isDisabled={item.quantity <= 1}
                      >
                        −
                      </Button>

                      <Text fontWeight="bold">{item.quantity}</Text>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addToCart(item.product.id)}
                      >
                        +
                      </Button>
                    </HStack>

                    <VStack spacing={0} align="end">
                      <Text fontWeight="semibold">
                        ${item.subtotal.toFixed(2)}
                      </Text>
                      <IconButton
                        aria-label="Eliminar producto"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeProductCompletely(item.product.id)}
                      />
                    </VStack>
                  </HStack>
                </Flex>
              ))}
            </Stack>

            <Box
              flex="1"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="xl"
              boxShadow="md"
              p={6}
              minW="300px"
            >
              <Heading size="md" mb={4} color={textColor}>
                Resumen del pedido
              </Heading>
              <Divider mb={4} />

              <VStack align="stretch" spacing={3} fontSize="md">
                {items.filter(item => item.product).map((item) => (
                  <Flex key={item.id} justify="space-between">
                    <Text color="gray.600">{item.product.name}</Text>
                    <Text fontWeight="medium">${item.subtotal.toFixed(2)}</Text>
                  </Flex>
                ))}
              </VStack>

              <Divider my={4} />

              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Total</Text>
                <Text color={accent}>${cart.total?.toFixed(2)}</Text>
              </Flex>

              <Button
                mt={6}
                colorScheme="blue"
                size="lg"
                w="100%"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
                onClick={handleCheckout}
              >
                Pagar
              </Button>
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
