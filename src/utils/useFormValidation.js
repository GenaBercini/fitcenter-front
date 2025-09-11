import { useState } from "react";

export function useFormValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /.{6,}/.test(password) &&
    (password.match(/[A-Z]/g) || []).length >= 2 &&
    /[0-9]/.test(password);
  const validateAddress = (address) => address && address.trim().length >= 5;
  const validateImage = (url) =>
    /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/i.test(url);
  const validateMatricula = (mat) => /^[A-Za-z0-9-]+$/.test(mat);
  const validateName = (name) => /^[A-Za-zÀ-ÿ\s]+$/.test(name);
  const validatePhone = (phone) => /^[0-9]+$/.test(phone);

  const validateForm = (fields = Object.keys(values)) => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = values[field];
      switch (field) {
        case "email":
          if (!value) newErrors.email = "El email es obligatorio";
          else if (!validateEmail(value)) newErrors.email = "Email inválido";
          break;
        case "password":
          if (!value) newErrors.password = "La contraseña es obligatoria";
          else if (!validatePassword(value))
            newErrors.password =
              "Contraseña debe tener 6 caracteres, 2 mayúsculas y un número";
          break;
        case "nombre":
        case "apellido":
          if (value.apellido && !validateName(value.apellido))
            newErrors.apellido = "Apellido solo debe contener letras";
          if (value.nombre && !validateName(value.nombre))
            newErrors.nombre = "Nombre solo debe contener letras";
          break;
        case "celular":
          if (value.celular && !validatePhone(value.celular))
            newErrors.celular = "Celular solo debe contener números";
          break;
        case "direccion":
          if (value.direccion && !validateAddress(value.direccion))
            newErrors.direccion = "Dirección demasiado corta";
          break;
        case "imagen":
          if (value.image && !validateImage(value))
            newErrors.imagen = "Debe ser una URL válida (.jpg, .jpeg, .png)";
          break;
        case "nroMatricula":
          if (!value) newErrors.nroMatricula = "La matrícula es obligatoria";
          else if (!validateMatricula(value)) {
              newErrors.nroMatricula =
              "Matrícula solo puede contener letras, números o guiones";
          }
          break;
        case "tipoProfesor":
          if (typeof value !== "boolean")
            newErrors.tipoProfesor = "Debe ser verdadero o falso";
          break;
        default:
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    validateForm(Object.keys(newValues));
  };

  const handleResetForm = (initialValues) => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
    setValues,
    setErrors,
    handleResetForm,
  };
}
