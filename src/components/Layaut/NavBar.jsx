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
import { Link } from "react-router-dom";
import { use } from "react";

const Links = ["Home", "Cart", "Turnos"];

const NavLink = ({ children, to }) => {
  return (
    <Box
      as={Link}
      to={to}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{ textDecoration: "none" }}
    >
      {children}
    </Box>
  );
};

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthModalOpen, openAuthModal, closeAuthModal, user, signOut } =
    useAuth();
  console.log(user);
  const navigate = useNavigate();

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const handleGoToProfile = () => {
    if (user.role === "admin") navigate("/dashboard");
    if (user.role === "instructor") navigate("/instructor");
    if (user.role === "professor") navigate("/professor");
    if (user.role === "client") navigate("/home");
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
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) =>
                link == "Home" ? (
                  <NavLink key={link} to={`/`}>
                    {link}
                  </NavLink>
                ) : (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>
                    {link}
                  </NavLink>
                ),
              )}

              {/* Carrito de Compras */}
              <Box position="relative">
                <IconButton
                  icon={<FiShoppingCart size={22} />}
                  aria-label="Carrito de compras"
                  variant="ghost"
                  colorScheme="blue"
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                >
                  <Avatar size="sm" src={user.image_url} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleGoToProfile}>Perfil</MenuItem>
                  <MenuItem>Configuración</MenuItem>
                  <MenuItem onClick={() => handleSignOut()}>
                    Cerrar Sesión
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"blue.400"}
                href={"#"}
                _hover={{
                  bg: "blue.300",
                }}
                onClick={() => openAuthModal()}
              >
                Acceder
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) =>
                link == "Home" ? (
                  <NavLink key={link} to={`/`}>
                    {link}
                  </NavLink>
                ) : (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>
                    {link}
                  </NavLink>
                ),
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
