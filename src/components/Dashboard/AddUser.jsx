import { useState } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_IMAGE =
  "https://cgkwvxeecaiaejwsuurm.supabase.co/storage/v1/object/public/user-images/public/4b194a8e-e783-4d30-8da4-3719363e89a8.png";

export default function AddUser({ role, label, onSaved }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    registration_number: "",
  });

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const save = async () => {
    const requiresRegistration =
      role === "professor" || role === "instructor";
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.password ||
      (requiresRegistration && !form.registration_number.trim())
    ) {
      Swal.fire({
        title: "Faltan datos",
        text: "Completá todos los campos obligatorios.",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          role,
          image: DEFAULT_IMAGE,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.msg || "No se pudo crear el usuario");
      }

      Swal.fire({
        title: "Éxito",
        text: `${label} creado correctamente`,
        icon: "success",
      });
      setForm({
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        registration_number: "",
      });
      onClose();
      onSaved?.();
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    }
  };

  const requiresRegistration = role === "professor" || role === "instructor";

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        {label}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{label}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input name="first_name" value={form.first_name} onChange={updateField} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Apellido</FormLabel>
              <Input name="last_name" value={form.last_name} onChange={updateField} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Dirección</FormLabel>
              <Input name="address" value={form.address} onChange={updateField} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Teléfono</FormLabel>
              <Input name="phone" value={form.phone} onChange={updateField} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={updateField} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input name="password" type="password" value={form.password} onChange={updateField} />
            </FormControl>
            {requiresRegistration && (
              <FormControl isRequired>
                <FormLabel>Número de registro</FormLabel>
                <Input
                  name="registration_number"
                  value={form.registration_number}
                  onChange={updateField}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button colorScheme="blue" onClick={save}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
