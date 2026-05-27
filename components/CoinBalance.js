import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Theme from "../components/Theme";
import { useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../utils/config";

const { height, width } = Dimensions.get("window");

const CoinBalance = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.register.user);
  const [totalBalance, setTotalBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(user?.user?.member_id)






  const fetchTotalBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        Alert.alert("Error", "Authentication token missing. Please login again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/referral/total-lcr`, { headers });
      if (response.data.status === 1) {
        setTotalBalance(response.data.total);
      } else {
        setTotalBalance(0);
        setError(response.data.message || "No balance found");
      }
    } catch (err) {
      setError("Failed to fetch balance. Please try again.");
      setTotalBalance(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

 

  useEffect(() => {
    fetchTotalBalance();
  }, [fetchTotalBalance]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        const state = navigation.getState();
        const routeCount = state?.routes?.length ?? 1;

        if (routeCount >= 3 && navigation.canGoBack()) {
          // pop 2 screens
          navigation.pop(2);
        } else {
          // not enough history — fallback (go home or exit)
          navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
        }
        return true; // prevent default
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [navigation])
  );

  const sponsoredLinks = [
    { id: "1", name: "RummyCircle", logo: require("../assets/Rummy.png") },
    { id: "2", name: "WinZO Ludo", logo: require("../assets/winzo.png") },
    { id: "3", name: "MPL Ludo", logo: require("../assets/Ludo.png") },
    { id: "4", name: "ZUPEE", logo: require("../assets/Zupe.png") },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.successIconContainer}>
        <Image
          source={require("../assets/Tickk.png")}
          style={styles.successIcon}
        />
      </View>

      <Text style={styles.successText}>
        BALANCE FETCHED{"\n"}SUCCESSFULLY
      </Text>

      <View style={styles.bankDetailsContainer}>
        {/* <Image source={require("../assets/default_bank_logo.png")} style={styles.bankLogo} /> */}
        <Text style={styles.bankName}>
          XXXXXX{user.user.MobileNumber.slice(-4)}
        </Text>
      </View>

      <Text style={styles.availableText}>Available Balance</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.balanceAmount}>LCR Money {totalBalance}</Text>
      )}

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }], })}
      >
        <Text style={styles.doneButtonText}>DONE</Text>
      </TouchableOpacity>

      {/* <View style={styles.sponsoredContainer}>
        <Text style={styles.sponsoredTitle}>Sponsored Links</Text>
        <View style={styles.sponsoredRow}>
          {sponsoredLinks.map((item) => (
            <View key={item.id} style={styles.sponsoredItem}>
              <Image source={item.logo} style={styles.sponsoredIcon} />
              <Text style={styles.sponsoredText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 30,
  },
  successIconContainer: { alignItems: "center", marginBottom: 15,marginTop:150 },
  successIcon: { width: 100, height: 100 },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  bankDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bankLogo: { width: 30, height: 30, marginRight: 10 },
  bankName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  availableText: { fontSize: 14, color: "#777" },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 5,
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    width: "80%",
    borderRadius: 8,
    position: "absolute",
    bottom: height * 0.1,
    alignItems: "center",
  },
  doneButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  sponsoredContainer: {
    marginTop: height * 0.05,
    alignItems: "center",
    width: "100%",
  },
  sponsoredTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  sponsoredRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
  },
  sponsoredItem: {
    alignItems: "center",
  },
  sponsoredIcon: { width: 50, height: 50, marginBottom: 5 },
  sponsoredText: { fontSize: 12, textAlign: "center", color: "#555" },
});

export default CoinBalance;