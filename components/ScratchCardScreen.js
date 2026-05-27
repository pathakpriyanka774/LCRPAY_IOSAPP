import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import Theme from "./Theme";
import { withAlpha } from "../utils/helper";
import { Modal } from "react-native-paper";
import { BASE_URL } from "../utils/config";
import ScratchReward from "./reward/ScratchReward";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDate } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppStore } from "../zustand/Store";

const { width } = Dimensions.get("window");

const ScratchCardScreen = () => {
  const { scratchCards, setScratchCards } = useAppStore();
  const [selectedScratchCard, setSelectedScratchCard] = useState(null);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const user = useSelector((state) => state.register.user);
  const referralCode = user.user?.member_id || "Not Available";

  useEffect(() => {
    const fetchScratchCards = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.warn("No access token found");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const userId = user.user?.member_id;
        if (!userId) return;

        const response = await axios.get(
          `${BASE_URL}/referral/lcrmoneydetail?userid=${userId}`,
          { headers }
        );

        if (response.status === 200 && Array.isArray(response.data.data)) {
          // Filter scratch cards where amount > 0
          const cards = response.data.data
            .filter((item) => item.amount > 0)
            .map((item, index) => ({
              id: index.toString(),
              amount: item.amount,
              receivedDate: item.date,
              IsScratched: item.status === 1,
              member_id: userId,
            }));
          setScratchCards(cards);
        } else {
          setScratchCards([]);
        }
      } catch (error) {
        console.error("Error fetching scratch card data:", error.message);
        setScratchCards([]);
      }
    };

    fetchScratchCards();
  }, [user, setScratchCards]);

  const handleScratchCard = (item) => {
    if (!item.IsScratched) {
      setSelectedScratchCard(item);
      showModal();
    }
  };

  const containerStyle = {
    marginHorizontal: width / 2 - 120,
    padding: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 220,
    maxWidth: 240,
    borderRadius: 14,
    overflow: "hidden",
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, item.IsScratched && styles.cardScratched]}
      onPress={() => handleScratchCard(item)}
      disabled={item.IsScratched}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardBadge}>
          {item.IsScratched ? "Claimed" : "Tap to reveal"}
        </Text>
        <Text style={styles.cardId}>ID: {item.member_id}</Text>
      </View>
      <View style={styles.cardContent}>
        {item.IsScratched ? (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Image
              source={require("../assets/Scratch.png")}
              style={styles.logo}
            />
            <Text style={styles.cardText}>You received</Text>
            <Text style={styles.cardAmount}>{item.amount} LCR Coins</Text>
            <Text style={styles.cardDate}>
              Received: {formatDate(item.receivedDate)}
            </Text>
          </View>
        ) : (
          <Image
            source={require("../assets/1.png")}
            style={{ width: 170, height: 180, borderRadius: 12 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        Rewards waiting: {scratchCards.length} scratch card
        {scratchCards.length !== 1 ? "s" : ""}
      </Text>

      <FlatList
        data={scratchCards}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No scratch cards yet</Text>
            <Text style={styles.emptySubtitle}>
              Share your referral code to unlock rewards.
            </Text>
          </View>
        }
      />

      <Modal
        visible={visible}
        transparent
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <View style={{ flex: 1 }}>
          {selectedScratchCard && <ScratchReward item={selectedScratchCard} />}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg,
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 14,
    backgroundColor: Theme.colors.secondary,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
    }),
  },
  cardScratched: {
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  cardBadge: {
    backgroundColor: withAlpha(Theme.colors.primary, 0.15),
    color: Theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "700",
    fontSize: 11,
  },
  cardId: {
    fontSize: 11,
    color: Theme.colors.subtext,
  },
  cardContent: {
    alignItems: "center",
    paddingBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: Theme.colors.text,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
    color: Theme.colors.primary,
  },
  cardDate: {
    fontSize: 12,
    color: Theme.colors.subtext,
    marginTop: 6,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 12,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Theme.colors.subtext,
    marginTop: 6,
  },
});

export default ScratchCardScreen;
