import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Theme from "../Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import { getCategoryDetails } from "../../config/bbpsCategories";
import { BASE_URL } from "../../utils/config";

const FastagTransaction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    endpoint = "Fastag Transaction",
    btnName = "Add vehicle",
    reminder,
  } = route.params || {};

  // State management
  const [recentRecharges, setRecentRecharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const [selectedOption, setSelectedOption] = useState(null);




  const FetchBillerConditions = async (selectedOption) => {
    try {


      console.log("Selected Option in FastagTransaction.js:", selectedOption?.biller_id);
   
      const access_token = await AsyncStorage.getItem("access_token");
      if (!access_token) {
        setError("Please sign in to view billers.");
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/api/v1/bbps/billers/ui-info/${selectedOption?.biller_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log("api/v1/bbps/billers/ui-info/--->", response.data.data);




      // =======================================================
      // If Support the BillFetch
      // =======================================================
      if (response?.data?.data?.shouldNaviagteToManualInput) {
        navigation.navigate("ProceedToPayment", {
          registrationCond: response.data?.data?.inputParams || [],
          paymentBnak: response?.data?.data?.billerName,
          reminder: reminder,
          biller_id: response?.data?.data?.billerId,
          tagName: endpoint,
          iconImage:`https://assetcdn.lcrpay.com/biller-assets/${response?.data?.data?.billerId}.png`,
          doesSupportBillFetch: response?.data?.data?.doesSupportBillFetch,
          doesSupportUserInput: response?.data?.data?.doesSupportUserInput,
          isBillFetchMandatory: response?.data?.data?.isBillFetchMandatory,
          shouldNaviagteToManualInput: response?.data?.data?.shouldNaviagteToManualInput,
          paymentChannels: response?.data?.data?.paymentChannels || [],
          billerName: response?.data?.data?.billerName,
          billerCategory: response?.data?.data?.billerCategory,
          allDiscomsList: response?.data?.data?.allDiscomsList || [],
        })
        return;
      }
      else {
        navigation.navigate("VehicleRegistration", {
          registrationCond: response.data?.data?.inputParams || [],
          paymentBnak: response?.data?.data?.billerName,
          reminder: reminder,
          biller_id: response?.data?.data?.billerId,
          tagName: endpoint,
          iconImage: `https://assetcdn.lcrpay.com/biller-assets/${response?.data?.data?.billerId}.png`,
          doesSupportBillFetch: response?.data?.data?.doesSupportBillFetch,
          doesSupportUserInput: response?.data?.data?.doesSupportUserInput,
          isBillFetchMandatory: response?.data?.data?.isBillFetchMandatory,
          shouldNaviagteToManualInput: response?.data?.data?.shouldNaviagteToManualInput,
          paymentChannels: response?.data?.data?.paymentChannels || [],
          billerName: response?.data?.data?.billerName,
          billerCategory: response?.data?.data?.billerCategory,
          allDiscomsList: response?.data?.data?.allDiscomsList || [],
        })
      }


    } catch (error) {
      console.error("API Error:", error);
    };
  }


  useEffect(()=>{
    if (selectedOption?.biller_name) {
      FetchBillerConditions(selectedOption);
    }
  },[selectedOption?.biller_name])

  useEffect(() => {
    navigation.setOptions({
      title: endpoint,
    });
  }, [endpoint, navigation]);

  // Fetch recent transactions
  const fetchRecentTransactions = useCallback(
    async ({ append = false, nextSkip = 0, showMainLoader = true } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (showMainLoader) {
          setLoading(true);
        }
        setError("");

        const access_token = await AsyncStorage.getItem("access_token");
        if (!access_token) {
          setError("Please sign in to view transactions.");
          if (append) {
            setLoadingMore(false);
          } else if (showMainLoader) {
            setLoading(false);
          }
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/v2/payments/bill-fetch/unique-consumers`,
          {
            params: {
              category: endpoint,
              skip: nextSkip,
              limit: limit,
            },
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );


        console.log(response.data?.data)


        // Extract data from response
        let incoming = [];
        if (Array.isArray(response.data?.data)) {
          incoming = response.data.data;
        } else if (Array.isArray(response.data?.data?.results)) {
          incoming = response.data.data.results;
        } else if (Array.isArray(response.data?.data?.data)) {
          incoming = response.data.data.data;
        }

        console.log("Extracted transactions:", incoming.length);

        // Map transactions to display format
        const mappedTransactions = incoming.map((transaction, index) => ({
          id: transaction.id || `${endpoint}-${nextSkip + index}`,
          biller_name: transaction.biller_name || transaction.blr_name || "Unknown Biller",
          amount: transaction.amount || transaction.bill_amount || 0,
          date: transaction.fetched_at || transaction.created_at || new Date().toISOString(),
          status: transaction.status || "Completed",
          description: transaction.description || `Payment to ${transaction.biller_name}`,
          registration_number: transaction.registration_number || "N/A",
          input_params: transaction.input_params ? Object.values(transaction.input_params).join(", ") : "N/A",
          biller_id: transaction.biller_id || "N/A",
        }));

        setHasMore(incoming.length === limit);
        setSkip(nextSkip + incoming.length);

        setRecentRecharges((prev) =>
          append ? [...prev, ...mappedTransactions] : mappedTransactions
        );

        if (append) {
          setLoadingMore(false);
        } else if (showMainLoader) {
          setLoading(false);
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Unable to load transactions right now.");
        setHasMore(false);
        if (append) {
          setLoadingMore(false);
        } else if (showMainLoader) {
          setLoading(false);
        }
      }
    },
    [endpoint, limit]
  );

  // Load transactions on screen focus
  useFocusEffect(
    useCallback(() => {
      setSkip(0);
      setRecentRecharges([]);
      fetchRecentTransactions({ append: false, nextSkip: 0, showMainLoader: true });
    }, [fetchRecentTransactions])
  );

  // Handle load more on scroll
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchRecentTransactions({
        append: true,
        nextSkip: skip,
        showMainLoader: false,
      });
    }
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setSkip(0);
    setRecentRecharges([]);
    fetchRecentTransactions({ append: false, nextSkip: 0, showMainLoader: false }).then(() =>
      setRefreshing(false)
    );
  }, [fetchRecentTransactions]);

  const renderRechargeItem = ({ item }) => {
    const categoryDetails = getCategoryDetails(endpoint);

    console.log("Rendering item:", item);
   

    return (
      <TouchableOpacity
        style={styles.rechargeItem}
        activeOpacity={0.7}
        onPress={() =>setSelectedOption(item)}
      >
        <View
          style={[
            styles.itemIconContainer,
            { backgroundColor: categoryDetails.bgColor },
          ]}
        >
          {/* <Text style={styles.itemIcon}>{categoryDetails.emoji}</Text> */}
          <Image source={{ uri: `https://assetcdn.lcrpay.com/biller-assets/${item.biller_id}.png` }} style={{ width: 44, height: 44 }}/>
        </View>
        <View style={styles.rechargeDetails}>
          <Text style={styles.bankName} numberOfLines={1}>
            {item.biller_name}
          </Text>
          {item.registration_number !== "N/A" && (
            <Text style={styles.registrationNumber}>
              {item.registration_number}
            </Text>
          )}
          <View style={styles.transactionFooter}>
            {/* <Text style={styles.rechargeInfo}>
              {moment(item.date).format("DD MMM YYYY, hh:mm A")}
            </Text> */}

            <Text style={styles.rechargeInfo}>
              {item.input_params}
            </Text>

          </View>
        </View>
        <View style={styles.amountContainer}>
          {/* <Text style={[styles.amountText, { color: categoryDetails.color }]}>
            ₹{(parseFloat(item.amount)/100).toFixed(2)}
          </Text> */}
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreOptions}>›</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    const categoryDetails = getCategoryDetails(endpoint);

    return (
      <View style={styles.bannerWrapper}>
        <View style={styles.bannerContent}>
          <View style={styles.headerTop}>
            <View style={styles.iconBadge}>
              <Text style={styles.headerEmoji}>{categoryDetails.emoji}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.bannerTitle}>{endpoint}</Text>
              <Text style={styles.bannerSubtitle}>Recent transactions</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    const categoryDetails = getCategoryDetails(endpoint);

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>{categoryDetails.emoji}</Text>
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptySubtitle}>
          Start making {endpoint.toLowerCase()} transactions to see them here.
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen} >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingLabel}>Loading transactions...</Text>
        </View>
      ) : (
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() =>
                  fetchRecentTransactions({ append: false, nextSkip: 0, showMainLoader: true })
                }
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContent}
              data={recentRecharges}
              keyExtractor={(item) => item.id}
              renderItem={renderRechargeItem}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Theme.colors.primary]}
                />
              }
            />
          )}
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addVehicleButton}
          onPress={() =>
            navigation.navigate("FAST", {
              endpoint: endpoint,
              reminder: reminder,
            })
          }
        >
          <Text style={styles.addVehicleText}>{btnName}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: Theme.colors.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  bannerWrapper: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: Theme.colors.primary,
    borderRadius: 16,
  },
  bannerContent: {
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "400",
  },
  rechargeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 22,
  },
  rechargeDetails: {
    flex: 1,
    marginRight: 8,
  },
  bankName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  registrationNumber: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  transactionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rechargeInfo: {
    fontSize: 12,
    color: "#888",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#e8f5e9",
  },
  statusSuccess: {
    backgroundColor: "#e8f5e9",
  },
  statusPending: {
    backgroundColor: "#fff3e0",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.colors.primary,
  },
  amountContainer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  moreButton: {
    paddingHorizontal: 4,
  },
  moreOptions: {
    fontSize: 20,
    color: "#ddd",
    fontWeight: "300",
  },
  addVehicleButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addVehicleText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    backgroundColor: "#fff",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    maxWidth: "80%",
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default FastagTransaction;
