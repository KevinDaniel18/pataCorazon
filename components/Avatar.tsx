import {
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/api/supabase";
import { removeProfilePicture, updateProfilePicture } from "@/api/endpoint";
import * as SecureStore from "expo-secure-store";
import UserImageOption from "./UserImageOption";

interface Props {
  size: number;
  url: string | null;
}

const Avatar = ({ url, size = 150 }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) {
      downloadImage(url);
    } else {
      setLoading(false);
    }
  }, [url]);

  async function downloadImage(path: string) {
    try {
      if (path.startsWith("http")) {
        setAvatarUrl(path);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from("avatars") //bucket
        .download(path);

      if (error) {
        console.error("Error details:", error);
        throw new Error(`Error downloading image: ${error.message}`);
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
        setLoading(false);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
        setLoading(false);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setModalVisible(false)
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Debes estar autenticado para subir una imagen");
      }

      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }
      console.log("Archivo subido:", data);
      const userId = await SecureStore.getItemAsync("USER_ID");
      const parseId = Number(userId);
      const publicUrl = supabase.storage.from("avatars").getPublicUrl(path)
        .data.publicUrl;

      if (publicUrl) {
        await updateProfilePicture(parseId, publicUrl);
        setAvatarUrl(publicUrl);
        Alert.alert("Foto de perfil subida con éxito");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  async function deleteAvatar() {
    try {
      setModalVisible(false)
      const { data: session } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Debes estar autenticado para eliminar la imagen");
      }

      if (!avatarUrl) {
        Alert.alert("No hay ninguna foto para eliminar.");
        return;
      }

      const path = avatarUrl.split("/").pop();
      const fullPath = `${path}`;

      console.log(avatarUrl);
      

      console.log("Ruta de la imagen a eliminar:", fullPath);

      const { error } = await supabase.storage
        .from("avatars")
        .remove([fullPath]);

      if (error) {
        throw error;
      }

      await removeProfilePicture();
      setAvatarUrl(null);

      Alert.alert("Foto de perfil eliminada con éxito.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error al eliminar la imagen:", error.message);
      }
    }
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={uploading}
      >
        <View style={[avatarSize, styles.avatar]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("@/assets/images/defaultProfile.jpg")
              }
              accessibilityLabel="Avatar"
              style={[avatarSize, styles.avatar, styles.image]}
            />
          )}
        </View>
      </TouchableOpacity>

      <View>
        <Text>{uploading ? "Subiendo..." : null}</Text>
      </View>

      <UserImageOption
        modalVisible={modalVisible || false}
        setModalVisible={() => setModalVisible(false)}
        uploadAvatar={uploadAvatar}
        deleteAvatar={deleteAvatar}
        avatarUrl={avatarUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },
});

export default Avatar;
