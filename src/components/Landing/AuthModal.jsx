import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Button,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Switch,
  HStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { FaPhoneAlt } from "react-icons/fa";
import { useFormValidation } from "../../utils/useFormValidation";
import ValidatedInput from "../Landing/ValidateInput";
import PasswordInput from "../Landing/PasswordInput";
import ImageInput from "../Landing/ImageInput";
import { FcGoogle } from "react-icons/fc";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0); // 0 = Cliente, 1 = Profesor
  const [disabledSend, setDisabledSend] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const { values, errors, handleChange, validateForm, handleResetForm } =
    useFormValidation({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      direccion: "",
      celular: "",
      imagen: "https://bit.ly/broken-link", // imagen por defecto
      nroMatricula: "",
      tipoProfesor: false,
    });

  useEffect(() => {
    const requiredFields = isLogin
      ? ["email", "password"]
      : ["email", "password"].concat(
          tabIndex === 1 ? ["nroMatricula", "tipoProfesor"] : []
        );
    setDisabledSend(
      requiredFields.some((field) => !values[field] || errors[field])
    );
  }, [values, errors, isLogin, tabIndex]);

  const handleSetImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      handleChange("imagen", reader.result);
    };
    reader.onerror = (error) => {
      Swal.fire({
        title: "Error al leer archivo",
        text: error.message,
        icon: "error",
      });
    };
  };

  const handleLogin = async () => {
    const valid = validateForm(["email", "password"]);
    if (!valid) return;
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({
        title: "Login exitoso!",
        variant: "solid",
        isClosable: true,
        position: "bottom-left",
        status: "success",
      });
      if (user?.role === "admin") {
        navigate("/dashboard");
      }
      handleCloseModal();
    } catch (err) {
      handleCloseModal();
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/users/auth/google";
  };

  const handleRegister = async () => {
    const fields = [
      "nombre",
      "apellido",
      "direccion",
      "celular",
      "email",
      "password",
      "imagen",
    ];
    if (tabIndex === 1) fields.push("nroMatricula", "tipoProfesor");
    const valid = validateForm(fields);
    if (!valid) return;

    setLoading(true);
    let rolUser = "";
    if (tabIndex === 1) {
      if (tipoProfesor) {
        rolUser = "instructor";
      } else {
        rolUser = "professor";
      }
    } else {
      rolUser = "client";
    }
    try {
      const userData = {
        first_name: values.nombre,
        last_name: values.apellido,
        address: values.direccion,
        phone: values.celular,
        email: values.email,
        password: values.password,
        image: values.imagen,
        role: rolUser,
        ...(tabIndex === 1 && {
          registration_number: values.nroMatricula,
        }),
      };
      await signUp(userData);
      toast({
        title: "Registro exitoso! Por favor, verifica tu correo.!",
        variant: "solid",
        isClosable: true,
        position: "bottom-left",
        status: "success",
      });
      handleCloseModal();
    } catch (err) {
      handleCloseModal();
      Swal.fire({ title: "Error", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsLogin(true);
    handleResetForm({
      email: "",
      password: "",
      nombre: "",
      apellido: "",
      direccion: "",
      celular: "",
      imagen: "",
      nroMatricula: "",
      tipoProfesor: false,
    });
    setTabIndex(0);
    closeAuthModal();
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={handleCloseModal}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="md" textAlign="center">
          {isLogin ? "Login" : "Registro"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {isLogin ? (
              <>
                <ValidatedInput
                  field="email"
                  placeholder="Email"
                  type="email"
                  errors={errors}
                  values={values}
                  handleChange={handleChange}
                />
                <PasswordInput
                  field="password"
                  errors={errors}
                  values={values}
                  handleChange={handleChange}
                />
              </>
            ) : (
              <Tabs
                index={tabIndex}
                onChange={setTabIndex}
                variant="soft-rounded"
                colorScheme="blue"
                isFitted
                isLazy
              >
                <TabList>
                  <Tab>Cliente</Tab>
                  <Tab>Profesor</Tab>
                </TabList>
                <TabPanels>
                  {[0, 1].map((idx) => (
                    <TabPanel key={idx}>
                      <VStack spacing={4}>
                        <ImageInput
                          handleSetImage={handleSetImage}
                          previewUrl={values.imagen}
                        />
                        <HStack>
                          <ValidatedInput
                            field="nombre"
                            placeholder="Nombre"
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                          />
                          <ValidatedInput
                            field="apellido"
                            placeholder="Apellido"
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                          />
                        </HStack>
                        <HStack>
                          <ValidatedInput
                            field="direccion"
                            placeholder="Dirección"
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                          />
                          <ValidatedInput
                            field="celular"
                            placeholder="Celular"
                            inputProps={{
                              InputRightElement: <FaPhoneAlt />,
                            }}
                            errors={errors}
                            values={values}
                            handleChange={handleChange}
                          />
                        </HStack>
                        <ValidatedInput
                          field="email"
                          placeholder="Email"
                          type="email"
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                        />
                        <PasswordInput
                          field="password"
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                        />
                        {tabIndex === 1 && (
                          <>
                            <ValidatedInput
                              type="nroMatricula"
                              field="nroMatricula"
                              placeholder="Numero de Matricula"
                              errors={errors}
                              values={values}
                              handleChange={handleChange}
                            />
                            <FormControl display="flex" alignItems="center">
                              <FormLabel htmlFor="instructor" mb="0">
                                Instructor
                              </FormLabel>
                              <Switch
                                id="instructor"
                                isChecked={values.tipoProfesor}
                                onChange={(e) =>
                                  handleChange("tipoProfesor", e.target.checked)
                                }
                              />
                            </FormControl>
                          </>
                        )}
                      </VStack>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            )}
          </VStack>

          <Text
            my={2}
            fontSize="sm"
            textAlign="center"
            color="blue.500"
            cursor="pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Text>
          <VStack spacing={4} align="center" mt={2}>
            <Button
              mx="auto"
              w="100%"
              bg="white"
              color="gray.700"
              border="1px solid"
              borderColor="gray.300"
              leftIcon={<FcGoogle />}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              _active={{
                bg: "blue.700",
                color: "white",
              }}
              onClick={handleGoogleLogin}
            >
              {isLogin ? "Iniciar sesión con Google" : "Registrarse con Google"}
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            isLoading={loading}
            w="full"
            onClick={isLogin ? handleLogin : handleRegister}
            isDisabled={disabledSend}
          >
            {isLogin ? "Login" : "Registrar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
