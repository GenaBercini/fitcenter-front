import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Spinner,
  Heading,
  Divider,
  useColorModeValue,
  Badge,
  Flex,
} from "@chakra-ui/react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgCard = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.100");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/session", {
          credentials: "include", // importante para enviar cookie de sesión
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="pink.500" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="gray.500">No se encontró información del usuario.</Text>
      </Flex>
    );
  }

  return (
    <Box
      p={6}
      bg={useColorModeValue("gray.50", "gray.800")}
      minH="100vh"
      display="flex"
      justifyContent="center"
    >
      <Box
        bg={bgCard}
        p={8}
        borderRadius="2xl"
        shadow="lg"
        maxW="md"
        w="full"
        textAlign="center"
      >
        {/* Imagen y nombre */}
        <VStack spacing={3}>
          <Avatar
            size="xl"
            name={`${user.first_name} ${user.last_name}`}
            src={user.image_url}
          />
          <Heading size="md" color="pink.500">
            {user.first_name} {user.last_name}
          </Heading>
          <Badge colorScheme="pink" fontSize="0.8em">
            {user.role?.toUpperCase()}
          </Badge>
        </VStack>

        <Divider my={6} />

        {/* Información del usuario */}
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Text color="gray.500">Email:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.email}
            </Text>
          </HStack>

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Teléfono:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.phone || "-"}
            </Text>
          </HStack>

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Dirección:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.adress || "-"}
            </Text>
          </HStack>

          {user.registration_number && (
            <HStack justify="space-between" w="full">
              <Text color="gray.500">N° Registro:</Text>
              <Text fontWeight="bold" color={textColor}>
                {user.registration_number}
              </Text>
            </HStack>
          )}

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Estado:</Text>
            <Text
              fontWeight="bold"
              color={user.banned ? "red.400" : "green.400"}
            >
              {user.banned ? "Baneado" : "Activo"}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default UserProfile;
