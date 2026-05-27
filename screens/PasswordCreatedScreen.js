import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";

const PasswordCreatedScreen = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <Image
          source={require("../assets/Tickk.png")}
          style={styles.iconImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Password Changed</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignInScreen")}
      >
        <Text style={styles.buttonText}>Back To Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkContainer: {
    marginTop: "20%",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },
  textContainer: {
    marginTop: "5%",
    marginBottom: "5%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.colors.secondary,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    marginBottom: "5%",
  },
  buttonText: {
    color: "green",
    fontSize: 18,
    textAlign: "center",
  },
});

export default PasswordCreatedScreen;
