import { Link } from "react-router-dom";
import { Accordion, Button, Heading, Icon, Stack } from "@chakra-ui/react"
import { BsFillPeopleFill, BsPersonArmsUp } from "react-icons/bs"
import { FaClock, FaFileInvoiceDollar, FaList, FaProductHunt, FaUserCircle } from "react-icons/fa"
import { FaPeopleGroup, FaPersonChalkboard } from "react-icons/fa6"
import { IoMdFitness } from "react-icons/io"
import { MdAttachMoney, MdCardMembership, MdCategory } from "react-icons/md"
import { RiAdminFill } from "react-icons/ri"
import { SiHomeassistantcommunitystore } from "react-icons/si"

const Demo = () => {
  return (
    <Stack width="full" maxW="400px">
      <Heading size="md">Dashboard</Heading>
      <Accordion.Root multiple collapsible >
        {items.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            
            {item.content == undefined ? (
              <Link to={'/dashboard/'+item.value}>
                <Accordion.ItemTrigger>
                  <Icon fontSize="lg" color="fg.subtle">
                    {item.icon}
                  </Icon>
                {item.title}
                {item.content && item.content.length > 0 &&
                (
                    <Accordion.ItemIndicator />
                )}
                </Accordion.ItemTrigger>
              </Link>
            ) : (
              <Accordion.ItemTrigger>
                  <Icon fontSize="lg" color="fg.subtle">
                    {item.icon}
                  </Icon>
                {item.title}
                {item.content && item.content.length > 0 &&
                (
                    <Accordion.ItemIndicator />
                )}
                </Accordion.ItemTrigger>
            )}
            {item.content && item.content.length > 0 && (
              
                <Accordion.ItemContent>
                    {item.content.map((item1) => (
                      <Link to={'/dashboard/'+item1.value} key={item1.value}>
                        <Accordion.ItemBody >
                            <Button>
                              <Icon fontSize="lg" color="fg.subtle" mr={2}>
                              {item1.icon}
                              </Icon>
                              {item1.title}
                            </Button>
                        </Accordion.ItemBody>
                    </Link>
                    ))}
                </Accordion.ItemContent>

            )}

          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  )
}

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
        }
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
  
]

export default Demo;