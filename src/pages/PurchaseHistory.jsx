import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Flex,
  Image,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date))
    : "-";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const purchaseBg = useColorModeValue("gray.50", "gray.700");
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
    if (authLoading) return;

    if (!authUser?.id) {
      setPurchases([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3000/cart/all/${authUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        const carts = Array.isArray(data) ? data : data.data || [];
        setPurchases(carts.filter((cart) => cart.items?.length > 0));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando historial de compras:", err);
        setLoading(false);
      });
  }, [authLoading, authUser?.id]);

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
                bg={purchaseBg}
                p={5}
                borderRadius="xl"
                shadow="sm"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Flex justify="space-between" align="start" mb={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      Compra #{purchase.id}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatDate(purchase.paymentDate || purchase.createdAt)}
                    </Text>
                  </Box>
                  <Text fontSize="sm">
                    <strong>Estado:</strong>{" "}
                    <Text
                      as="span"
                      color={
                        purchase.status?.toLowerCase() === "completed"
                          ? "green.500"
                          : "orange.500"
                      }
                      fontWeight="medium"
                    >
                      {purchase.status || "Procesado"}
                    </Text>
                  </Text>
                </Flex>

                <VStack align="stretch" spacing={3}>
                  {purchase.items.map((item) => (
                    <Flex
                      key={item.id}
                      align="center"
                      justify="space-between"
                      gap={3}
                    >
                      <Flex align="center" gap={3}>
                        <Image
                          src={item.product?.img}
                          alt={item.product?.name || "Producto"}
                          boxSize="56px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <Box>
                          <Text fontWeight="medium" color={textColor}>
                            {item.product?.name || "Producto"}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {item.quantity} x{" "}
                            {currency.format(item.product?.price || 0)}
                          </Text>
                        </Box>
                      </Flex>
                      <Text fontWeight="medium" color={textColor}>
                        {currency.format(item.subtotal || 0)}
                      </Text>
                    </Flex>
                  ))}
                </VStack>

                <Box mt={4} pt={4} borderTopWidth="1px" borderColor="gray.200">
                  <Flex justify="space-between">
                    <Text color="gray.500">Subtotal</Text>
                    <Text color={textColor}>
                      {currency.format(
                        purchase.items.reduce(
                          (subtotal, item) => subtotal + (item.subtotal || 0),
                          0,
                        ),
                      )}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" mt={1}>
                    <Text fontWeight="bold" color={textColor}>
                      Total
                    </Text>
                    <Text fontWeight="bold" color="blue.600">
                      {currency.format(purchase.total || 0)}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default PurchaseHistory;
