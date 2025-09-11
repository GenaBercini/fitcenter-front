import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Flex, Spinner, Text } from "@chakra-ui/react";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
  <Flex
      h="100vh"
      w="100vw"
      align="center"
      justify="center"
      direction="column"
      bg="gray.50"
    >
      <Spinner
        thickness="4px"
        speed="0.6s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text mt={4} fontSize="lg" color="gray.600">
        Cargando...
      </Text>
    </Flex>
  )}
  else {
    return user ? <Outlet /> : <Navigate to="/" replace />;
  }
};


