import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useLoginForm } from "@/hooks/form/useLoginForm";

const LoginScreen = () => {
  const {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    errorMsg,
    isLoading,
    handleInput,
    login,
  } = useLoginForm();

  const router = useRouter();

  const navigateToSignUp = () => {
    router.navigate("/sign-up");
  };

  return (
    <View
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          {/* <Text style={styles.logoText}>
            Pata <AntDesign name="heart" size={24} color="pink" />
          </Text> */}
          <Image
            style={{ height: 100, width: 100 }}
            source={require("@/assets/images/logoPata.png")}
          />
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

        <TouchableOpacity accessibilityLabel="Forgot your password?">
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={() => {
            setFormData((prev) => ({ ...prev, authMethod: "local" }));
            login();
          }}
          disabled={isLoading}
          accessibilityLabel="Log In"
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
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
            Don't have an account?{" "}
            <Text onPress={navigateToSignUp} style={styles.signUpLink}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#AEEFFF",
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
    //backgroundColor: "#FF9AA2", // Soft pink button
    backgroundColor: "#8EDCBF",
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

export default LoginScreen;
