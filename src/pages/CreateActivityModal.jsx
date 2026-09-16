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
  Select,
  Textarea,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function CreateActivityModal({
  isOpen,
  onClose,
  instructorId,
  editingActivity,
  onActivitySaved,
}) {
  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (editingActivity) {
      setNewActivity({
        name: editingActivity.name || "",
        description: editingActivity.description || "",
        startTime: editingActivity.startTime || "",
        endTime: editingActivity.endTime || "",
        capacity: editingActivity.capacity || "",
      });
    } else {
      setNewActivity({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        capacity: "",
      });
    }
  }, [editingActivity, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (editingActivity) {
        res = await fetch(
          `http://localhost:3000/activities/${editingActivity.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...newActivity,
              instructorId,
              approved: editingActivity.approved,
            }),
          },
        );
      } else {
        res = await fetch("http://localhost:3000/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instructorId,
            ...newActivity,
            approved: false,
          }),
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al procesar la actividad");
      }

      toast({
        title: editingActivity ? "Actividad actualizada" : "Actividad creada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (onActivitySaved) await onActivitySaved();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
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
      <ModalContent borderRadius="md" overflow="hidden">
        <ModalHeader bg="blue.600" color="white" fontWeight="bold" pb={3}>
          {editingActivity ? "Editar Actividad" : "Crear Nueva Actividad"}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <form onSubmit={handleSubmit}>
          <ModalBody pt={4}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre de la Actividad</FormLabel>
                <Select
                  placeholder="Seleccioná una actividad"
                  value={newActivity.name}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, name: e.target.value })
                  }
                >
                  <option value="Hilado">Hilado</option>
                  <option value="CrossFit">CrossFit</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Zumba">Zumba</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  placeholder="Breve descripción"
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>

              <HStack w="100%">
                <FormControl isRequired>
                  <FormLabel>Hora de Inicio</FormLabel>
                  <Input
                    type="time"
                    value={newActivity.startTime}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        startTime: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hora de Fin</FormLabel>
                  <Input
                    type="time"
                    value={newActivity.endTime}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        endTime: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Cupo Máximo</FormLabel>
                <Input
                  type="number"
                  min="1"
                  value={newActivity.capacity}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      capacity: e.target.value,
                    })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" colorScheme="red" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={loading}>
              {editingActivity ? "Guardar Cambios" : "Crear Actividad"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
