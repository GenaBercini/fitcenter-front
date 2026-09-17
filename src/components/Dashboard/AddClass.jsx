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
  Input,
  FormLabel,
  FormControl,
  HStack,
  Select,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AddClass({ onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("CrossFit");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");

  const classOptions = ["Hilado", "CrossFit", "Yoga", "Zumba"];

  const guardar = async () => {
    if (!name || !startTime || !endTime || !capacity) {
      Swal.fire({
        title: "Error",
        text: "Completar todos los campos obligatorios",
        icon: "error",
      });
      return;
    }

    const payload = {
      name,
      startTime,
      endTime,
      capacity: Number(capacity),
      instructorId: 1,
    };

    try {
      const res = await fetch(`${API_URL}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        // En caso de que responda texto plano
      }

      if (res.ok || data.success) {
        Swal.fire({
          title: "Éxito",
          text: data.msg || data.message || "Clase creada correctamente",
          icon: "success",
        }).then(() => {
          if (onSaved) onSaved();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error de Servidor",
          text:
            data.msg || data.message || rawText || "Error al crear la clase",
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
        Agregar clase
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva clase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Nombre de la clase</FormLabel>
              <Select value={name} onChange={(e) => setName(e.target.value)}>
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Cupo máximo</FormLabel>
              <Input
                type="number"
                placeholder="Ej: 20"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </FormControl>
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

export default AddClass;
