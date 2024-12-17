import { registerPet } from "@/api/endpoint";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";

interface FormDataProps {
  name: string;
  breed: string;
  age: number;
  isVaccinated: boolean;
  isSterilized: boolean;
  description: string;
  size: string;
  imageUrl: string;
  location: string;
  ownerId?: number;
}

type ErrorProps = Partial<Record<keyof FormDataProps, string>>;
export function usePetForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    breed: "",
    age: 0,
    isVaccinated: false,
    isSterilized: false,
    description: "",
    size: "",
    imageUrl: "",
    location: "",
    ownerId: undefined,
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleInput(
    name: keyof FormDataProps,
    value: string | boolean | number
  ) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs() {
    let isValid = true;
    const errors: ErrorProps = {};

    if (formData.name.trim() === "") {
      errors.name = "El nombre es requerido";
      isValid = false;
    }

    if (formData.breed.trim() === "") {
      errors.breed = "La raza es requerida";
      isValid = false;
    }

    if (isNaN(formData.age) || formData.age <= 0) {
      errors.age = "La edad debe ser un número mayor a 0";
      isValid = false;
    }

    if (formData.size.trim() === "") {
      errors.size = "El tamaño es requerido";
      isValid = false;
    }

    if (formData.location.trim() === "") {
      errors.location = "La ubicación es requerida";
      isValid = false;
    }

    if (formData.description && formData.description.trim().length < 10) {
      errors.description = "La descripción debe tener al menos 10 caracteres";
      isValid = false;
    }

    if (
      formData.imageUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(formData.imageUrl)
    ) {
      errors.imageUrl = "La URL de la imagen debe ser válida";
      isValid = false;
    }

    console.log("Validación:", formData);

    setErrorMsg(errors);
    return isValid;
  }

  async function register() {
    setIsLoading(true);
    try {
      if (validateInputs()) {
        console.log("Datos a enviar:", formData);

        const res = await registerPet(formData);
        console.log("Registro exitoso:", res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return { formData, errorMsg, handleInput, register, isLoading };
}
