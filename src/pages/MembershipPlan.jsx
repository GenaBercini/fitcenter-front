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

const plans = [
  {
    name: "Básico",
    price: 79,
    benefits: [
      "Acceso al gimnasio",
      "Uso de máquinas de musculación y cardio",
      "Acceso a vestuarios",
    ],
    scale: 0.9, // pequeño
  },
  {
    name: "VIP",
    price: 129,
    benefits: [
      "Todo lo del Básico",
      "Acceso a clases grupales",
      "Zona exclusiva para miembros VIP",
    ],
    scale: 1, // mediano
  },
  {
    name: "Full",
    price: 199,
    benefits: [
      "Todo lo del VIP",
      "Entrenador personal 1 vez por semana",
      "Acceso ilimitado a todas las áreas",
    ],
    scale: 1.1, // más grande
  },
];

export default function Membership() {
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
                color={"pink.400"}
                rounded={"full"}
                borderWidth="1px"
                borderColor="pink.400"
              >
                {plan.name}
              </Text>
              <Stack direction={"row"} align={"center"} justify={"center"}>
                <Text fontSize={"3xl"} color="pink.400">
                  $
                </Text>
                <Text fontSize={"6xl"} fontWeight={800} color="pink.500">
                  {plan.price}
                </Text>
                <Text color={"gray.500"}>/month</Text>
              </Stack>
            </Stack>

            <Box px={6} py={6}>
              <List spacing={3} minH="110px">
                {plan.benefits.map((b, i) => (
                  <ListItem key={i}>
                    <ListIcon as={FaCheck} color="pink.400" />
                    {b}
                  </ListItem>
                ))}
              </List>

              <Button
                mt={6}
                w={"full"}
                bg={"pink.400"}
                color={"white"}
                rounded={"xl"}
                boxShadow={"0 5px 20px 0px rgb(219, 39, 119 / 63%)"}
                _hover={{ bg: "pink.500" }}
                _focus={{ bg: "pink.500" }}
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
