import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoanTermsList = ({ terms, loanColor }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons
          name="shield-check"
          size={22}
          color="#5F259F"
        />
        <Text style={styles.title}>Key Features & Benefits</Text>
      </View>
      
      {terms.map((term, idx) => (
        <View key={idx} style={styles.termItem}>
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={loanColor}
          />
          <Text style={styles.termText}>{term}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 10,
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  termText: {
    fontSize: 14,
    color: "#34495E",
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
});

export default LoanTermsList;
