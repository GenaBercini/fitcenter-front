import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const UserProfile = () => {
  const {
    user: authUser,
    loading: authLoading,
    updateUser,
    openAuthModal,
  } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(authUser || {});
  const toast = useToast();
  const navigate = useNavigate();
  const bgCard = useColorModeValue("white", "gray.700");
  const bgPage = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData(authUser);
    }
  }, [authUser]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Guardar los cambios
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.data);
        if (updateUser) updateUser(result.data);
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

  // Cancelar edición y restaurar datos iniciales
  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (authLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex
        justify="center"
        align="center"
        minH="100vh"
        direction="column"
        gap={4}
        bg={bgPage}
      >
        <Text color="gray.500" fontSize="lg">
          No se encontró sesión de usuario activa.
        </Text>
        <Button colorScheme="blue" onClick={openAuthModal}>
          Iniciar Sesión
        </Button>
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
          <Badge colorScheme="blue" fontSize="0.8em">
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
                textAlign="left"
              >
                {user.banned ? "Baneado" : "Activo"}
              </Text>

              {/* Membresía */}
              <Text color="gray.500" textAlign="left">
                Membresía:
              </Text>

              <Box textAlign="left">
                <Badge
                  colorScheme={
                    user.membershipType === "premium"
                      ? "green"
                      : user.membershipType === "basic"
                        ? "blue"
                        : "gray"
                  }
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  {user.membershipType === "premium"
                    ? "Premium"
                    : user.membershipType === "basic"
                      ? "Basic"
                      : "Sin membresía"}
                </Badge>
              </Box>
            </Box>
          </Box>
        </VStack>

        <Divider my={6} />

        {/* Acciones del formulario */}
        <HStack justify="center" spacing={4}>
          {isEditing ? (
            <>
              <Button colorScheme="blue" onClick={handleSave}>
                Guardar cambios
              </Button>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                Editar perfil
              </Button>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => navigate("/home")}
              >
                Volver
              </Button>
            </>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default UserProfile;
