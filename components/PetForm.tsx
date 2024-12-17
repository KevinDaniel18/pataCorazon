import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { usePetForm } from "@/hooks/form/usePetForm";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "@/api/supabase";

export function PetForm() {
  const { formData, errorMsg, handleInput, register, isLoading } = usePetForm();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);

  const resetForm = () => {
    handleInput('name', '');
    handleInput('breed', '');
    handleInput('age', 0);
    handleInput('size', '');
    handleInput('location', '');
    handleInput('description', '');
    handleInput('isVaccinated', true);
    handleInput('isSterilized', true);
    handleInput('imageUrl', '');
    setImageUri(null);
  };
  

  const handleImagePick = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return Alert.alert(
          "Permiso denegado",
          "No se puede acceder a la galería."
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("El usuario canceló la selección de medios.");
        return;
      }

      const media = result.assets[0];
      if (!media.uri) {
        throw new Error("No se pudo obtener la URI del archivo seleccionado.");
      }

      if (!result.canceled) {
        const image = result.assets[0];
        setImageUri(image.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al seleccionar la imagen.");
    }
  };

  const handleUploadImage = async () => {
    if (!imageUri) return;

    setUploading(true);

    try {
      const arrayBuffer = await fetch(imageUri).then((res) =>
        res.arrayBuffer()
      );
      const fileExt = imageUri.split(".").pop() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("adoptionPosts")
        .upload(path, arrayBuffer, {
          contentType: `image/${fileExt}`,
        });

      if (error) {
        throw new Error(`Error al subir la imagen: ${error.message}`);
      }

      console.log("Archivo subido:", data);

      const publicUrl = supabase.storage
        .from("adoptionPosts")
        .getPublicUrl(path).data.publicUrl;

      console.log("url obtenida", publicUrl);

      if (publicUrl) {
        handleInput("imageUrl", publicUrl);
        setImageUri(publicUrl);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.imageUrl && imageUri) {
      // Si la URL no está en formData, subimos la imagen primero
      await handleUploadImage();
    }
  };

  useEffect(() => {
    // Cuando la URL de la imagen esté disponible, procedemos con el registro
    if (formData.imageUrl) {
      register(); // Registramos solo cuando la URL esté en el estado
      Alert.alert("Éxito", "Animal registrado correctamente.");
    }
  }, [formData.imageUrl]);

  useEffect(() => {
    if (formData.imageUrl) {
      resetForm(); // Limpiar el formulario después de que los datos hayan sido registrados
    }
  }, [formData]); 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Mascota</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={formData.name}
          onChangeText={(value) => handleInput("name", value)}
        />
        {errorMsg.name && <Text style={styles.error}>{errorMsg.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Raza</Text>
        <TextInput
          style={styles.input}
          placeholder="Raza de la mascota"
          value={formData.breed}
          onChangeText={(value) => handleInput("breed", value)}
        />
        {errorMsg.breed && <Text style={styles.error}>{errorMsg.breed}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad de la mascota"
          keyboardType="numeric"
          value={String(formData.age)}
          onChangeText={(value) => handleInput("age", parseInt(value) || 0)}
        />
        {errorMsg.age && <Text style={styles.error}>{errorMsg.age}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tamaño</Text>
        <Picker
          selectedValue={formData.size}
          onValueChange={(value) => handleInput("size", value)}
          style={styles.picker}
        >
          <Picker.Item label="Pequeño" value="SMALL" />
          <Picker.Item label="Mediano" value="MEDIUM" />
          <Picker.Item label="Grande" value="LARGE" />
        </Picker>
        {errorMsg.size && <Text style={styles.error}>{errorMsg.size}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ubicación de la mascota"
          value={formData.location}
          onChangeText={(value) => handleInput("location", value)}
        />
        {errorMsg.location && (
          <Text style={styles.error}>{errorMsg.location}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción de la mascota"
          multiline
          value={formData.description}
          onChangeText={(value) => handleInput("description", value)}
        />
        {errorMsg.description && (
          <Text style={styles.error}>{errorMsg.description}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Estado de Vacunación</Text>
        <Picker
          selectedValue={formData.isVaccinated}
          onValueChange={(value) => handleInput("isVaccinated", value)}
          style={styles.picker}
        >
          <Picker.Item label="Vacunado" value={true} />
          <Picker.Item label="No vacunado" value={false} />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Estado de Esterilización</Text>
        <Picker
          selectedValue={formData.isSterilized}
          onValueChange={(value) => handleInput("isSterilized", value)}
          style={styles.picker}
        >
          <Picker.Item label="Esterilizado" value={true} />
          <Picker.Item label="No esterilizado" value={false} />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {errorMsg.imageUrl && (
        <Text style={styles.error}>{errorMsg.imageUrl}</Text>
      )}

      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (isUploading || isLoading) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isUploading || isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isUploading ? "Subiendo imagen..." : "Registrar mascota"}
        </Text>
      </TouchableOpacity>
      {/* <Button
        title={isUploading ? "Subiendo imagen..." : "Registrar mascota"}
        onPress={handleSubmit}
        disabled={isUploading || isLoading}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F8FF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B5EAD7",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#B5EAD7",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  imagePicker: {
    backgroundColor: "#FF9AA2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  error: {
    color: "#FF9AA2",
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#B5EAD7",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
