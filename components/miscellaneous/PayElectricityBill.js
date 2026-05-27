import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Dimensions,
} from "react-native";
import { ArrowLeft, Info, Tag } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Theme from "../Theme";
import { TextInput } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

const PayElectricityBill = () => {
  const navigation = useNavigation();
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);

  const [amount, setAmount] = useState();

  const handleProceedToPay = () => {
    // Handle payment logic here
    console.log("Proceeding to payment...");
  };

  const route = useRoute();

  const { response } = route.params;

  console.log("this is additionalInfo------->", response[0]?.additionalInfo);
  console.log("this is billerResponse------->", response[0]?.billerResponse);

  function formatDate(inputDate) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const [year, month, day] = inputDate.split("-"); // Extract year, month, and day
    const formattedDate = `${parseInt(day)} ${
      months[parseInt(month) - 1]
    } ${year}`;

    return formattedDate;
  }
  const data = {
    billAmount: response[0]?.billerResponse?.billAmount || "",
    billDate: formatDate(response[0]?.billerResponse?.billDate) || "",
    billNumber: response[0]?.billerResponse?.billNumber || "",
    billPeriod: response[0]?.billerResponse?.billPeriod || "",
    customerName: response[0]?.billerResponse?.customerName || "",
    dueDate: formatDate(response[0]?.billerResponse?.dueDate) || "",
  };

  useEffect(() => {
    console.log(response);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.companyInfo}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=64&q=80",
            }}
            style={styles.companyLogo}
          />
          <View style={styles.companyDetails}>
            <Text style={styles.companyId}>
              {data.customerName !== "NA"
                ? data.customerName
                : "Biller : " + data.billNumber}
            </Text>
            {/* <Text style={styles.companyName}>PVVNL</Text> */}
          </View>
        </View>

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&q=80",
          }}
          style={styles.partnerLogo}
        />
      </View>

      {/* Bill Amount */}
      <View style={styles.amountContainer}>
        <View style={styles.amountBox}>
          <Text style={styles.currencySymbol}>₹</Text>
          {/* <Text style={styles.amount}>440</Text> */}
          <TextInput
            style={{ width: "auto", fontSize: 25 }}
            // placeholder="Enter the Amout"
            placeholderTextColor="#999"
            // maxLength={5}
            keyboardType="NUMERIC"
            onChangeText={(value) => setAmount(value)}
            value={data.billAmount}
            editable={false}
          />
        </View>

        <Text style={styles.dueDate}>Bill due on {data.dueDate}</Text>
      </View>

      {/* Bill Details Button */}
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Bill Details</Text>
      </TouchableOpacity>

      {/* Offers Section */}
      <View style={styles.offersContainer}>
        <View style={styles.offerBadge}>
          <Tag size={20} color="#00B37A" />
          <Text style={styles.offerText}>7 offers available for you</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Auto Pay Section */}
      <View style={styles.autoPayContainer}>
        <View style={styles.autoPayLeft}>
          <View style={styles.autoPayIcon}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=40&q=80",
              }}
              style={styles.clockIcon}
            />
          </View>
          <View style={styles.autoPayInfo}>
            <View style={styles.autoPayHeader}>
              <Text style={styles.autoPayTitle}>
                Pay Future Bills Automatically
              </Text>
              <Info size={16} color="#666" />
            </View>
            <Text style={styles.autoPaySubtitle}>
              Using UPI, Credit or Debit cards
            </Text>
          </View>
        </View>
        <Switch
          value={autoPayEnabled}
          onValueChange={setAutoPayEnabled}
          trackColor={{ false: "#D1D5DB", true: "#00B37A" }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={handleProceedToPay}>
        <Text style={styles.payButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  companyDetails: {
    marginLeft: 12,
  },
  companyId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  companyName: {
    fontSize: 14,
    color: "#6B7280",
  },
  partnerLogo: {
    width: 80,
    height: 24,
    resizeMode: "contain",
  },
  amountContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 4,
  },
  amount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1F2937",
  },
  dueDate: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  detailsButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  detailsButtonText: {
    color: Theme.colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  offersContainer: {
    marginTop: "auto",
    padding: 16,
  },
  offerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
  },
  offerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#065F46",
  },
  viewAllText: {
    color: "#00B5FF",
    fontSize: 14,
    fontWeight: "500",
  },
  autoPayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  autoPayLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  autoPayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  clockIcon: {
    width: 24,
    height: 24,
  },
  autoPayInfo: {
    marginLeft: 12,
    flex: 1,
  },
  autoPayHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  autoPayTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginRight: 4,
  },
  autoPaySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  payButton: {
    backgroundColor: Theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PayElectricityBill;
