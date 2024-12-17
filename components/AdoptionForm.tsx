import { useAdoptionRequestForm } from "@/hooks/form/useAdoptionRequestForm";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

interface AdoptionFormProps {
  petId: number;
  onClose: () => void;
}

export default function AdoptionForm({ petId, onClose }: AdoptionFormProps) {
  const { formData, errorMsg, handleInput, register, isLoading } =
    useAdoptionRequestForm();

  const handleSubmit = async () => {
    const userId = await SecureStore.getItemAsync("USER_ID");
    console.log("userId recuperado:", userId);

    if (!userId) {
      console.error("USER_ID no encontrado en SecureStore");
      return;
    }

    // Asegúrate de que petId y userId se agreguen correctamente en formData
    const updatedData = {
      ...formData, // Copia los datos existentes
      userId: Number(userId), // Asegúrate de que sea un número
      petId: petId, // Asigna petId
    };

    console.log("Datos antes de enviar:", updatedData); 

    await register(updatedData); 
    onClose(); 
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Solicitud de Adopción</Text>

      <TextInput
        style={styles.input}
        placeholder="¿Por qué quieres adoptar a este animal?"
        value={formData.description}
        onChangeText={(text) => handleInput("description", text)}
        multiline
      />
      {errorMsg.description && (
        <Text style={styles.error}>{errorMsg.description}</Text>
      )}

      <Button
        title={isLoading ? "Enviando..." : "Enviar"}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  error: { color: "red", marginBottom: 10 },
});
