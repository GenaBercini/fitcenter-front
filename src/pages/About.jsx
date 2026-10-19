import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiUsers, FiCalendar, FiAward } from "react-icons/fi";

// Azul ultramar tomado de la foto del gimnasio
const ULTRAMAR = "#1F4E9E";

const highlights = [
  {
    icon: FiUsers,
    title: "Profes que te acompañan",
    text: "Entrenadores certificados que arman tu rutina y siguen tu progreso.",
  },
  {
    icon: FiCalendar,
    title: "Clases para cada ritmo",
    text: "Hilado, CrossFit, Yoga y Zumba, con turnos durante toda la semana.",
  },
  {
    icon: FiAward,
    title: "Un plan para cada objetivo",
    text: "Basic para entrenar en sala, o Premium si además querés sumarte a las clases grupales.",
  },
];

export default function About() {
  return (
    <Box bg="white" py={{ base: 8, md: 14 }}>
      <Container maxW="6xl">
        {/* Presentación */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 16 }}
          align="center"
        >
          <Box flex="1" maxW={{ md: "520px" }}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl" }}
              lineHeight="1.1"
              color="gray.800"
              mb={6}
            >
              Sobre nosotros
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" lineHeight="1.7" mb={5}>
              En FitCenter creemos que entrenar es más que un hábito: es un estilo
              de vida. Nuestro gimnasio nació en 2015 con la misión de ayudar a cada
              persona a alcanzar su máximo potencial, en un ambiente motivador y
              profesional.
            </Text>
            <Text fontSize="lg" color="gray.600" lineHeight="1.7">
              Hoy somos una comunidad de más de 400 socios que entrena con nosotros
              todos los días.
            </Text>
          </Box>

          <Box flex="1" position="relative" w="100%" maxW={{ base: "100%", md: "460px" }}>
            <Image
              src="/2150321791.jpg"
              alt="Pesas, mancuernas y zapatillas sobre un fondo azul"
              w="100%"
              h={{ base: "320px", md: "540px" }}
              objectFit="cover"
              objectPosition="center 40%"
              rounded="3xl"
            />
            <Box
              position="absolute"
              left={{ base: 4, md: -8 }}
              bottom={{ base: 4, md: 10 }}
              bg="white"
              rounded="2xl"
              shadow="lg"
              px={6}
              py={4}
            >
              <Text fontFamily="heading" fontWeight="700" fontSize="2xl" color="gray.800" lineHeight="1.2">
                Desde 2015
              </Text>
              <Text color="gray.600">entrenando en Rosario</Text>
            </Box>
          </Box>
        </Stack>

        {/* Cómo entrenamos */}
        <Box mt={{ base: 16, md: 24 }}>
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} color="gray.800" mb={10}>
            Cómo entrenamos
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 12 }}>
            {highlights.map((item) => (
              <Box key={item.title}>
                <Flex
                  w={12}
                  h={12}
                  align="center"
                  justify="center"
                  rounded="xl"
                  bg="blue.50"
                  color="blue.500"
                  mb={4}
                >
                  <Icon as={item.icon} boxSize={6} aria-hidden="true" />
                </Flex>
                <Heading as="h3" fontSize="lg" color="gray.800" mb={2}>
                  {item.title}
                </Heading>
                <Text color="gray.600" lineHeight="1.7">
                  {item.text}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Cierre */}
        <Flex
          mt={{ base: 16, md: 24 }}
          bg={ULTRAMAR}
          color="white"
          rounded="3xl"
          px={{ base: 6, md: 12 }}
          py={{ base: 10, md: 12 }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          justify="space-between"
          gap={8}
        >
          <Box maxW="520px">
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} mb={3}>
              Vení a conocernos
            </Heading>
            <Text color="blue.100" fontSize="lg" lineHeight="1.7">
              Estamos en Saavedra 118, Rosario. Si tenés dudas sobre los planes o
              las clases, escribinos.
            </Text>
          </Box>
          <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "100%", sm: "auto" }}>
            <Button
              as={RouterLink}
              to="/activities"
              size="lg"
              bg="white"
              color={ULTRAMAR}
              _hover={{ bg: "blue.50" }}
            >
              Ver actividades
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              size="lg"
              variant="outline"
              color="white"
              borderColor="whiteAlpha.700"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Contactanos
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
}