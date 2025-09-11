import { Container, Heading, VStack, Box, Text } from "@chakra-ui/react";

export default function Blog() {
  const posts = [
    {
      title: "3 errores comunes al hacer sentadillas",
      content:
        "Evita encorvar la espalda, bajar poco y poner peso excesivo. La técnica es más importante que la carga.",
    },
    {
      title: "Qué comer antes y después del gimnasio",
      content:
        "Antes: carbohidratos ligeros (fruta, avena). Después: proteínas + carbohidratos (pollo con arroz, batido).",
    },
    {
      title: "Nueva clase de funcional – Martes y Jueves 20hs",
      content:
        "Sumamos una nueva clase de funcional para todos los niveles. ¡Vení a probar tu primera clase gratis!",
    },
  ];

  return (
    <Container maxW="container.lg" py={10}>
      <Heading mb={6}>Consejos & Novedades</Heading>
      <VStack spacing={4} align="stretch">
        {posts.map((post, i) => (
          <Box key={i} p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md">{post.title}</Heading>
            <Text mt={2}>{post.content}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
