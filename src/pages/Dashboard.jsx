import React from "react";
import { Outlet } from "react-router-dom";
import Demo from "../components/Dashboard/Accordion";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Flex minH="100vh" bg="gray.100">
      {/* Menú lateral izquierdo */}
      <Box
        w="260px"
        bg="gray.800"
        color="white"
        py={6}
        px={4}
        display="flex"
        flexDirection="column"
      >
        <Heading fontSize="xl" mb={6} color="white">
          FitCenter
        </Heading>

        <VStack align="start" spacing={4} w="100%">
          <Box h="1px" bg="gray.600" w="100%" mb={2} />
          <Demo />
        </VStack>
      </Box>

      {/* Contenido dinámico */}
      <Box flex="1" p={6} overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Dashboard;
