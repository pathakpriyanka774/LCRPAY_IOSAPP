import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { getPanData } from "../src/features/aadharKyc/AadharSlice";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";

const PanDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isZoomed, setIsZoomed] = useState(false);

  const { PanDetail } = useSelector((state) => state.aadhar);

  const handleZoom = () => setIsZoomed((z) => !z);

  useEffect(() => {
    dispatch(getPanData());
  }, [dispatch]);

  const panDetails = PanDetail?.data || {};

  // ✅ SAFE DOB FORMATTER (dd-mm-yyyy) — prevents split on undefined
  const formattedDob = useMemo(() => {
    const raw = panDetails?.dateOfBirth;
    if (!raw) return "N/A";

    const cleaned = String(raw).trim();
    // handle ISO with time: 1990-07-05T00:00:00Z or if a time part exists
    const datePart = cleaned.includes("T") ? cleaned.split("T")[0] : cleaned.split(" ")[0];

    const sep = datePart.includes("-") ? "-" : (datePart.includes("/") ? "/" : null);
    if (!sep) return cleaned;

    const p = datePart.split(sep);
    if (p.length !== 3) return cleaned;

    // yyyy-mm-dd -> dd-mm-yyyy
    if (p[0].length === 4) {
      const [yyyy, mm, dd] = p;
      return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
    }

    // assume dd-mm-yyyy or dd/mm/yyyy -> dd-mm-yyyy
    const [dd, mm, yyyy] = p;
    return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
  }, [panDetails?.dateOfBirth]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={require("../assets/gov.png")} style={styles.govLogo} />
          <Text style={styles.headerText}>
            भारत सरकार{"\n"}GOVERNMENT OF INDIA
          </Text>
          <Image source={require("../assets/IncomeTax.png")} style={styles.incomeTaxLogo} />
        </View>

        <Image
          source={
            panDetails?.photo
              ? { uri: `data:image/jpeg;base64,${panDetails.photo}` }
              : require("../assets/profile.png")
          }
          style={[styles.profilePic, isZoomed && { width: 120, height: 150 }]}
        />

        <View style={styles.userDetails}>
          <Text style={styles.userDetailsText}>
            Name: {panDetails?.pan_holder_name || "N/A"}
          </Text>
          <Text style={styles.userDetailsText}>DOB: {formattedDob}</Text>
          <Text style={styles.panNumber}>PAN: {panDetails?.pan_number || "N/A"}</Text>
        </View>

        <View style={styles.footer}>
          {/* <TouchableOpacity style={styles.proceedButton} onPress={() => navigation.navigate("Profile4")}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={handleZoom} style={{ marginTop: 8 }}>
            <Text style={styles.zoomButtonText}>{isZoomed ? "Zoom Out" : "Zoom In"}</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>आयकर विभाग - भारत</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  govLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  incomeTaxLogo: {
    width: 50,
    height: 40,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  profilePic: {
    width: 80,
    height: 100,
    alignSelf: "center",
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
  panNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    marginTop: 5,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  zoomDownloadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  zoomButtonText: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
  },
});

export default PanDetails;
