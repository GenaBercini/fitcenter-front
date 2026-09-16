import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Flex,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const handleGoToProducts = () => {
    navigate("/");
    setTimeout(() => {
      document
        .getElementById("productos-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  useEffect(() => {
    fetch("http://localhost:3000/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando historial de compras:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bg}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

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
        <Heading as="h2" size="lg" textAlign="center" mb={6} color={textColor}>
          <FaShoppingCart style={{ display: "inline", marginRight: "10px" }} />
          Historial de{" "}
          <Text as="span" color="blue.500">
            Compras
          </Text>
        </Heading>

        {purchases.length === 0 ? (
          <VStack spacing={4} py={10}>
            <Text color="gray.500" fontSize="lg">
              No tenés compras registradas en tu cuenta.
            </Text>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={handleGoToProducts}
            >
              Ver productos
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            {purchases.map((purchase) => (
              <Box
                key={purchase.id || purchase._id}
                bg="gray.50"
                p={5}
                borderRadius="xl"
                shadow="sm"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Text fontSize="md" mb={1} color={textColor}>
                  <strong>Producto:</strong>{" "}
                  {purchase.product_name || "Producto"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Fecha:</strong> {purchase.date || "-"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Precio unitario:</strong> ${purchase.price}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Cantidad:</strong> {purchase.quantity}
                </Text>
                <Text fontSize="md" color="blue.600" fontWeight="bold" mt={2}>
                  <strong>Total:</strong> ${purchase.total}
                </Text>
                <Text fontSize="sm" mt={1}>
                  <strong>Estado:</strong>{" "}
                  <Text
                    as="span"
                    color={
                      purchase.status === "completed"
                        ? "green.500"
                        : "orange.500"
                    }
                    fontWeight="medium"
                  >
                    {purchase.status || "Procesado"}
                  </Text>
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default PurchaseHistory;
