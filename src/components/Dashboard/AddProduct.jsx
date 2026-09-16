import React, { useEffect, useState } from "react";
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
  Select,
  Switch,
  FormLabel,
  FormControl,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [productName, setName] = useState("");
  const [image, setImage] = useState(null);
  const [productDescription, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("0.00");
  const [stock, setStock] = useState(1);
  const [disabled, setDisabled] = useState(false);

  // Cargar categorías tolerando distintos formatos de respuesta
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setCategories(list);
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
        setCategories([]);
      });
  }, []);

  function guardar() {
    if (
      !productName.trim() ||
      !productDescription.trim() ||
      Number(price) <= 0 ||
      Number(stock) < 0 ||
      !selectedCategory ||
      !image
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos correctamente.",
        icon: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("disabled", disabled);
    formData.append("categoryId", selectedCategory);
    formData.append("image", image);

    fetch(`${API_URL}/products`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.id) {
          Swal.fire({
            title: "Éxito",
            text: "Producto creado correctamente",
            icon: "success",
          }).then(() => location.reload());
        } else {
          Swal.fire({
            title: "Error",
            text: data.msg || data.message || "Error al crear producto",
            icon: "error",
          });
        }
      })
      .catch((err) => {
        Swal.fire({ title: "Error", text: err.message, icon: "error" });
      });
  }

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Agregar producto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Nombre"
              mb={2}
              value={productName}
              onChange={(e) => setName(e.target.value)}
            />

            <Text mb={1}>Imagen</Text>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            )}
            <Input
              type="file"
              accept="image/*"
              mb={2}
              onChange={(e) => setImage(e.target.files[0])}
            />

            <Input
              placeholder="Descripción"
              mb={2}
              value={productDescription}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Text mb={1}>Precio</Text>
            <NumberInput
              step={0.01}
              precision={2}
              min={0}
              mb={2}
              value={price}
              onChange={(val) => setPrice(val)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Text mb={1}>Stock</Text>
            <NumberInput
              step={1}
              min={0}
              mb={2}
              value={stock}
              onChange={(val) => setStock(val)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Select
              placeholder="Seleccionar categoría"
              mb={4}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">{!disabled ? "Activo" : "Inactivo"}</FormLabel>
              <Switch
                isChecked={!disabled}
                onChange={(e) => setDisabled(!e.target.checked)}
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

export default AddProduct;
