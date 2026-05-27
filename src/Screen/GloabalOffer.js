import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import Theme from "../../components/Theme";

// Dummy Data
const PresentOffer = [
  {
    id: 1,
    type: "bus",
    Title: "Save up to Rs 250 on bus tickets",
    valid: "31 Dec",
    code: "BUS30",
  },
  {
    id: 2,
    type: "bus",
    Title: "Flat Rs 100 off on first bus booking",
    valid: "15 Jan",
    code: "NEWBUS100",
  },
  {
    id: 3,
    type: "train",
    Title: "Save up to Rs 500 on train tickets",
    valid: "31 Dec",
    code: "TRAIN500",
  },
  {
    id: 4,
    type: "train",
    Title: "20% cashback on train ticket bookings",
    valid: "28 Feb",
    code: "CASHBACK20",
  },
];

// Single Offer Card
const OfferCard = ({ title, valid, code, type, color, navigation }) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("aboutOffer", { title, valid, code, type, color })
    }
    style={[styles.card, { backgroundColor: color }]}
  >
    <Text style={styles.offerType}>{type}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.details}>Valid till: {valid}</Text>

    <TouchableOpacity style={styles.codeContainer}>
      <Svg width="24" height="24" viewBox="0 0 24 24">
        <Rect width="24" height="24" fill="none" />
        <Path
          fill="#333"
          d="M11.38 17.41c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.63.58A2.04 2.04 0 0 0 11.21 0H5C3.9 0 3 .9 3 2v6.21c0 .53.21 1.04.59 1.41zM7.25 3a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5"
        />
      </Svg>
      <Text style={styles.codeText}>Code: {code}</Text>
    </TouchableOpacity>

    <Image
      style={styles.offerImage}
      source={
        type === "bus"
          ? require("../../assets/Offers/bus.png")
          : require("../../assets/Offers/train.png")
      }
    />
  </TouchableOpacity>
);

const GlobalOffer = () => {
  const navigation = useNavigation();
  const [selectedBtn, setSelectedBtn] = useState("All");
  const [selectedData, setSelectedData] = useState(PresentOffer);

  const filterOffers = () => {
    if (selectedBtn.toLowerCase() === "bus") {
      setSelectedData(PresentOffer.filter((item) => item.type === "bus"));
    } else if (selectedBtn.toLowerCase() === "train") {
      setSelectedData(PresentOffer.filter((item) => item.type === "train"));
    } else {
      setSelectedData(PresentOffer);
    }
  };

  useEffect(() => {
    filterOffers();
  }, [selectedBtn]);

  const getColor = (type) => (type === "bus" ? "#FF7F7F" : "#87CEFA");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Offers</Text>
          <Text style={styles.subHeading}>
            Get Best Deals with Great Offers
          </Text>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {["Bus"].map((btn) => (
            <Button
              key={btn}
              onPress={() => setSelectedBtn(btn)}
              style={[
                styles.filterButton,
                selectedBtn === btn && styles.selectedFilterButton,
              ]}
              labelStyle={[
                styles.filterButtonText,
                selectedBtn === btn && styles.selectedFilterText,
              ]}
            >
              {btn}
            </Button>
          ))}
        </View>

        {/* Offer List */}
        <FlatList
          data={selectedData}
          renderItem={({ item }) => (
            <OfferCard
              title={item.Title}
              valid={item.valid}
              code={item.code}
              type={item.type}
              color={getColor(item.type)}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  header: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subHeading: {
    fontSize: 16,
    color: "#777",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterButton: {
    marginHorizontal: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: Theme.colors.secondary,
  },
  selectedFilterButton: {
    backgroundColor: "#FF7F7F",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#555",
  },
  selectedFilterText: {
    color: Theme.colors.secondary,
  },
  card: {
    width: 340,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  offerType: {
    color: Theme.colors.secondary,
    backgroundColor: "#777",
    borderRadius: 10,
    paddingHorizontal: 10, // Horizontal padding to maintain spacing
    paddingVertical: 5, // Vertical padding for content height
    alignSelf: "flex-start", // Shrink the container to fit content
    textTransform: "capitalize",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  codeText: {
    color: "#333",
    marginLeft: 5,
  },
  offerImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});

export default GlobalOffer;
