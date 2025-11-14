import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Demo from '../components/Dashboard/Accordion';

import 'chartkick/chart.js'
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
    <Flex minH="100vh" bg="gray.200">

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
        
        {/* para las subrutas del panel */}
        <Outlet />

      </Box>
    </Flex>
  );
};

export default Dashboard;
