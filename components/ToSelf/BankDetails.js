import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ban as Bank,
  Plus,
  CircleAlert as AlertCircle,
  ChevronRight,
} from "lucide-react-native";
import Theme from "../Theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const BankCard = ({ bank }) => {
  // Get last 4 digits of account number
  const lastFourDigits = bank.bankACNumber.slice(-4);
  const maskedNumber = "••••" + lastFourDigits;

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("HomeScreen"); // Always navigate to HomeScreen
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AddAmount", {
          bankName: bank.bankName,
          account: maskedNumber,
          holder: bank.bankACHolder,
          id: bank.id,
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.bankIconContainer}>
          <Bank size={24} color={Theme.colors.primary} />
        </View>
        <View style={styles.bankInfo}>
          <Text style={styles.bankName}>{bank.bankName}</Text>
          <Text style={styles.accountType}>Primary Account</Text>
        </View>
        <ChevronRight size={20} color="#999" />
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ACCOUNT HOLDER</Text>
          <Text style={styles.detailValue}>{bank.bankACHolder}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
          <Text style={styles.detailValue}>{maskedNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IFSC CODE</Text>
          <Text style={styles.detailValue}>{bank.bankIFSC}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = ({ onAddBank }) => (
  <View style={styles.emptyContainer}>
    <Image
      source={{
        uri: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      }}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No Bank Accounts</Text>
    <Text style={styles.emptyText}>
      Add your bank account to enable seamless transfers and payments
    </Text>
    <TouchableOpacity style={styles.addButton} onPress={onAddBank}>
      <Plus size={20} color="#FFFFFF" />
      <Text style={styles.addButtonText}>Add Bank Account</Text>
    </TouchableOpacity>
  </View>
);

const ErrorState = ({ error, onRetry }) => (
  <View style={styles.errorContainer}>
    <AlertCircle size={48} color="#DC3545" />
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const BankDetails = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBanks, setAllBanks] = useState([]);

  const getUserBankList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${BASE_URL}/payments/get_all_user_accounts?banktype=self`,
        { headers }
      );

      if (response.data.status && Array.isArray(response.data.data)) {
        setAllBanks(response.data.data);
        console.log(response.data);
      } else {
        throw new Error("No bank accounts found");
      }
    } catch (error) {
      let errorMessage = "Failed to fetch bank details";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.status === 404
            ? "Bank details not found"
            : error.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserBankList();
  }, []);

  const handleAddBank = () => navigation.navigate("AddBankAccount");

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your accounts...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={getUserBankList} />;
  }

  if (!allBanks.length) {
    return <EmptyState onAddBank={handleAddBank} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Bank Accounts</Text>
        <Text style={styles.headerSubtitle}>
          Manage your linked bank accounts
        </Text>
      </View>

      <FlatList
        data={allBanks}
        keyExtractor={(item) => item.bankACNumber.toString()}
        renderItem={({ item }) => <BankCard bank={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={handleAddBank}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bankIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#E6F0FF",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bankInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  accountType: {
    fontSize: 14,
    color: "#666666",
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  cardDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666666",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  emptyImage: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 24,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BankDetails;
