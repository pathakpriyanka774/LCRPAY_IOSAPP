import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAppStore } from "../zustand/Store";
import { BASE_URL } from "../utils/config";

const CirclePopup = ({ visible, onClose, onSelectCircle, selectedOperator }) => {
  const [circles, setCircles] = useState([]);

  const { setSelectedOperator } = useAppStore();

  const handleOperatorCircle = (item) => {
    onSelectCircle({
      circleName: item.CircleName,
      circleId: item.CircleID,
    });

    setSelectedOperator({
      operator: selectedOperator,
      circle: item.CircleName,
    });
  };

  const fetchCircleCode = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error("Token is missing!");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(
        `${BASE_URL}/recharge/circlecode/`,
        { headers }
      );
      console.log(response.data.data);
      if (response.status === 200) {
        setCircles(response.data.data);
      } else {
        Alert.alert("Error", "Something went wrong!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 404) {
          Alert.alert("Error", "Requested resource not found (404)");
        }
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    }
  };

  useEffect(() => {
    fetchCircleCode();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Top Bar with Title & Close Icon */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Select Your Circle</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={circles}
            keyExtractor={(item) => String(item.CircleID)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.circleItem}
                onPress={() => handleOperatorCircle(item)}
              >
                <Text style={styles.circleText}>{item.CircleName}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  circleItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  circleText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});

export default CirclePopup;
