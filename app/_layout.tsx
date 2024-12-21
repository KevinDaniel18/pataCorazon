import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider } from "@/hooks/auth/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Layout() {
  return (
    <GestureHandlerRootView>
       <StatusBar translucent backgroundColor="transparent"/>
      <AuthProvider>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="sign-in" options={{ animation: "fade" }} />
          </Stack>
        </BottomSheetModalProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
