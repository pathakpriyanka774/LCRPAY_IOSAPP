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
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../utils/config";

const PrivateFundingScreen = () => {
  const loanData = getLoanById("private-funding");

  const navigation = useNavigation();


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [annualTurnover, setAnnualTurnover] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [fundingPurpose, setFundingPurpose] = useState("");

  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>
          Private funding configuration is unavailable.
        </Text>
      </View>
    );
  }

  // Currency formatter (adds commas)
  const formatCurrencyInput = (value) => {
    const digitsOnly = value.replace(/[^0-9]/g, "");
    if (!digitsOnly) return "";
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
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
          keyboardType="numeric"
          onChangeText={(text) => setter(formatCurrencyInput(text))}
        />
      </View>
    </View>
  );

  // Form values object
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      loan_amount: loanAmount,
      annual_turnover: annualTurnover,
      employment_type: employmentType,
      funding_purpose: fundingPurpose,
    }),
    [fullName, email, phoneNumber, loanAmount, annualTurnover, employmentType, fundingPurpose]
  );

  const requiredFields = [
    "full_name",
    "email",
    "phone_number",
    "loan_amount",
    "annual_turnover",
    "employment_type",
    "funding_purpose",
  ];

  const currencyFields = ["loan_amount", "annual_turnover"];

  // Form validation
  const isFormValid = useMemo(() => {
    return requiredFields.every((key) => {
      const value = formValues[key];
      if (!value) return false;
      if (currencyFields.includes(key)) {
        const normalized = parseFloat(value.replace(/,/g, ""));
        return !isNaN(normalized) && normalized > 0;
      }
      return value.trim().length > 0;
    });
  }, [formValues]);

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Convert formatted numbers (1,00,000) → 100000
      const normalizedLoan = loanAmount.replace(/,/g, "");
      const normalizedTurnover = annualTurnover.replace(/,/g, "");

      const payload = {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        loan_amount: normalizedLoan,
        annual_turnover: normalizedTurnover,
        employment_type: employmentType,
        funding_purpose: fundingPurpose,
      };

      console.log(payload)

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // FIXED: Correct Axios format
      const res = await axios.post(
        `${BASE_URL}/apply/private-funding`,
        payload,
        { headers }
      );

      console.log("API Success:", res?.data);

      setLoading(false);

      if (res?.data?.status) {
        navigation.navigate("SuccessScreen")
      }

    } catch (error) {
      console.log("API Error:", error?.response?.data || error.message);
      setLoading(false);
    }
  };

  const quickStats = [
    { label: "Ticket Size", value: "₹25L - ₹10Cr" },
    { label: "Use Case", value: "Short term & bridge" },
    { label: "Turnaround", value: "As fast as 5 days" },
    { label: "Repayment", value: "Bullet / Structured" },
  ];

  const highlights = [
    "High-value bridge funding backed by property or cash flows.",
    "Ideal for urgent acquisitions, working capital or promoter funding.",
    "Dedicated relationship team with customized repayment scheduling.",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: `${loanData.color}15` }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${loanData.color}30` }]}>
            <MaterialCommunityIcons name={loanData.icon} size={42} color={loanData.color} />
          </View>
          <Text style={styles.headerTitle}>{loanData.name}</Text>
          <Text style={styles.headerDescription}>{loanData.description}</Text>
          <Text style={styles.headerSubtext}>
            Bespoke structures for investors, developers and promoters.
          </Text>
        </View>

        {/* PROGRAM SNAPSHOT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="handshake" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Program Snapshot</Text>
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

        {/* TERMS */}
        <LoanTermsList terms={loanData.terms} loanColor={loanData.color} />

        {/* APPLICATION FORM */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="file-document-edit"
              size={22}
              color={loanData.color}
            />
            <Text style={styles.sectionTitle}>Application Details</Text>
          </View>

          {/* FORM FIELDS */}
          {renderTextField("Full Name", fullName, setFullName)}
          {renderTextField("Email", email, setEmail, { keyboardType: "email-address" })}
          {renderTextField("Phone Number", phoneNumber, setPhoneNumber, { keyboardType: "phone-pad" })}

          {renderCurrencyField("Loan Amount", loanAmount, setLoanAmount)}
          {renderCurrencyField("Annual Turnover", annualTurnover, setAnnualTurnover)}

          {renderPickerField(
            "Employment Type",
            employmentType,
            setEmploymentType,
            ["SEP", "SENP"]
          )}

          {renderPickerField(
            "Event / Funding Purpose",
            fundingPurpose,
            setFundingPurpose,
            ["Wedding", "Reception", "Anniversary", "Birthday Party", "Corporate Event", "Other"]
          )}

          {/* SUBMIT BUTTON */}
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isFormValid ? { backgroundColor: loanData.color } : styles.buttonDisabled,
              ]}
              onPress={() => handleSubmit()}
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
          <Text style={styles.highlightTitle}>Why private funding?</Text>
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

export default PrivateFundingScreen;
