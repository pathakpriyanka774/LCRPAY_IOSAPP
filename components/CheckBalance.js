import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  BackHandler,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import Theme from "../components/Theme";
import { useSelector } from "react-redux";

const { height, width } = Dimensions.get("window");

const CheckBalance = () => {
  const navigation = useNavigation();

  const bankDetails = useSelector(
    (state) => state.wallet.transactionHistory.final_amount
  );
  const user = useSelector((state) => state.register.user);

  useEffect(() => {
    console.log(bankDetails);
  }, [bankDetails]);

  const sponsoredLinks = [
    { id: "1", name: "RummyCircle", logo: require("../assets/Rummy.png") },
    { id: "2", name: "WinZO Ludo", logo: require("../assets/winzo.png") },
    { id: "3", name: "MPL Ludo", logo: require("../assets/Ludo.png") },
    { id: "4", name: "ZUPEE", logo: require("../assets/Zupe.png") },
  ];

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
    <View style={styles.container}>
      <View style={styles.successIconContainer}>
        <Image
          source={require("../assets/Tickk.png")}
          style={styles.successIcon}
        />
      </View>

      <Text style={styles.successText}>
        Bank account balance fetched{"\n"}successfully
      </Text>

      <View style={styles.bankDetailsContainer}>
        <Image source={bankDetails?.logo} style={styles.bankLogo} />
        <Text style={styles.bankName}>
          XXXXXX{user.user.MobileNumber.slice(-4)}
        </Text>
      </View>

      <Text style={styles.availableText}>Available Balance</Text>
      <Text style={styles.balanceAmount}>₹{bankDetails}</Text>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={styles.doneButtonText}>DONE</Text>
      </TouchableOpacity>

      <View style={styles.sponsoredContainer}>
        <Text style={styles.sponsoredTitle}>Sponsored Links</Text>
        <View style={styles.sponsoredRow}>
          {sponsoredLinks.map((item) => (
            <View key={item.id} style={styles.sponsoredItem}>
              <Image source={item.logo} style={styles.sponsoredIcon} />
              <Text style={styles.sponsoredText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
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

  successIconContainer: { alignItems: "center", marginBottom: 15 },
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

export default CheckBalance;
