import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Swal from "sweetalert2";

function EditClass({ cls }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [className, setName] = useState(cls?.name || "");
  const [startTime, setStartTime] = useState(cls?.startTime || "");
  const [endTime, setEndTime] = useState(cls?.endTime || "");
  const [capacity, setCapacity] = useState(cls?.capacity || "");

  const handleOpen = () => {
    setName(cls?.name || "");
    setStartTime(cls?.startTime || "");
    setEndTime(cls?.endTime || "");
    setCapacity(cls?.capacity || "");
    onOpen();
  };

  function editar() {
    if (className !== "" && startTime !== "" && endTime !== "") {
      // Payload adaptado estrictamente a las columnas existentes en Sequelize
      const payload = {
        name: className,
        startTime: startTime,
        endTime: endTime,
        capacity: Number(capacity) || 0,
        instructorId: cls?.instructorId || 1, // Mantiene el instructor o asigna id 1 por defecto
      };

      fetch("http://localhost:3000/activities/" + cls.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          const isOk = res.ok;
          return res.json().then((data) => ({ isOk, data }));
        })
        .then(({ isOk, data }) => {
          if (data.success || isOk) {
            Swal.fire({
              title: "Éxito",
              text:
                data.msg || data.message || "Clase modificada correctamente",
              icon: "success",
            }).then(() => {
              location.reload();
            });
          } else {
            Swal.fire({
              title: "Error",
              text: data.msg || data.message || "No se pudo modificar la clase",
              icon: "error",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err.message || "Error al conectar con el servidor",
            icon: "error",
          });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Completar todos los campos obligatorios",
        icon: "error",
      });
    }
  }

  return (
    <>
      <Button onClick={handleOpen}>Editar</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar clase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Nombre de la clase</FormLabel>
              <Input
                placeholder="Nombre de la clase"
                value={className}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <HStack mb={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Hora inicio</FormLabel>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Hora fin</FormLabel>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </FormControl>
            </HStack>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Cupo máximo</FormLabel>
              <Input
                placeholder="Cupo máximo"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="ghost" onClick={editar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditClass;
