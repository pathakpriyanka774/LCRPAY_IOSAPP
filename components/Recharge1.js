import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, InteractionManager, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import Contacts from "react-native-contacts";
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from "./Theme";

const COLORS = {
  primary: Theme?.colors?.primary || "#5F259F",
  secondary: "#FFFFFF",
  bg: "#F6F7FB",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  chipBg: "#EFE7FF",
  danger: "#EF4444",
};

const CHUNK = 100;        // append 100 at a time for browsing all
const INDEX_CHUNK = 800;  // index-building chunk size (bigger chunks reduce overhead)
const SEARCH_RESULT_CAP = 300; // limit results to keep UI smooth

// Idle-ish scheduler
const scheduleIdle = (fn) => {
  if (typeof global.requestIdleCallback === "function") {
    return requestIdleCallback(fn, { timeout: 100 });
  }
  if (typeof global.requestAnimationFrame === "function") {
    return requestAnimationFrame(() => fn({ timeRemaining: () => 16 }));
  }
  return setTimeout(fn, 0);
};

const digitsOnly = (s = "") => s.replace(/[^\d]/g, "");
const norm = (s = "") => s.toLowerCase().trim();

const Recharge1 = () => {
  const navigation = useNavigation();

  // Permission
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Search bar state
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Browse-all dataset & progressive render
  const allRef = useRef([]);             // full cleaned contacts
  const [browsingAll, setBrowsingAll] = useState(false);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [visibleContacts, setVisibleContacts] = useState([]);
  const appendedIndexRef = useRef(0);
  const appendingRef = useRef(false);

  // Background index (for fast local search)
  const indexRef = useRef([]); // { id, nameLower, numsDigits[], refIndex }
  const [indexReady, setIndexReady] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState({ built: 0, total: 0 });

  // Number picker removed — direct navigation always

  const numbersSetRef = useRef(new Set());
  const [unknownProceedDigits, setUnknownProceedDigits] = useState("");



  // Errors
  const [errorMsg, setErrorMsg] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  /* ---------------- Permissions ---------------- */
  useEffect(() => {
    let permissionCheckCompleted = false;
    
    (async () => {
      try {
        console.log("Starting permission check...");
        
        if (Platform.OS === "android") {
          console.log("Android permission check");
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "Contacts Permission",
              message: "We need access to your contacts to let you pick numbers for recharge.",
              buttonPositive: "Allow",
              buttonNegative: "Deny",
            }
          );
          console.log("Android permission result:", granted);
          permissionCheckCompleted = true;
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
            setPermissionDenied(false);
          } else {
            setHasPermission(false);
            setPermissionDenied(true);
          }
        } else {
          // iOS: Check contacts permission
          console.log("iOS permission check");
          try {
            const status = await Contacts.checkPermission();
            console.log("iOS permission status:", status);
            permissionCheckCompleted = true;
            
            // Handle all possible iOS permission states
            if (status === 'authorized' || status === 'granted') {
              setHasPermission(true);
              setPermissionDenied(false);
            } else if (status === 'denied' || status === 'restricted') {
              setHasPermission(false);
              setPermissionDenied(true);
            } else if (status === 'undefined' || status === 'limited') {
              // Request permission for iOS
              console.log("Requesting iOS permission...");
              const permission = await Contacts.requestPermission();
              console.log("iOS permission request result:", permission);
              if (permission === 'authorized' || permission === 'granted') {
                setHasPermission(true);
                setPermissionDenied(false);
              } else {
                setHasPermission(false);
                setPermissionDenied(true);
              }
            } else {
              // Unknown status, assume denied for safety
              console.log("Unknown iOS permission status:", status);
              setHasPermission(false);
              setPermissionDenied(true);
            }
          } catch (iosError) {
            console.error("iOS permission error:", iosError);
            permissionCheckCompleted = true;
            // Fallback: assume permission denied on error
            setHasPermission(false);
            setPermissionDenied(true);
            setErrorMsg("Failed to check contacts permission.");
          }
        }
      } catch (error) {
        console.error("Permission error:", error);
        permissionCheckCompleted = true;
        setHasPermission(false);
        setPermissionDenied(true);
        setErrorMsg("Failed to request permission.");
      }
    })();
    
    // Add timeout to prevent infinite loading - increased to 10 seconds
    const timeout = setTimeout(() => {
      if (!permissionCheckCompleted && !hasPermission && !permissionDenied) {
        console.log("Permission check timeout - assuming denied");
        setHasPermission(false);
        setPermissionDenied(true);
        setErrorMsg("Permission check timed out. Please try again.");
      }
    }, 10000); // Increased to 10 seconds for better iOS compatibility
    
    return () => clearTimeout(timeout);
  }, []);

  const getContactName = (c) =>
    c.displayName || `${c.givenName || ""} ${c.familyName || ""}`.trim() || "Unknown";

  // ------ Cache helpers ------
  const CACHE_KEY = "CONTACTS_CACHE_V1";
  const minimalize = (c) => ({
    recordID: c.recordID,
    givenName: c.givenName,
    familyName: c.familyName,
    displayName: c.displayName,
    _name: c._name || getContactName(c),
    phoneNumbers: (c.phoneNumbers || []).map((n) => ({ label: n.label, number: n.number })),
  });

  const saveCache = async (arr) => {
    try {
      const payload = JSON.stringify(arr.map(minimalize));
      await AsyncStorage.setItem(CACHE_KEY, payload);
    } catch { }
  };

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Build lightweight search index in background chunks
  const startIndexing = useCallback((cleaned) => {
    if (!mountedRef.current) return;
    setIndexing(true);
    setIndexReady(false);
    setIndexProgress({ built: 0, total: cleaned.length });
    indexRef.current = [];
    numbersSetRef.current = new Set();

    let i = 0;
    let cancelled = false;
    const buildChunk = () => {
      if (cancelled || !mountedRef.current) return;
      if (i >= cleaned.length) {
        setIndexing(false);
        setIndexReady(true);
        return;
      }
      const end = Math.min(i + INDEX_CHUNK, cleaned.length);
      const slice = cleaned.slice(i, end).map((c, idx) => {
        const numsDigits = (c.phoneNumbers || [])
          .map((n) => digitsOnly(n?.number || ""))
          .map((d) => (d.length > 10 ? d.slice(-10) : d)); // ✅ always store last 10 digits

        numsDigits.forEach((d) => { if (d && d.length >= 10) numbersSetRef.current.add(d.slice(-10)); });
        return {
          id: c.recordID || `${i + idx}`,
          nameLower: norm(c._name),
          numsDigits,
          refIndex: i + idx,
        };
      });
      indexRef.current.push(...slice);
      i = end;
      setIndexProgress({ built: i, total: cleaned.length });
      scheduleIdle(buildChunk);
    };
    scheduleIdle(buildChunk);
    return () => { cancelled = true; };
  }, []);

  /* ---------------- Load cache ASAP ---------------- */
  useEffect(() => {
    (async () => {
      const cached = await loadCache();
      if (cached && cached.length > 0) {
        allRef.current = cached.map((c) => ({ ...c, _name: c._name || getContactName(c) }));
        // Show immediately
        setBrowsingAll(true);
        setVisibleContacts([]);
        appendedIndexRef.current = 0;
        appendNextChunk(true);
        // Build index in background from cache if none yet
        if (indexRef.current.length === 0) startIndexing(allRef.current);
      }
    })();
  }, [startIndexing]);

  /* ---------------- Background prefetch from device ---------------- */
  useEffect(() => {
    if (!hasPermission) return;
    const start = async () => {
      try {
        await new Promise((res) => InteractionManager.runAfterInteractions(res));
        const all = await Contacts.getAllWithoutPhotos();
        const cleaned = (all || [])
          .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
          .map((c) => ({ ...c, _name: getContactName(c) }));

        allRef.current = cleaned;
        // Save cache in background
        saveCache(cleaned);
        startIndexing(cleaned);
        setBrowsingAll(true);
      } catch (error) {
        console.error("Error loading contacts:", error);
        setErrorMsg("Failed to load contacts. Please check permissions.");
      }
    };
    start();
  }, [hasPermission, startIndexing]);

  /* ---------------- Search logic ---------------- */
  const searchTimer = useRef(null);

  const runLocalIndexSearch = (q) => {
    const qLower = norm(q);
    const qDigits = digitsOnly(q);
    const out = [];
    const idx = indexRef.current;

    // If user typed 10-digit number → filter by exact number
    if (qDigits.length === 10) {
      const normalized = qDigits.slice(-10); // always last 10 digits
      for (let k = 0; k < idx.length; k++) {
        const it = idx[k];
        if (it.numsDigits.some((d) => d === normalized)) {
          out.push(allRef.current[it.refIndex]);
        }
      }
    }

    // Otherwise, if it's not a full number → fallback to name search
    else if (qLower.length > 0) {
      for (let k = 0; k < idx.length; k++) {
        const it = idx[k];
        if (it.nameLower.includes(qLower)) {
          out.push(allRef.current[it.refIndex]);
        }
      }
    }

    out.sort((a, b) => (a._name || "").localeCompare(b._name || ""));
    return out;
  };




  const last10 = (d = "") => {
    const s = digitsOnly(d);
    return s.length >= 10 ? s.slice(-10) : "";
  };


  const isKnownNumber = (d) => {
    if (!d) return false;
    const raw = digitsOnly(d);
    const l10 = last10(d);
    return (
      !!l10 && numbersSetRef.current.has(l10)
    );
  };

  const onChangeSearchText = (text) => {
    setSearchText(text);
    const rawDigits = digitsOnly(text);
    const candidate = last10(rawDigits);
    const known = candidate ? isKnownNumber(candidate) : false;

    setUnknownProceedDigits(candidate && !known ? candidate : "");


    if (!hasPermission) return;

    if (searchTimer.current) clearTimeout(searchTimer.current);
    const q = text.trim();

    if (!q) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      try {
        setSearchLoading(true);

        // Prefer local index (once ready). Fall back to native while building.
        if (indexReady) {
          const res = runLocalIndexSearch(q);
          setSearchResults(res);
        } else {
          // Native search (non-blocking UI)
          try {
            await new Promise((res) => InteractionManager.runAfterInteractions(res));
            const matches = await Contacts.getContactsMatchingString(q);
            const cleaned = (matches || [])
              .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
              .map((c) => ({ ...c, _name: getContactName(c) }));
            // sort only small result set, keeps UX stable
            cleaned.sort((a, b) => (a._name || "").localeCompare(b._name || ""));
            setSearchResults(cleaned.slice(0, SEARCH_RESULT_CAP));
          } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
          }
        }
      } catch {
        // Ignore transient search errors
      } finally {
        setSearchLoading(false);
      }
    }, 200); // tight debounce for responsiveness
  };

  /* ---------------- Browse all (on demand) ---------------- */
  const startBrowseAll = async () => {
    if (!hasPermission) return;
    setBrowsingAll(true);
    setBrowseLoading(true);
    setSearchText("");
    setSearchResults([]);

    try {
      // If background has already fetched, just show it
      if (allRef.current.length > 0) {
        appendedIndexRef.current = 0;
        setVisibleContacts([]);
        appendNextChunk(true);
      } else {
        // Fallback if background fetch failed somehow
        await new Promise((res) => InteractionManager.runAfterInteractions(res));
        const all = await Contacts.getAllWithoutPhotos();
        const cleaned = (all || [])
          .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
          .map((c) => ({ ...c, _name: getContactName(c) }))
          .sort((a, b) => (a._name || "").localeCompare(b._name || ""));
        allRef.current = cleaned;
        appendedIndexRef.current = 0;
        setVisibleContacts([]);
        appendNextChunk(true);
      }
    } finally {
      setBrowseLoading(false);
    }
  };

  // Auto-load the full list on mount so contacts appear immediately.
  useEffect(() => {
    if (hasPermission && !browsingAll) {
      startBrowseAll();
    }
  }, [hasPermission]);


  const appendNextChunk = (immediate = false) => {
    if (appendingRef.current) return;
    const all = allRef.current || [];
    if (appendedIndexRef.current >= all.length) return;

    const doAppend = () => {
      appendingRef.current = true;
      const start = appendedIndexRef.current;
      const end = Math.min(start + CHUNK, all.length);
      const slice = all.slice(start, end);
      setVisibleContacts((prev) => (start === 0 ? slice : [...prev, ...slice]));
      appendedIndexRef.current = end;
      appendingRef.current = false;
    };

    if (immediate) doAppend();
    else scheduleIdle(doAppend);
  };



  /* ---------------- Navigation & Picker ---------------- */
  const sanitizeNumber = (num) => (num || "").replace(/\s+/g, "");

  const navigateWithNumber = (name, number) => {
    navigation.navigate("Recharge", {
      contactName: name || "Unknown",
      contactNumber: number,
    });
  };

  const handleContactPress = useCallback((contact) => {
    const nums = contact?.phoneNumbers || [];
    if (nums.length === 0) return;
    // Always navigate directly with primary number (no modal)
    return navigateWithNumber(contact._name || "Unknown", sanitizeNumber(nums[0]?.number));
  }, []);

  // NumberPicker removed

  /* ---------------- UI: list & cards ---------------- */
  const ContactCard = memo(({ item, onPress }) => {
    const name = item._name || "Unknown";
    const primaryNumber = item?.phoneNumbers?.[0]?.number || "-";
    // only show name, number, and leading icon

    // Simple name color
    const getAvatarColor = (s) => {
      const palette = [
        "#4CAF50", "#2196F3", "#9C27B0", "#F44336", "#FF9800", "#009688",
        "#673AB7", "#3F51B5", "#E91E63", "#795548", "#607D8B", "#FFC107",
      ];
      const n = (s || "X").split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
      return palette[n % palette.length];
    };



    return (
      <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.85}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(name) }]}>
          <Text style={styles.avatarText}>{(name[0] || "U").toUpperCase()}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.number} numberOfLines={1}>{primaryNumber}</Text>
        </View>
        {/* trailing empty to keep layout simple */}
        <View style={styles.trailing} />
      </TouchableOpacity>
    );
  });

  const renderEmpty = () => {
    if (!hasPermission) {
      if (permissionDenied) {
        return (
          <View style={styles.emptyWrap}>
            <MaterialIcons name="no-accounts" size={56} color={COLORS.subtext} />
            <Text style={styles.emptyTitle}>Permission denied</Text>
            <Text style={styles.emptyHint}>Enable contacts permission in Settings.</Text>
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                setHasPermission(false);
                setPermissionDenied(false);
                setErrorMsg("");
                // Trigger permission check again with improved logic
                const permissionCheck = async () => {
                  let permissionCheckCompleted = false;
                  try {
                    if (Platform.OS === "ios") {
                      const status = await Contacts.checkPermission();
                      console.log("Retry iOS permission status:", status);
                      permissionCheckCompleted = true;
                      
                      if (status === 'authorized' || status === 'granted') {
                        setHasPermission(true);
                        setPermissionDenied(false);
                      } else if (status === 'denied' || status === 'restricted') {
                        setPermissionDenied(true);
                      } else if (status === 'undefined' || status === 'limited') {
                        const permission = await Contacts.requestPermission();
                        console.log("Retry iOS permission request result:", permission);
                        if (permission === 'authorized' || permission === 'granted') {
                          setHasPermission(true);
                          setPermissionDenied(false);
                        } else {
                          setPermissionDenied(true);
                        }
                      } else {
                        setPermissionDenied(true);
                      }
                    }
                  } catch (error) {
                    console.error("Retry permission error:", error);
                    permissionCheckCompleted = true;
                    setPermissionDenied(true);
                  }
                  
                  // Add timeout for retry as well
                  setTimeout(() => {
                    if (!permissionCheckCompleted && !hasPermission && !permissionDenied) {
                      console.log("Retry permission check timeout - assuming denied");
                      setPermissionDenied(true);
                    }
                  }, 10000);
                };
                permissionCheck();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={styles.emptyWrap}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyText}>Checking permission…</Text>
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        </View>
      );
    }

    return (
      <View style={styles.emptyWrap}>
        <MaterialIcons name="search" size={56} color={COLORS.subtext} />
        <Text style={styles.emptyTitle}>No contacts to show</Text>
        <Text style={styles.emptyHint}>
          Try searching by name or number.
        </Text>
      </View>
    );
  };

  // defer search text if supported (RN with React 18+); otherwise pass-through
  const deferredSearch = (React.useDeferredValue || ((v) => v))(searchText);
  const data = useMemo(() => {
    if (deferredSearch.trim()) return searchResults;
    if (browsingAll) return visibleContacts;
    return [];
  }, [deferredSearch, searchResults, browsingAll, visibleContacts]);

  const onEndReached = () => {
    if (browsingAll) appendNextChunk(false);
  };

  const renderItem = useCallback(({ item }) => (
    <ContactCard item={item} onPress={handleContactPress} />
  ), [handleContactPress]);

  // Manual refresh button handler
  const refreshContacts = useCallback(async () => {
    if (refreshLoading) return;
    try {
      setRefreshLoading(true);
      const all = await Contacts.getAllWithoutPhotos();
      const cleaned = (all || [])
        .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
        .map((c) => ({ ...c, _name: getContactName(c) }));

      allRef.current = cleaned;
      saveCache(cleaned);
      startIndexing(cleaned);
    } catch (error) {
      console.error("Refresh contacts error:", error);
      setErrorMsg("Failed to refresh contacts. Please try again.");
    } finally {
      setRefreshLoading(false);
    }
  }, [refreshLoading]);

  /* ---------------- Render ---------------- */
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Contact</Text>

          <View style={styles.headerRight}>
            {indexing ? (
              <View style={styles.indexPill}>
                <MaterialIcons name="sync" size={14} color={COLORS.primary} />
                <Text style={styles.indexPillText}>
                  Indexing {indexProgress.built}/{indexProgress.total}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.headerBtn}
              onPress={refreshContacts}
              activeOpacity={0.9}
              disabled={refreshLoading}
            >
              {refreshLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <MaterialIcons name="refresh" size={18} color={COLORS.primary} />
              )}
              <Text style={styles.headerBtnText}>{refreshLoading ? "Refreshing" : "Refresh"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="searchBar" style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={COLORS.subtext} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or number"
            placeholderTextColor={COLORS.subtext}
            value={searchText}
            onChangeText={onChangeSearchText}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => onChangeSearchText("")}>
              <MaterialIcons name="cancel" size={18} color={COLORS.subtext} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          {searchText ? (
            <Text style={styles.infoText}>
              {searchLoading ? "Searching…" : `${searchResults.length} match(es)${indexReady ? "" : " (native)"}`}
            </Text>
          ) : (
            <Text style={styles.infoText}>
              {browsingAll ? `${visibleContacts.length} / ${allRef.current.length} contacts` : "Loading contacts…"}
            </Text>
          )}

          {/* Removed explicit Load More button; infinite scroll handles pagination */}
        </View>

        {unknownProceedDigits ? (
          <TouchableOpacity
            style={[styles.card, { marginTop: 8 }]}
            onPress={() => navigateWithNumber("Unknown", unknownProceedDigits)}
            activeOpacity={0.9}
          >
            <View style={[styles.avatar, { backgroundColor: "#9CA3AF" }]}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={1}>Unknown</Text>
              <Text style={{ marginTop: 2, fontSize: 13, color: COLORS.subtext, width: "auto" }} numberOfLines={1}>{unknownProceedDigits}</Text>
            </View>
            <View style={styles.trailing}>
              <View style={styles.badge}>
                <MaterialIcons name="bolt" size={12} color={COLORS.primary} />
                <Text style={styles.badgeText}>Proceed</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={COLORS.subtext} />
            </View>
          </TouchableOpacity>
        ) : null}


        {/* List */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.recordID || String(index)}
          renderItem={renderItem}
          ListEmptyComponent={
            searchLoading || browseLoading ? (
              <View style={styles.emptyWrap}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.emptyText}>
                  {searchLoading ? "Searching…" : "Preparing contacts…"}
                </Text>
              </View>
            ) : (
              renderEmpty()
            )
          }
          contentContainerStyle={data.length === 0 ? { flex: 1 } : { paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.15}
          onEndReached={onEndReached}
          initialNumToRender={12}
          maxToRenderPerBatch={16}
          updateCellsBatchingPeriod={16}
          windowSize={15}
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
          getItemLayout={(_, index) => ({ length: 76, offset: 76 * index, index })}
        />


        {/* Number Picker removed */}
      </View>
    </SafeAreaView>
  );
};

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },

  indexPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  indexPillText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },

  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  infoText: { fontSize: 12, color: COLORS.subtext },

  loadMoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreText: { color: COLORS.primary, fontWeight: "700", fontSize: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEEAF7",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  cardBody: { flex: 1, marginLeft: 14 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  number: { marginTop: 2, fontSize: 13, color: COLORS.subtext },
  trailing: { alignItems: "flex-end", justifyContent: "center" },
  // simplified item UI — chips removed
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.primary + "22",
    marginBottom: 6,
  },
  badgeText: { color: COLORS.primary, fontWeight: "800", fontSize: 11 },

  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { marginTop: 12, color: COLORS.subtext, fontSize: 14 },
  emptyTitle: { marginTop: 6, color: COLORS.text, fontSize: 16, fontWeight: "700" },
  emptyHint: { marginTop: 2, color: COLORS.subtext, fontSize: 12, textAlign: "center" },
  errorText: { marginTop: 8, color: COLORS.danger, fontSize: 12, textAlign: "center" },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
  },

  // modal styles removed
});

export default Recharge1;
