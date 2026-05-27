// ComplaintSuccessScreen.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Platform,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';

// If you're using bare React Native: `npm i @react-native-clipboard/clipboard`
import Clipboard from "@react-native-clipboard/clipboard";

// Props:
// - navigation (optional): for Go Home / Track Complaint
// - route.params = { txnRefId, complaintId } (optional)
const ComplaintSuccessScreen = ({ navigation, route }) => {
  const PURPLE = "#6f3cff";

  const {
    txnRefId = "CC015896DGBR36547855",
    complaintId = "CC0154896525485",
  } = route?.params || {};

  const message = useMemo(
    () =>
      `Your BillPayment Complaint has been registered successfully for B-Connect TXN ID ${txnRefId}. Your Complaint ID is ${complaintId}. You can track status of your complaint using your Complaint ID.`,
    [txnRefId, complaintId]
  );

  const copyToClipboard = (label, value) => {
    try {
      Clipboard.setString(value);
      Alert.alert("Copied", `${label} copied to clipboard`);
    } catch (e) {
      Alert.alert("Copy failed", "Please try again.");
    }
  };

  const shareDetails = async () => {
    try {
      await Share.share({
        message:
          `Bill Payment Complaint Registered ✅\n\n` +
          `B-Connect TXN ID: ${txnRefId}\n` +
          `Complaint ID: ${complaintId}\n\n` +
          `You can track the status using the Complaint ID.`,
      });
    } catch {
      // no-op
    }
  };

  const goHome = () => {
    if (navigation?.navigate) navigation.navigate("Home");
  };

  const goTrack = () => {
    if (navigation?.navigate)
      navigation.navigate("ComplaintTrackingScreen", { complaintId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Success Badge */}
        <View style={[styles.badge, { borderColor: PURPLE }]}>
          <View style={[styles.checkWrap, { backgroundColor: PURPLE }]}>
            <Text style={styles.check}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Complaint Submitted</Text>

        {/* Summary card */}
        <View style={styles.card}>
          <Text style={styles.lead}>
            Your Bill Payment Complaint has been registered successfully.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>B-Connect TXN ID</Text>
            <Text style={styles.value} selectable>
              {txnRefId}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Complaint ID</Text>
            <Text style={styles.value} selectable>
              {complaintId}
            </Text>
          </View>

          <Text style={styles.note}>
            You can track the status of your complaint using your Complaint ID.
          </Text>

          {/* Quick actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: PURPLE }]}
              onPress={() => copyToClipboard("Txn Ref ID", txnRefId)}
            >
              <Text style={[styles.smallBtnText, { color: PURPLE }]}>
                B-Connect ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: PURPLE }]}
              onPress={() => copyToClipboard("Complaint ID", complaintId)}
            >
              <Text style={[styles.smallBtnText, { color: PURPLE }]}>
                Complaint ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallBtn, { borderColor: PURPLE }]}
              onPress={shareDetails}
            >
              <Text style={[styles.smallBtnText, { color: PURPLE }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Full message (collapsed on iOS/Android selectable text differences kept simple) */}
        <View style={styles.fullMsgWrap}>
          <Text style={styles.fullMsg} selectable>
            {message}
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: PURPLE }]}
            onPress={goTrack}
          >
            <Text style={styles.primaryText}>Track Complaint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: PURPLE }]}
            onPress={goHome}
          >
            <Text style={[styles.outlineText, { color: PURPLE }]}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
  },

  // Badge
  badge: {
    alignSelf: "center",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: Platform.OS === "ios" ? "600" : "700",
    lineHeight: 56,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: "#F8F6FF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E7E1FF",
  },
  lead: {
    fontSize: 14,
    color: "#3B3B3B",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#EEE8FF",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 13,
    color: "#6A6A6A",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: "#6A6A6A",
  },

  // Small actions
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Full message
  fullMsgWrap: {
    backgroundColor: "#FBFAFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE8FF",
    padding: 12,
  },
  fullMsg: {
    fontSize: 13,
    lineHeight: 18,
    color: "#333",
  },

  // CTAs
  ctaWrap: {
    marginTop: "auto",
    gap: 10,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  outlineBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  outlineText: {
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ComplaintSuccessScreen;
