import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useNavigation, useRoute } from "@react-navigation/native";

const RechargeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const contactName = route.params?.contactName || "Recharge";
  const contactNumber = route.params?.contactNumber || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Recommended Packs");

  const packs = {
    "Recommended Packs": [],
    Popular: [
      {
        amount: "199",
        validity: "28 days",
        data: "1.5 GB per day",
        description:
          "Voice: Unlimited Calls | SMS: 100 SMS/day | Get Unlimited 5G Data for eligible subscribers",
      },
      {
        amount: "249",
        validity: "28 days",
        data: "2 GB per day",
        description:
          "Voice: Unlimited Calls | SMS: 100 SMS/day | Get Unlimited 5G Data for eligible subscribers",
      },
    ],

    Data: [
      {
        amount: "98",
        bestseller: false,
        validity: "12 days",
        data: "2 GB total",
        description: "Get 2GB 5G Data for eligible subscribers",
      },
      {
        amount: "401",
        bestseller: false,
        validity: "28 days",
        data: "3 GB per day",
        description: "Get 3GB 5G Data for eligible subscribers",
      },
    ],
    "Super Savers": [
      {
        amount: "329",
        bestseller: false,
        validity: "56 days",
        data: "6 GB total",
        description:
          "Get 6GB 5G Data validity of 56 days for eligible subscribers",
      },
      {
        amount: "599",
        bestseller: false,
        validity: "84 days",
        data: "1.5 GB per day",
        description:
          "Voice: Unlimited Calls | SMS: 100 SMS/day | Get Unlimited 5G Data for eligible subscribers",
      },
    ],
    "Unlimited 5G Plans": [
      {
        amount: "599",
        bestseller: false,
        validity: "28 days",
        data: "Unlimited 5G",
        description:
          "Voice: Unlimited Calls | SMS: 100 SMS/day | Get Unlimited 5G Data for eligible subscribers",
      },
      {
        amount: "799",
        bestseller: false,
        validity: "56 days",
        data: "Unlimited 5G + 2 GB per day",
        description:
          "Voice: Unlimited Calls | SMS: 100 SMS/day | Get Unlimited 5G Data for eligible subscribers",
      },
    ],
    "Truly Unlimited": [
      {
        amount: "299",
        bestseller: false,
        validity: "28 days",
        data: "Truly Unlimited Calls + 1.5 GB/day",
      },
      {
        amount: "499",
        bestseller: false,
        validity: "56 days",
        data: "Truly Unlimited Calls + 2 GB/day",
      },
    ],
    "International Roaming": [
      {
        amount: "999",
        bestseller: false,
        validity: "7 days",
        data: "International Roaming + 3 GB total",
      },
      {
        amount: "1499",
        bestseller: false,
        validity: "15 days",
        data: "International Roaming + 5 GB total",
      },
    ],
    Entertainment: [
      {
        amount: "349",
        bestseller: false,
        validity: "30 days",
        data: "Entertainment Pack + 3 GB total",
      },
      {
        amount: "799",
        bestseller: false,
        validity: "56 days",
        data: "Entertainment Pack + 5 GB total",
      },
    ],
  };

  useEffect(() => {
    navigation.setOptions({
      title: contactName,
    });
  }, [navigation, contactName]);

  const categories = Object.keys(packs);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredPacks =
    packs[selectedCategory]?.filter(
      (pack) =>
        pack.amount.includes(searchQuery) ||
        pack.data.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 5 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search a plan, eg 349, 5G, etc."
              placeholderTextColor="gray"
            />
          </View>

          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryTabs}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryTabContainer}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryTab,
                      selectedCategory === category && styles.activeCategoryTab,
                    ]}
                  >
                    {category}
                  </Text>
                  {selectedCategory === category && (
                    <View style={styles.underline} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.recommendedPacksContainer}>
            <ScrollView
              style={styles.recommendedPacks}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {selectedCategory === "Recommended Packs" && (
                <View>
                  <View style={styles.planCard}>
                    <View style={styles.offerTag}>
                      <Text style={styles.offerText}>Republic Day Offer</Text>
                    </View>
                    <Text style={styles.price}>₹2,999</Text>
                    <View style={styles.planDetails}>
                      <Text style={styles.label}>Validity</Text>
                      <Text style={styles.value}>275 Days</Text>
                    </View>
                    <View style={styles.planDetails}>
                      <Text style={styles.label}>Data</Text>
                      <Text style={styles.value}>Unlimited 5G + 1.5GB/day</Text>
                    </View>
                    <Text style={styles.desc}>
                      Voice: Unlimited Calls | SMS: 100 SMS/day Get Unlimited 5G
                      Data for eligible subscribers
                    </Text>
                    <View style={styles.iconsAndDetailsRow}>
                      <View style={styles.iconsRow}>
                        <Image
                          source={require("../assets/g5.png")}
                          style={styles.icon}
                        />
                        <Image
                          source={require("../assets/movie.png")}
                          style={styles.icon}
                        />
                        <Image
                          source={require("../assets/music.png")}
                          style={styles.icon}
                        />
                      </View>
                      <TouchableOpacity>
                        <Text style={styles.details}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.planCard}>
                    <View style={styles.offerTag}>
                      <Text style={styles.offerText}>Republic Day Offer</Text>
                    </View>
                    <Text style={styles.price}>₹3,599</Text>
                    <View style={styles.planDetails}>
                      <Text style={styles.label}>Validity</Text>
                      <Text style={styles.value}>365 Days</Text>
                    </View>
                    <View style={styles.planDetails}>
                      <Text style={styles.label}>Data</Text>
                      <Text style={styles.value}>Unlimited 5G + 2.5GB/day</Text>
                    </View>
                    <Text style={styles.desc}>
                      Voice: Unlimited Calls | SMS: 100 SMS/day Get Unlimited 5G
                      Data for eligible subscribers
                    </Text>
                    <View style={styles.iconsAndDetailsRow}>
                      <View style={styles.iconsRow}>
                        <Image
                          source={require("../assets/g5.png")}
                          style={styles.icon}
                        />
                        <Image
                          source={require("../assets/movie.png")}
                          style={styles.icon}
                        />
                        <Image
                          source={require("../assets/music.png")}
                          style={styles.icon}
                        />
                        <Image
                          source={require("../assets/cloud.png")}
                          style={styles.icon}
                        />
                      </View>
                      <TouchableOpacity>
                        <Text style={styles.details}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Other Categories Content */}
              {selectedCategory !== "Recommended Packs" && (
                <View>
                  {filteredPacks.map((pack, index) => (
                    <View key={index} style={styles.planCard}>
                      <Text style={styles.price}>₹{pack.amount}</Text>
                      <View style={styles.planDetails}>
                        <Text style={styles.label}>Validity</Text>
                        <Text style={styles.value}>{pack.validity}</Text>
                      </View>
                      <View style={styles.planDetails}>
                        <Text style={styles.label}>Data</Text>
                        <Text style={styles.value}>{pack.data}</Text>
                      </View>
                      <Text style={styles.desc}>{pack.description}</Text>
                      <TouchableOpacity>
                        <Text style={styles.details}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    width: "90%",
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignSelf: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },
  categoryTabs: {
    flexDirection: "row",
    marginBottom: -500,
  },
  categoryTabContainer: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryTab: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
  },
  activeCategoryTab: {
    fontWeight: "bold",
    color: Theme.colors.primary,
  },
  underline: {
    height: 3,
    width: "100%",
    backgroundColor: Theme.colors.primary,
    marginTop: 5,
    borderRadius: 2,
  },
  recommendedPacksContainer: {
    paddingHorizontal: 10,
    marginTop: 50,
  },
  planCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 3,
    position: "relative",
  },
  offerTag: {
    position: "absolute",
    top: 5,
    left: 10,
    backgroundColor: "#FF6F00",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  offerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
  },
  planDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    color: "gray",
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 12,
    color: "gray",
    marginVertical: 5,
  },
  details: {
    color: "green",
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  iconsRow: {
    flexDirection: "row",
    // marginVertical: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  iconsAndDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
});

export default RechargeScreen;
