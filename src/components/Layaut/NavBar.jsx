import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Stack,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Badge,
  Container,
} from "@chakra-ui/react";
import AuthModal from "../Auth/AuthModal";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/cartContext";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthModalOpen, openAuthModal, closeAuthModal, user, signOut } =
    useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const handleGoToProfile = () => {
    if (!user) return;
    const role = user.role?.toLowerCase();

    if (role === "admin") navigate("/dashboard");
    else if (role === "instructor") navigate("/instructor");
    else if (role === "professor") navigate("/professor");
    else navigate("/home");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <>
      <Box bg="transparent" py={3}>
        <Container maxW="7xl">
          <Flex
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={6}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="2xl"
            shadow="sm"
          >
            {/* Logo de la marca (Más grande y con presencia) */}
            <Box
              as="button"
              onClick={() => navigate("/")}
              cursor="pointer"
              display="flex"
              alignItems="center"
              _hover={{ transform: "scale(1.03)" }}
              transition="transform 0.2s"
            >
              <Image
                src="../../../public/culturista-musculoso-sosteniendo-gran-barra-grandes-pesos.png"
                boxSize="48px"
                fit="contain"
                alt="FitCenter Logo"
              />
            </Box>

            {/* Acciones Derecha (Iconos y textos más proporcionados) */}
            <Flex alignItems={"center"} gap={4}>
              {user && (
                <Button
                  variant="ghost"
                  fontSize="md"
                  fontWeight={600}
                  color="gray.700"
                  leftIcon={<FiShoppingBag size={20} />}
                  onClick={() => navigate("/myPurchases")}
                  display={{ base: "none", sm: "inline-flex" }}
                  _hover={{ bg: "blue.50", color: "blue.600" }}
                >
                  Mis compras
                </Button>
              )}

              {/* Carrito de Compras */}
              <Box position="relative">
                <IconButton
                  icon={<FiShoppingCart size={22} />}
                  aria-label="Carrito de compras"
                  variant="ghost"
                  colorScheme="blue"
                  rounded="full"
                  size="lg"
                  onClick={() => navigate("/cart")}
                />
                {totalItems > 0 && (
                  <Badge
                    position="absolute"
                    top="1"
                    right="1"
                    colorScheme="red"
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    fontWeight="bold"
                    shadow="sm"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Box>

              {/* Avatar e Historial de Usuario */}
              {user != null ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    ml={1}
                  >
                    <Avatar
                      size="md"
                      name={`${user.first_name || ""} ${user.last_name || ""}`}
                      src={user.image_url}
                    />
                  </MenuButton>
                  <MenuList shadow="xl" borderRadius="2xl" p={2}>
                    <MenuItem
                      onClick={handleGoToProfile}
                      fontWeight="medium"
                      borderRadius="lg"
                    >
                      Mi Panel
                    </MenuItem>
                    <MenuItem
                      onClick={handleSignOut}
                      color="red.500"
                      fontWeight="medium"
                      borderRadius="lg"
                    >
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"blue.500"}
                  _hover={{ bg: "blue.600" }}
                  onClick={() => openAuthModal()}
                  borderRadius="full"
                  px={6}
                  size="md"
                >
                  Acceder
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
