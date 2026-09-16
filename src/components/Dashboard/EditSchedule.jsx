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
  Select,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Swal from "sweetalert2";

function EditSchedule({ schedule }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [day, setDay] = useState(schedule?.day || "Lunes");
  const [startTime, setStartTime] = useState(schedule?.startTime || "");
  const [endTime, setEndTime] = useState(schedule?.endTime || "");
  const [capacity, setCapacity] = useState(schedule?.capacity || "");
  const [maxCapacity, setMaxCapacity] = useState(schedule?.maxCapacity || "");

  const handleOpen = () => {
    setDay(schedule?.day || "Lunes");
    setStartTime(schedule?.startTime || "");
    setEndTime(schedule?.endTime || "");
    setCapacity(schedule?.capacity || "");
    setMaxCapacity(schedule?.maxCapacity || "");
    onOpen();
  };

  function editar() {
    if (startTime !== "" && endTime !== "" && capacity !== "") {
      const payload = {
        day,
        startTime,
        endTime,
        capacity: Number(capacity),
        maxCapacity: maxCapacity ? Number(maxCapacity) : Number(capacity),
      };

      fetch("http://localhost:3000/schedule/" + schedule.id, {
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
                data.msg || data.message || "Turno modificado correctamente",
              icon: "success",
            }).then(() => {
              location.reload();
            });
          } else {
            Swal.fire({
              title: "Error",
              text: data.msg || data.message || "No se pudo modificar el turno",
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
          <ModalHeader>Editar turno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel fontSize="sm">Día</FormLabel>
              <Select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
              </Select>
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

            <HStack mb={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Cupo (Capacity)</FormLabel>
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Cupo Máximo</FormLabel>
                <Input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </FormControl>
            </HStack>
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

export default EditSchedule;
