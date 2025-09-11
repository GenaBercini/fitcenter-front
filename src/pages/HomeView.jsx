// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaCalendarPlus,
//   FaClipboardList,
//   FaHistory,
//   FaDumbbell,
// } from "react-icons/fa";
// import "./HomeView.css";

// function HomeView() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       <h2>
//         ¡Hola <span className="pink-text">Kevin</span>!
//       </h2>

//       <div className="shortcuts">
//         <div className="shortcut" onClick={() => navigate("/users")}>
//           <FaUser className="icon" />
//           <p>Perfil</p>
//         </div>
//         <div className="shortcut" onClick={() => navigate("/booking")}>
//           <FaCalendarPlus className="icon" />
//           <p>Reservar</p>
//         </div>
//         <div className="shortcut" onClick={() => navigate("/agendados")}>
//           <FaClipboardList className="icon" />
//           <p>Turnos</p>
//         </div>
//         <div className="shortcut" onClick={() => navigate("/historial")}>
//           <FaHistory className="icon" />
//           <p>Historial</p>
//         </div>
//       </div>

//       <div className="section">
//         <h3>Entrenamiento</h3>
//         <div className="training-card">
//           <FaDumbbell className="icon" />
//           <div>
//             <strong>Ver plan actual</strong>
//             <p>Entrenamiento personalizado</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomeView;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaUser,
  FaCalendarPlus,
  FaClipboardList,
  FaHistory,
  FaDumbbell,
} from "react-icons/fa";

function HomeView() {
  const navigate = useNavigate();

  // Colores desde Chakra (modo claro/oscuro)
  const bgCard = useColorModeValue("white", "gray.700");
  const iconColor = "pink.500";

  return (
    <Box p={6} bg={useColorModeValue("gray.50", "gray.800")} minH="100vh">
      {/* Saludo */}
      <Heading size="lg">
        ¡Hola{" "}
        <Text as="span" color="pink.500">
          Kevin
        </Text>
        !
      </Heading>

      {/* Atajos */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mt={6}>
        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/users")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaUser size={28} color="#E91E63" />
          <Text mt={2}>Perfil</Text>
        </Flex>

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/booking")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaCalendarPlus size={28} color="#E91E63" />
          <Text mt={2}>Reservar</Text>
        </Flex>

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/agendados")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaClipboardList size={28} color="#E91E63" />
          <Text mt={2}>Turnos</Text>
        </Flex>

        <Flex
          bg={bgCard}
          p={5}
          borderRadius="xl"
          align="center"
          justify="center"
          flexDir="column"
          shadow="md"
          cursor="pointer"
          onClick={() => navigate("/historial")}
          _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
        >
          <FaHistory size={28} color="#E91E63" />
          <Text mt={2}>Historial</Text>
        </Flex>
      </Grid>

      {/* Sección entrenamiento */}
      <Box mt={10}>
        <Heading size="md" mb={4}>
          Entrenamiento
        </Heading>
        <Flex bg={bgCard} p={5} borderRadius="xl" align="center" shadow="md">
          <FaDumbbell size={28} color="#E91E63" />
          <VStack align="start" spacing={0} ml={4}>
            <Text fontWeight="bold">Ver plan actual</Text>
            <Text fontSize="sm" color="gray.500">
              Entrenamiento personalizado
            </Text>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}

export default HomeView;
