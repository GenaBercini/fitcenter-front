import {
  Box,
  Center,
  Stack,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  HStack,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

const plans = [
  {
    name: "Basic",
    price: 20,
    benefits: [
      "Acceso al gimnasio",
      "Uso de máquinas de musculación y cardio",
      "Acceso a vestuarios",
    ],
    scale: 0.9, // pequeño
  },
  {
    name: "Premium",
    price: 30,
    benefits: [
      "Todo lo del Basic",
      "Acceso a clases grupales",
      "Zona exclusiva para miembros VIP",
    ],
    scale: 1, // mediano
  },
];

export default function Membership() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const payMembership = async (membershipType, userId) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/users/payMembership/${userId}`,
        { membershipType },
        { withCredentials: true },
      );

      return data?.data?.url;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "No se pudo conectar con el servidor";
      throw new Error(message);
    }
  };

  const handleMembershipCheckout = async (membershipType) => {
    if (authLoading) return;

    if (!user?.id) {
      openAuthModal();
      return;
    }

    try {
      setCheckoutLoading(true);
      const url = await payMembership(membershipType, user.id);
      if (!url) {
        throw new Error("Stripe no devolvió una URL de checkout");
      }
      window.location.assign(url);
    } catch (err) {
      console.error("Error con el checkout de membresía:", err);
      window.alert(`No se pudo iniciar el pago: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Center py={6}>
      <HStack spacing={6} align="flex-start">
        {plans.map((plan) => (
          <Box
            id="membership-section"
            key={plan.name}
            maxW={"330px"}
            w={"full"}
            transform={`scale(${plan.scale})`}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            bg="white"
          >
            <Stack textAlign={"center"} p={6} align={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={500}
                p={2}
                px={3}
                color={"blue.500"}
                rounded={"full"}
                borderWidth="1px"
                borderColor="blue.500"
              >
                {plan.name}
              </Text>
              <Stack direction={"row"} align={"center"} justify={"center"}>
                <Text fontSize={"3xl"} color="blue.400">
                  $
                </Text>
                <Text fontSize={"6xl"} fontWeight={800} color="blue.500">
                  {plan.price}
                </Text>
                <Text color={"gray.500"}>/mensuales</Text>
              </Stack>
            </Stack>

            <Box px={6} py={6}>
              <List spacing={3} minH="110px">
                {plan.benefits.map((b, i) => (
                  <ListItem key={i}>
                    <ListIcon as={FaCheck} color="blue.500" />
                    {b}
                  </ListItem>
                ))}
              </List>

              <Button
                mt={6}
                w={"full"}
                bg={"blue.500"}
                color={"white"}
                rounded={"xl"}
                boxShadow={"0 5px 20px 0px rgb(219, 39, 119 / 63%)"}
                _hover={{ bg: "blue.500" }}
                _focus={{ bg: "blue.500" }}
                isLoading={checkoutLoading}
                isDisabled={authLoading}
                onClick={() => handleMembershipCheckout(plan.name)}
              >
                Seleccionar
              </Button>
            </Box>
          </Box>
        ))}
      </HStack>
    </Center>
  );
}
