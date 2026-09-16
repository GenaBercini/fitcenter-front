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
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function AddMembership({ onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const guardar = async () => {
    if (!type || !price) {
      Swal.fire({
        title: "Error",
        text: "Completar todos los campos obligatorios",
        icon: "error",
      });
      return;
    }

    const valorPrecio = parseFloat(price) || 0;

    // Se envían todas las alternativas de nombre para empatar la desestructuración del controlador
    const payload = {
      type: type,
      monthly_price: valorPrecio,
      monthlyPrice: valorPrecio,
      price: valorPrecio,
    };

    try {
      const res = await fetch("http://localhost:3000/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {}

      if (res.ok || data.success || data.id) {
        Swal.fire({
          title: "Éxito",
          text: "Membresía creada correctamente",
          icon: "success",
        }).then(() => {
          if (onSaved) onSaved();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error de Servidor",
          text:
            data.message ||
            data.msg ||
            rawText ||
            "Error al crear la membresía",
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
        Agregar membresía
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva membresía</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de membresía</FormLabel>
              <Input
                placeholder="Ej: VIP / Mensual / Trimestral"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Precio mensual ($)</FormLabel>
              <Input
                placeholder="Ej: 15000"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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

export default AddMembership;
