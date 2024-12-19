import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "@/hooks/auth/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor="#AEEFFF"/>
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="sign-in" options={{ animation: "fade" }} />
      </Stack>
    </AuthProvider>
  );
}
