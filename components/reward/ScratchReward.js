import {  StyleSheet, Text, View, Image } from "react-native";
import { useState } from "react";
import { ScratchCard } from "./ScratchCard";
import { useImage } from "@shopify/react-native-skia";
import Theme from "../Theme";
import { formatDate } from "../../utils";
import { useAppStore } from "../../zustand/Store";
import {SafeAreaView} from 'react-native-safe-area-context';

// Assets
import ScratchImage from "../../assets/1.png";

const ScratchReward = ({ item }) => {
  const { scratchCards } = useAppStore();
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100)
  );
  const image = useImage(ScratchImage);
  const isScratched =
    scratchCards.find((card) => card.id === item.id)?.IsScratched || false;

  if (!image) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardWrapper}>
        <ScratchCard
          key={`scratch-${randomNumber}`}
          style={styles.scratchCard}
          image={image}
          img_id={item.id}
        >
          <View style={styles.card}>
            <Image
              source={require("../../assets/referral2.png")}
              style={styles.logo}
            />
            <Text style={styles.cardText}>You Received</Text>
            <Text style={styles.rewardText}>{item.amount} LCR Coins</Text>
            <Text style={styles.cardDate}>
              Received Date: {formatDate(item.receivedDate)}
            </Text>
          </View>
        </ScratchCard>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardWrapper: {
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  scratchCard: {
    borderRadius: 16,
    width: 180,
    height: 180,
  },
  loading: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  rewardText: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.colors.primary,
  },
  cardDate: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
});

export default ScratchReward;
