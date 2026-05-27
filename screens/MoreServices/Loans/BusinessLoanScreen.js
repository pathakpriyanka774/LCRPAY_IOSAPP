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

const BusinessLoanScreen = ({ navigation }) => {
  const loanData = getLoanById("business-loan");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [annualTurnover, setAnnualTurnover] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [collateralValue, setCollateralValue] = useState("");
  const [businessContinuity, setBusinessContinuity] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>
          Business loan configuration unavailable.
        </Text>
      </View>
    );
  }

  /* Format Currency */
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
            <Picker.Item key={opt} value={opt} label={opt} />
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
          value={value}
          keyboardType="numeric"
          onChangeText={(t) => setter(formatCurrencyInput(t))}
        />
      </View>
    </View>
  );

  /* Form Data */
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      business_name: businessName,
      business_type: businessType,
      annual_turnover: annualTurnover,
      loan_amount: loanAmount,
      collateral_value: collateralValue,
      business_continuity: businessContinuity,
    }),
    [
      fullName,
      email,
      phoneNumber,
      businessName,
      businessType,
      annualTurnover,
      loanAmount,
      collateralValue,
      businessContinuity,
    ]
  );

  /* Required Fields */
  const requiredFields = [
    "full_name",
    "email",
    "phone_number",
    "business_name",
    "business_type",
    "annual_turnover",
    "loan_amount",
    "collateral_value",
    "business_continuity",
  ];

  const currencyFields = ["annual_turnover", "loan_amount", "collateral_value"];

  /* Validate */
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
        business_name: businessName,
        business_type: businessType,
        annual_turnover: Number(annualTurnover.replace(/,/g, "")),
        loan_amount: Number(loanAmount.replace(/,/g, "")),
        collateral_value: Number(collateralValue.replace(/,/g, "")),
        business_continuity: Number(businessContinuity.replace(/\D/g, "")),
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${BASE_URL}/apply/business-loan`,
        payload,
        { headers }
      );

      setLoading(false);

      if (res?.data?.status) {
        navigation.navigate("SuccessScreen");
      }
    } catch (err) {
      console.log("API ERROR:", err?.response?.data || err.message);
      setLoading(false);
    }
  };

  /* UI Elements */
  const quickStats = [
    { label: "Business Vintage", value: "18+ Months" },
    { label: "Turnover Range", value: "₹25L - ₹25Cr" },
    { label: "Funding Uses", value: "WC / Capex / OD" },
    { label: "Documentation", value: "Digital Bank + GST" },
  ];

  const highlights = [
    "Perfect for proprietorship, partnership, LLP, and Pvt Ltd firms.",
    "Covers unsecured loans, OD/CC enhancement & working capital.",
    "Cash-flow based analysis using GST + bank statements.",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: `${loanData.color}20` }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${loanData.color}35` }]}>
            <MaterialCommunityIcons name={loanData.icon} size={42} color={loanData.color} />
          </View>
          <Text style={styles.headerTitle}>{loanData.name}</Text>
          <Text style={styles.headerDescription}>{loanData.description}</Text>
          <Text style={styles.headerSubtext}>Unsecured | WC | OD/CC | GST Based</Text>
        </View>

        {/* SNAPSHOT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="briefcase-account" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Business Snapshot</Text>
          </View>

          <View style={styles.quickInfoGrid}>
            {quickStats.map((i) => (
              <View key={i.label} style={styles.quickInfoPill}>
                <Text style={styles.quickInfoLabel}>{i.label}</Text>
                <Text style={styles.quickInfoValue}>{i.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* TERMS */}
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
          {renderTextField("Business Name", businessName, setBusinessName)}

          {renderPickerField("Business Type", businessType, setBusinessType, [
            "Proprietorship",
            "Partnership",
            "Private Limited",
            "LLP",
            "Startup",
          ])}

          {renderCurrencyField("Annual Turnover", annualTurnover, setAnnualTurnover)}
          {renderCurrencyField("Loan Amount", loanAmount, setLoanAmount)}
          {renderCurrencyField("Collateral Value", collateralValue, setCollateralValue)}

          {renderPickerField("Business Continuity", businessContinuity, setBusinessContinuity, [
            "1 Year",
            "2 Years",
            "3 Years",
            "4 Years",
            "5+ Years",
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
          <Text style={styles.highlightTitle}>What You Get</Text>

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

export default BusinessLoanScreen;
