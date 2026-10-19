import { useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { API_URL } from "../config/api";

const ULTRAMAR = "#1F4E9E";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Saavedra%20118%2C%20Rosario";
const emptyForm = { name: "", email: "", message: "" };

const validate = ({ name, email, message }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Ingresá tu nombre.";
  if (!EMAIL_REGEX.test(email.trim())) errors.email = "Ingresá un email válido.";
  if (!message.trim()) errors.message = "Escribí tu mensaje.";
  return errors;
};

function ContactItem({ icon, children }) {
  return (
    <Flex gap={4} align="start">
      <Flex
        flexShrink={0}
        w={10}
        h={10}
        align="center"
        justify="center"
        rounded="xl"
        bg="whiteAlpha.200"
      >
        <Icon as={icon} boxSize={5} aria-hidden="true" />
      </Flex>
      <Box pt={2}>{children}</Box>
    </Flex>
  );
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setFeedback(data.message || "No pudimos enviar el mensaje. Probá de nuevo.");
        return;
      }

      setStatus("sent");
      setFeedback(`Mensaje enviado. Te vamos a responder a ${form.email.trim()}.`);
      setForm(emptyForm);
    } catch {
      setStatus("error");
      setFeedback("No pudimos conectar con el servidor. Revisá tu conexión y probá de nuevo.");
    }
  };

  return (
    <Box bg="white" py={{ base: 8, md: 14 }}>
      <Container maxW="6xl">
        <Box maxW="640px" mb={{ base: 8, md: 12 }}>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl" }}
            lineHeight="1.1"
            color="gray.800"
            mb={4}
          >
            Contactanos
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" lineHeight="1.7">
            Escribinos por consultas sobre planes, clases o turnos y te respondemos por mail.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={{ base: 8, md: 12 }} alignItems="start">
          {/* Formulario */}
          <Box as="form" onSubmit={handleSubmit} noValidate gridColumn={{ md: "span 3" }}>
            <Stack spacing={5}>
              <Stack direction={{ base: "column", sm: "row" }} spacing={5}>
                <FormControl isRequired isInvalid={Boolean(errors.name)}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    maxLength={100}
                    size="lg"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={Boolean(errors.email)}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              </Stack>

              <FormControl isRequired isInvalid={Boolean(errors.message)}>
                <FormLabel>Mensaje</FormLabel>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Contanos en qué te podemos ayudar"
                  maxLength={2000}
                  rows={6}
                  size="lg"
                  resize="vertical"
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>

              {(status === "sent" || status === "error") && (
                <Alert status={status === "sent" ? "success" : "error"} borderRadius="xl">
                  <AlertIcon />
                  {feedback}
                </Alert>
              )}

              <Box>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={status === "sending"}
                  loadingText="Enviando"
                  w={{ base: "100%", sm: "auto" }}
                >
                  Enviar mensaje
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Datos de contacto */}
          <Stack
            gridColumn={{ md: "span 2" }}
            bg={ULTRAMAR}
            color="white"
            rounded="3xl"
            p={{ base: 6, md: 8 }}
            spacing={6}
          >
            <Heading as="h2" fontSize="2xl">
              También podés encontrarnos acá
            </Heading>

            <ContactItem icon={FiMapPin}>
              <Text fontWeight="600">Saavedra 118, Rosario</Text>
              <Link href={MAPS_URL} isExternal color="blue.100" textDecoration="underline">
                Ver en el mapa
              </Link>
            </ContactItem>

            <ContactItem icon={FiPhone}>
              <Link href="tel:+541112345678" fontWeight="600">
                +54 11 1234 5678
              </Link>
            </ContactItem>

            <ContactItem icon={FiMail}>
              <Link href="mailto:contacto@fitcenter.com" fontWeight="600">
                contacto@fitcenter.com
              </Link>
            </ContactItem>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}