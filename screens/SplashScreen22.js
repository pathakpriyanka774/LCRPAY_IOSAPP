import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Theme from "../components/Theme";

const SplashScreen22 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoShadowContainer}>
        <Image source={require("../assets/Undraww1.png")} style={styles.logo} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Send Money with Ease!</Text>
        <Text style={styles.description}>
          Fast & Safe Transactions,{"\n"}UPI, Net Banking & More,{"\n"} 100%
          Secure & Reliable
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SplashScreen3")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoShadowContainer: {
    position: "absolute",
    top: "5%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  textContainer: {
    position: "absolute",
    top: "45%",
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  description: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "5%",
    width: "80%",
    alignItems: "center",
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    shadowColor: "#ff6f61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: Theme.colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SplashScreen22;
