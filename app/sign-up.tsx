import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRegisterForm } from "@/hooks/form/useRegisterForm";

const RegisterScreen = () => {
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    errorMsg,
    isLoading,
    handleInput,
    register,
  } = useRegisterForm();

  const router = useRouter();

  const navigateToSignIn = () => {
    router.navigate("/sign-in");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Pata <AntDesign name="heart" size={24} color="pink" />
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@example.com"
            placeholderTextColor="#A0A0A0"
            value={formData.email}
            onChangeText={(text) => handleInput("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Enter your email"
          />
          {errorMsg.email ? (
            <Text style={styles.errorText}>{errorMsg.email}</Text>
          ) : null}

          <Text style={styles.labelInput}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="fulano mengano"
            placeholderTextColor="#A0A0A0"
            value={formData.userName}
            onChangeText={(text) => handleInput("userName", text)}
            autoCapitalize="none"
            accessibilityLabel="Enter your name"
          />
          {errorMsg.userName ? (
            <Text style={styles.errorText}>{errorMsg.userName}</Text>
          ) : null}

          <Text style={styles.labelInput}>Ciudad</Text>
          <TextInput
            style={styles.input}
            placeholder="ciudad"
            placeholderTextColor="#A0A0A0"
            value={formData.city}
            onChangeText={(text) => handleInput("city", text)}
            autoCapitalize="none"
            accessibilityLabel="Enter your city"
          />
          {errorMsg.city ? (
            <Text style={styles.errorText}>{errorMsg.city}</Text>
          ) : null}

          <Text style={styles.labelInput}>Pais</Text>
          <TextInput
            style={styles.input}
            placeholder="Pais"
            placeholderTextColor="#A0A0A0"
            value={formData.country}
            onChangeText={(text) => handleInput("country", text)}
            autoCapitalize="none"
            accessibilityLabel="Enter your country"
          />
          {errorMsg.country ? (
            <Text style={styles.errorText}>{errorMsg.country}</Text>
          ) : null}

          <Text style={styles.labelInput}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Your password"
              placeholderTextColor="#A0A0A0"
              value={formData.password}
              onChangeText={(text) => handleInput("password", text)}
              secureTextEntry={!showPassword}
              accessibilityLabel="Enter your password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <FontAwesome6
                name={showPassword ? "eye-slash" : "eye"}
                size={24}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {errorMsg.password ? (
            <Text style={styles.errorText}>{errorMsg.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={() => {
            setFormData((prev) => ({ ...prev, authMethod: "local" }));
            register();
          }}
          disabled={isLoading}
          accessibilityLabel="Crear"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Crear</Text>
          )}
        </TouchableOpacity>

        <View style={styles.lineContent}>
          <View style={styles.line} />
          <View>
            <Text style={styles.lineText}>Or</Text>
          </View>
          <View style={styles.line} />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>
            Ya tienes una cuenta?{" "}
            <Text onPress={navigateToSignIn} style={styles.signUpLink}>
              Entrar
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AEEFFF",
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF9AA2", // Soft pink for the logo
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelInput: {
    color: "#4A4A4A",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B5EAD7", // Mint green border
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
  },
  button: {
    backgroundColor: "#FF9AA2", // Soft pink button
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#4A4A4A",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "right",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 10,
  },
  lineContent: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#B5EAD7", // Mint green line
  },
  lineText: {
    width: 50,
    textAlign: "center",
    color: "#4A4A4A",
  },
  signUpContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#4A4A4A",
  },
  signUpLink: {
    color: "#FF9AA2", // Soft pink for the sign-up link
    fontWeight: "bold",
  },
});

export default RegisterScreen;
