import React, { useRef, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Divider,
  VStack,
  HStack,
  Stack,
  Image,
  SimpleGrid,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
// import MembershipPlan from "../components/Landing/MembershipPlan";
import InstructorsSection from "../components/Landing/InstructorsSection";
import ProductsSection from "../components/Landing/ProductsSection";
import AuthModal from "../components/Landing/AuthModal";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pricingRef = useRef();
  const [isPricingOpen, setIsPricingOpen] = useState(true); // Acordeones abiertos desde el inicio
  const toast = useToast();
  const { signInWithGoogle } = useAuth();

  const stats = [
    { label: "400+", description: "Happy Members" },
    { label: "20+", description: "Weekly Classes" },
    { label: "8+", description: "Certified Trainers" },
    { label: "99%", description: "Customer Satisfaction" },
  ];

  const handleJoinNow = () => {
    // Solo se abre el acordeon de precios si es que esta cerrado
    if (!isPricingOpen && pricingRef.current) {
      pricingRef.current.click();
      setIsPricingOpen(true);
    }
    setTimeout(() => {
      document
        .getElementById("membership-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Acordeón independiente reutilizable
  const SectionAccordion = ({ title, children }) => (
    <Accordion allowToggle defaultIndex={[0]} mb={8}>
      <AccordionItem border="none">
        {({ isExpanded }) => (
          <>
            <h2>
              <AccordionButton justifyContent="center" py={4}>
                <HStack w="100%">
                  <Divider borderColor="gray.300" flex="1" />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="lg"
                    whiteSpace="nowrap"
                  >
                    <Text mr={2}>{title}</Text>
                    <AccordionIcon
                      transform={isExpanded ? "rotate(0deg)" : "rotate(180deg)"}
                      transition="transform 0.2s"
                    />
                  </Box>
                  <Divider borderColor="gray.300" flex="1" />
                </HStack>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{children}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );

  useEffect(() => {
    const handleOAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get("access_token");
      if (access_token) {
        try {
          await signInWithGoogle(access_token);
          toast({
            title: "Inicio con Google exitoso!",
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
    <Box p={4}>
      <Box mt={4} mb={4} bg="blue.50" py={2} px={10} borderRadius="3xl">
        <Stack direction={["column", "row"]} align="center" spacing={10}>
          <VStack align="start" maxW="600px">
            <Heading size="2xl" lineHeight="short">
              Build Strength. Boost Confidence. <br />
              Transform Your Life.
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Join TitanFit and become part of a community that pushes limits
              and inspires greatness.
            </Text>
            <Button bgColor="blue.500" size="lg" onClick={handleJoinNow}>
              Join Now
            </Button>
          </VStack>

          <Image
            src="../../public/2150321791.jpg"
            borderRadius="2xl"
            boxSize={["100%", "400px"]}
            objectFit="contain"
            blur="2xl"
          />
        </Stack>
      </Box>

      <SimpleGrid
        my={5}
        columns={[1, 2, 4]}
        spacing={10}
        borderWidth="1px"
        shadow="lg"
        py={10}
        px={8}
        rounded="4xl"
      >
        {stats.map((s, idx) => (
          <VStack key={idx}>
            <Heading size="3xl">{s.label}</Heading>
            <Text>{s.description}</Text>
          </VStack>
        ))}
      </SimpleGrid>

      <SectionAccordion title="Products">
        <ProductsSection />
      </SectionAccordion>

      <SectionAccordion title="Instructors">
        <InstructorsSection />
      </SectionAccordion>

      <Accordion allowToggle defaultIndex={[0]} mb={8}>
        <AccordionItem border="none">
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  justifyContent="center"
                  py={4}
                  ref={pricingRef}
                  onClick={() => setIsPricingOpen(!isExpanded)}
                >
                  <HStack w="100%">
                    <Divider borderColor="gray.300" flex="1" />
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                      whiteSpace="nowrap"
                    >
                      <Text mr={2}>Pricing</Text>
                      <AccordionIcon
                        transform={
                          isExpanded ? "rotate(0deg)" : "rotate(180deg)"
                        }
                        transition="transform 0.2s"
                      />
                    </Box>
                    <Divider borderColor="gray.300" flex="1" />
                  </HStack>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box id="membership-section">
                  <MembershipPlan />
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      <AuthModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
}
