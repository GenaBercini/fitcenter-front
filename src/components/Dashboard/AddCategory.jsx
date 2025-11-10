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


function AddCategory() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  //NOMBRE
  const [categoryName, setName] = useState("");

  //IMAGEN
  const [image, setImage] = useState(null);

  //ACTIVO
  const [activo, setActivo] = useState(0);

  //GUARDAR
  function guardar () {
    console.log('categoryName', categoryName);
    console.log('activo', activo);
    console.log('imagen', image);

    if(categoryName != "" &&
      activo === 0 &&
      image != null
    ) {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("active", activo);
      if (image) formData.append("image", image);

      fetch("http://localhost:3000/categories", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          console.log("Categoría creada:", data);
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
      <Button onClick={onOpen}>Agregar categoría</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Input placeholder='Nombre' mb={2} value={categoryName} onChange={(e) => setName(e.target.value)}/>
            
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

            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='email-alerts' mb='0'>
                {activo == 0 ? "Activa" : "Inactiva"}
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

export default AddCategory
