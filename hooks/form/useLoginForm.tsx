import { useRouter } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useAuth } from "../auth/AuthContext";

interface FormDataProps {
  email: string;
  password: string;
}
interface ErrorProps {
  email?: string;
  password?: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [showPassword, setShowPassword] = useState(false);
  const { onLogin, onLoginSupabase, isLoading } = useAuth();

  const router = useRouter();

  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  if (!onLogin) {
    console.error("onLogin no está definido en el contexto.");
  }

  function handleInput(name: keyof FormDataProps, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg[name]) {
      setErrorMsg((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validateInputs() {
    let isValid = true;
    const errors: ErrorProps = {};

    if (formData.email.trim() === "") {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function login() {
    if (validateInputs()) {
      const res = await onLogin!(formData.email, formData.password);

      if (res && res.error) {
        showToast(res.msg);
        return;
      }

      const resSupabase = await onLoginSupabase!(
        formData.email,
        formData.password
      );

      if (resSupabase && resSupabase.error) {
        showToast(resSupabase.msg);
        return;
      }

      router.navigate("/");
    }
  }

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    errorMsg,
    isLoading,
    handleInput,
    login,
  };
}
