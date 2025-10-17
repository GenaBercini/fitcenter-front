import React from "react";
import { Outlet, Link } from "react-router-dom";
import Demo from '../components/Dashboard/Accordion';
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  Badge,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";

const StatCard = ({ title, value, color }) => (
  <Box
    bg="white"
    borderRadius="md"
    p={4}
    shadow="sm"
    border="1px solid"
    borderColor="gray.200"
  >
    <Text fontSize="sm" color="gray.500">
      {title}
    </Text>
    <Text fontSize="2xl" color={color} fontWeight="bold">
      {value}
    </Text>
    <Box h="1" mt={2} bg={color} w="60%" borderRadius="full" />
  </Box>
);

const CustomerRow = ({ name, role }) => (
  <Flex justify="space-between" align="center" py={2}>
    <Text>{name}</Text>
    <Badge colorScheme={role === "Admin" ? "purple" : "blue"} fontSize="0.75em">
      {role}
    </Badge>
  </Flex>
);

const Dashboard = () => {
  return (
    <Flex minH="100vh" bg="gray.500">

      {/* Vertical navbar */}

      <Box
        w="240px"
        bg="gray.800"
        color="white"
        py={6}
        px={4}
        display="flex"
        flexDirection="column"
        fontSize="sm"
      >
        <Heading fontSize="lg" mb={6}>
          FitCenter
        </Heading>

        <VStack align="start" spacing={4}>
          <Box h="1" bg="gray.600" w="100%" />

          <Demo/>
        </VStack>
      </Box>

      {/* Main */}
      <Box flex="1" p={6}>

        {/* <Box bg="orange.100" color="orange.800" py={2} px={4} mb={6} borderRadius="md">
          <Text fontWeight="bold">
            Se ha registrado un nuevo socio
          </Text>
        </Box> */}

        {/* <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <StatCard title="Ventas en productos" value="$1M" color="purple.500" />
          <StatCard title="Clases dictadas totales" value="1369" color="blue.400" />
          <StatCard title="Profesores activos" value="567" color="red.400"/>

        <Box
          bg="orange.100"
          color="orange.800"
          py={2}
          px={4}
          mb={6}
          borderRadius="md"
        >
          <Text fontWeight="bold">Se ha registrado un nuevo socio</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <StatCard
            title="Ventas en productos"
            value="$1M"
            color="purple.500"
          />
          <StatCard
            title="Clases dictadas totales"
            value="1369"
            color="blue.400"
          />
          <StatCard title="Profesores activos" value="567" color="red.400" />

        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box bg="white" p={4} borderRadius="md" shadow="sm">
            <Heading size="sm" mb={4}>
              Nuevos clientes
            </Heading>
            <CustomerRow name="Genaro Bercini" />
            <CustomerRow name="Nicolás Piccoli" />
            <CustomerRow name="Tomás Cravero" />
            <CustomerRow name="Kevin Egidi" />
            <CustomerRow name="Ramiro Rojtberg" />
          </Box>

          <Box
            bg="white"
            p={4}
            borderRadius="md"
            shadow="sm"
            marginLeft={"10px"}
          >
            <Heading size="sm" mb={4}>
              Últimos cambios
            </Heading>
            <Text fontSize="sm" color="gray.500">
              No hay cambios
            </Text>
          </Box>
        </SimpleGrid> */}
        <Outlet />

      </Box>
    </Flex>
  );
};

export default Dashboard;
