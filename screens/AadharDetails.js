import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../components/Theme";
import { getAadharDetail } from "../src/features/aadharKyc/AadharSlice";
import { BASE_URL } from "../utils/config";

const AadharDetails = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { AadharDetail, loading } = useSelector((state) => state.aadhar);

  const [circularloading, setCircularLoading] = useState(false);
  const [result, setResult] = useState();

  const handleAddharData = async () => {
    try {
      setCircularLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      console.log(token);

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Ensure correct format
      };

      const response = await axios.get(
        `${BASE_URL}/userAadharDetail/`,
        // {},  // Empty body, since it's a POST request
        { headers } // Pass headers correctly inside an object
      );
      console.log(response.data);

      if (response.status === 200) {
        console.log("Response Data:", response.data.vtc);
        setResult(response.data);
      } else {
        navigation.goBack();
      }

      setCircularLoading(false);
    } catch (error) {
      setCircularLoading(false);
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleAddharData();
    console.log(`this is aadhaar-------->`, result);
  }, []);

  useEffect(() => {
    dispatch(getAadharDetail());
  }, [dispatch]);

  const aadharDetails = AadharDetail?.aadhar_details || {};
  const address = aadharDetails?.address || {};

  useEffect(() => {
    console.log(`this is adddhar Details`, aadharDetails, AadharDetail);
  }, [AadharDetail]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : result ? (
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={require("../assets/gov.png")}
              style={styles.logoLeft}
            />
            <Text style={styles.headerText}>
              भारत सरकार{""} GOVERNMENT OF INDIA
            </Text>
            <Image
              source={require("../assets/aadhar.png")}
              style={styles.logoRight}
            />
          </View>
          <Image
            source={
              aadharDetails.photo
                ? { uri: `data:image/jpeg;base64,${aadharDetails.photo}` }
                : require("../assets/profile.png")
            }
            style={styles.profilePic}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userDetailsText}>{aadharDetails.name || "N/A"}</Text>
            <Text style={styles.userDetailsText}>{aadharDetails.dateOfBirth || "N/A"}</Text>
            {/* <Text style={styles.userDetailsText}>{aadharDetails.gender === 'M' ? 'Male' : aadharDetails.gender === 'F' ? 'Female' : 'N/A'}</Text> */}
            <Text style={styles.userDetailsText}>
              {aadharDetails.maskedNumber || "N/A"}
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              Address: {result.address || "N/A"}
            </Text>
            <Text style={styles.addressText}>{address.careOf || "N/A"}</Text>
            <Text style={styles.addressText}>
              {[address.locality, address.district, address.state]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </Text>
            <Text style={styles.addressText}>
              {address.country
                ? `${address.country} - ${address.pin || "N/A"}`
                : "N/A"}
            </Text>
          </View>
          {aadharDetails.qrCode ? (
            <Image
              source={{ uri: `data:image/png;base64,${aadharDetails.qrCode}` }}
              style={styles.qrCode}
            />
          ) : (
            <Image
              source={require("../assets/Qr_Code.png")}
              style={styles.qrCode}
            />
          )}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => navigation.navigate("Profile3")}
          >
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>आधार-आम आदमी का अधिकार</Text>
        </View>
      ) : (
        <View style={[styles.container, { padding: 10 }]}>
          <Text style={styles.warningText}>⚠ Please Complete Your KYC</Text>
          <Text style={styles.subText}>
            Your KYC is required to continue. Please complete your verification.
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Theme.colors.primary }]}
            onPress={() => navigation.navigate("OfflineKyc")}
          >
            <Text style={styles.buttonText}>Complete Your KYC</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logoLeft: {
    width: 50,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  logoRight: {
    width: 50,
    height: 40,
    resizeMode: "contain",
    marginLeft: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  profilePic: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  userDetails: {
    alignItems: "center",
    marginBottom: 10,
  },
  userDetailsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  addressText: {
    fontSize: 14,
    textAlign: "center",
  },
  qrCode: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  proceedButton: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  warningText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d9534f",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AadharDetails;
