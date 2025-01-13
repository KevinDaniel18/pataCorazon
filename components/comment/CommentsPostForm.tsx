import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useCommentForm } from "@/hooks/form/useCommentForm";
import { CommentsPostFormProps } from "@/types/comments";

export default function CommentsPostForm({
  petId,
  onCommentPosted,
}: CommentsPostFormProps) {
  const { formData, errorMsg, handleInput, postComment, isLoading } =
    useCommentForm();

  useEffect(() => {
    handleInput("petId", petId);
  }, [petId]);

  const send = async () => {
    const newComment = await postComment();

    handleInput("content", "");
    if (newComment?.data?.user) {
      onCommentPosted(newComment?.data);
    } else {
      console.error("El comentario no tiene datos del usuario");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un comentario..."
          placeholderTextColor="#999"
          value={formData.content}
          onChangeText={(text) => handleInput("content", text)}
          multiline={true}
          maxLength={500}
        />

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={send}
          disabled={!formData.content.trim()|| isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <AntDesign name="arrowup" size={24} color={!formData.content.trim() ? "gray" :"#8EDCBF"} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  iconContainer: {
    padding: 5,
  },
});
