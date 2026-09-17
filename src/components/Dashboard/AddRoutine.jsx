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
  Switch,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function AddRoutine({ onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [typeRoutine, setTypeRoutine] = useState("");
  const [descRoutine, setDescRoutine] = useState("");
  const [activo, setActivo] = useState(0); // 0 = Activa (disabled: false), 1 = Inactiva (disabled: true)

  const guardar = async () => {
    if (!typeRoutine || !descRoutine) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa el tipo de rutina y la descripción",
        icon: "error",
      });
      return;
    }

    // Payload adaptado al modelo de Sequelize Routine
    const payload = {
      typeRoutine,
      descRoutine, // Nombre de columna exacto en Sequelize
      disabled: activo === 1, // disabled: false = Activa, true = Inactiva
      professorId: null,
    };

    try {
      const res = await fetch("http://localhost:3000/routines", {
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
          text: data.msg || "Rutina creada correctamente",
          icon: "success",
        }).then(() => {
          if (onSaved) onSaved();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.msg || rawText || "Error al crear la rutina",
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
        Agregar Rutina
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva rutina</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de rutina</FormLabel>
              <Input
                placeholder="Ej: Hipertrofia / Torso-Pierna"
                value={typeRoutine}
                onChange={(e) => setTypeRoutine(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Descripción</FormLabel>
              <Input
                placeholder="Descripción detallada"
                value={descRoutine}
                onChange={(e) => setDescRoutine(e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                {activo === 0 ? "Activa" : "Inactiva"}
              </FormLabel>
              <Switch
                isChecked={activo === 0}
                onChange={() => setActivo(activo === 0 ? 1 : 0)}
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

export default AddRoutine;
