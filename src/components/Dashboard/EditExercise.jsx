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
} from "@chakra-ui/react";
import { useState } from "react";
import Swal from "sweetalert2";

function EditExercise({ exercise }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(exercise?.name || "");
  const [typeEx, setTypeEx] = useState(exercise?.typeEx || "Fuerza");

  const handleOpen = () => {
    setName(exercise?.name || "");
    setTypeEx(exercise?.typeEx || "Fuerza");
    onOpen();
  };

  function editar() {
    if (name !== "") {
      const payload = {
        name,
        typeEx,
      };

      fetch("http://localhost:3000/exercises/" + exercise.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success || data) {
            Swal.fire({
              title: "Éxito",
              text: "Ejercicio modificado correctamente",
              icon: "success",
            }).then(() => {
              location.reload();
            });
          }
        })
        .catch((err) => {
          Swal.fire({ title: "Error", text: err.message, icon: "error" });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Completar el nombre del ejercicio",
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
          <ModalHeader>Editar ejercicio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Nombre</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de ejercicio</FormLabel>
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
            <Button variant="ghost" onClick={editar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditExercise;
