import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/config";
import {
  Settings,
  KeyRound,
  Fingerprint,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { version } from '../../package.json';
const SettingScreen = () => {
  const navigation = useNavigation();
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [fingerPrintStatus, setFingerPrintStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.register.user);

  const handleGetFingerPrintStatus = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${BASE_URL}/misc/get_fingerprint_status`,
        { headers }
      );
      
      console.log(response.data)
      const serverStatus = response.data.fingerprint_status === 1;
      setFingerPrintStatus(response.data.fingerprint_status);
      setIsFingerprintEnabled(serverStatus);
      await AsyncStorage.setItem(
        "fingerPrintStatus",
        JSON.stringify(response.data.fingerprint_status)
      );

    } catch (error) {
      setError("Failed to fetch fingerprint status");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFingerprint = async (value) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const newStatus = value ? 1 : 2;

      const response = await axios.post(
        `${BASE_URL}/misc/set_fingerprint_status`,
        { type: newStatus },
        { headers }
      );

      if (response.status === 200) {
        setFingerPrintStatus(newStatus);
        setIsFingerprintEnabled(newStatus === 1);
        await AsyncStorage.setItem(
          "fingerPrintStatus",
          JSON.stringify(newStatus)
        );
      }
    } catch (error) {
      setError("Failed to update fingerprint settings");
      console.error("Error:", error);
      setIsFingerprintEnabled(!value); // Revert switch state on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetFingerPrintStatus();
  }, []);

  const SettingItem = ({
    icon: Icon,
    title,
    value,
    onPress,
    showToggle,
    isToggled,
    disabled,
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, disabled && styles.settingItemDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#007AFF" strokeWidth={2} />
        </View>
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      {showToggle ? (
        <Switch
          value={isToggled}
          onValueChange={onPress}
          disabled={disabled || isLoading}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isToggled ? "#007AFF" : "#f4f3f4"}
        />
      ) : (
        <ChevronRight size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  if (isLoading && !error) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleGetFingerPrintStatus}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem
          icon={KeyRound}
          title={
            user?.user?.TransactionPIN
              ? "Update Transaction PIN"
              : "Set Transaction PIN"
          }
          onPress={() =>
            navigation.navigate(
              user?.user?.TransactionPIN
                ? "SetTransactionPin"
                : "TransactionPin"
            )
          }
        />

        {Platform.OS !== "web" && (
          <SettingItem
            icon={Fingerprint}
            title="Fingerprint Authentication"
            showToggle
            isToggled={isFingerprintEnabled}
            onPress={toggleFingerprint}
            disabled={isLoading}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon={Bell}
          title="Push Notifications"
          showToggle
          isToggled={true}
          onPress={() => {}}
        />
      </View>

      

      {/* <TouchableOpacity style={styles.logoutButton} onPress={() => { }}>
                <LogOut size={20} color="#FF3B30" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity> */}

      <Text style={{textAlign:"center"}}>Version : {version}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 17,
    color: "#000",
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 8,
  },
  
});

export default SettingScreen;
