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
  useDisclosure,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

function EditMembership({ membership, onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState(membership?.type || membership?.name || "");
  const [price, setPrice] = useState(
    membership?.monthly_price || membership?.price || "",
  );

  const handleOpen = () => {
    setType(membership?.type || membership?.name || "");
    setPrice(membership?.monthly_price || membership?.price || "");
    onOpen();
  };

  const editar = () => {
    if (type !== "" && price !== "") {
      const numericPrice = Number(price);
      const payload = {
        type: type,
        name: type,
        monthly_price: numericPrice,
        monthlyPrice: numericPrice,
        price: numericPrice,
      };

      fetch(`http://localhost:3000/memberships/${membership.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          Swal.fire({
            title: "Éxito",
            text: "Membresía modificada correctamente",
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
        text: "Completar campos obligatorios",
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
          <ModalHeader>Editar membresía</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Tipo de membresía</FormLabel>
              <Input
                placeholder="Tipo de membresía"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Precio ($)</FormLabel>
              <Input
                placeholder="Precio"
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
            <Button variant="ghost" onClick={editar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditMembership;
