import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Input,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
} from "@chakra-ui/react";
import AuthModal from "../Landing/AuthModal";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Links = ["Dashboard", "Cart", "Turns"];

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
  const navigate = useNavigate();
  const handleGoToProfile = () => {
    navigate("/profile");
  };
  const handleSignOut = () => {
    navigate("/");
    signOut();
  };

  return (
    <>
      <Box p={2}>
        <Flex
          h={14}
          p={2}
          alignItems={"center"}
          justifyContent={"space-between"}
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <IoMdClose /> : <IoMdMenu />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Image
              src="../../../public/culturista-musculoso-sosteniendo-gran-barra-grandes-pesos.png"
              boxSize="40px"
              fit="cover"
              alt="Pesas"
            />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link} to={`/${link.toLowerCase()}`}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <HStack w="40%" maxW="sm" borderWidth="1px" rounded="lg" spacing={0}>
            <Input flex="1" placeholder="Search" p={2} />
            <Button bg="gray.100" variant="outline">
              Submit
            </Button>
          </HStack>
          <Flex alignItems={"center"} justifyContent={"end"} minW="20%">
            {(user != null) ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                >
                  <Avatar
                    size="sm"
                    src={user.image_url}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleGoToProfile}>Profile</MenuItem>
                  <MenuItem>Configuración</MenuItem>
                  <MenuItem onClick={() => signOut()}>Cerrar Sesión</MenuItem>
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
              {Links.map((link) => (
                <NavLink key={link} to={`/${link.toLowerCase()}`}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
