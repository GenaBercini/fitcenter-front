import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Heading,
  Icon,
  Stack,
} from "@chakra-ui/react";
import {
  BsFillPeopleFill,
  BsPersonArmsUp
} from "react-icons/bs";
import {
  FaClock,
  FaFileInvoiceDollar,
  FaList,
  FaProductHunt,
  FaUserCircle
} from "react-icons/fa";
import { FaPeopleGroup, FaPersonChalkboard } from "react-icons/fa6";
import { IoMdFitness } from "react-icons/io";
import { MdAttachMoney, MdCardMembership, MdCategory } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";

const Demo = () => {
  return (
    <Stack width="full" maxW="400px">
      <Heading size="md">Dashboard</Heading>
      <Accordion allowMultiple allowToggle>
        {items.map((item) => (
          
          <AccordionItem key={item.value}>
            
            <h2>
              {item.content == undefined ? (
                <AccordionButton as={Link} to={`/dashboard/${item.value}`}>
                  <Icon fontSize="xl" color="fg.subtle" mr={2}>
                    {item.icon}
                  </Icon>
                  {item.title}
                  {item.content && item.content.length > 0 && <AccordionIcon />}
                </AccordionButton>
              ) : (
                <AccordionButton>
                  <Icon fontSize="xl" color="fg.subtle" mr={2}>
                    {item.icon}
                  </Icon>
                  {item.title}
                  {item.content && item.content.length > 0 && <AccordionIcon />}
                </AccordionButton>
              )}
              
            </h2>

            {item.content && item.content.length > 0 && (
              <AccordionPanel>
                {item.content.map((item1) => (
                  <AccordionButton
                    as={Link}
                    to={`/dashboard/${item1.value}`}
                    key={item1.value}
                    w="100%"
                  >
                    <Icon fontSize="xl" color="fg.subtle" mr={2}>
                      {item1.icon}
                    </Icon>
                    {item1.title}
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

const items = [
  {
    value: "branches",
    icon: <SiHomeassistantcommunitystore />,
    title: "Sucursales",
  },
  {
    value: "memberships",
    icon: <MdCardMembership />,
    title: "Membresías",
  },
  {
    value: "bookings",
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
    value: "excersises",
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
    title: "Categorias",
  },
  {
    value: "products",
    icon: <FaProductHunt />,
    title: "Productos",
  },
  {
    value: "orders",
    icon: <FaFileInvoiceDollar />,
    title: "Ordenes",
  },
  {
    value: "profile",
    icon: <FaUserCircle />,
    title: "Perfil",
  },
];

export default Demo;