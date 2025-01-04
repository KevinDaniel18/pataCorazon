import { addPetComment } from "@/api/endpoint";
import { useState } from "react";

interface FormDataProps {
  content: string;
  petId: number | undefined;
}

type ErrorProps = Partial<Record<keyof FormDataProps, string>>;

export function useCommentForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    content: "",
    petId: undefined,
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

    if (formData.content.trim() === "") {
      errors.content = "El comentario no puede estar vacío";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function postComment() {
    setIsLoading(true);
    try {
      if (validateInputs()) {
        console.log("datos a enviar", formData);
        
        const res = await addPetComment(formData);
        console.log("datos enviados", res.data);
        return res;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return { formData, errorMsg, handleInput, postComment, isLoading };
}
