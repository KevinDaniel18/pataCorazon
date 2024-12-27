import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

type UpdateUserFormProps = {
  label: string;
  value: string | undefined;
  onChange: (text: string) => void;
  errorMsg?: string;
  placeholder?: string;
  field: string;
  secureTextEntry: boolean
};

export default function UpdateUserForm({
  label,
  value,
  onChange,
  errorMsg,
  placeholder,
  field,
  secureTextEntry
}: UpdateUserFormProps) {
  return (
    <View style={styles.inputContainer}>
      {field === "password" ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        <Text style={styles.label}>Actualiza tu {label}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder || ""}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});
