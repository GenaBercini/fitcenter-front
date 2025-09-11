import React from "react";
import {
    Stack,
    Box,
    Flex,
    HStack,
    Button,
    Heading
} from "@chakra-ui/react";


export default function Cart() {
    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="gray.50"
            p={4}
        >
            <Box
                bg="white"
                p={8}
                borderRadius="md"
                boxShadow="md"
                border="1px solid #ccc"
                w="100%"
                maxW="900px"
            >
                <Heading as="h2" size="3xl" textAlign="center" mb={4}>
                    Tu carrito
                </Heading>
                <Stack spacing={4}>
                    {/* Producto 1 */}
                    <Flex
                        border="1px solid #ccc"
                        p={4}
                        borderRadius="md"
                        justify="space-between"
                        align="center"
                    >
                        <Box>Producto 1</Box>
                        <HStack spacing={2}>
                            <Button size="sm" bg="red" color="white" _hover={{ bg: 'red.600' }} fontSize="lg">
                                -
                            </Button>
                            <Box fontWeight="bold" minW="20px" textAlign="center">1</Box>
                            <Button size="sm" bg="green" color="white" _hover={{ bg: 'green.600' }} fontSize="lg">
                                +
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Producto 2 */}
                    <Flex
                        border="1px solid #ccc"
                        p={4}
                        borderRadius="md"
                        justify="space-between"
                        align="center"
                    >
                        <Box>Producto 2</Box>
                        <HStack spacing={2}>
                            <Button size="sm" bg="red" color="white" _hover={{ bg: 'red.600' }} fontSize="lg">
                                -
                            </Button>
                            <Box fontWeight="bold" minW="20px" textAlign="center">1</Box>
                            <Button size="sm" bg="green" color="white" _hover={{ bg: 'green.600' }} fontSize="lg">
                                +
                            </Button>
                        </HStack>
                    </Flex>

                    {/* Producto 3 */}
                    <Flex
                        border="1px solid #ccc"
                        p={4}
                        borderRadius="md"
                        justify="space-between"
                        align="center"
                    >
                        <Box>Producto 3</Box>
                        <HStack spacing={2}>
                            <Button size="sm" bg="red" color="white" _hover={{ bg: 'red.600' }} fontSize="lg">
                                -
                            </Button>
                            <Box fontWeight="bold" minW="20px" textAlign="center">1</Box>
                            <Button size="sm" bg="green" color="white" _hover={{ bg: 'green.600' }} fontSize="lg">
                                +
                            </Button>

                        </HStack>
                    </Flex>
                </Stack>

                <Flex justify="flex-end" mt={4} mb={2}>
                    <Box fontWeight="bold" fontSize="lg" pr="8">
                        Total:
                    </Box>
                </Flex>

                <Button
                    bg="blue"
                    size="lg"
                    _hover={{ bg: 'blue.600' }}
                    width="100%"
                    mt={6} // margen arriba para separar de los productos
                >
                    Comprar
                </Button>
            </Box>

        </Flex>
    );
}