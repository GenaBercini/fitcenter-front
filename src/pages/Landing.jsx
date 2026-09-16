import React, { useRef, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  SimpleGrid,
  useDisclosure,
  useToast,
  Container,
  Flex,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import MembershipPlan from "../pages/MembershipPlan";
import ProductsSection from "../components/Landing/ProductsSection";
import AuthModal from "../components/Auth/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pricingRef = useRef();
  const toast = useToast();
  const { signInWithGoogle } = useAuth();

  const stats = [
    { label: "400+", description: "Miembros felices" },
    { label: "20+", description: "Clases semanales" },
    { label: "8+", description: "Entrenadores certificados" },
    { label: "99%", description: "Satisfacción del cliente" },
  ];

  const handleJoinNow = () => {
    document
      .getElementById("membership-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleOAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get("access_token");
      if (access_token) {
        try {
          await signInWithGoogle(access_token);
          toast({
            title: "¡Inicio con Google exitoso!",
            variant: "solid",
            isClosable: true,
            position: "bottom-left",
            status: "success",
          });
          window.history.replaceState(null, "", window.location.pathname);
        } catch (err) {
          Swal.fire({
            title: "Error en login con Google",
            text: err.message,
            icon: "error",
          });
        }
      }
    };
    handleOAuth();
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" pb={10}>
      {/* 1. HERO BANNER PRINCIPAL (Sin espacio en blanco) */}
      <Container maxW="7xl" pt={2} pb={6}>
        <Box
          bg="gray.900"
          borderRadius="3xl"
          overflow="hidden"
          position="relative"
          shadow="xl"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} minH="400px">
            {/* Columna Izquierda: Mensaje y CTA */}
            <Flex
              direction="column"
              justify="center"
              align="flex-start"
              p={{ base: 8, md: 12 }}
              bgGradient="linear(to-r, blue.900, blue.800, transparent)"
              zIndex={2}
            >
              <Heading
                size="2xl"
                lineHeight="tight"
                color="white"
                mb={4}
                fontWeight="extrabold"
              >
                Desarrolla fuerza. <br />
                Aumenta la confianza. <br />
                <Text as="span" color="blue.400">
                  Transforma tu vida.
                </Text>
              </Heading>
              <Text fontSize="md" color="gray.300" mb={6} maxW="480px">
                Únete a FitCenter y forma parte de una comunidad que supera los
                límites e inspira la grandeza.
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                px={8}
                borderRadius="full"
                onClick={handleJoinNow}
                shadow="lg"
                _hover={{ transform: "scale(1.03)" }}
                transition="all 0.2s"
              >
                Empieza ahora
              </Button>
            </Flex>

            {/* Columna Derecha: Imagen a pantalla completa del contenedor */}
            <Box
              position={{ base: "relative", md: "absolute" }}
              right={0}
              top={0}
              w={{ base: "100%", md: "55%" }}
              h="100%"
            >
              <Image
                src="../../public/2150321791.jpg"
                alt="Gimnasio FitCenter"
                w="100%"
                h="100%"
                objectFit="cover"
              />
              {/* Degradado para acoplar la imagen con el texto */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                bgGradient="linear(to-r, blue.900, transparent)"
                display={{ base: "none", md: "block" }}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Container>

      {/* 2. MÉTRICAS / ESTADÍSTICAS */}
      <Container maxW="7xl" py={4}>
        <SimpleGrid
          columns={[1, 2, 4]}
          spacing={8}
          bg="white"
          borderWidth="1px"
          borderColor="gray.100"
          shadow="md"
          py={8}
          px={6}
          rounded="3xl"
          textAlign="center"
        >
          {stats.map((s, idx) => (
            <VStack key={idx} spacing={1}>
              <Heading size="2xl" color="blue.500">
                {s.label}
              </Heading>
              <Text color="gray.600" fontWeight="medium">
                {s.description}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>

      {/* 3. SECCIÓN DE PRODUCTOS */}
      <Container maxW="7xl" py={8}>
        <ProductsSection />
      </Container>

      {/* 4. SECCIÓN DE MEMBRESÍAS / PRECIOS */}
      <Container maxW="7xl" py={8} id="membership-section" ref={pricingRef}>
        <Box textAlign="center" mb={6}>
          <Heading textAlign="center" size="xl" color="gray.800" mb={2}>
            Planes de Membresía
          </Heading>
          <Text textAlign="center" color="gray.500">
            Elegí el plan que mejor se adapte a tu rutina de entrenamiento
          </Text>
        </Box>
        <MembershipPlan />
      </Container>

      <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
}
