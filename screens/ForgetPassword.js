import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { userRegister } from "../src/features/userRegister/RegisterSlice";
import Theme from "../components/Theme";

const countryCodes = [{ label: "+91", value: "+91" }];

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSendCode = () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    if (!/^[6789]\d{9}$/.test(phoneNumber)) {
      setError("Phone number must start with 6, 7, 8, or 9");
      return;
    }

    setError(""); // Clear error if input is valid

    console.log(`Phone number: ${selectedCountryCode}${phoneNumber}`);
    dispatch(userRegister(phoneNumber));

    navigation.navigate("ForgotPasswordScreen", {
      phoneNumber: `${selectedCountryCode}${phoneNumber}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Verify your phone {"\n"}number with code
      </Text>
      <Text style={styles.description}>
        We'll send you a code. It helps keep your account secure
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.countryCodeContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedCountryCode(value)}
            items={countryCodes}
            value={selectedCountryCode}
            style={{
              inputIOS: pickerSelectStyles.inputIOS,
              inputAndroid: pickerSelectStyles.inputAndroid,
            }}
            useNativeAndroidPickerStyle={false}
            placeholder={{}}
          />
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          keyboardType="phone-pad"
          maxLength={10} // Restrict input to 10 digits
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text.replace(/[^0-9]/g, "")); // Allow only numbers
            setError(""); // Clear error when typing
          }}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Text
          style={styles.signInLink}
          onPress={() => navigation.navigate("SignInScreen")}
        >
          Sign in
        </Text>
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Verify Number</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Theme.colors.secondary },
  header: { fontSize: 26, fontWeight: "bold", marginTop: 30 },
  description: { marginBottom: 20, color: "#888" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  countryCodeContainer: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: Theme.colors.primary,
    paddingRight: 10,
  },
  phoneInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  signInText: { marginTop: 20, fontWeight: "bold" },
  signInLink: { color: Theme.colors.primary },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Theme.colors.secondary,
    textAlign: "center",
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30,
  },
});

export default ForgotPassword;
