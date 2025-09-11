import { Container, Heading, Text, VStack } from "@chakra-ui/react";

export default function About() {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={6} align="start">
        <Heading>About Us</Heading>
        <Text>
          En FitCenter creemos que entrenar es más que un hábito: es un estilo
          de vida. Nuestro gimnasio nació en 2015 con la misión de ayudar a cada
          persona a alcanzar su máximo potencial, en un ambiente motivador y
          profesional.
        </Text>
      </VStack>
    </Container>
  );
}
