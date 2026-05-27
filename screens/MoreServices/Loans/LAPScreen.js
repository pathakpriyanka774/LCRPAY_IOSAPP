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
import { BASE_URL } from "../../../utils/config";

const LAPScreen = ({ navigation }) => {
  const loanData = getLoanById("lap");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [incomeContinuity, setIncomeContinuity] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>LAP configuration unavailable.</Text>
      </View>
    );
  }

  /* Currency formatter */
  const formatCurrencyInput = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /* Render Helpers */
  const renderTextField = (label, value, setter, { keyboardType = "default", placeholder } = {}) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder || `Enter ${label}`}
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
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
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
          placeholder={`Enter ${label}`}
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={value}
          onChangeText={(t) => setter(formatCurrencyInput(t))}
        />
      </View>
    </View>
  );

  /* Form Values */
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      loan_amount: loanAmount,
      property_value: propertyValue,
      income_continuity: incomeContinuity,
      employment_status: employmentStatus, // Residential / Commercial / Industrial / Land
    }),
    [fullName, email, phoneNumber, loanAmount, propertyValue, incomeContinuity, employmentStatus]
  );

  /* Required Fields */
  const requiredFields = [
    "full_name",
    "email",
    "phone_number",
    "loan_amount",
    "property_value",
    "income_continuity",
    "employment_status",
  ];

  const currencyFields = ["loan_amount", "property_value"];

  const isFormValid = useMemo(() => {
    return requiredFields.every((key) => {
      const val = formValues[key];
      if (!val) return false;

      if (currencyFields.includes(key)) {
        const num = parseFloat(val.replace(/,/g, ""));
        return !isNaN(num) && num > 0;
      }

      return val.trim().length > 0;
    });
  }, [formValues]);

  /* Submit Handler */
  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");

      const payload = {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        loan_amount: Number(loanAmount.replace(/,/g, "")),
        property_value: Number(propertyValue.replace(/,/g, "")),
        income_continuity: incomeContinuity,
        employment_status: employmentStatus,
      };


      console.log(payload)


      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${BASE_URL}/apply/loan-against-property`,
        payload,
        { headers }
      );

      setLoading(false);

      console.log(res.data)

      if (res?.data?.status) {
        navigation.navigate("SuccessScreen");
      }
    } catch (err) {
      console.log("API ERROR:", err?.response?.data || err.message);
      setLoading(false);
    }
  };

  /* UI Blocks */
  const quickStats = [
    { label: "Minimum Loan", value: "₹10 Lakhs" },
    { label: "Residential LTV", value: "Up to 75%" },
    { label: "Commercial LTV", value: "Up to 65%" },
    { label: "Industrial LTV", value: "Up to 50%" },
  ];

  const highlights = [
    "Income continuity of 3 years considered.",
    "Residential, commercial & industrial properties accepted.",
    "Multiple co-applicants and family clubbing supported.",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: `${loanData.color}15` }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${loanData.color}30` }]}>
            <MaterialCommunityIcons name={loanData.icon} size={42} color={loanData.color} />
          </View>
          <Text style={styles.headerTitle}>{loanData.name}</Text>
          <Text style={styles.headerDescription}>{loanData.description}</Text>
          <Text style={styles.headerSubtext}>Flexi-Documentation | High LTV | Multiple Property Options</Text>
        </View>

        {/* SNAPSHOT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="home-city" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Property Snapshot</Text>
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

        {/* FORM */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="file-document-edit" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Application Details</Text>
          </View>

          {renderTextField("Full Name", fullName, setFullName)}
          {renderTextField("Email", email, setEmail, { keyboardType: "email-address" })}
          {renderTextField("Phone Number", phoneNumber, setPhoneNumber, { keyboardType: "phone-pad" })}

          {renderCurrencyField("Loan Amount", loanAmount, setLoanAmount)}

          {renderCurrencyField("Property Value", propertyValue, setPropertyValue)}

          {renderPickerField("Income Continuity", incomeContinuity, setIncomeContinuity, [
            "Stable",
            "Moderate",
            "Irregular",
          ])}

          {renderPickerField("Property Type", employmentStatus, setEmploymentStatus, [
            "Residential", "Commercial", "Industrial","Land"
          ])}

          {/* SUBMIT BUTTON */}
          <View style={styles.formActions}>
            <TouchableOpacity
              disabled={!isFormValid || loading}
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                isFormValid ? { backgroundColor: loanData.color } : styles.buttonDisabled,
              ]}
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
          <Text style={styles.highlightTitle}>Why choose LAP with us?</Text>

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

export default LAPScreen;
