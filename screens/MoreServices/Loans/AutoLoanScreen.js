import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getLoanById } from "../../../config/loanCatlog";
import LoanTermsList from "../../../components/Loans/LoanTermList";
import styles from "./loanScreenStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../utils/config";

const AutoLoanScreen = () => {
  const loanData = getLoanById("auto-loan");
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleValue, setVehicleValue] = useState("");
  const [emisPaid, setEmisPaid] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>Auto Loan configuration unavailable.</Text>
      </View>
    );
  }

  /* ------------------ Currency Formatting ------------------ */
  const formatCurrencyInput = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /* ------------------ Render Helpers ------------------ */
  const renderTextField = (label, value, setter, { keyboardType = "default", placeholder } = {}) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        value={value}
        onChangeText={setter}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderPickerField = (label, value, setter, options) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={value} onValueChange={setter} style={styles.picker}>
          <Picker.Item label={`Select ${label}`} value="" color="#999" />
          {options.map((o) => (
            <Picker.Item key={o} label={o} value={o} />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderCurrencyField = (label, value, setter) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={[styles.currencySymbol, { color: loanData.color }]}>₹</Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#999"
          value={value}
          onChangeText={(t) => setter(formatCurrencyInput(t))}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  /* ------------------ Form Data ------------------ */
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      vehicle_type: vehicleType,
      vehicle_value: vehicleValue,
      emis_paid: emisPaid,
    }),
    [fullName, email, phoneNumber, vehicleType, vehicleValue, emisPaid]
  );

  const requiredFields = ["full_name", "email", "phone_number", "vehicle_type", "vehicle_value", "emis_paid"];

  const currencyFields = ["vehicle_value"];

  const isFormValid = useMemo(() => {
    return requiredFields.every((key) => {
      const value = formValues[key];
      if (!value) return false;

      if (currencyFields.includes(key)) {
        const numeric = parseFloat(value.replace(/,/g, ""));
        return !isNaN(numeric) && numeric > 0;
      }

      return value.toString().trim().length > 0;
    });
  }, [formValues]);

  /* ------------------ Submit Handler ------------------ */
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        vehicle_type: vehicleType,
        vehicle_value: vehicleValue.replace(/,/g, ""),
        emis_paid: emisPaid,
      };

      console.log(payload)

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(`${BASE_URL}/apply/auto-loan`, payload, { headers });

      setLoading(false);
      if (res?.data?.status) navigation.navigate("SuccessScreen");
    } catch (error) {
      console.log("Auto Loan Error:", error?.response?.data || error.message);
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  const quickStats = [
    { label: "Finance Type", value: "New & Used Vehicles" },
    { label: "Max LTV", value: "Up to 100%" },
    { label: "BT Eligibility", value: "150% - 190%" },
    { label: "Turnaround", value: "Within 48 hours" },
  ];

  const highlights = [
    "Financing available for cars, bikes, trucks & commercial vehicles.",
    "Supports balance transfer & refinance options.",
    "Quick approval timelines & instant eligibility checks.",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: `${loanData.color}15` }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${loanData.color}30` }]}>
            <MaterialCommunityIcons name={loanData.icon} size={42} color={loanData.color} />
          </View>
          <Text style={styles.headerTitle}>{loanData.name}</Text>
          <Text style={styles.headerDescription}>{loanData.description}</Text>
          <Text style={styles.headerSubtext}>New Car • Used Car • Two-wheelers • Commercial Vehicles</Text>
        </View>

        {/* QUICK STATS */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="car-multiple" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Vehicle Coverage</Text>
          </View>

          <View style={styles.quickInfoGrid}>
            {quickStats.map((item) => (
              <View key={item.label} style={styles.quickInfoPill}>
                <Text style={styles.quickInfoLabel}>{item.label}</Text>
                <Text style={styles.quickInfoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <LoanTermsList terms={loanData.terms} loanColor={loanData.color} />

        {/* FORM SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="file-document-edit" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Applicant Details</Text>
          </View>

          {renderTextField("Full Name", fullName, setFullName)}
          {renderTextField("Email", email, setEmail, { keyboardType: "email-address" })}
          {renderTextField("Phone Number", phoneNumber, setPhoneNumber, { keyboardType: "phone-pad" })}

          {renderPickerField("Vehicle Type", vehicleType, setVehicleType, [
             "New Car", "Used Car", "New Two Wheeler", "Used Two Wheeler"
          ])}

          {renderCurrencyField("Vehicle Value", vehicleValue, setVehicleValue)}

          {renderTextField("Existing EMIs Paid", emisPaid, setEmisPaid, {
            keyboardType: "numeric",
          })}

          {/* SUBMIT BUTTON */}
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isFormValid ? { backgroundColor: loanData.color } : styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                  <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* HIGHLIGHTS */}
        <View style={[styles.highlightCard, { backgroundColor: `${loanData.color}10` }]}>
          <Text style={styles.highlightTitle}>Why Auto Loan?</Text>
          {highlights.map((point) => (
            <View key={point} style={styles.highlightItem}>
              <View style={[styles.highlightDot, { backgroundColor: loanData.color }]} />
              <Text style={styles.highlightText}>{point}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AutoLoanScreen;
