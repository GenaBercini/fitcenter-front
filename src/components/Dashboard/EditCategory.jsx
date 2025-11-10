import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Switch, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function EditCategory({category}) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleOpen = () => {
        getCategories();
        onOpen();
        if(category.disabled == false){
            category.disabled = 0;
        }
        
        console.log("category" , category);
        console.log("http://localhost:3000/uploads/"+category.img);
       
    }

    //NOMBRE
    const [categoryName, setName] = useState(category.name);

    //IMAGEN
    const [image, setImage] = useState(category.img);

    //CATEGORÍA
    const [categories, setCategories] = useState([]);
    //const [loading, setLoading] = useState(true);

    function getCategories () {
        fetch("http://localhost:3000/categories")
        .then((res) => res.json())
        .then((data) => {
        
            setCategories(data.data);
            console.log("CATEGORIAS EDIT", data.data);
                    
            //setLoading(false);
        })
        .catch((err) => {
            console.error("Error cargando categoryos:", err);
            //setLoading(false);
        });
    }

    //ACTIVO
    const [activo, setActivo] = useState(0);

    //EDITAR
    function editar () {
        console.log('categoryName', categoryName);
        console.log('activo', activo);
        console.log("imagen ant", category.img);
        console.log('imagen', image);
    
        if(categoryName != "" &&
            (activo == 0 || activo == 1) &&
            image != null
        ) {
            const formData = new FormData();
            formData.append("name", categoryName);
            formData.append("active", activo);
            formData.append("lastImg", category.img);
            if (image) formData.append("image", image);
    
            fetch("http://localhost:3000/categories/"+category.id, {
            method: "PUT",
            body: formData,
            })
            .then(res => res.json())
            .then(data => {
                console.log("Categoría modificada:", data);
                if(data.success){
                //modal
                Swal.fire({ title: "Éxito", text: data.msg, icon: "success" })
                .then(() => {
                    location.reload();
                });
                }
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
      <Button onClick={handleOpen}>Editar</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Input placeholder='Nombre' mb={2} value={categoryName} onChange={(e) => setName(e.target.value)}/>
                        
            <Text>Imagen</Text>
            {image && (
                <img
                src={
                image instanceof File
                    ? URL.createObjectURL(image)   // si es File, mostrar vista previa
                    : "http://localhost:3000/uploads/" + image // si es string, usar URL del servidor
                }
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
                {activo == 0 ? "Activo" : "Inactivo"}
                </FormLabel>
                <Switch
                id='activo'
                isChecked={activo == 0}
                onChange={(e) => setActivo(activo == 0 ? 1 : 0)}
                />
            </FormControl>


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost'
            onClick={editar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditCategory;