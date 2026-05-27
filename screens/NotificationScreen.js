import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image, Linking, RefreshControl, Alert, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, X } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Theme from "../components/Theme";
import { BASE_URL } from "../utils/config";

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const LIMIT = 20;

  const fetchNotifications = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setPaginationLoading(true);
      } else {
        setLoading(true);
        setOffset(0);
      }

      const token = await AsyncStorage.getItem("access_token");
      const currentOffset = isLoadMore ? offset + LIMIT : 0;

      const response = await axios.get(
        `${BASE_URL}/notification/my-notifications`,
        {
          params: {
            limit: LIMIT,
            offset: currentOffset,
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || {};
      const items = data.items || [];
      const total = data.total_count || 0;

      console.log("Notification API response:", data.items);

      console.log("Notifications fetched:", items.length, "Total:", total);

      const mergedNotifications = isLoadMore
        ? [...notifications, ...items]
        : items;
      const moreAvailable =
        mergedNotifications.length < total && items.length > 0;

      setNotifications(mergedNotifications);
      setOffset(isLoadMore ? currentOffset : 0);

      setTotalCount(total);
      setHasMore(moreAvailable);
    } catch (err) {
      console.log("Fetch notifications error:", err.message);
    } finally {
      if (isLoadMore) {
        setPaginationLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const cleanContent = useCallback((content, vars) => {
    if (!content) return "";
    return content.replace(/\$\$(.+?)\$\$/g, (_, key) => {
      const cleanedKey = key?.trim();
      return (vars && cleanedKey && vars[cleanedKey]) || "";
    });
  }, []);

  const handleNotificationAction = useCallback((item) => {
    const dataObj = item?.data || {};
    
    // Check if it's a meeting notification
    const isMeeting = Boolean(dataObj?.meeting_title || dataObj?.deep_link?.includes('meet') || dataObj?.meet_url);

    const externalUrl = dataObj?.type === 'externallink' ? dataObj?.url : undefined;
    
    // Priority order for deep links:
    // 1. deep_link (Google Meet, Teams, etc.)
    // 2. meet_url (Google Meet specific)
    // 3. action_url (promotional links)
    const deepLink = dataObj?.deep_link || dataObj?.meet_url || dataObj?.action_url || externalUrl;
    
    if (isMeeting && deepLink) {
      // For meetings, open the deep link directly
      Linking.openURL(deepLink).catch((err) => {
        console.log("Failed to open meeting link:", err);
        Alert.alert("Unable to open link", "The meeting link could not be opened on this device.");
      });
    } else if (deepLink) {
      // For other notifications with deep links, navigate to app first then use deep link
      Linking.openURL(deepLink).catch((err) => {
        console.log("Failed to open link:", err);
        Alert.alert("Unable to open link", "The link could not be opened on this device.");
      });
    }
  }, []);

  const getActionLabel = useCallback((item) => {
    const dataObj = item?.data || {};
    
    // Return appropriate label based on notification type
    if (dataObj?.meeting_title) return "Join Meeting";
    if (dataObj?.type === 'externallink' && dataObj?.url) return "Open Link";
    if (dataObj?.deep_link) return "Open Link";
    if (dataObj?.action_url) return "View Offer";
    return "Learn More";
  }, []);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d)) return dateStr?.slice(0, 10) || "";
      return d.toLocaleDateString();
    } catch (e) {
      return dateStr?.slice(0, 10) || "";
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <NotificationCard
        item={item}
        onPressAction={handleNotificationAction}
        onPressCard={() => {
          setSelectedNotification(item);
          setDetailModalVisible(true);
        }}
        formatDate={formatDate}
        cleanContent={cleanContent}
        getActionLabel={getActionLabel}
      />
    ),
    [handleNotificationAction, formatDate, cleanContent, getActionLabel]
  );

  const keyExtractor = useCallback(
    (item, index) => `notif-${item?.id || index}`,
    []
  );

  const handleEndReached = () => {
    if (hasMore && !paginationLoading && !loading) {
      fetchNotifications(true);
    }
  };

  const renderFooter = () => {
    if (!paginationLoading) return null;
    return (
      <View style={styles.paginationLoader}>
        <Text style={styles.paginationText}>Loading more notifications...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Theme.colors.primary} barStyle="light-content" />
      <View style={styles.container}>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Bell size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Stay up to date with LCR Pay</Text>
          </View>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            notifications.length ? styles.listContent : styles.emptyContent
          }
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchNotifications(false)}
              tintColor="#5F259F"
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrapper}>
                  <Bell size={26} color="#B79AE0" />
                </View>
                <Text style={styles.emptyTitle}>You're all caught up</Text>
                <Text style={styles.emptySubtitle}>
                  New announcements will appear here once available.
                </Text>
              </View>
            ) : null
          }
        />

        {/* Full notification detail modal */}
        <NotificationDetailModal
          visible={detailModalVisible}
          notification={selectedNotification}
          onClose={() => {
            setDetailModalVisible(false);
            setSelectedNotification(null);
          }}
          onPressAction={handleNotificationAction}
          formatDate={formatDate}
          cleanContent={cleanContent}
          getActionLabel={getActionLabel}
        />
      </View>
    </SafeAreaView>
  );
}


const NotificationCard = React.memo(({ item, onPressAction, onPressCard, formatDate, cleanContent, getActionLabel }) => {
  // Handle both old format (vars) and new format (items from API)
  const vars = item?.vars || {};
  const dataObj = item?.data || {};

  // Use new format fields if available, fallback to old format
  const title = item?.title || vars?.title || "Notification";
  const body = item?.body || vars?.subtitle || "";
  const imageUrl = item?.image_url || vars?.image_url;
  const description = cleanContent(
    item?.content || vars?.content || "",
    vars
  );
  const ctaLink = dataObj?.cta_link || vars?.["ZOOM LINK"] || vars?.zoom_link || vars?.cta_link;
  const sentAt = item?.sent_at || item?.updated_at;
  const hasDeepLink = Boolean(dataObj?.deep_link || dataObj?.meet_url || dataObj?.action_url || (dataObj?.type === 'externallink' && dataObj?.url));
  const isRead = item?.status === 'read';

  return (
    <TouchableOpacity 
      style={[styles.card, isRead && styles.cardRead]}
      activeOpacity={0.7}
      onPress={onPressCard}
    >
      {!isRead && <View style={styles.unreadIndicator} />}
      
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, !isRead && styles.iconContainerActive]}>
          <Bell size={18} color={isRead ? "#B79AE0" : "#5F259F"} />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.title, !isRead && styles.titleBold]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.time}>{formatDate(sentAt)}</Text>
        </View>
      </View>

      {body ? (
        <Text style={[styles.subtitle, !isRead && styles.subtitleBold]} numberOfLines={2}>
          {body}
        </Text>
      ) : null}

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : null}

      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      {dataObj?.type === 'externallink' && dataObj?.url ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => Linking.openURL(dataObj.url).catch(() => {})}
        >
          <Text style={styles.linkText} numberOfLines={2}>
            {dataObj.url}
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Handle new deep link format OR old CTA link format */}
      {hasDeepLink ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => onPressAction(item)}
        >
          <Text style={styles.buttonText}>{getActionLabel(item)}</Text>
        </TouchableOpacity>
      ) : ctaLink ? (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => Linking.openURL(ctaLink).catch(() => {})}
        >
          <Text style={styles.buttonText}>
            {dataObj?.cta_label || vars?.cta_label || "Learn More"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
});

// Notification detail modal component
const NotificationDetailModal = React.memo(({ visible, notification, onClose, onPressAction, formatDate, cleanContent, getActionLabel }) => {
  if (!notification) return null;

  const vars = notification?.vars || {};
  const dataObj = notification?.data || {};
  const title = notification?.title || vars?.title || "Notification";
  const body = notification?.body || vars?.subtitle || "";
  const imageUrl = notification?.image_url || vars?.image_url;
  const description = cleanContent(
    notification?.content || vars?.content || "",
    vars
  );
  const ctaLink = dataObj?.cta_link || vars?.["ZOOM LINK"] || vars?.zoom_link || vars?.cta_link;
  const sentAt = notification?.sent_at || notification?.updated_at;
  const hasDeepLink = Boolean(dataObj?.deep_link || dataObj?.meet_url || dataObj?.action_url || (dataObj?.type === 'externallink' && dataObj?.url));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={28} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Details</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <Bell size={24} color="#5F259F" />
            </View>

            <Text style={styles.modalTitle}>{title}</Text>

            {body && <Text style={styles.modalSubtitle}>{body}</Text>}

            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}

            {dataObj?.type === 'externallink' && dataObj?.url ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => Linking.openURL(dataObj.url).catch(() => {})}
              >
                <Text style={styles.linkText}>
                  {dataObj.url}
                </Text>
              </TouchableOpacity>
            ) : null}

            {description && (
              <Text style={styles.modalDescription}>{description}</Text>
            )}

            <View style={styles.modalMeta}>
              <Text style={styles.modalDate}>📅 {formatDate(sentAt)}</Text>
            </View>

            {/* Action button */}
            {hasDeepLink ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.modalButton}
                onPress={() => {
                  onPressAction(notification);
                  onClose();
                }}
              >
                <Text style={styles.modalButtonText}>{getActionLabel(notification)}</Text>
              </TouchableOpacity>
            ) : ctaLink ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.modalButton}
                onPress={() => {
                  Linking.openURL(ctaLink).catch(() => {});
                  onClose();
                }}
              >
                <Text style={styles.modalButtonText}>
                  {dataObj?.cta_label || vars?.cta_label || "Learn More"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
});
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F6FC",
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#5F259F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B6B6B",
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6A5C82",
    marginBottom: 10,
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 18,
  },
  linkText: {
    marginTop: 8,
    fontSize: 13,
    color: "#5F259F",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 4,
    backgroundColor: "#5F259F",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    shadowColor: "#5F259F",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "#8A8A8A",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#EFE7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
  paginationLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  paginationText: {
    fontSize: 13,
    color: "#6B6B6B",
  },
  // Unread indicator
  unreadIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    backgroundColor: "#5F259F",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardRead: {
    opacity: 0.85,
  },
  iconContainerActive: {
    backgroundColor: "#E8D9F8",
  },
  titleBold: {
    fontWeight: "800",
  },
  subtitleBold: {
    fontWeight: "600",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F6FC",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E0F0",
    backgroundColor: "#FFFFFF",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 28,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6A5C82",
    marginBottom: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
  },
  modalDescription: {
    fontSize: 16,
    color: "#4A4A4A",
    lineHeight: 26,
    marginBottom: 18,
  },
  modalMeta: {
    backgroundColor: "#F8F6FC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 14,
    color: "#6A5C82",
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "#5F259F",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    elevation: 4,
    shadowColor: "#5F259F",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
