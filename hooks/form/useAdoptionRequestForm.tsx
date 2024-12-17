import { useState } from "react";
import { useSocket } from "../socket/SocketContext";

interface FormDataProps {
  petId: number | undefined;
  userId: number | undefined;
  description: string;
}

type ErrorProps = Partial<Record<keyof FormDataProps, string>>;

export function useAdoptionRequestForm() {
  const socket = useSocket();
  const [formData, setFormData] = useState<FormDataProps>({
    petId: undefined,
    userId: undefined,
    description: "",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleInput(
    name: keyof FormDataProps,
    value: string | number | undefined
  ) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs() {
    let isValid = true;
    const errors: ErrorProps = {};

    if (formData.description.trim() === "") {
      errors.description = "¿Por qué quieres adoptar a este animal?";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function register(data: FormDataProps) {
    setIsLoading(true);
    try {
      if (validateInputs() && socket) {
        console.log("Datos a enviar:", data);
        socket.emit("createAdoptionRequest", data, (response: any) => {
          console.log("Respuesta del servidor:", response);
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return { formData, errorMsg, handleInput, register, isLoading };
}
