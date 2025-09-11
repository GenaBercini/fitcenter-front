// import React, { useEffect, useState } from "react";
// import { FaHistory } from "react-icons/fa";
// import "./PageStyles.css";

// const PurchaseHistory = () => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/users/1/history") // ESTO TENGO Q TOCAR TAMBIEN EN EL BACK
//       .then((res) => res.json())
//       .then((data) => setHistory(data))
//       .catch((err) => console.error("Error fetching history:", err));
//   }, []);

//   return (
//     <div className="page-container">
//       <h2>
//         <FaHistory className="icon" />{" "}
//         <span className="pink-text">Historial</span> de Compras
//       </h2>

//       <div className="card">
//         {history.length === 0 ? (
//           <p>No tienes compras registradas.</p>
//         ) : (
//           <ul>
//             {history.map((h) => (
//               <li key={h.id}>
//                 {h.product} - ${h.amount} -{" "}
//                 {new Date(h.date).toLocaleDateString()}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PurchaseHistory;

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/purchases") // <-- Hay q contemplar esto en el back
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando historial de compras:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (purchases.length === 0) return <Text>No tenés compras registradas.</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        <FaShoppingCart style={{ display: "inline", marginRight: "8px" }} />
        Historial de{" "}
        <Text as="span" color="pink.500">
          Compras
        </Text>
      </Heading>

      <VStack spacing={4} align="stretch">
        {purchases.map((purchase) => (
          <Box
            key={purchase.id}
            bg={useColorModeValue("white", "gray.700")}
            p={4}
            borderRadius="xl"
            shadow="md"
          >
            <Text>
              <strong>Producto:</strong> {purchase.product_name}
            </Text>
            <Text>
              <strong>Fecha:</strong> {purchase.date}
            </Text>
            <Text>
              <strong>Precio:</strong> ${purchase.price}
            </Text>
            <Text>
              <strong>Cantidad:</strong> {purchase.quantity}
            </Text>
            <Text>
              <strong>Total:</strong> ${purchase.total}
            </Text>
            <Text>
              <strong>Estado:</strong> {purchase.status}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PurchaseHistory;
