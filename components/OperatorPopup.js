import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CirclePopup from "./CirclePopup";

const logoMap = {
  "Airtel Prepaid": require("../assets/airtel.png"),
  "BSNL Prepaid": require("../assets/bsnl2.png"),
  "Jio Prepaid": require("../assets/jio.png"),
  "Vi Prepaid": require("../assets/vi.png"),
};

// Fallback operator IDs when API does not provide them
const operatorIdMap = {
  "Airtel Prepaid": 650,
  "BSNL Prepaid": 651,
  "Jio Prepaid": 652,
  "Vi Prepaid": 653,
};

const OperatorPopup = ({ visible, onClose, onSelectOperator }) => {
  const [circlePopupVisible, setCirclePopupVisible] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null); // {name, id, logo}
  const [operators, setOperators] = useState([
    { name: "Airtel Prepaid", id: operatorIdMap["Airtel Prepaid"], logo: logoMap["Airtel Prepaid"] },
    { name: "BSNL Prepaid", id: operatorIdMap["BSNL Prepaid"], logo: logoMap["BSNL Prepaid"] },
    { name: "Jio Prepaid", id: operatorIdMap["Jio Prepaid"], logo: logoMap["Jio Prepaid"] },
    { name: "Vi Prepaid", id: operatorIdMap["Vi Prepaid"], logo: logoMap["Vi Prepaid"] },
  ]);

  useEffect(() => {
    if (!visible) return;
    // Fetch operator list with IDs from Freecharge catalog
    (async () => {
      try {
        const resp = await axios.get(
          "https://www.freecharge.in/api/catalog/nosession/sub-category/SHORT_CODE/MR"
        );
        const billers = Array.isArray(resp?.data?.data?.billers)
          ? resp.data.data.billers
          : [];
        const mapped = billers.map((b) => ({
          name: b.name,
          id: b.operatorMasterId ?? operatorIdMap[b.name] ?? null,
          logo: logoMap[b.name] || require("../assets/jio.png"),
        }));
        setOperators([
          { name: "Airtel Prepaid", id: operatorIdMap["Airtel Prepaid"], logo: logoMap["Airtel Prepaid"] },
          { name: "BSNL Prepaid", id: operatorIdMap["BSNL Prepaid"], logo: logoMap["BSNL Prepaid"] },
          { name: "Jio Prepaid", id: operatorIdMap["Jio Prepaid"], logo: logoMap["Jio Prepaid"] },
          { name: "Vi Prepaid", id: operatorIdMap["Vi Prepaid"], logo: logoMap["Vi Prepaid"] },
        ]);
      } catch {
        setOperators([
          { name: "Airtel Prepaid", id: operatorIdMap["Airtel Prepaid"], logo: logoMap["Airtel Prepaid"] },
          { name: "BSNL Prepaid", id: operatorIdMap["BSNL Prepaid"], logo: logoMap["BSNL Prepaid"] },
          { name: "Jio Prepaid", id: operatorIdMap["Jio Prepaid"], logo: logoMap["Jio Prepaid"] },
          { name: "Vi Prepaid", id: operatorIdMap["Vi Prepaid"], logo: logoMap["Vi Prepaid"] },
        ]);
      }
    })();
  }, [visible]);

  const handleOperatorSelect = (operator) => {
    const withId = {
      ...operator,
      id: operator?.id ?? operatorIdMap[operator?.name] ?? null,
      logo: operator?.logo || logoMap[operator?.name] || require("../assets/jio.png"),
    };
    setSelectedOperator(withId);
    onClose();
    setTimeout(() => {
      setCirclePopupVisible(true);
    }, 150);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Select Your Operator</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={operators}
              keyExtractor={(item) => item.name}
              contentContainerStyle={{ paddingBottom: 30 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.operatorItem}
                  onPress={() => handleOperatorSelect(item)}
                >
                  <Image source={item.logo} style={styles.operatorLogo} />
                  <Text style={styles.operatorText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <CirclePopup
        visible={circlePopupVisible}
        onClose={() => setCirclePopupVisible(false)}
        onSelectCircle={(circle) => {
          setCirclePopupVisible(false);
          if (selectedOperator) {
            onSelectOperator({
              operator: selectedOperator.name,
              operatorId: selectedOperator.id ?? operatorIdMap[selectedOperator.name] ?? null,
              operatorLogo: selectedOperator.logo,
              circle: circle.circleName,
              circleId: circle.circleId,
            });
          }
        }}
        selectedOperator={selectedOperator?.name || ""}
      />
    </>
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
  operatorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  operatorLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  operatorText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
});

export default OperatorPopup;
