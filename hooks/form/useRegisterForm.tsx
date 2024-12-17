import { useRouter } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { useAuth } from "../auth/AuthContext";

interface FormDataProps {
  email: string;
  userName: string;
  password: string;
  city: string;
  country: string;
}
interface ErrorProps {
  email?: string;
  userName?: string;
  password?: string;
  city?: string;
  country?: string;
}

export function useRegisterForm() {
  const [formData, setFormData] = useState<FormDataProps>({
    email: "",
    userName: "",
    password: "",
    city: "",
    country: "",
  });
  const [errorMsg, setErrorMsg] = useState<ErrorProps>({});
  const [showPassword, setShowPassword] = useState(false);
  const { onRegister, onLogin, isLoading } = useAuth();

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

    if (formData.userName.trim() === "") {
      errors.userName = "El nombre es requerido";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }

    if (formData.city.trim() === "") {
      errors.city = "La ciudad es requerida";
      isValid = false;
    }

    if (formData.country.trim() === "") {
      errors.country = "El pais es requerido";
      isValid = false;
    }

    setErrorMsg(errors);
    return isValid;
  }

  async function register() {
    if (validateInputs()) {
      console.log("Datos ingresados:", {
        email: formData.email,
        name: formData.userName,
        password: formData.password,
        city: formData.city,
        country: formData.country,
      });

      const res = await onRegister!(
        formData.email,
        formData.userName,
        formData.password,
        formData.city,
        formData.country
      );

      if (res && res.error) {
        showToast(res.msg);
      } else {
        router.navigate("/sign-in");
      }
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
    register,
  };
}
