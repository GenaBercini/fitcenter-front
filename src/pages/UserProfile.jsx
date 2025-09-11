// import React, { useEffect, useState } from "react";
// import { FaUser } from "react-icons/fa";
// import "./PageStyles.css";

// const UserProfile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:3000/users/1") // ejemplo: user con ID 1
//       .then((res) => res.json())
//       .then((data) => {
//         setUser(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching user:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Cargando perfil...</p>;
//   if (!user) return <p>No se pudo cargar el perfil</p>;

//   return (
//     <div className="page-container">
//       <h2>
//         <FaUser className="icon" /> Mi <span className="pink-text">Perfil</span>
//       </h2>

//       <div className="card">
//         <p>
//           <strong>Nombre:</strong> {user.first_name} {user.last_name}
//         </p>
//         <p>
//           <strong>Email:</strong> {user.email}
//         </p>
//         <p>
//           <strong>Teléfono:</strong> {user.phone}
//         </p>
//         <p>
//           <strong>Dirección:</strong> {user.address}
//         </p>
//         <p>
//           <strong>Usuario:</strong> {user.username}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users/1")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (!user) return <Text>No se pudo cargar el perfil</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        <FaUser style={{ display: "inline", marginRight: "8px" }} />
        Mi{" "}
        <Text as="span" color="pink.500">
          Perfil
        </Text>
      </Heading>

      <Box
        bg={useColorModeValue("white", "gray.700")}
        p={6}
        borderRadius="xl"
        shadow="md"
      >
        <Text>
          <strong>Nombre:</strong> {user.first_name} {user.last_name}
        </Text>
        <Text>
          <strong>Email:</strong> {user.email}
        </Text>
        <Text>
          <strong>Teléfono:</strong> {user.phone}
        </Text>
        <Text>
          <strong>Dirección:</strong> {user.address}
        </Text>
        <Text>
          <strong>Usuario:</strong> {user.username}
        </Text>
      </Box>
    </Box>
  );
};

export default UserProfile;
