import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Theme from "../../../components/Theme";

const RateUs = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Us</Text>

      {/* Card with Box Shadow */}
      <View style={styles.card}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/Images/rate.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Enjoy #5F259FBus?</Text>
            <Text style={styles.subText}>
              Share your experience with us and spread the word.
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.rateButton}>
          <Text style={styles.rateButtonText}>Rate Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    marginBottom: 20, // Adjust bottom margin to avoid layout issues
  },

  // Title style for Rate Us text
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },

  // Card Container with Box Shadow
  card: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 12,
    padding: 10,
    width: "100%",
    maxWidth: 400,
    marginBottom: 10,
    // Box shadow for card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5, // For Android shadow support
  },

  // Content section styling inside the card
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Image styling
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    resizeMode: "contain",
  },

  // Text container styling
  textContainer: {
    flex: 1,
  },

  // Heading text under image
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },

  // Subtext under the heading
  subText: {
    fontSize: 14,
    color: "#666",
  },

  // Rate Now Button Styling
  rateButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  rateButtonText: {
    color: Theme.colors.secondary,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RateUs;
