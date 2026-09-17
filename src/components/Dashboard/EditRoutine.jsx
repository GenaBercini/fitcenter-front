import React, { useState } from "react";
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
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function EditRoutine({ routine, onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [typeRoutine, setTypeRoutine] = useState(routine?.typeRoutine || "");
  const [descRoutine, setDescRoutine] = useState(
    routine?.descRoutine || routine?.description || "",
  );
  const [activo, setActivo] = useState(
    routine?.disabled === true || Number(routine?.disabled) === 1 ? 1 : 0,
  );

  const handleOpen = () => {
    setTypeRoutine(routine?.typeRoutine || "");
    setDescRoutine(routine?.descRoutine || routine?.description || "");
    setActivo(
      routine?.disabled === true || Number(routine?.disabled) === 1 ? 1 : 0,
    );
    onOpen();
  };

  const editar = () => {
    if (typeRoutine !== "" && descRoutine !== "") {
      const payload = {
        typeRoutine,
        descRoutine,
        disabled: activo === 1,
      };

      fetch(`http://localhost:3000/routines/${routine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          Swal.fire({
            title: "Éxito",
            text: "Rutina modificada correctamente",
            icon: "success",
          }).then(() => {
            if (onSaved) onSaved();
            location.reload();
          });
        })
        .catch((err) =>
          Swal.fire({ title: "Error", text: err.message, icon: "error" }),
        );
    } else {
      Swal.fire({
        title: "Error",
        text: "Completar los campos obligatorios",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Button size="sm" colorScheme="gray" onClick={handleOpen}>
        Editor
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar rutina</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de rutina</FormLabel>
              <Input
                placeholder="Tipo de rutina"
                value={typeRoutine}
                onChange={(e) => setTypeRoutine(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Descripción</FormLabel>
              <Input
                placeholder="Descripción"
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
            <Button variant="ghost" onClick={editar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditRoutine;
