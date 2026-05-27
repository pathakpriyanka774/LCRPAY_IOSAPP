import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Linking,
  PermissionsAndroid,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useSelector } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Buffer } from "buffer";
import { BASE_URL } from "../utils/config";

const COLORS = {
  primary: Theme?.colors?.primary || "#5F259F",
  secondary: Theme?.colors?.secondary || "#FFFFFF",
  bg: "#F6F7FB",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  pending: "#F59E0B",
  fail: "#DC2626",
  chipBg: "#EFE7FF",
};
const PAGE_SIZE = 20;

const normStatus = (val) => {
  if (val === undefined || val === null) return "unknown";
  const s = String(val).toLowerCase();
  if (["success", "completed", "1", "true"].includes(s)) return "success";
  if (["pending", "processing"].includes(s)) return "pending";
  if (["fail", "failed", "error", "false"].includes(s)) return "failed";
  return s || "unknown";
};

// LCR Money -> unified
const toUnifiedFromLcr = (r) => ({
  category: "LCR Money",
  transaction_amount: Number(r?.amount) || 0,
  transaction_date: r?.transactiondate || r?.validity || null,
  reference_id: r?.reference_id ? String(r?.reference_id) : null,
  purpose: r?.received_for || "LCR Money",
  remark: r?.remark || r?.other || "",
  status: "success", // entries in the ledger are posted
  transaction_type: String(r?.transactiontype || "credit").toLowerCase(), // credit/debit
});

const toUnifiedFromLcrReward = (r) => ({
  category: "LCR Reward",
  transaction_amount: Number(r?.amount) || 0,
  transaction_date: r?.transactiondate || r?.validity || null,
  reference_id: r?.reference_id ? String(r?.reference_id) : null,
  purpose: r?.received_for || "LCR REWARD",
  remark: r?.remark || r?.other || "",
  status: "success", // entries in the ledger are posted
  transaction_type: String(r?.transactiontype || "credit").toLowerCase(), // credit/debit
});

// Biller Payments -> unified
const toUnifiedFromBiller = (r) => ({
  category: "Bill Payments",
  transaction_amount: Number(r?.amount) || 0,
  transaction_date: r?.updated_at || r?.created_at || null,
  reference_id: r?.reference_id || r?.rrn || null,
  purpose: r?.gstin_numberservice_type || r?.purpose || "Bill Payment",
  remark: [r?.payment_mode, r?.rrn ? `RRN ${r.rrn}` : ""].filter(Boolean).join(" - "),
  status: normStatus(r?.status || r?.service_status),
  transaction_type: "debit", // paying out
  gstin_number: r?.gstin_number,
});

const fmtINR = (v) => {
  if (v === null || v === undefined || isNaN(Number(v))) return "Rs 0";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(v));
  } catch {
    return `Rs ${v}`;
  }
};

const statusMeta = (status) => {
  switch ((status || "").toLowerCase()) {
    case "success":
      return { color: COLORS.success, icon: "check-circle", label: "Success" };
    case "pending":
      return { color: COLORS.pending, icon: "hourglass-empty", label: "Pending" };
    case "fail":
    case "failed":
      return { color: COLORS.fail, icon: "cancel", label: "Failed" };
    default:
      return { color: COLORS.subtext, icon: "help-outline", label: "Unknown" };
  }
};

const titleFromTxn = (txn) => {
  const s = (txn?.status || "").toLowerCase();
  const t = (txn?.transaction_type || "").toLowerCase();
  if (s === "success") return t === "credit" ? "Payment Received" : "Payment Debited";
  if (s === "pending") return "Transaction Pending";
  if (s === "fail" || s === "failed") return "Transaction Failed";
  return "Transaction";
};

// Skeleton Loading Card
const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.cardTopRow}>
      <View style={[styles.skeletonText, { width: "50%", height: 18 }]} />
      <View style={[styles.skeletonBadge, { width: 80, height: 24 }]} />
    </View>
    <View style={[styles.skeletonText, { width: "70%", height: 14, marginVertical: 8 }]} />
    <View style={[styles.skeletonText, { width: "80%", height: 14, marginVertical: 8 }]} />
    <View style={[styles.skeletonText, { width: "40%", height: 16, marginTop: 12 }]} />
  </View>
);

const History = ({ route }) => {
  const info = useSelector((state) => state.wallet);
  const [transactions, setTransaction] = useState(info?.transactionHistory?.transactions || []);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Build categories dynamically from transactions; include "All"
  const categories = useMemo(() => {
    return ["Bill Payments", "LCR Money", "LCR Reward"];
  }, [transactions]);

  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const requestedInitialTab = route?.params?.initialTab;
  const [tab, setTab] = useState(
    ["Bill Payments", "LCR Money", "LCR Reward"].includes(requestedInitialTab)
      ? requestedInitialTab
      : "Bill Payments"
  ); // quick category tab
  const [category, setCategory] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState(""); // YYYY-MM-DD
  const [toDate, setToDate] = useState(""); // YYYY-MM-DD
  const [txnIdQuery, setTxnIdQuery] = useState("");
  const [loadingByTab, setLoadingByTab] = useState({}); // Track loading per tab

  useEffect(() => {
    const nextTab = route?.params?.initialTab;
    if (["Bill Payments", "LCR Money", "LCR Reward"].includes(nextTab) && nextTab !== tab) {
      setTab(nextTab);
    }
  }, [route?.params?.initialTab, tab]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    const min = minAmount !== "" && !isNaN(Number(minAmount)) ? Number(minAmount) : null;
    const max = maxAmount !== "" && !isNaN(Number(maxAmount)) ? Number(maxAmount) : null;

    const parseYMD = (s) => {
      if (!s || typeof s !== "string") return null;
      const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return null;
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    };
    const fromD = parseYMD(fromDate);
    const toD = parseYMD(toDate);

    const catActive = category && category !== "All" ? category : tab !== "All" ? tab : "All";

    return (transactions || []).filter((t) => {
      if (catActive !== "All" && t?.category !== catActive) return false;

      const amt = Number(t?.transaction_amount);
      if (!isNaN(amt)) {
        if (min !== null && amt < min) return false;
        if (max !== null && amt > max) return false;
      }

      const raw = t?.transaction_date;
      const dt = raw ? new Date(raw) : null;
      if (dt && !isNaN(dt.getTime())) {
        if (fromD && dt < fromD) return false;
        if (toD) {
          const toEnd = new Date(toD);
          toEnd.setHours(23, 59, 59, 999);
          if (dt > toEnd) return false;
        }
      }

      if (
        txnIdQuery &&
        !String(t?.reference_id || "").toLowerCase().includes(txnIdQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, tab, category, minAmount, maxAmount, fromDate, toDate, txnIdQuery]);

  const resetFilters = () => {
    setCategory("All");
    setMinAmount("");
    setMaxAmount("");
    setFromDate("");
    setToDate("");
    setTxnIdQuery("");
  };

  // ====================================================================
  // Helpers
  // ====================================================================

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchTransactions = async (isLoadMore = false) => {
    const tabName = tab;
    const currentOffset = isLoadMore ? offset + PAGE_SIZE : 0;

    if (isLoadMore) {
      setPaginationLoading(true);
    } else {
      setLoadingByTab((prev) => ({ ...prev, [tabName]: true }));
    }

    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        if (isLoadMore) {
          setPaginationLoading(false);
        } else {
          setLoadingByTab((prev) => ({ ...prev, [tabName]: false }));
        }
        Alert.alert("Error", "Authentication token missing. Please login again.");
        return;
      }

      let url = "";
      let mapper = (r) => r;
      let selectRows = (data) => [];

      if (tabName === "Bill Payments") {
        url = `${BASE_URL}/transaction/payment/history`;
        mapper = toUnifiedFromBiller;
        selectRows = (data) => (Array.isArray(data?.data) ? data.data : []);
      } else if (tabName === "LCR Money") {
        url = `${BASE_URL}/transaction/lcr_money_history`;
        mapper = toUnifiedFromLcr;
        selectRows = (data) => (Array.isArray(data?.records) ? data.records : []);
      } else if (tabName === "LCR Reward") {
        url = `${BASE_URL}/transaction/lcr_rewards_history`;
        mapper = toUnifiedFromLcrReward;
        selectRows = (data) => (Array.isArray(data?.records) ? data.records : []);
      }

      const { data } = await axios.get(url, {
        params: { limit: PAGE_SIZE, offset: currentOffset },
        headers,
      });

      const rows = selectRows(data);
      const unified = rows.map(mapper);

      setTransaction((prev) => (isLoadMore ? [...prev, ...unified] : unified));
      setOffset(currentOffset);
      setHasMore(rows.length === PAGE_SIZE);
    } catch (err) {
      console.log("fetchTransactions err:", err?.message);
      if (!isLoadMore) {
        setTransaction([]);
      }
    } finally {
      if (isLoadMore) {
        setPaginationLoading(false);
      } else {
        setLoadingByTab((prev) => ({ ...prev, [tabName]: false }));
      }
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setTransaction([]);
    fetchTransactions(false);
  }, [tab]);

  const isCurrentTabLoading = loadingByTab[tab] || false;



  // ===============================================================
  // Download Receipt
  // ===============================================================
  const DownloadReceipt = async (reference_id) => {
    try {
      if (!reference_id) {
        Alert.alert("Download unavailable", "Missing transaction reference id.");
        return;
      }

      const authHeaders = await getAuthHeaders();
      if (!authHeaders) {
        Alert.alert("Error", "Authentication token missing. Please login again.");
        return;
      }

      if (Platform.OS === "android") {
        const ok = await ensureStoragePermission();
        if (!ok) {
          Alert.alert(
            "Permission needed",
            "Storage permission is required to save and open the receipt."
          );
          return;
        }
      }

      setDownloadingId(reference_id);

      const headers = {
        ...authHeaders,
        Accept: "application/json",
      };

      const { data } = await axios.get(`${BASE_URL}/receipts/download/${reference_id}`, {
        headers,
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(new Uint8Array(data));
      const base64 = buffer.toString("base64");

      const { uri: fileUri, publicLocation } = await saveReceiptFile(base64, reference_id);

      const info = await FileSystem.getInfoAsync(fileUri);
      if (!info.exists || !info.size) {
        throw new Error("Receipt file not found or empty after save");
      }

      const openUrl =
        Platform.OS === "android" && !publicLocation
          ? await FileSystem.getContentUriAsync(fileUri)
          : fileUri;

      console.log("Opening receipt uri:", openUrl, "public:", publicLocation);

      try {
        await Linking.openURL(openUrl);
      } catch (linkErr) {
        console.log("Linking open failed:", linkErr?.message);
        Alert.alert("Receipt saved", `Saved to: ${fileUri}`);
      }

      console.log(
        "Receipt saved to:",
        fileUri,
        "size:",
        info.size || 0,
        "public:",
        publicLocation
      );
    } catch (err) {
      console.log("downloadReceipt err:", err?.message);
      Alert.alert("Download failed", "Unable to download receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const ensureStoragePermission = async () => {
    if (Platform.OS !== "android") return true;

    // For Android 11+ scoped storage, SAF handles access; only request legacy storage when needed.
    if (Platform.Version >= 30) return true;

    const perm = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const has = await PermissionsAndroid.check(perm);
    if (has) return true;

    const res = await PermissionsAndroid.request(perm);
    return res === PermissionsAndroid.RESULTS.GRANTED;
  };

  const saveReceiptFile = async (base64, referenceId) => {
    const filename = `receipt-${referenceId}.pdf`;

    // Try saving to a user-selected directory on Android so the file is visible in Downloads.
    if (Platform.OS === "android" && FileSystem.StorageAccessFramework) {
      try {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            "application/pdf"
          );
          await FileSystem.writeAsStringAsync(safUri, base64, { encoding: "base64" });
          return { uri: safUri, publicLocation: true };
        }
      } catch (err) {
        console.log("SAF save failed, falling back to app storage:", err?.message);
      }
    }

    // Fallback: save within app sandbox (documentDirectory preferred).
    const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    const dir = `${baseDir}receipts/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
    const fileUri = `${dir}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: "base64" });
    return { uri: fileUri, publicLocation: false };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Text style={styles.headerSubtitle}>Filter and track your activity</Text>
      </View>

      {/* Quick Category Tabs (scrollable chips) */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {categories.map((c) => {
            const active = tab === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => setTab(c)}
                activeOpacity={0.9}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Panel */}
      {filtersOpen && (
        <View style={styles.filtersPanel}>
          {/* Row: Amount */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Amount</Text>
            <View style={styles.rowInputs}>
              <TextInput
                value={minAmount}
                onChangeText={setMinAmount}
                placeholder="Min"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={COLORS.subtext}
              />
              <Text style={styles.rangeDash}>-</Text>
              <TextInput
                value={maxAmount}
                onChangeText={setMaxAmount}
                placeholder="Max"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={COLORS.subtext}
              />
            </View>
          </View>

          {/* Row: Date Range */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date range</Text>
            <View style={styles.rowInputs}>
              <TextInput
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="From (YYYY-MM-DD)"
                style={styles.input}
                placeholderTextColor={COLORS.subtext}
                autoCapitalize="none"
              />
              <Text style={styles.rangeDash}>-</Text>
              <TextInput
                value={toDate}
                onChangeText={setToDate}
                placeholder="To (YYYY-MM-DD)"
                style={styles.input}
                placeholderTextColor={COLORS.subtext}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Row: Category */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.rowInputs}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {categories.map((c) => {
                  const active = category === c;
                  return (
                    <TouchableOpacity
                      key={`cat_${c}`}
                      onPress={() => setCategory(c)}
                      style={[styles.catPill, active && styles.catPillActive]}
                    >
                      <Text style={[styles.catPillText, active && styles.catPillTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Row: Transaction ID */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Transaction ID</Text>
            <TextInput
              value={txnIdQuery}
              onChangeText={setTxnIdQuery}
              placeholder="Search (contains)"
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor={COLORS.subtext}
              autoCapitalize="none"
            />
          </View>

          {/* Actions */}
          <View style={styles.filterActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.resetBtn]}
              onPress={resetFilters}
              activeOpacity={0.9}
            >
              <MaterialIcons name="refresh" size={16} color={COLORS.text} />
              <Text style={[styles.actionText, { color: COLORS.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.applyBtn]}
              onPress={() => setFiltersOpen(false)}
              activeOpacity={0.9}
            >
              <MaterialIcons name="check" size={16} color="#fff" />
              <Text style={[styles.actionText, { color: "#fff" }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item, idx) => `${item?.reference_id || idx}`}
        renderItem={({ item: transaction, index: idx }) => {
          const st = statusMeta(transaction.status);
          const referenceId = transaction?.reference_id;
          return (
            <View style={styles.card}>
              {/* Top Row: Title + Status */}
              <View style={styles.cardTopRow}>
                <View style={styles.titleWrap}>
                  <MaterialIcons name={st.icon} size={18} color={st.color} />
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {titleFromTxn(transaction)}
                  </Text>
                </View>
                <View style={styles.topActions}>
                  <TouchableOpacity
                    onPress={() => DownloadReceipt(referenceId)}
                    style={styles.iconBtn}
                    activeOpacity={0.8}
                    disabled={!referenceId || downloadingId === referenceId}
                  >
                    <MaterialIcons
                      name="download"
                      size={20}
                      color={
                        !referenceId || downloadingId === referenceId
                          ? COLORS.subtext
                          : COLORS.primary
                      }
                    />
                  </TouchableOpacity>
                  <View style={[styles.statusBadge, { backgroundColor: `${st.color}1A` }]}>
                    <MaterialIcons name={st.icon} size={14} color={st.color} />
                    <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                  </View>
                </View>
              </View>

              {/* Purpose & Remark */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Purpose</Text>
                <Text style={styles.metaValue} numberOfLines={1}>
                  {transaction?.purpose || "-"}
                </Text>
              </View>
              {Boolean(transaction?.remark) && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Description</Text>
                  <Text style={styles.metaValue} numberOfLines={2}>
                    {transaction.remark}
                  </Text>
                </View>
              )}

              {transaction?.gstin_number && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>GSTIN Number</Text>
                  <Text style={styles.metaValue} numberOfLines={2}>
                    {transaction.gstin_number}
                  </Text>
                </View>
              )}

              {/* Amount */}
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amountValue}>{fmtINR(transaction?.transaction_amount)}</Text>
              </View>

              {/* Footer Row: ID & Date */}
              <View style={styles.footerRow}>
                <View style={styles.footerCol}>
                  <Text style={styles.footerLabel}>Transaction ID</Text>
                  <Text style={styles.footerValue} numberOfLines={1}>
                    {transaction?.reference_id || "-"}
                  </Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerCol}>
                  <Text style={styles.footerLabel}>Date & Time</Text>
                  <Text style={styles.footerValue} numberOfLines={2}>
                    {transaction?.transaction_date
                      ? new Date(transaction.transaction_date).toLocaleString()
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={[
          styles.listContent,
          filteredTransactions.length === 0 && !isCurrentTabLoading ? styles.listEmptyContent : null,
        ]}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          if (hasMore && !isCurrentTabLoading && !paginationLoading) {
            fetchTransactions(true);
          }
        }}
        ListEmptyComponent={
          isCurrentTabLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="receipt-long" size={28} color={COLORS.subtext} />
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptyText}>Adjust filters or try another category.</Text>
            </View>
          )
        }
        ListFooterComponent={
          paginationLoading ? (
            <View style={styles.paginationFooter}>
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text, letterSpacing: 0.2 },
  headerSubtitle: { marginTop: 2, fontSize: 12, color: COLORS.subtext },

  tabsContainer: { paddingVertical: 8 },
  tabsScroll: { paddingHorizontal: 12, gap: 8 },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabChipActive: { backgroundColor: COLORS.chipBg, borderColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.text, fontWeight: "600" },
  tabTextActive: { color: COLORS.primary },

  filterBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterBtnText: { color: COLORS.primary, fontWeight: "700" },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#E8F1FF",
    borderRadius: 999,
  },
  activeFilterText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },

  filtersPanel: {
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    ...Platform.select({ android: { elevation: 1 } }),
  },
  filterRow: { marginBottom: 12 },
  filterLabel: { fontSize: 12, color: COLORS.subtext, marginBottom: 6, fontWeight: "600" },
  rowInputs: { flexDirection: "row", alignItems: "center" },

  input: {
    flexGrow: 1,
    minWidth: 120,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 13,
  },
  rangeDash: { marginHorizontal: 8, color: COLORS.subtext },

  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
  },
  catPillActive: {
    backgroundColor: COLORS.chipBg,
    borderColor: COLORS.primary,
  },
  catPillText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },
  catPillTextActive: { color: COLORS.primary },

  filterActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtn: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
  },
  actionText: { fontWeight: "700", fontSize: 13 },

  listContent: { paddingHorizontal: 12, paddingBottom: 50 },
  listEmptyContent: { flexGrow: 1, justifyContent: "center" },

  loadingWrap: { alignItems: "center", paddingVertical: 28 },
  loadingText: { marginTop: 8, color: COLORS.subtext, fontSize: 12 },
  paginationFooter: { paddingVertical: 16, alignItems: "center" },

  emptyWrap: { alignItems: "center", paddingVertical: 36 },
  emptyTitle: { marginTop: 8, fontSize: 16, fontWeight: "700", color: COLORS.text },
  emptyText: { marginTop: 2, fontSize: 12, color: COLORS.subtext },

  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#EEEAF7",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  skeletonText: {
    backgroundColor: "#E8E8E8",
    borderRadius: 6,
    marginVertical: 2,
  },
  skeletonBadge: {
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },

  topActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: { fontSize: 12, fontWeight: "700" },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  metaLabel: { color: COLORS.subtext, fontSize: 12 },
  metaValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    maxWidth: "65%",
    textAlign: "right",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 6,
    borderColor: COLORS.border,
  },
  amountLabel: { color: COLORS.subtext, fontSize: 12 },
  amountValue: { fontSize: 16, fontWeight: "800", color: COLORS.primary, letterSpacing: 0.2 },

  footerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderColor: COLORS.border,
    marginTop: 6,
    paddingTop: 8,
  },
  footerCol: { flex: 1 },
  footerLabel: { color: COLORS.subtext, fontSize: 11, marginBottom: 2 },
  footerValue: { color: COLORS.text, fontSize: 12, fontWeight: "600" },
  footerDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 10 },
});

export default History;
