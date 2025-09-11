import React from "react";
import {
  Image,
  Text,
  Box,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { instructors } from "../../utils/mocks";

export default function InstructorsSection() {
  return (
    <Box p={8}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={10}
        align="stretch"
      >
        {instructors.map((product) => (
          <Box
            key={product.id}
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="md"
            overflow="hidden"
            bg="white"
            display="flex"
            flexDirection="column"
            m={2}
            cursor="pointer"
          >
            <Image
              src={product.image}
              alt={product.name}
              objectFit="cover"
              h="200px"
              w="100%"
            />

            <VStack
              p={4}
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Text fontWeight="bold" fontSize="xl">
                {product.specialty}
              </Text>
              <Text fontSize="lg">{product.name}</Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
