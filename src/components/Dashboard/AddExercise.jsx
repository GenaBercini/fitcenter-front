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
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function AddExercise({ onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [typeEx, setTypeEx] = useState("Fuerza");

  const guardar = async () => {
    if (!name) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa el nombre del ejercicio",
        icon: "error",
      });
      return;
    }

    // Payload adaptado al modelo de Sequelize
    const payload = {
      name,
      typeEx, // Campo obligatorio
    };

    try {
      const res = await fetch("http://localhost:3000/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { msg: rawText };
      }

      if (res.ok || data.success || data.id) {
        Swal.fire({
          title: "Éxito",
          text: "Ejercicio creado correctamente",
          icon: "success",
        }).then(() => {
          if (onSaved) onSaved();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.msg || rawText || "Error al guardar el ejercicio",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Agregar ejercicio
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo ejercicio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Nombre</FormLabel>
              <Input
                placeholder="Ej: Press de banca"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de ejercicio (typeEx)</FormLabel>
              <Select
                value={typeEx}
                onChange={(e) => setTypeEx(e.target.value)}
              >
                <option value="Fuerza">Fuerza</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibilidad">Flexibilidad</option>
                <option value="Hipertrofia">Hipertrofia</option>
              </Select>
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

export default AddExercise;
