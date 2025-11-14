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
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const bgCard = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");

  //  Obtener el usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          setFormData(data.data);
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

  //  Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Guardar los cambios
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.data);
        setIsEditing(false);
        toast({
          title: "Perfil actualizado correctamente",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error al actualizar el perfil",
          description: result.message || "Intenta nuevamente",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      toast({
        title: "Error de conexión",
        description: "No se pudo contactar con el servidor.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
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
      bg={bgPage}
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={{ base: 4, md: 10 }}
    >
      <Box
        bg={bgCard}
        p={8}
        borderRadius="2xl"
        shadow="2xl"
        w={{ base: "90%", md: "60%", lg: "45%" }}
        textAlign="center"
      >
        {/* Imagen y nombre */}
        <VStack spacing={3}>
          <Avatar
            size="2xl"
            name={`${user.first_name || ""} ${user.last_name || ""}`}
            src={user.image_url}
          />
          <Heading size="md" color="blue.500">
            {user.first_name || "Sin nombre"} {user.last_name || ""}
          </Heading>
          <Badge colorScheme="blue.500" fontSize="0.8em">
            {user.role?.toUpperCase()}
          </Badge>
        </VStack>
        <Divider my={6} />

        <VStack align="stretch" spacing={4}>
          <Box>
            <Heading size="sm" color="blue.500" mb={3}>
              Información personal
            </Heading>

            {/* Sección de datos en dos columnas */}
            <Box
              display="grid"
              gridTemplateColumns="1fr 2fr"
              rowGap={3}
              columnGap={6}
              alignItems="center"
            >
              {[
                { label: "Nombre", key: "first_name" },
                { label: "Apellido", key: "last_name" },
                { label: "Correo electrónico", key: "email" },
                { label: "Teléfono", key: "phone" },
                { label: "Dirección", key: "address" },
              ].map((field) => (
                <React.Fragment key={field.key}>
                  <Text color="gray.500" textAlign="left">
                    {field.label}:
                  </Text>
                  {isEditing ? (
                    <Input
                      name={field.key}
                      value={formData[field.key] || ""}
                      onChange={handleChange}
                      placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <Text fontWeight="bold" color={textColor} textAlign="left">
                      {user[field.key] || "-"}
                    </Text>
                  )}
                </React.Fragment>
              ))}

              {/* Estado */}
              <Text color="gray.500" textAlign="left">
                Estado:
              </Text>
              <Text
                fontWeight="bold"
                color={user.banned ? "red.400" : "green.400"}
              >
                {user.banned ? "Baneado" : "Activo"}
              </Text>

              {/* Membresía */}
              <Text color="gray.500" textAlign="left">
                Membresía:
              </Text>

              <Badge
                colorScheme={
                  user.membershipType === "premium"
                    ? "green"
                    : user.membershipType === "basic"
                    ? "blue"
                    : "gray" // guest o null
                }
                px={2}
                py={1}
                borderRadius="md"
                textAlign="center"
              >
                {user.membershipType === "premium"
                  ? "Premium"
                  : user.membershipType === "basic"
                  ? "Basic"
                  : "Sin membresía"}
              </Badge>
            </Box>
          </Box>
        </VStack>

        <Divider my={6} />
        {/* Botones */}
        <HStack justify="center" spacing={4}>
          {isEditing ? (
            <>
              <Button colorScheme="blue" onClick={handleSave}>
                Guardar cambios
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Editar perfil
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default UserProfile;
