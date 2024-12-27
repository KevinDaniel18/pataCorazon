import { updateUser } from "@/api/endpoint";
import { supabase } from "@/api/supabase";
import { useState } from "react";

export interface FormDataProps {
  name?: string | undefined;
  email?: string | undefined;
  city?: string | undefined;
  country?: string | undefined;
  password?: string | undefined;
}

export type ErrorProps = Partial<Record<keyof FormDataProps, string>>;
export function useUpdateUserForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    name: undefined,
    email: undefined,
    city: undefined,
    country: undefined,
    password: undefined,
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleInput(name: keyof FormDataProps, value: string | undefined) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs(title: string) {
    let isValid = true;
    const errors: ErrorProps = {};

    //validar los campos según el título de la pantalla
    switch (title) {
      case "Nombre":
        if (!formData.name?.trim()) {
          errors.name = "Ingresa tu nuevo nombre";
          isValid = false;
        }
        break;
      
      case "Correo":
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Ingresa un correo válido";
          isValid = false;
        }
        break;
      
      case "Ubicación":
        if (!formData.city?.trim()) {
          errors.city = "La ciudad es requerida";
          isValid = false;
        }
        if (!formData.country?.trim()) {
          errors.country = "El país es requerido";
          isValid = false;
        }
        break;
      
      case "Cambiar contraseña":
        if (!formData.password?.trim()) {
          errors.password = "Ingresa tu nueva contraseña";
          isValid = false;
        } else if (formData.password.length < 6) {
          errors.password = "La contraseña debe tener al menos 6 caracteres";
          isValid = false;
        }
        break;
    }

    console.log("Validación:", formData);
    setErrorMsg(errors);
    return isValid;
  }

  async function update(title: string) {
    setIsLoading(true);
    try {
      const isValid = validateInputs(title);
      console.log("¿Validación exitosa?", isValid);
  
      if (isValid) {
        if (title === "Cambiar contraseña") {
          
          const { error } = await supabase.auth.updateUser({
            password: formData.password as string,
          });
  
          if (error) {
            setErrorMsg({ password: error.message });
            return false;
          }
  
          console.log("Contraseña actualizada exitosamente en Supabase");
  
    
          const updateBackendResponse = await updateUser({ password: formData.password });
          if (!updateBackendResponse) {
            setErrorMsg({ password: "No se pudo actualizar la contraseña en el backend" });
            return false;
          }
  
          console.log("Contraseña actualizada exitosamente en el backend");
          return true;
        } else {
          const dataToUpdate: Partial<FormDataProps> = {};
          switch (title) {
            case "Nombre":
              dataToUpdate.name = formData.name;
              break;
            case "Correo":
              dataToUpdate.email = formData.email;
              break;
            case "Ubicación":
              dataToUpdate.city = formData.city;
              dataToUpdate.country = formData.country;
              break;
          }
  
          const res = await updateUser(dataToUpdate);
          console.log("Actualización exitosa:", res.data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }
  

  return { formData, errorMsg, handleInput, update, isLoading };
}
