import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/purchases") // <-- Hay q contemplar esto en el back
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando historial de compras:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (purchases.length === 0) return <Text>No tenés compras registradas.</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        <FaShoppingCart style={{ display: "inline", marginRight: "8px" }} />
        Historial de{" "}
        <Text as="span" color="blue.500">
          Compras
        </Text>
      </Heading>

      <VStack spacing={4} align="stretch">
        {purchases.map((purchase) => (
          <Box
            key={purchase.id}
            bg={useColorModeValue("white", "gray.700")}
            p={4}
            borderRadius="xl"
            shadow="md"
          >
            <Text>
              <strong>Producto:</strong> {purchase.product_name}
            </Text>
            <Text>
              <strong>Fecha:</strong> {purchase.date}
            </Text>
            <Text>
              <strong>Precio:</strong> ${purchase.price}
            </Text>
            <Text>
              <strong>Cantidad:</strong> {purchase.quantity}
            </Text>
            <Text>
              <strong>Total:</strong> ${purchase.total}
            </Text>
            <Text>
              <strong>Estado:</strong> {purchase.status}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PurchaseHistory;
