import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiCalendar, FiX } from "react-icons/fi";

// Mismo azul ultramar que "Sobre nosotros" y "Contacto"
const ULTRAMAR = "#1F4E9E";

const novedad = {
  title: "Nueva clase de funcional",
  when: "Martes y jueves a las 20 h",
  text: "Sumamos una clase de funcional para todos los niveles. Vení a probarla: la primera es gratis.",
};

const consejos = [
  {
    id: "sentadillas",
    category: "Entrenamiento",
    color: "blue",
    title: "3 errores comunes al hacer sentadillas",
    errors: [
      "Encorvar la espalda",
      "Bajar poco",
      "Cargar más peso del que podés controlar",
    ],
    closing: "La técnica es más importante que la carga.",
  },
  {
    id: "comidas",
    category: "Nutrición",
    color: "green",
    title: "Qué comer antes y después del gimnasio",
    before: "Carbohidratos livianos, como fruta o avena.",
    after: "Proteínas y carbohidratos, como pollo con arroz o un batido.",
  },
];

function CategoryBadge({ color, children }) {
  return (
    <Badge
      colorScheme={color}
      variant="subtle"
      textTransform="none"
      fontSize="sm"
      fontWeight="600"
      px={3}
      py={1}
      rounded="full"
    >
      {children}
    </Badge>
  );
}

function ConsejoSentadillas({ post }) {
  return (
    <>
      <List spacing={3} mb={5}>
        {post.errors.map((error) => (
          <ListItem key={error} display="flex" alignItems="flex-start" fontSize="lg" color="gray.700">
            <ListIcon as={FiX} color="red.400" boxSize={5} mt="0.2em" flexShrink={0} />
            {error}
          </ListItem>
        ))}
      </List>
      <Text fontSize="lg" fontWeight="600" color="gray.800">
        {post.closing}
      </Text>
    </>
  );
}

function ConsejoComidas({ post }) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
      {[
        ["Antes", post.before],
        ["Después", post.after],
      ].map(([label, text]) => (
        <Box key={label} bg="gray.50" rounded="2xl" p={5}>
          <Text fontFamily="heading" fontWeight="700" color="gray.800" mb={1}>
            {label}
          </Text>
          <Text color="gray.600" lineHeight="1.7">
            {text}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default function Blog() {
  return (
    <Box bg="white" py={{ base: 8, md: 14 }}>
      <Container maxW="6xl">
        {/* Encabezado */}
        <Box maxW="640px" mb={{ base: 8, md: 12 }}>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl" }}
            lineHeight="1.1"
            color="gray.800"
            mb={4}
          >
            Consejos y novedades
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" lineHeight="1.7">
            Tips para entrenar mejor y lo nuevo del gimnasio.
          </Text>
        </Box>

        {/* Novedad destacada */}
        <Flex
          bg={ULTRAMAR}
          color="white"
          rounded="3xl"
          px={{ base: 6, md: 12 }}
          py={{ base: 8, md: 10 }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "start", md: "center" }}
          justify="space-between"
          gap={8}
        >
          <Box maxW="560px">
            <Badge
              bg="whiteAlpha.300"
              color="white"
              textTransform="none"
              fontSize="sm"
              fontWeight="600"
              px={3}
              py={1}
              rounded="full"
              mb={4}
            >
              Novedad
            </Badge>
            <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} mb={3}>
              {novedad.title}
            </Heading>
            <Flex align="center" gap={2} color="blue.100" fontWeight="600" mb={3}>
              <Icon as={FiCalendar} aria-hidden="true" />
              <Text>{novedad.when}</Text>
            </Flex>
            <Text color="blue.50" fontSize="lg" lineHeight="1.7">
              {novedad.text}
            </Text>
          </Box>
          <Button
            as={RouterLink}
            to="/activities"
            size="lg"
            bg="white"
            color={ULTRAMAR}
            _hover={{ bg: "blue.50" }}
            flexShrink={0}
            w={{ base: "100%", sm: "auto" }}
          >
            Ver actividades
          </Button>
        </Flex>

        {/* Consejos */}
        <Box maxW="760px" mt={{ base: 14, md: 20 }}>
          <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} color="gray.800" mb={8}>
            Consejos
          </Heading>

          <Stack spacing={10} divider={<Divider borderColor="gray.200" />}>
            {consejos.map((post) => (
              <Box as="article" key={post.id}>
                <CategoryBadge color={post.color}>{post.category}</CategoryBadge>
                <Heading
                  as="h3"
                  fontSize={{ base: "xl", md: "2xl" }}
                  color="gray.800"
                  lineHeight="1.3"
                  mt={4}
                  mb={5}
                >
                  {post.title}
                </Heading>
                {post.id === "sentadillas" ? (
                  <ConsejoSentadillas post={post} />
                ) : (
                  <ConsejoComidas post={post} />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}