import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";

const KycVerificationComplited = () => {
  const navigation = useNavigation();

  // const handleContinue = () => {
  //   navigation.navigate('HomeScreen');
  // };

  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <Image
          source={require("../assets/Tickk.png")}
          style={styles.iconImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Verification completed{"\n"}Your Email has been verified.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={styles.buttonText}>Continue To Home</Text>
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
    color: "#fff",
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
    color: Theme.colors.primary,
    fontSize: 18,
    textAlign: "center",
  },
});

export default KycVerificationComplited;
