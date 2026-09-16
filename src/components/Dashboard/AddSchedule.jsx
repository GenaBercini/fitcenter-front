import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Select,
  Input,
  FormLabel,
  FormControl,
  HStack,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function AddSchedule({ onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [day, setDay] = useState("Lunes");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const guardar = async () => {
    if (!startTime || !endTime || !capacity) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa el horario y el cupo (capacity)",
        icon: "error",
      });
      return;
    }

    // Payload idéntico al modelo Sequelize Schedule
    const payload = {
      day,
      startTime,
      endTime,
      capacity: Number(capacity),
      maxCapacity: maxCapacity ? Number(maxCapacity) : Number(capacity),
    };

    try {
      const res = await fetch("http://localhost:3000/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        // Fallback si la respuesta no es JSON
      }

      if (res.ok || data.success) {
        Swal.fire({
          title: "Éxito",
          text: data.msg || data.message || "Turno creado correctamente",
          icon: "success",
        }).then(() => {
          if (onSaved) onSaved();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error de Servidor",
          text:
            data.msg || data.message || rawText || "Error al crear el turno",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error de Red",
        text: err.message || "No se pudo conectar con el servidor",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Agregar turno
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo turno</ModalHeader>
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
                  placeholder="Ej: 20"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Cupo Máximo</FormLabel>
                <Input
                  type="number"
                  placeholder="Opcional"
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
            <Button variant="ghost" onClick={guardar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddSchedule;
