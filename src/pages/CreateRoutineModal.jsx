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

export default function CreateRoutineModal({ isOpen, onClose }) {
  const [typeRoutine, setTypeRoutine] = useState("");
  const [descRoutine, setDescRoutine] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typeRoutine, descRoutine }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      toast({
        title: "Rutina creada",
        description: "La rutina fue agregada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTypeRoutine("");
      setDescRoutine("");
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
        <ModalHeader>Nueva Rutina</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Tipo de rutina</FormLabel>
              <Input
                placeholder="Ej: Hipertrofia"
                value={typeRoutine}
                onChange={(e) => setTypeRoutine(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                placeholder="Ej: Rutina para tren superior"
                value={descRoutine}
                onChange={(e) => setDescRoutine(e.target.value)}
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
