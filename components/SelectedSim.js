import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";

const VerifyMobileNumber = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSim, setSelectedSim] = useState(null);

  const handleSimSelection = (simNumber) => {
    setSelectedSim(simNumber);
    setModalVisible(true);
  };

  const proceedToRegister = () => {
    setModalVisible(false);
    navigation.navigate("Register"); // Navigate to the Register screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/Mob.png")} style={styles.appIcon} />
        <Text style={styles.title}>Verify mobile number</Text>
      </View>

      <View style={styles.simContainer}>
        <Text style={styles.simSelectText}>
          Please select the SIM registered with your bank.
        </Text>

        <TouchableOpacity
          style={styles.simCard}
          onPress={() => handleSimSelection("SIM 1")}
        >
          <Image source={require("../assets/sim.jpg")} style={styles.simLogo} />
          <View style={styles.carrierContainer}>
            <Text style={styles.carrierName}>Airtel</Text>
          </View>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={selectedSim === "SIM 1" ? Theme.colors.primary : "#888"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.simCard}
          onPress={() => handleSimSelection("SIM 2")}
        >
          <Image source={require("../assets/sim.jpg")} style={styles.simLogo} />
          <View style={styles.carrierContainer}>
            <Text style={styles.carrierName}>Vi India</Text>
          </View>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={selectedSim === "SIM 2" ? Theme.colors.primary : "#888"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm SIM</Text>
            <Text style={styles.modalText}>
              You have selected {selectedSim} -{" "}
              {selectedSim === "SIM 1" ? "Airtel" : "Vi India"}. Do you want to
              proceed?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText1}>Change SIM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.proceedButton]}
                onPress={proceedToRegister}
              >
                <Text style={styles.modalButtonText}>PROCEED</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
  },
  header: {
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  appIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  simContainer: {
    paddingHorizontal: 20,
  },
  simSelectText: {
    fontSize: 16,
    color: Theme.colors.primary,
    marginBottom: 16,
  },
  simCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  simLogo: {
    width: 50,
    height: 35,
    resizeMode: "contain",
    borderRadius: 35,
    overflow: "hidden",
  },
  carrierContainer: {
    flex: 1,
    marginLeft: 12,
  },
  carrierName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: Theme.colors.secondary,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    width: "40%",
    alignItems: "center",
  },
  proceedButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: "#007AFF",
  },
  modalButtonText: {
    fontSize: 16,
    color: Theme.colors.secondary,
  },
  modalButtonText1: {
    fontSize: 16,
    color: "black",
  },
});

export default VerifyMobileNumber;
