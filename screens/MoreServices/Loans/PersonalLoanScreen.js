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

const PersonalLoanScreen = ({ navigation }) => {
  const loanData = getLoanById("personal-loan");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [existingEmis, setExistingEmis] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [cibilScore, setCibilScore] = useState("");
  const [loading, setLoading] = useState(false);

  if (!loanData) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>Personal loan configuration unavailable.</Text>
      </View>
    );
  }

  /* ---------- Currency Format ---------- */
  const formatCurrencyInput = (value) => {
    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /* ----------- Render Helpers ---------- */
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
          onChangeText={(text) => setter(formatCurrencyInput(text))}
        />
      </View>
    </View>
  );

  /* ---------- Form Values ---------- */
  const formValues = useMemo(
    () => ({
      full_name: fullName,
      email,
      phone_number: phone,
      employment_status: employmentStatus,
      company_name: companyName,
      monthly_income: monthlyIncome,
      existing_emis: existingEmis,
      loan_amount: loanAmount,
      tenure,
      cibil_score: cibilScore,
    }),
    [
      fullName,
      email,
      phone,
      employmentStatus,
      companyName,
      monthlyIncome,
      existingEmis,
      loanAmount,
      tenure,
      cibilScore,
    ]
  );

  /* ---------- Required Fields ---------- */
  const requiredFields = [
    "full_name",
    "email",
    "phone_number",
    "employment_status",
    "company_name",
    "monthly_income",
    "existing_emis",
    "loan_amount",
    "tenure",
    "cibil_score",
  ];

  const currencyFields = ["loan_amount"];

  /* ---------- Validation ---------- */
  const isFormValid = useMemo(() => {
    return requiredFields.every((key) => {
      const val = formValues[key];
      if (!val) return false;

      if (currencyFields.includes(key)) {
        const num = parseFloat(val.replace(/,/g, ""));
        return !isNaN(num) && num > 0;
      }

      return val.toString().trim().length > 0;
    });
  }, [formValues]);

  /* ---------- Submit Handler ---------- */
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");

      const payload = {
        full_name: fullName,
        email,
        phone_number: phone,
        employment_status: employmentStatus.toLowerCase(),
        company_name: companyName,
        monthly_income: Number(monthlyIncome),
        existing_emis: Number(existingEmis),
        loan_amount: Number(loanAmount.replace(/,/g, "")),
        tenure: Number(tenure.replace(/\D/g, "")),
        cibil_score: Number(cibilScore),
      };


      console.log(payload)

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${BASE_URL}/apply/personal-loan`,
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

  /* ---------- Quick Stats & Highlights ---------- */
  const quickStats = [
    { label: "Salary Requirement", value: "₹15,000+" },
    { label: "Max FOIR", value: "75%" },
    { label: "Loan Range", value: "₹1L - ₹1Cr" },
    { label: "Tenure", value: "Up to 84 months" },
  ];

  const highlights = [
    "Eligible for salaried, business owners and professionals.",
    "Balance transfer + top-up available.",
    "Fully digital application with status tracking.",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: `${loanData.color}15` }]}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${loanData.color}30` },
            ]}
          >
            <MaterialCommunityIcons name={loanData.icon} size={42} color={loanData.color} />
          </View>
          <Text style={styles.headerTitle}>{loanData.name}</Text>
          <Text style={styles.headerDescription}>{loanData.description}</Text>
          <Text style={styles.headerSubtext}>
            Salary ₹15,000+ | Salaried + Self-Employed | Instant Processing
          </Text>
        </View>

        {/* QUICK SNAPSHOT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="flash" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Quick Snapshot</Text>
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

        {/* FORM */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="file-document-edit" size={22} color={loanData.color} />
            <Text style={styles.sectionTitle}>Application Details</Text>
          </View>

          {renderTextField("Full Name", fullName, setFullName)}
          {renderTextField("Email", email, setEmail, { keyboardType: "email-address" })}
          {renderTextField("Phone Number", phone, setPhone, { keyboardType: "phone-pad" })}

          {renderPickerField("Employment Status", employmentStatus, setEmploymentStatus, [
            "salaried", "self-employed", "Business Owner", "Professional", "SEP"
          ])}

          {renderTextField("Company Name", companyName, setCompanyName)}

          {renderTextField("Monthly Income", monthlyIncome, setMonthlyIncome, {
            keyboardType: "numeric",
          })}

          {renderTextField("Existing EMIs", existingEmis, setExistingEmis, {
            keyboardType: "numeric",
          })}

          {renderCurrencyField("Loan Amount", loanAmount, setLoanAmount)}

          {renderPickerField("Tenure (Years)", tenure, setTenure, [
            "1 Year",
            "2 Years",
            "3 Years",
            "4 Years",
            "5 Years",
            "7 Years",
          ])}

          {renderTextField("CIBIL Score", cibilScore, setCibilScore, {
            keyboardType: "numeric",
          })}

          {/* SUBMIT */}
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
          <Text style={styles.highlightTitle}>Why choose this loan?</Text>
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

export default PersonalLoanScreen;
