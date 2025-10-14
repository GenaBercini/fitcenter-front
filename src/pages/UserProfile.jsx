import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  HStack,
  Spinner,
  Heading,
  Divider,
  useColorModeValue,
  Badge,
  Flex,
} from "@chakra-ui/react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgCard = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.100");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/session", {
          credentials: "include", // importante para enviar cookie de sesión
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" color="pink.500" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Text color="gray.500">No se encontró información del usuario.</Text>
      </Flex>
    );
  }

  return (
    <Box
      p={6}
      bg={useColorModeValue("gray.50", "gray.800")}
      minH="100vh"
      display="flex"
      justifyContent="center"
    >
      <Box
        bg={bgCard}
        p={8}
        borderRadius="2xl"
        shadow="lg"
        maxW="md"
        w="full"
        textAlign="center"
      >
        {/* Imagen y nombre */}
        <VStack spacing={3}>
          <Avatar
            size="xl"
            name={`${user.first_name} ${user.last_name}`}
            src={user.image_url}
          />
          <Heading size="md" color="pink.500">
            {user.first_name} {user.last_name}
          </Heading>
          <Badge colorScheme="pink" fontSize="0.8em">
            {user.role?.toUpperCase()}
          </Badge>
        </VStack>

        <Divider my={6} />

        {/* Información del usuario */}
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Text color="gray.500">Email:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.email}
            </Text>
          </HStack>

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Teléfono:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.phone || "-"}
            </Text>
          </HStack>

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Dirección:</Text>
            <Text fontWeight="bold" color={textColor}>
              {user.adress || "-"}
            </Text>
          </HStack>

          {user.registration_number && (
            <HStack justify="space-between" w="full">
              <Text color="gray.500">N° Registro:</Text>
              <Text fontWeight="bold" color={textColor}>
                {user.registration_number}
              </Text>
            </HStack>
          )}

          <HStack justify="space-between" w="full">
            <Text color="gray.500">Estado:</Text>
            <Text
              fontWeight="bold"
              color={user.banned ? "red.400" : "green.400"}
            >
              {user.banned ? "Baneado" : "Activo"}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default UserProfile;

// EL CODIGO DE ACA ABAJO ES LA VERSION COMPLETA CON EDICION, LA DE ARRIBA ES SOLO PARA VISUALIZAR

//import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Avatar,
//   Text,
//   Heading,
//   VStack,
//   HStack,
//   Divider,
//   Spinner,
//   useColorModeValue,
//   Badge,
//   Button,
//   Input,
//   FormControl,
//   FormLabel,
//   useToast,
// } from "@chakra-ui/react";
// import { FaUserEdit, FaSave, FaTimes } from "react-icons/fa";

// function UserProfileView() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const toast = useToast();

//   const bgCard = useColorModeValue("white", "gray.700");
//   const bgPage = useColorModeValue("gray.50", "gray.800");
//   const textColor = useColorModeValue("gray.700", "gray.100");

//   // 🔹 Traer usuario
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/users/1");
//         if (!response.ok) throw new Error("Error al obtener usuario");
//         const data = await response.json();
//         setUser(data);
//         setFormData(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   // 🔹 Guardar cambios
//   const handleSave = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/users/${user.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error("Error al actualizar usuario");

//       const updatedUser = await response.json();
//       setUser(updatedUser);
//       setIsEditing(false);

//       toast({
//         title: "Perfil actualizado",
//         description: "Los cambios se guardaron correctamente.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "No se pudo guardar el perfil.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   // 🔹 Manejar cambios en los inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   if (loading)
//     return (
//       <Flex justify="center" align="center" minH="100vh" bg={bgPage}>
//         <Spinner size="xl" color="pink.500" />
//       </Flex>
//     );

//   if (!user)
//     return (
//       <Flex justify="center" align="center" minH="100vh" bg={bgPage}>
//         <Text color="gray.500">No se encontró el usuario.</Text>
//       </Flex>
//     );

//   return (
//     <Box p={6} bg={bgPage} minH="100vh">
//       <Flex
//         direction="column"
//         align="center"
//         bg={bgCard}
//         borderRadius="2xl"
//         p={6}
//         shadow="md"
//         maxW="500px"
//         mx="auto"
//       >
//         {/* Imagen */}
//         <Avatar
//           size="2xl"
//           name={`${user.first_name} ${user.last_name}`}
//           src={formData.image_url}
//           mb={4}
//           border="4px solid"
//           borderColor="pink.400"
//         />

//         <Heading size="lg" color={textColor}>
//           {formData.first_name} {formData.last_name}
//         </Heading>
//         <Badge colorScheme="pink" mt={2} px={3} py={1} borderRadius="lg">
//           {user.role}
//         </Badge>

//         <Divider my={4} />

//         {/* Info editable */}
//         <VStack spacing={3} align="start" w="100%" px={2}>
//           {isEditing ? (
//             <>
//               <FormControl>
//                 <FormLabel>Nombre</FormLabel>
//                 <Input
//                   name="first_name"
//                   value={formData.first_name || ""}
//                   onChange={handleChange}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Apellido</FormLabel>
//                 <Input
//                   name="last_name"
//                   value={formData.last_name || ""}
//                   onChange={handleChange}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Teléfono</FormLabel>
//                 <Input
//                   name="phone"
//                   value={formData.phone || ""}
//                   onChange={handleChange}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Dirección</FormLabel>
//                 <Input
//                   name="adress"
//                   value={formData.adress || ""}
//                   onChange={handleChange}
//                 />
//               </FormControl>

//               <FormControl>
//                 <FormLabel>Imagen (URL)</FormLabel>
//                 <Input
//                   name="image_url"
//                   value={formData.image_url || ""}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//             </>
//           ) : (
//             <>
//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">Email:</Text>
//                 <Text fontWeight="medium">{user.email}</Text>
//               </HStack>

//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">Teléfono:</Text>
//                 <Text fontWeight="medium">{user.phone || "No especificado"}</Text>
//               </HStack>

//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">Dirección:</Text>
//                 <Text fontWeight="medium">{user.adress || "No especificada"}</Text>
//               </HStack>

//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">Número de registro:</Text>
//                 <Text fontWeight="medium">
//                   {user.registration_number || "N/A"}
//                 </Text>
//               </HStack>

//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">UID:</Text>
//                 <Text fontWeight="medium">{user.uid}</Text>
//               </HStack>

//               <HStack justify="space-between" w="100%">
//                 <Text color="gray.500">Baneado:</Text>
//                 <Badge colorScheme={user.banned ? "red" : "green"}>
//                   {user.banned ? "Sí" : "No"}
//                 </Badge>
//               </HStack>
//             </>
//           )}
//         </VStack>

//         <Divider my={4} />

//         {/* Botones */}
//         {isEditing ? (
//           <Flex w="full" gap={3}>
//             <Button
//               leftIcon={<FaTimes />}
//               colorScheme="gray"
//               variant="outline"
//               w="full"
//               onClick={() => {
//                 setFormData(user);
//                 setIsEditing(false);
//               }}
//             >
//               Cancelar
//             </Button>
//             <Button
//               leftIcon={<FaSave />}
//               colorScheme="pink"
//               w="full"
//               onClick={handleSave}
//             >
//               Guardar
//             </Button>
//           </Flex>
//         ) : (
//           <Button
//             leftIcon={<FaUserEdit />}
//             colorScheme="pink"
//             variant="solid"
//             mt={2}
//             w="full"
//             onClick={() => setIsEditing(true)}
//           >
//             Editar perfil
//           </Button>
//         )}
//       </Flex>
//     </Box>
//   );
// }

// export default UserProfileView;
