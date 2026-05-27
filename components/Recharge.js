// File: RechargeScreen.js — global search across all categories + refined UI

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import OperatorPopup from "./OperatorPopup";
import { useAppStore } from "../zustand/Store";
import axios from "axios";

/* ---------------- Session cache ---------------- */
export const GlobalPlans = {
  raw: null,
  categoryList: [],
  planById: {},
  categoryToPlanIds: {},
  lastUpdated: null,
};

const planToPack = (p, planId) => {
  const getAttr = (tag) =>
    (p.attributes || []).find((a) => a.tag?.toLowerCase() === tag.toLowerCase())?.value || null;

  const validity =
    p.validityInDays && p.validityInDays > 0
      ? `${p.validityInDays} Days`
      : getAttr("Validity") || "NA";

  const data =
    p.data || getAttr("Data") || (p.talktime ? `Talktime Rs${p.talktime}` : "-");

  return {
    planId,
    price: Number(p.amount),
    validity,
    data,
    description: p.description || "",
    raw: p,
  };
};

const COLORS = {
  primary: Theme?.colors?.primary || "#5F259F",
  secondary: Theme?.colors?.secondary || "#FFFFFF",
  bg: "#F6F7FB",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#E5E7EB",
  chipBg: "#EFE7FF",
};

/* ---------------- Screen ---------------- */
const RechargeScreen = () => {
  const { operatorCircle, setSelectedOperator } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);

  const [circleId, setCircleId] = useState(null);
  const [operatorId, setOperatorId] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [plansVersion, setPlansVersion] = useState(0); // bump to force re-render when plans cache changes
  const [categories, setCategories] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { contactName, contactNumber } = route.params || {};

  const [selectedCat, setSelectedCat] = useState(null);

  // NOTE: still numeric keyboard (as you wanted), but search now spans ALL categories.
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // animated underline for tabs
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineW = useRef(new Animated.Value(0)).current;
  const tabRefs = useRef({}); // store x & w for each tab

  // keep a ref to the search input so it never loses focus
  const searchRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: contactName || "Recharge" });
  }, [navigation, contactName]);

  const operatorlistWithImg = [
    { name: "Airtel Prepaid", logo: require("../assets/airtel.png") },
    { name: "BSNL Prepaid", logo: require("../assets/bsnl2.png") },
    { name: "Jio Prepaid", logo: require("../assets/jio.png") },
    { name: "Vi Prepaid", logo: require("../assets/vi.png") },
  ];
  const selectedOperatorImage =
    selectedLogo ||
    operatorlistWithImg.find(
      (item) => item.name.toLowerCase() === (operatorCircle?.operator || "").toLowerCase()
    )?.logo ||
    require("../assets/jio.png");

  const resetPlans = () => {
    GlobalPlans.raw = null;
    GlobalPlans.categoryList = [];
    GlobalPlans.planById = {};
    GlobalPlans.categoryToPlanIds = {};
    GlobalPlans.lastUpdated = Date.now();
    setSelectedCat(null);
    setQuery("");
    setCategories([]);
    tabRefs.current = {};
    underlineX.setValue(0);
    underlineW.setValue(0);
    setPlansVersion((v) => v + 1);
  };

  /* ---- SIM mapping ---- */
  const getSimProvider = async (mobile_no) => {
    try {
      setLoading(true);
      let number = String(mobile_no || "").replace(/^\+91\s?/, "").replace(/\s+/g, "");
      if (!number) return;

      const headers = { "Content-Type": "application/json", Accept: "application/json" };

      const response = await axios.post(
        `https://www.freecharge.in/api/fulfilment/nosession/fetch/operatorMapping`,
        { serviceNumber: number, productCode: "MR" },
        { headers }
      );

      const opId = response?.data?.data?.operatorId ?? null;
      const cirId = response?.data?.data?.circleId ?? null;
      setOperatorId(opId);
      setCircleId(cirId);

      resetPlans();
      const billerResponse = await axios.get(
        `https://www.freecharge.in/api/catalog/nosession/sub-category/SHORT_CODE/MR`
      );
      const billers = Array.isArray(billerResponse?.data?.data?.billers)
        ? billerResponse.data.data.billers
        : [];

      const biller = billers.find((b) => Number(b.operatorMasterId) === Number(opId)) || null;
      const circleObj = biller?.circles?.find((c) => Number(c.circleId) === Number(cirId)) || null;

      setSelectedOperator({
        circle: circleObj?.circleName || operatorCircle?.circle,
        operator: biller?.name || operatorCircle?.operator,
      });
      setSelectedLogo(
        operatorlistWithImg.find((item) => item.name.toLowerCase() === (biller?.name || "").toLowerCase())
          ?.logo || null
      );
      if (opId && cirId) {
        fetchPlans(opId, cirId);
      }
    } catch {
      // keep UI quiet on mapping errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contactNumber) getSimProvider(contactNumber);
  }, [contactNumber]);

  /* ---- Fetch plans when ids ready ---- */
  const fetchPlans = async (opId, cirId) => {
    try {
      setLoading(true);
      resetPlans();
      const res = await axios.get(
        `https://www.freecharge.in/rds/plans/${opId}/${cirId}/RlJFRUNIQVJHRV9WMnxBbW95bk1idWErUGVyK1pVSFZXUUhseE91RWREazRiNDJZRT0=`
      );

      const payload = res?.data?.data ?? null;
      if (!payload) throw new Error("Invalid plans response.");

      const { categoryDetails = [], planDetails = {} } = payload;

      console.log(opId, cirId, categoryDetails)
      const planById = {};
      Object.keys(planDetails).forEach((id) => (planById[id] = planDetails[id]));

      const categoryToPlanIds = {};
      const categoryList = [];
      categoryDetails.forEach((c) => {
        const ids = Array.isArray(c.planIds) ? c.planIds.map(String) : [];
        categoryToPlanIds[c.category] = ids;
        categoryList.push(c.category);
      });

      GlobalPlans.raw = payload;
      GlobalPlans.planById = planById;
      GlobalPlans.categoryToPlanIds = categoryToPlanIds;
      GlobalPlans.categoryList = categoryList;
      GlobalPlans.lastUpdated = Date.now();
      setCategories(categoryList);

      const preferred = ["Recommended", "Popular", "Unlimited", "Truly unlimited"];
      const pick =
        preferred.find((p) =>
          categoryList.find((c) => c.toLowerCase() === p.toLowerCase())
        ) || categoryList[0] || null;
      setSelectedCat(pick);
      setPlansVersion((v) => v + 1);

      // set initial underline to active tab
      setTimeout(() => moveUnderlineTo(pick), 0);
    } catch {
      // show empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (operatorId && circleId) fetchPlans(operatorId, circleId);
  }, [operatorId, circleId]);

  const onRefresh = () => {
    setRefreshing(true);
    if (operatorId && circleId) fetchPlans(operatorId, circleId);
    else if (contactNumber) getSimProvider(contactNumber);
    else setRefreshing(false);
  };

  /* ---- Build data views ---- */
  // Flatten ALL packs once (memoized) for fast global search
  const allPacks = useMemo(() => {
    const packs = [];
    categories.forEach((cat) => {
      const ids = GlobalPlans.categoryToPlanIds[cat] || [];
      ids.forEach((id) => {
        const p = GlobalPlans.planById[id];
        if (p) packs.push({ ...planToPack(p, id), _cat: cat });
      });
    });
    // remove duplicates if any (same plan id appearing in multiple cats)
    const seen = new Set();
    return packs.filter((pk) => (seen.has(pk.planId) ? false : (seen.add(pk.planId), true)));
  }, [plansVersion, categories]);

  // Packs in selected category (for normal browsing when search empty)
  const selectedCatPacks = useMemo(() => {
    if (!selectedCat) return [];
    const ids = GlobalPlans.categoryToPlanIds[selectedCat] || [];
    return ids
      .map((id) => {
        const p = GlobalPlans.planById[id];
        return p ? { ...planToPack(p, id), _cat: selectedCat } : null;
      })
      .filter(Boolean);
  }, [selectedCat, plansVersion]);

  // ✅ GLOBAL SEARCH: when query is present, search across ALL categories.
  const filteredPack = useMemo(() => {
    const q = query.trim();
    if (!q) return selectedCatPacks;

    // numeric-first search (your requirement) + soft text fallback if pasted
    const isNum = /^[0-9]+(\.[0-9]+)?$/.test(q);
    const qLower = q.toLowerCase();

    return allPacks.filter((pk) => {
      if (isNum) {
        // exact or substring match on price
        return Number(pk.price) === Number(q) || String(pk.price).includes(q);
      }
      // text fallback: rare, but works if user pastes a word
      return (
        pk.description?.toLowerCase().includes(qLower) ||
        pk.validity?.toLowerCase().includes(qLower) ||
        pk.data?.toLowerCase().includes(qLower) ||
        String(pk.price).includes(qLower) ||
        pk._cat?.toLowerCase().includes(qLower)
      );
    });
  }, [query, allPacks, selectedCatPacks]);

  // small summary when searching globally
  const searchSummary = useMemo(() => {
    if (!query.trim()) return null;
    const cats = new Set(filteredPack.map((p) => p._cat));
    return { count: filteredPack.length, catCount: cats.size };
  }, [filteredPack, query]);

  /* ---------------- UI parts ---------------- */
  const moveUnderlineTo = (category) => {
    const meta = tabRefs.current[category];
    if (!meta) return;
    Animated.spring(underlineX, { toValue: meta.x, useNativeDriver: false, tension: 180, friction: 18 }).start();
    Animated.spring(underlineW, { toValue: meta.w, useNativeDriver: false, tension: 180, friction: 18 }).start();
  };

  const TabChip = ({ category }) => {
    const active = selectedCat === category;
    return (
      <TouchableOpacity
        onLayout={(e) => {
          const { x, width } = e.nativeEvent.layout;
          tabRefs.current[category] = { x, w: width };
          if (active) moveUnderlineTo(category);
        }}
        onPress={() => {
          setSelectedCat(category);
          moveUnderlineTo(category);
        }}
        activeOpacity={0.9}
        style={[styles.tabBtn, active && styles.tabBtnActive]}
      >
        <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  // SINGLE-LINE validity + per-day data (truncates gracefully)
  const InlineInfo = ({ validity, data }) => (
    <Text style={styles.inlineInfo} numberOfLines={1} ellipsizeMode="tail">
      <Text style={styles.inlineLabel}>Validity: </Text>
      <Text style={styles.inlineValue}>{validity || "—"}</Text>
      <Text>   •   </Text>
      <Text style={styles.inlineLabel}>Data: </Text>
      <Text style={styles.inlineValue}>{data || "—"}</Text>
    </Text>
  );

  const PlanCard = ({ pack }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.planCard}
      onPress={() =>
        navigation.navigate("RechargeScreenPay", {
          contactName,
          contactNumber,
          pack,
          img: selectedOperatorImage,
          operator_code: operatorId,
          circle: operatorCircle.circle,
        })
      }
    >
      <View style={styles.cardTop}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>₹{pack.price}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <InlineInfo validity={pack.validity} data={pack.data} />
          {!!pack.description && <Text style={styles.desc} numberOfLines={3}>{pack.description}</Text>}
        </View>
        <MaterialIcons name="chevron-right" size={22} color={COLORS.subtext} />
      </View>

      {/* tiny tag showing where it came from when searching globally */}
      {!!query.trim() && !!pack._cat && (
        <View style={styles.catTag}>
          <Text style={styles.catTagText}>{pack._cat}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const SkeletonCard = () => (
    <View style={styles.planCard}>
      <View style={styles.cardTop}>
        <View style={[styles.priceBadge, { backgroundColor: "#EEE" }]}>
          <View style={{ width: 48, height: 16, backgroundColor: "#E6E6E6", borderRadius: 6 }} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ height: 14, backgroundColor: "#EEE", borderRadius: 6, marginBottom: 6 }} />
          <View style={{ height: 12, backgroundColor: "#EEE", borderRadius: 6, width: "70%" }} />
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <OperatorPopup
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectOperator={(op) => {
              setModalVisible(false);
              resetPlans();
              if (op?.operator) {
                setSelectedOperator({ operator: op.operator, circle: op.circle, logo: op.operatorLogo });
              }
              if (op?.operatorLogo) setSelectedLogo(op.operatorLogo);

              if (op?.operatorId) setOperatorId(op.operatorId);
              if (op?.circleId) setCircleId(op.circleId);

              if (op?.operatorId && op?.circleId) {
                fetchPlans(op.operatorId, op.circleId);
              }
            }}
          />

          {/* ----- Header card (SIM/number) ----- */}
          {contactNumber && (
            <View style={styles.headerCard}>
              <Image source={selectedOperatorImage} style={styles.logo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.number}>Number - {contactNumber}</Text>
                <Text style={styles.planMeta}>
                  {(operatorCircle?.operator || "Prepaid")}{operatorCircle?.circle ? ` - ${operatorCircle.circle}` : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.changeBtn}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ----- Search (kept OUTSIDE FlatList so it never remounts / lose focus) ----- */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#6B7280" />
            <TextInput
              ref={searchRef}
              style={styles.searchInput}
              placeholder="Search by amount (e.g., 349)"
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                // keep keyboard up on first key — defensive
                if (searchRef.current) {
                  // No-op focus call (Android sometimes drops focus on re-render)
                  searchRef.current.isFocused?.() || searchRef.current.focus?.();
                }
              }}
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              inputMode="numeric"
              returnKeyType="search"
              blurOnSubmit={false}
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery("")} accessibilityLabel="Clear search">
                <MaterialIcons name="cancel" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* tiny result summary when searching globally */}
          {!!searchSummary && (
            <View style={styles.searchHint}>
              <MaterialIcons name="travel-explore" size={16} color={COLORS.primary} />
              <Text style={styles.searchHintText}>
                Showing {searchSummary.count} result{searchSummary.count === 1 ? "" : "s"} across {searchSummary.catCount} categor{searchSummary.catCount === 1 ? "y" : "ies"}
              </Text>
            </View>
          )}

          {/* ----- Tabs (outside FlatList to avoid remounts + keep underline animation smooth) ----- */}
          <View style={styles.tabsWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScroll}
              keyboardShouldPersistTaps="handled"
            >
              {categories.map((c) => (
                <TabChip key={c} category={c} />
              ))}
              <Animated.View
                style={[
                  styles.underline,
                  { transform: [{ translateX: underlineX }], width: underlineW },
                ]}
              />
            </ScrollView>
          </View>

          {/* ----- Plans list ----- */}
          <FlatList
            data={filteredPack}
            keyExtractor={(item) => String(item.planId)}
            renderItem={({ item }) => <PlanCard pack={item} />}
            ListEmptyComponent={
              loading ? (
                <View style={{ paddingHorizontal: 12 }}>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyWrap}>
                  <MaterialIcons name="receipt-long" size={28} color={COLORS.subtext} />
                  <Text style={styles.emptyText}>
                    {selectedCat
                      ? query.trim()
                        ? "No plans found across categories for your search."
                        : "No plans in this category."
                      : "Select a category to view plans."}
                  </Text>
                </View>
              )
            }
            contentContainerStyle={{ paddingBottom: 60 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* corner loader */}
          {loading && (
            <View style={styles.cornerLoader}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  /* header card */
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    marginHorizontal: 12,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  logo: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  number: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  planMeta: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  changeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  changeText: { fontSize: 13, color: COLORS.primary, fontWeight: "800" },

  /* search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.text, paddingVertical: 0 },

  /* search hint bar */
  searchHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F6F1FF",
    borderColor: COLORS.primary + "22",
    borderWidth: 1,
    marginTop: 8,
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchHintText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },

  /* tabs */
  tabsWrap: {
    marginTop: 10,
    paddingBottom: 4,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    gap: 12,
    position: "relative",
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtnActive: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  tabText: { fontSize: 13, color: COLORS.text, fontWeight: "600" },
  tabTextActive: { color: COLORS.primary },
  underline: {
    position: "absolute",
    height: 2,
    backgroundColor: COLORS.primary,
    bottom: 0,
    left: 12,
    borderRadius: 2,
  },

  /* list + cards */
  planCard: {
    backgroundColor: COLORS.secondary,
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#EEEAF7",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },

  // price badge with subtle “chip” look
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: COLORS.primary + "33",
    alignSelf: "flex-start",
  },
  priceBadgeText: { fontSize: 18, fontWeight: "900", color: COLORS.primary },

  // NEW: single-line inline info
  inlineInfo: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
    flexShrink: 1,
  },
  inlineLabel: {
    color: COLORS.subtext,
    fontWeight: "600",
  },
  inlineValue: {
    color: COLORS.text,
    fontWeight: "700",
  },

  desc: { fontSize: 12, color: COLORS.subtext, lineHeight: 18, marginTop: 6 },

  // category tag on card when searching globally
  catTag: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F7F3FF",
    borderWidth: 1,
    borderColor: COLORS.primary + "22",
  },
  catTagText: { fontSize: 10, fontWeight: "800", color: COLORS.primary },

  emptyWrap: { alignItems: "center", justifyContent: "center", paddingVertical: 24 },
  emptyText: { marginTop: 6, color: COLORS.subtext, fontSize: 13 },

  /* corner loader */
  cornerLoader: {
    position: "absolute",
    right: 14,
    bottom: 18,
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
});

export default RechargeScreen;
