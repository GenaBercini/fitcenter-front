import {
  Container,
  Heading,
  VStack,
  Input,
  Textarea,
  Button,
  Text,
} from "@chakra-ui/react";

export default function Contact() {
  return (
    <Container maxW="container.md" py={10}>
      <Heading mb={6}>Contact Us</Heading>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Tu nombre" />
        <Input placeholder="Tu email" type="email" />
        <Textarea placeholder="Escribe tu mensaje aquí..." />
        <Button colorScheme="teal">Enviar</Button>
      </VStack>

      <Text mt={6}>
        📍 Dirección: Saavedra 118, Rosario <br />
        📞 Teléfono: +54 11 1234 5678 <br />
        📧 Email: contacto@fitcenter.com
      </Text>
    </Container>
  );
}
