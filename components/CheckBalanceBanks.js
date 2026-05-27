import React, { use, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "../components/Theme";
import { useSelector } from "react-redux";

const CheckBalanceBanks = () => {
  const navigation = useNavigation();

  const user = useSelector((state) => state.register.user);

  useEffect(() => {}, [user]);

  const upiAccounts = [
    
    {
      id: "2",
      bank: "LCR Money Balance",
      number: `XXXXXX${user.user.MobileNumber.slice(-4)}`,
      logo: require("../assets/star.png"),
      screen: "CheckBalancePin",
      // balance: "1000 Coins",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Accounts on {Theme.Text.Company} 
        </Text>
        <FlatList
          data={upiAccounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                if (item.screen) {
                  navigation.navigate(item.screen, {
                    bank: item.bank,
                    number: item.number,
                    logo: item.logo || null,
                    icon: item.icon || null,
                  });
                }
              }}
            >
              {item.icon ? (
                <MaterialIcons name={item.icon} size={35} color="#5F259F" />
              ) : (
                <Image source={item.logo} style={styles.bankLogo} />
              )}
              <View style={styles.listText}>
                <Text style={styles.bankText}>
                  {item.bank} - {item.number}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#888" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>POWERED BY</Text>
        <Image
          source={require("../assets/LogoN.png")}
          style={styles.npciLogo}
        />
        <Text style={styles.upiText}>
          NPCI - National Payment Corporation of India
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  section: {
    backgroundColor: "white",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  bankLogo: {
    width: 35,
    height: 35,
    borderRadius: 5,
  },
  listText: {
    flex: 1,
    marginLeft: 15,
  },
  bankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  setPinText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5F259F",
  },
  npciLogo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginVertical: 0,
  },
  footer: {
    alignItems: "center",
    position: "absolute",
    bottom: "10%",
    left: 0,
    right: 0,
    paddingBottom: 1,
  },
  footerText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: -25,
  },
  upiText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: -30,
  },
});

export default CheckBalanceBanks;
