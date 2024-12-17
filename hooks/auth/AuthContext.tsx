import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import { supabase } from "@/api/supabase";
import { login, register } from "@/api/endpoint";

interface AuthProps {
  authState?: { token: string | null; authenticated?: boolean | null };
  isLoading: boolean;
  onRegister?: (
    email: string,
    name: string,
    password: string,
    city: string,
    country: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLoginSupabase?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({
  isLoading: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: null });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuthState = async () => {
      try {
        const token = await SecureStore.getItemAsync("TOKEN_KEY");
        console.log("token", token);

        const supabaseAccessToken = await SecureStore.getItemAsync(
          "ACCESS_TOKEN"
        );

        const supabaseRefreshToken = await SecureStore.getItemAsync(
          "REFRESH_TOKEN"
        );

        if (token) {
          setAuthState({
            token: token,
            authenticated: true,
          });

          await supabase.auth.setSession({
            access_token: supabaseAccessToken!,
            refresh_token: supabaseRefreshToken!,
          });
        } else {
          setAuthState({
            token: null,
            authenticated: false,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuthState();
  }, [authState.token]);

  async function handleRegister(
    email: string,
    name: string,
    password: string,
    city: string,
    country: string
  ) {
    setIsLoading(true);
    try {
      const res = await register({ email, name, password, city, country });
      const { error } = await supabase.auth.signUp({
        email,
        password: password,
      });
      if (error) {
        console.error("error autenticando en supabase", error.message);
      }
      return { userId: res.data.id };
    } catch (error: any) {
      if (new AxiosError(error) && error.response) {
        return {
          error: true,
          msg: error.response.data.message,
          statusCode: error.response.status,
        };
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      if (!res || !res.data) {
        throw new Error("No se recibió una respuesta válida del servidor.");
      }
      setAuthState({ token: res.data.accessToken, authenticated: true });
      const accessToken = res.data.accessToken;

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

      await SecureStore.setItemAsync("TOKEN_KEY", accessToken);
      await SecureStore.setItemAsync("USER_ID", JSON.stringify(res.data.id));
      console.log("login with", { email: res.data.email });

      return res.data;
    } catch (error: any) {
      if (new AxiosError(error) && error.response) {
        return {
          error: true,
          msg: error.response.data.message,
          statusCode: error.response.status,
        };
      } else {
        console.log(error);
        return { error: true, msg: "Ocurrió un error desconocido" };
      }
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithSupabase = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error al iniciar sesión con Supabase:", error.message);
      return { error: true, msg: "Credenciales invalidas" };
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (!accessToken || !refreshToken) {
      console.error("Error: No se recibieron tokens válidos.");
      return { error: true, msg: "Credenciales inválidas" };
    }

    await SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
    await SecureStore.setItemAsync("REFRESH_TOKEN", refreshToken);

    return { error: false };
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await SecureStore.deleteItemAsync("TOKEN_KEY");
    await SecureStore.deleteItemAsync("USER_ID");
    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
    });
    setIsLoading(false);
  };

  const value = {
    onRegister: handleRegister,
    onLogin: handleLogin,
    onLoginSupabase: loginWithSupabase,
    onLogout: handleLogout,
    authState,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
