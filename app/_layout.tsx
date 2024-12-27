import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "@/hooks/auth/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" />
      <GestureHandlerRootView>
        <AuthProvider>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="sign-in"
                options={{ animation: "fade", headerShown: false }}
              />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
              <Stack.Screen
                name="notifications/allow-notifications"
                options={{ title: "Notificaciones" }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
