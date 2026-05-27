import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";

const AddUpiScreen = () => {
  const [upiId, setUpiId] = useState("");
  const [isValidUpi, setIsValidUpi] = useState(false);
  const [nickname, setNickname] = useState("");
  const [registeredName, setRegisteredName] = useState("Aangan Homes");
  const [isEditable, setIsEditable] = useState(true);

  const validateUpi = () => {
    if (upiId.trim() !== "") {
      setIsValidUpi(true);
    } else {
      setIsValidUpi(false);
    }
  };

  const handleSaveEdit = () => {
    if (!isEditable) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add UPI ID</Text>

      <Text style={styles.infoText}>
        You can send or request money to the UPI ID of your contact. The name of
        the contact is returned on successful verification of the UPI ID.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Beneficiary UPI ID</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={upiId}
            onChangeText={setUpiId}
            editable={isEditable}
            onBlur={validateUpi}
            placeholder="Enter UPI ID"
          />
          {isValidUpi && (
            <MaterialIcons name="check-circle" size={20} color="green" />
          )}
        </View>
      </View>

      {isValidUpi && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Registered Name</Text>
            <Text style={styles.registeredName}>{registeredName}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nickname (optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter Nickname"
                value={nickname}
                onChangeText={setNickname}
                editable={isEditable}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
            <Text style={styles.saveButtonText}>
              {isEditable ? "SAVE" : "EDIT"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "Theme.colors.primary",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#5E17EB",
    paddingVertical: 5,
  },
  registeredName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddUpiScreen;
