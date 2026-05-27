import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UserLoanInfoScreen = ({ route, navigation }) => {
  const { loanType, formData } = route.params || {};

  const getFieldLabel = (key) => {
    const labelMap = {
      amount: "Loan Amount",
      tenure: "Tenure",
      employmentType: "Employment Type",
      monthlyIncome: "Monthly Income",
      vehicleType: "Vehicle Type",
      vehicleMake: "Vehicle Make/Model",
      propertyType: "Property Type",
      propertyValue: "Property Value",
      businessType: "Business Type",
      annualRevenue: "Annual Revenue",
      monthlyTurnover: "Monthly Turnover",
      businessAge: "Business Age",
      existingLoans: "Existing Loans on Property",
      annualTurnover: "Annual Turnover",
      bankingRelationship: "Banking Relationship",
      machineryType: "Machinery Type",
      machineryCost: "Machinery Cost",
      eventType: "Event Type",
      eventDate: "Event Date"
    };
    return labelMap[key] || key;
  };

  const getIconForField = (key) => {
    const iconMap = {
      amount: "currency-inr",
      tenure: "calendar-clock",
      employmentType: "briefcase",
      monthlyIncome: "cash",
      vehicleType: "car",
      vehicleMake: "card-text",
      propertyType: "home-variant",
      propertyValue: "currency-inr",
      businessType: "domain",
      annualRevenue: "chart-line",
      monthlyTurnover: "cash-multiple",
      businessAge: "clock-outline",
      existingLoans: "bank",
      annualTurnover: "chart-bar",
      bankingRelationship: "handshake",
      machineryType: "cog",
      machineryCost: "currency-inr",
      eventType: "party-popper",
      eventDate: "calendar"
    };
    return iconMap[key] || "file-document";
  };

  const formatValue = (key, value) => {
    if (key.toLowerCase().includes('amount') || 
        key.toLowerCase().includes('income') || 
        key.toLowerCase().includes('revenue') || 
        key.toLowerCase().includes('turnover') || 
        key.toLowerCase().includes('value') || 
        key.toLowerCase().includes('cost')) {
      return `₹ ${value}`;
    }
    return value;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.successCard}>
          <MaterialCommunityIcons
            name="check-circle"
            size={64}
            color="#5F259F"
          />
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Your {loanType} application has been received
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="file-document-check"
              size={24}
              color="#5F259F"
            />
            <Text style={styles.sectionTitle}>Application Details</Text>
          </View>

          <View style={styles.loanTypeRow}>
            <View style={styles.loanTypeLabel}>
              <MaterialCommunityIcons
                name="tag"
                size={20}
                color="#5F259F"
              />
              <Text style={styles.loanTypeText}>Loan Type</Text>
            </View>
            <Text style={styles.loanTypeValue}>{loanType}</Text>
          </View>

          <View style={styles.divider} />

          {formData && Object.keys(formData).map((key, index) => (
            <View key={index} style={styles.detailRow}>
              <MaterialCommunityIcons
                name={getIconForField(key)}
                size={22}
                color="#5F259F"
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{getFieldLabel(key)}</Text>
                <Text style={styles.detailValue}>{formatValue(key, formData[key])}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#3498DB"
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What's Next?</Text>
            <Text style={styles.infoText}>
              Our team will review your application and contact you within 24-48 hours. 
              Please keep your documents ready for verification.
            </Text>
          </View>
        </View>

        <View style={styles.documentsCard}>
          <View style={styles.documentsHeader}>
            <MaterialCommunityIcons
              name="file-upload"
              size={22}
              color="#27AE60"
            />
            <Text style={styles.documentsTitle}>Documents Required</Text>
          </View>
          <View style={styles.documentItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={18} color="#27AE60" />
            <Text style={styles.documentText}>Identity Proof (Aadhaar/PAN/Passport)</Text>
          </View>
          <View style={styles.documentItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={18} color="#27AE60" />
            <Text style={styles.documentText}>Address Proof (Utility Bill/Rental Agreement)</Text>
          </View>
          <View style={styles.documentItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={18} color="#27AE60" />
            <Text style={styles.documentText}>Income Proof (Salary Slips/Bank Statements)</Text>
          </View>
          <View style={styles.documentItem}>
            <MaterialCommunityIcons name="checkbox-marked-circle" size={18} color="#27AE60" />
            <Text style={styles.documentText}>Recent Photographs</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("LoanSelection")}
        >
          <MaterialCommunityIcons
            name="home"
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  successCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: "#7F8C8D",
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 10,
  },
  loanTypeRow: {
    backgroundColor: "#F8F5FC",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  loanTypeLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  loanTypeText: {
    fontSize: 13,
    color: "#7F8C8D",
    marginLeft: 8,
  },
  loanTypeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5F259F",
    marginLeft: 28,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECF0F1",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F6FA",
  },
  detailContent: {
    flex: 1,
    marginLeft: 14,
  },
  detailLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  infoCard: {
    backgroundColor: "#E8F4F8",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },
  documentsCard: {
    backgroundColor: "#E8F8F0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  documentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 10,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  documentText: {
    fontSize: 13,
    color: "#2C3E50",
    marginLeft: 10,
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5F259F",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});

export default UserLoanInfoScreen;
