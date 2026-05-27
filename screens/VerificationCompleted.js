import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../utils/config";

const VerificationCompleted = () => {
  const navigation = useNavigation();
  const [isRefered, setIsReferd] = useState(false);

  const isAlreaadyReferal = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      console.log(token);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const referExist = await axios.get(
        `${BASE_URL}/register/does_intro_already_exists`,
        { headers }
      );
      console.log(`referal code --->`, referExist.data);
      setIsReferd(referExist.data.introducer_status === 0);

      if (referExist.data.introducer_status == 0) {
        navigation.navigate("RefferalCode");
      } else if (referExist.data.introducer_status === 1) {
        navigation.navigate("HomeScreen");
      }
    } catch (error) {
      console.log(error);
    }
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
        <Text style={styles.title}>
          Verification completed{"\n"}Your phone number has been verified.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={isAlreaadyReferal}>
        <Text style={styles.buttonText}>Continue</Text>
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
    backgroundColor: Theme.colors.secondary,
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

export default VerificationCompleted;

// // this is previous code
