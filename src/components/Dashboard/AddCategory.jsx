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
  Text,
  Switch,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

function AddCategory({ buttonLabel = "Agregar categoría" }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categoryName, setName] = useState("");
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(true);

  const guardar = async () => {
    if (!categoryName.trim() || !image) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa el nombre y selecciona una imagen.",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("active", active);
    formData.append("image", image);

    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers,
        body: formData,
      });

      const rawText = await res.text();
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        // En caso de que el servidor responda texto plano
      }

      if (res.ok || data.success || data.id) {
        Swal.fire({
          title: "Éxito",
          text: data.msg || data.message || "Categoría creada correctamente",
          icon: "success",
        }).then(() => {
          onClose();
          location.reload();
        });
      } else {
        Swal.fire({
          title: "Error de Servidor",
          text:
            data.msg ||
            data.message ||
            rawText ||
            "Error al crear la categoría",
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
        {buttonLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Nombre de la categoría</FormLabel>
              <Input
                placeholder="Ej: Suplementos"
                value={categoryName}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel fontSize="sm">Imagen</FormLabel>
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Vista previa"
                  style={{
                    width: "100%",
                    maxHeight: "180px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm">
                {active ? "Activa" : "Inactiva"}
              </FormLabel>
              <Switch
                isChecked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="blue" onClick={guardar}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddCategory;
