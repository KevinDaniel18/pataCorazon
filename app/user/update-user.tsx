import UpdateUserForm from "@/components/UpdateUserForm";
import {
  ErrorProps,
  FormDataProps,
  useUpdateUserForm,
} from "@/hooks/form/useUpdateUserForm";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UpdateUser() {
  const { title } = useLocalSearchParams() as { title: string };
  const { formData, handleInput, errorMsg, isLoading, update } = useUpdateUserForm();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title });
  }, [title]);

  const getField = () => {
    switch (title) {
      case "Nombre":
        return [{ value: formData.name || undefined, field: "name" }];
      case "Correo":
        return [{ value: formData.email || undefined, field: "email" }];
      case "Ubicación":
        return [
          { value: formData.city || undefined, field: "city" },
          { value: formData.country || undefined, field: "country" },
        ];
      case "Cambiar contraseña":
        return [{ value: formData.password || undefined, field: "password" }];
      default:
        return [];
    }
  };

  const fields = getField();

  const handleUpdate = async () => {
    const success = await update(title);
    if (success) {
      // Opcional: navegar hacia atrás o mostrar un mensaje de éxito
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {fields.map(({ value, field }) => (
        <UpdateUserForm
          key={field}
          label={
            field === "city"
              ? "Ciudad"
              : field === "country"
              ? "País"
              : field === "password"
              ? "Cambiar contraseña"
              : title.toLowerCase()
          }
          value={value}
          onChange={(text) => handleInput(field as keyof FormDataProps, text)}
          errorMsg={errorMsg[field as keyof ErrorProps]}
          field={field}
          secureTextEntry={field === "password"}
        />
      ))}

      <TouchableOpacity
        onPress={handleUpdate}
        style={styles.buttom}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text>Actualizar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  buttom: {
    padding: 15,
    backgroundColor: "#8EDCBF",
    alignSelf: "center",
    borderRadius: 20,
  },
});
