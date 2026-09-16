import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { BsFillPeopleFill, BsPersonArmsUp } from "react-icons/bs";
import { FaClock, FaList, FaProductHunt, FaUserCircle } from "react-icons/fa";
import { FaPeopleGroup, FaPersonChalkboard } from "react-icons/fa6";
import { IoMdFitness } from "react-icons/io";
import { MdAttachMoney, MdCardMembership, MdCategory } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

const Demo = () => {
  return (
    <Stack width="full" maxW="400px">
      <Heading size="md" color="white" mb={2}>
        <Link to="/dashboard/main">Dashboard</Link>
      </Heading>
      <Accordion allowMultiple allowToggle>
        {items.map((item) => (
          <AccordionItem key={item.value} border="none">
            <h2>
              {item.content === undefined ? (
                <AccordionButton
                  as={Link}
                  to={`/dashboard/${item.value}`}
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                >
                  <Icon fontSize="xl" color="gray.300" mr={2}>
                    {item.icon}
                  </Icon>
                  {item.title}
                </AccordionButton>
              ) : (
                <AccordionButton _hover={{ bg: "gray.700" }} borderRadius="md">
                  <Icon fontSize="xl" color="gray.300" mr={2}>
                    {item.icon}
                  </Icon>
                  {item.title}
                  {item.content && item.content.length > 0 && (
                    <AccordionIcon ml="auto" />
                  )}
                </AccordionButton>
              )}
            </h2>

            {item.content && item.content.length > 0 && (
              <AccordionPanel pb={2} pt={1} pl={4}>
                {item.content.map((subItem) => (
                  <AccordionButton
                    as={Link}
                    to={`/dashboard/${subItem.value}`}
                    key={subItem.value}
                    w="100%"
                    _hover={{ bg: "gray.700" }}
                    borderRadius="md"
                    my={1}
                  >
                    <Icon fontSize="lg" color="gray.400" mr={2}>
                      {subItem.icon}
                    </Icon>
                    {subItem.title}
                  </AccordionButton>
                ))}
              </AccordionPanel>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
};

// Se corrigieron los "value" para que coincidan con AppRoutes.jsx
const items = [
  {
    value: "memberships",
    icon: <MdCardMembership />,
    title: "Membresías",
  },
  {
    value: "schedule", // Corregido: antes decía "bookings"
    icon: <FaClock />,
    title: "Turnos",
  },
  {
    value: "classes",
    icon: <FaPeopleGroup />,
    title: "Clases",
  },
  {
    value: "routines",
    icon: <FaList />,
    title: "Rutinas",
  },
  {
    value: "exercises", // Corregido: antes decía "excersises"
    icon: <IoMdFitness />,
    title: "Ejercicios",
  },
  {
    value: "staff",
    icon: <BsFillPeopleFill />,
    title: "Personal",
    content: [
      {
        value: "administrators",
        icon: <RiAdminFill />,
        title: "Administradores",
      },
      {
        value: "professors",
        icon: <BsPersonArmsUp />,
        title: "Profesores",
      },
      {
        value: "instructors",
        icon: <FaPersonChalkboard />,
        title: "Instructores",
      },
      {
        value: "clients",
        icon: <MdAttachMoney />,
        title: "Clientes",
      },
    ],
  },
  {
    value: "categories",
    icon: <MdCategory />,
    title: "Categorías",
  },
  {
    value: "products",
    icon: <FaProductHunt />,
    title: "Productos",
  },
  {
    value: "main", // Corregido: antes decía "profile"
    icon: <FaUserCircle />,
    title: "Perfil",
  },
];

export default Demo;
