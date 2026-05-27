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

const MachineryLoanScreen = ({ navigation }) => {
  const loanData = getLoanById("machinery-loan");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [machineType, setMachineType] = useState("");
  const [machineCost, setMachineCost] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [businessContinuity, setBusinessContinuity] = useState("");
  const [coApplicant, setCoApplicant] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>Machinery loan configuration unavailable.</Text>
      </View>
    );
  }

  /* Format currency "1,00,000" */
  const formatCurrencyInput = (value) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    if (!digitsOnly) return "";
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /* TEXT INPUT FIELD */
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

  /* PICKER FIELD */
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

  /* CURRENCY FIELD */
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

  /* FORM VALUES */
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      business_name: businessName,
      machine_type: machineType,
      machine_cost: machineCost,
      loan_amount: loanAmount,
      business_continuity: businessContinuity,
      co_applicant: coApplicant,
    }),
    [
      fullName,
      email,
      phoneNumber,
      businessName,
      machineType,
      machineCost,
      loanAmount,
      businessContinuity,
      coApplicant,
    ]
  );

  /* REQUIRED FIELDS */
  const requiredFields = [
    "full_name",
    "email",
    "phone_number",
    "business_name",
    "machine_type",
    "machine_cost",
    "loan_amount",
    "business_continuity",
  ];

  const currencyFields = ["machine_cost", "loan_amount"];

  /* VALIDATION */
  const isFormValid = useMemo(() => {
    return requiredFields.every((key) => {
      const val = formValues[key];
      if (!val) return false;
      if (currencyFields.includes(key)) {
        const number = parseFloat(val.replace(/,/g, ""));
        return !isNaN(number) && number > 0;
      }
      return val.trim().length > 0;
    });
  }, [formValues]);

  /* SUBMIT HANDLER */
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
        machine_type: machineType,
        machine_cost: Number(machineCost.replace(/,/g, "")),
        loan_amount: Number(loanAmount.replace(/,/g, "")),
        business_continuity: Number(businessContinuity.replace(/\D/g, "")),
        co_applicant: coApplicant || "",
      };

      console.log(payload)

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${BASE_URL}/apply/machine-loan`,
        payload,
        { headers }
      );

      console.log(res?.data)

      setLoading(false);

      if (res?.data?.status) {
        navigation.navigate("SuccessScreen");
      }
    } catch (err) {
      console.log("API ERROR:", err?.response?.data || err.message);
      setLoading(false);
    }
  };

  /* QUICK STATS */
  const quickStats = [
    { label: "Funding", value: "Up to 90% Asset Cost" },
    { label: "Tenure", value: "Up to 10 Years" },
    { label: "Sectors", value: "Manufacturing & Infra" },
    { label: "Processing", value: "Fast-track disbursal" },
  ];

  const highlights = [
    "Supports purchase of new/used machinery with collateral backed lending.",
    "Covers plant & machinery, medical, printing, and infrastructure equipment.",
    "Flexible moratorium & seasonal repayment flow support.",
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
          <Text style={styles.headerSubtext}>Best for automation & equipment upgrades</Text>
        </View>

        {/* SNAPSHOT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="factory" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Machinery Snapshot</Text>
          </View>

          <View style={styles.quickInfoGrid}>
            {quickStats.map((stat) => (
              <View key={stat.label} style={styles.quickInfoPill}>
                <Text style={styles.quickInfoLabel}>{stat.label}</Text>
                <Text style={styles.quickInfoValue}>{stat.value}</Text>
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

          {renderPickerField("Machinery Type", machineType, setMachineType, [
            "New Machinery",
            "Used Machinery",
            "Construction Equipment",
            "Manufacturing Equipment",
            "Agricultural Equipment",
          ])}

          {renderCurrencyField("Total Machinery Cost", machineCost, setMachineCost)}
          {renderCurrencyField("Loan Amount", loanAmount, setLoanAmount)}

          {renderPickerField("Business Continuity", businessContinuity, setBusinessContinuity, [
            "1 Year",
            "2 Years",
            "3 Years",
            "5 Years",
            "7+ Years",
          ])}

          {renderTextField(
            "Co-Applicant Name (Optional)",
            coApplicant,
            setCoApplicant
          )}

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
                  <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* HIGHLIGHTS */}
        <View style={[styles.highlightCard, { backgroundColor: `${loanData.color}10` }]}>
          <Text style={styles.highlightTitle}>Program Benefits</Text>

          {highlights.map((item) => (
            <View key={item} style={styles.highlightItem}>
              <View style={[styles.highlightDot, { backgroundColor: loanData.color }]} />
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MachineryLoanScreen;
