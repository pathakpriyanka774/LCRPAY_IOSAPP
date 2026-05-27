import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";

const TopUp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.moreSectionContainer}>
        <View style={styles.moreSection}>
          <Text style={styles.sectionTitle}>More Services</Text>
          <View style={styles.moreOptions}>
            <TouchableOpacity
              style={styles.moreOption}
              onPress={() => navigation.navigate("Membership")}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="wallet-membership"
                  size={24}
                  color="#e436ff"
                />
              </View>
              <Text style={styles.moreOptionText}>Prime{"\n"}Membership</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreOption}
              onPress={() => navigation.navigate("Network")}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="join-inner" size={24} color="#51ff36" />
              </View>
              <Text style={styles.moreOptionText}>Other Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moreOption}
              onPress={() => navigation.navigate("Income")}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="currency-rupee"
                  size={24}
                  color="#3651ff"
                />
              </View>
              <Text style={styles.moreOptionText}>Blud Club</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    // backgroundColor: "green",
  },
  moreSectionContainer: {
    backgroundColor: Theme.colors.secondary,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: "95%",
    alignSelf: "center",
  },
  moreSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // marginBottom: 10,
    color: "black",
    textAlign: "center",
  },
  moreOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  moreOption: {
    alignItems: "center",
    // marginVertical: 10,
  },
  moreOptionText: {
    color: "green",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  iconContainer: {
    backgroundColor: Theme.colors.secondary,
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#006400",
    // textAlign: "center",
    textAlign: "left",
    paddingLeft: 15,
  },
});

export default TopUp;
