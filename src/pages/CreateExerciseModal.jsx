import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateExerciseModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [typeEx, setTypeEx] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, typeEx }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      toast({
        title: "Ejercicio creado",
        description: "El ejercicio fue agregado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setName("");
      setTypeEx("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Nuevo Ejercicio</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder="Ej: Sentadillas"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tipo de ejercicio</FormLabel>
              <Input
                placeholder="Ej: Piernas, Brazos..."
                value={typeEx}
                onChange={(e) => setTypeEx(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="pink" type="submit" isLoading={loading}>
              Crear
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
