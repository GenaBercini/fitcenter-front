import React, { useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import Swal from "sweetalert2";


function AddProduct() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  //NOMBRE
  const [productName, setName] = useState("");

  //IMAGEN
  const [image, setImage] = useState(null);

  //DESCRIPCION
  const [productDescription, setDescription] = useState("");

  //CATEGORÍA
  const [categories, setCategories] = useState([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => {
    
        setCategories(data.data);
        console.log("CATEGORIAS", data.data);
                
        //setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        //setLoading(false);
      });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(0);

  //PRECIO
  const [price, setPrice] = React.useState(0)

  //STOCK
  const [stock, setStock] = useState(1)

  //ACTIVO
  const [activo, setActivo] = useState(0);

  //GUARDAR
  function guardar () {
    console.log('productName', productName);
    console.log('productDescription', productDescription);
    console.log('price', Number(price));
    console.log('stock', stock);
    console.log('activo', activo);
    console.log('selectedCategory', Number(selectedCategory));
    console.log('imagen', image);

    if(productName != "" &&
      productDescription != "" &&
      Number(price) > 0 &&
      stock >= 1 &&
      activo === 0 &&
      Number(selectedCategory) > 0 &&
      image != null
    ) {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("active", activo);
      formData.append("categoryId", selectedCategory);
      if (image) formData.append("image", image);

      fetch("http://localhost:3000/products", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          console.log("Producto creado:", data);
          if(data.success){
            //modal
            Swal.fire({ title: "Éxito", text: data.msg, icon: "success" })
            .then(() => {
              location.reload();
            });
          }
          //onClose(); // cerramos modal
        })
        .catch(err => {
          Swal.fire({ title: "Error", text: err, icon: "error" })
        });
    } else {
      Swal.fire({ title: "Error", text: "Completar todos los campos", icon: "error" })
    }
    
  }
  
  return (
    <>
      <Button onClick={onOpen}>Agregar producto</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nuevo producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Input placeholder='Nombre' mb={2} value={productName} onChange={(e) => setName(e.target.value)}/>
            
            <Text>Imagen</Text>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
              />
            )}
            <Input 
              type="file" 
              accept="image/*" 
              mb={2}
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Input placeholder='Descripción' mb={2} value={productDescription} onChange={(e) => setDescription(e.target.value)}/>

            <Text>Precio</Text>
             <NumberInput
              step={0.01}
              precision={2}
              min={0}
              max={1000000}
              mb={2}
              value={price}
              onChange={(valueString, valueNumber) => {
                if (valueString === "") {
                  setPrice("");
                } else if (!isNaN(valueNumber)) {
                  setPrice(valueString);
                }
              }}
              onBlur={() => {
                const parsed = parseFloat(price);
                if (!isNaN(parsed)) setPrice(parsed.toFixed(2));
                else setPrice("0.00");
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Text>Stock</Text>
            <NumberInput step={1} defaultValue={1} min={0} max={100} mb={2}
            onChange={(stock) => setStock(stock)}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Select placeholder='Seleccionar categoría' mb={4}
            value={selectedCategory} // controlas el valor
            onChange={(e) => setSelectedCategory(e.target.value)}>
              {
                categories.map((category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                )))
              }
            </Select>

            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='email-alerts' mb='0'>
                {activo == 0 ? "Activo" : "Inactivo"}
              </FormLabel>
              <Switch
                id='activo'
                isChecked={activo === 0}
                onChange={(e) => setActivo(activo === 0 ? 1 : 0)}
              />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost'
            onClick={guardar}>Guardar</Button>


          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddProduct
