import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Theme from "./Theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const DirectIncome = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { endpoint, name } = route.params;
  console.log(endpoint);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation]);

  const [customHeader, setCustomHeader] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // const isKeyAvail = (details, key_name) => {
  //   return details.some(([key]) => key === key_name)
  // }

  // const getKeyValue = (details,key_name)=>{
  //   return details.find(([key])=> key===key_name);
  // }

  // useEffect(()=>{
  //   isKeyAvail(result, received_date){

  //   }

  // },[])

  const handleData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      console.log(token);

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Ensure correct format
      };

      const response = await axios.post(
        `https://api.lcrpay.in.com/network/${endpoint}`,
        {},
        { headers } // Pass headers correctly inside an object
      );

      console.log(`this is data ---> `, response.data);

      if (response.status === 200) {
        if (response.data && response.data.data.length > 0) {
          setResult(response.data.data);

          setCustomHeader(
            Object.keys(response.data.data[0]).filter((key) => key !== "id")
          );
        }
      } else {
        navigation.goBack();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="small"
            color={Theme.colors.primary}
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      ) : result.length !== 0 ? (
        <View style={styles.levelContainer}>
          <Text style={styles.levelTitle}>{name}</Text>

          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator
          >
            <View style={styles.table}>
              {/* ✅ Table Header */}
              <View style={styles.tableRowHeader}>
                <Text
                  style={[styles.tableCell, styles.headerCell, styles.srNoCell]}
                >
                  Sr No.
                </Text>
                {customHeader.map((header, index) => (
                  <Text
                    key={index}
                    style={[styles.tableCell, styles.headerCell]}
                  >
                    {header}
                  </Text>
                ))}
              </View>

              {/* ✅ Table Body */}
              <FlatList
                data={result}
                keyExtractor={(item, index) => index.toString()} // Ensure unique keys
                nestedScrollEnabled
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.tableRow,
                      {
                        backgroundColor:
                          index % 2 === 0 ? "#E6F9E6" : "#FFFFFF",
                      },
                    ]}
                  >
                    <Text style={[styles.tableCell, styles.srNoCell]}>
                      {index + 1}
                    </Text>
                    {customHeader.map((key, i) => (
                      <Text key={i} style={styles.tableCell}>
                        {key === "received_date" && item[key]
                          ? moment(item[key]).format("DD-MM-YYYY HH:mm:ss") // Format date
                          : item[key] ?? "-"}{" "}
                        {/* Show formatted date or default value */}
                      </Text>
                    ))}
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.secondary,
  },
  levelContainer: {
    marginBottom: 30,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Theme.colors.primary,
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 8,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: Theme.colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  tableCell: {
    minWidth: 160,
    textAlign: "center",
    padding: 10,
    fontSize: 12,
  },
  srNoCell: {
    minWidth: 50,
    fontWeight: "bold",
  },
  headerCell: {
    fontWeight: "bold",
    color: Theme.colors.secondary,
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
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  noDataText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});

export default DirectIncome;
