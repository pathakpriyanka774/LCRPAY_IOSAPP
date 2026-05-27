import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginSignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const predefinedPhoneNumber = "+11";
  const predefinedEmail = "a";

  const handleSendOTP = () => {
    if (phoneNumber === predefinedPhoneNumber || email === predefinedEmail) {
      navigation.navigate("OTPScreen", { phoneNumber, email });
    } else {
      Alert.alert("Error", "Phone number or email is incorrect.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.content}>
        <Text style={styles.subtitle}>
          Just need phone number or email to login or create a new account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="+8882201101"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Text style={styles.or}>or</Text>
        <TextInput
          style={styles.input}
          placeholder="ramaeralegal@gmail.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.terms}>
          By Login or Register, you accept the terms of use and our privacy
          policy.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.smsText}>Send code to SMS?</Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    width: "100%",
  },

  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  or: {
    color: "black",
    marginVertical: 5,
  },
  terms: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#5F259F",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  smsText: {
    color: "#5F259F",
    fontSize: 14,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
  },
});
