import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar
} from "react-native";
import successAni from "../../Animation/success.json";
import Theme from "../Theme";

const { width } = Dimensions.get("window");

export function SuccessScreen() {
  const navigation = useNavigation();
  const animation = useRef(null);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Lottie Animation */}
      <View style={styles.animationWrapper}>
        <LottieView
          ref={animation}
          source={successAni}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </View>

      {/* Text Content */}
      <Text style={styles.title}>Application Submitted Successfully!</Text>
      <Text style={styles.subtitle}>
        We will get back to you shortly.
      </Text>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        activeOpacity={0.9}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  animationWrapper: {
    marginTop: -60,
    alignItems: "center",
    justifyContent: "center",
  },

  animation: {
    width: width * 0.45,
    height: width * 0.45,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 6,
    lineHeight: 28,
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
    lineHeight: 22,
  },

  button: {
    width: "100%",
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 50,

    // subtle shadow for premium feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
