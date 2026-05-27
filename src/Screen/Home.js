import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, Modal, Switch } from "react-native-paper";
import { Calendar } from "react-native-calendars"; // Install react-native-calendars package
import moment from "moment"; // For date formatting
import { useNavigation } from "@react-navigation/native";
import GloabalOffer from "./GloabalOffer";
import RateUs from "./Home/RateUs";
import { UserState } from "../UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "../../components/Theme";

const Home = () => {
  const navigation = useNavigation();

  const {
    from_loc,
    to_loc,
    selectedDate,
    setSelectedDate,
    onChangeFrom_loc,
    onChangeTo_loc,
  } = UserState();

  const [showCalendar, setShowCalendar] = useState(false);

  const SwapDestination = () => {
    const temp = from_loc;
    onChangeFrom_loc(to_loc);
    onChangeTo_loc(temp);
  };

  // console.log(showCalendar)

  const OpenDate = () => {
    setShowCalendar(true);
  };

  const onDateSelect = (date) => {
    const formattedDate = moment(date.dateString).format("D MMM YYYY");
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  const setToday = () => {
    const today = moment().format("D MMM YYYY");
    setSelectedDate(today);
  };

  const setTomorrow = () => {
    const tomorrow = moment().add(1, "days").format("D MMM YYYY");
    setSelectedDate(tomorrow);
  };

  const handleSearch = () => {
    if (!from_loc || !to_loc || !selectedDate) {
      alert('Please fill in both "From" and "To" locations.');
    } else {
      navigation.navigate("searchpage", { from_loc, to_loc, selectedDate });
    }
  };

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.mainHomeContainer}>
        <View
          style={{
            background: "linear-gradient(to top, #ff7e5f, #feb47b)",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              width: "90%",
              marginTop: 15,
              alignSelf: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bus Ticket</Text>

            <View style={styles.SearchInputContainer}>
              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("singleSearch", {
                      location: "starting",
                    })
                  }
                  style={styles.InputWithIcon}
                >
                  <Svg
                    style={styles.svgImage}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                  >
                    <Path
                      fill="white"
                      stroke="black"
                      d="M30.17 7.314c-.024-.274-.214-.498-.42-.498s-.375-.17-.375-.375s-.222-.336-.493-.29l-1.472.25c-.296-1.793-.74-2.914-1.41-3.584c-2-2-18-2-20 0c-.67.67-1.114 1.79-1.41 3.583l-1.472-.25c-.27-.046-.493.085-.493.29s-.17.376-.375.376s-.396.225-.42.498l-.47 5.066a.447.447 0 0 0 .453.498h1.062c.275 0 .52-.224.546-.498l.394-4.232a.46.46 0 0 1 .54-.415l.054.01C4.008 11.395 4 29.682 4 29.682c0 .554.14 1 .313 1h2.562c.173 0 .313-.446.313-1V27.79c4.643.7 12.982.7 17.625 0v1.89c0 .553.14 1 .312 1h2.562c.172 0 .312-.447.312-1c0 0-.008-18.283-.408-21.937l.054-.01a.46.46 0 0 1 .54.416l.393 4.23c.024.275.27.5.545.5h1.062a.45.45 0 0 0 .454-.5l-.47-5.066zM7.126 23.37a1.811 1.811 0 1 1-.002-3.62a1.811 1.811 0 0 1 .002 3.619zm-2.083-7.393c.1-7.435.45-11.238 1.665-12.454c.487-.486 3.777-1.207 9.293-1.207s8.806.72 9.293 1.207c1.217 1.216 1.564 5.02 1.665 12.455c-1.175.473-4.904 1.025-10.958 1.025c-6.05 0-9.778-.55-10.958-1.026m18.02 5.582a1.813 1.813 0 0 1 3.624-.001a1.811 1.811 0 0 1-3.624 0z"
                    />
                  </Svg>

                  {from_loc ? (
                    <View style={{ position: "absolute", left: 50 }}>
                      <Text>From</Text>
                      <Text style={{ fontWeight: "bold" }}>{from_loc}</Text>
                    </View>
                  ) : (
                    <View style={{ position: "absolute", left: 50 }}>
                      <Text>From</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("singleSearch", { location: "ending" })
                  }
                  style={styles.InputWithIcon}
                >
                  <Svg
                    style={styles.svgImage}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                  >
                    <Path
                      fill="white"
                      stroke="black"
                      d="M30.17 7.314c-.024-.274-.214-.498-.42-.498s-.375-.17-.375-.375s-.222-.336-.493-.29l-1.472.25c-.296-1.793-.74-2.914-1.41-3.584c-2-2-18-2-20 0c-.67.67-1.114 1.79-1.41 3.583l-1.472-.25c-.27-.046-.493.085-.493.29s-.17.376-.375.376s-.396.225-.42.498l-.47 5.066a.447.447 0 0 0 .453.498h1.062c.275 0 .52-.224.546-.498l.394-4.232a.46.46 0 0 1 .54-.415l.054.01C4.008 11.395 4 29.682 4 29.682c0 .554.14 1 .313 1h2.562c.173 0 .313-.446.313-1V27.79c4.643.7 12.982.7 17.625 0v1.89c0 .553.14 1 .312 1h2.562c.172 0 .312-.447.312-1c0 0-.008-18.283-.408-21.937l.054-.01a.46.46 0 0 1 .54.416l.393 4.23c.024.275.27.5.545.5h1.062a.45.45 0 0 0 .454-.5l-.47-5.066zM7.126 23.37a1.811 1.811 0 1 1-.002-3.62a1.811 1.811 0 0 1 .002 3.619zm-2.083-7.393c.1-7.435.45-11.238 1.665-12.454c.487-.486 3.777-1.207 9.293-1.207s8.806.72 9.293 1.207c1.217 1.216 1.564 5.02 1.665 12.455c-1.175.473-4.904 1.025-10.958 1.025c-6.05 0-9.778-.55-10.958-1.026m18.02 5.582a1.813 1.813 0 0 1 3.624-.001a1.811 1.811 0 0 1-3.624 0z"
                    />
                  </Svg>

                  {to_loc ? (
                    <View style={{ position: "absolute", left: 50 }}>
                      <Text>To</Text>
                      <Text style={{ fontWeight: "bold" }}>{to_loc}</Text>
                    </View>
                  ) : (
                    <View style={{ position: "absolute", left: 50 }}>
                      <Text>To</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={SwapDestination}
                  marginLeft={10}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "80%",
                    backgroundColor: Theme.colors.primary,
                    transform: [{ translateX: -10 }, { translateY: -10 }],
                  }}
                  mode="contained"
                >
                  <Icon source="swap-vertical" color="white" size={30} />
                </TouchableOpacity>
              </View>

              <View style={styles.dateAndTime}>
                <TouchableOpacity
                  onPress={OpenDate}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 20 20"
                  >
                    <Rect width="20" height="20" fill="none" />
                    <Path
                      fill="black"
                      d="M5.673 0a.7.7 0 0 1 .7.7v1.309h7.517v-1.3a.7.7 0 0 1 1.4 0v1.3H18a2 2 0 0 1 2 1.999v13.993A2 2 0 0 1 18 20H2a2 2 0 0 1-2-1.999V4.008a2 2 0 0 1 2-1.999h2.973V.699a.7.7 0 0 1 .7-.699M1.4 7.742v10.259a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V7.756zm5.267 6.877v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zm-8.333-3.977v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zM4.973 3.408H2a.6.6 0 0 0-.6.6v2.335l17.2.014V4.008a.6.6 0 0 0-.6-.6h-2.71v.929a.7.7 0 0 1-1.4 0v-.929H6.373v.92a.7.7 0 0 1-1.4 0z"
                    />
                  </Svg>
                  <View>
                    <Text style={styles.text}>Date of Journey</Text>
                    <Text>{selectedDate || "select Date"}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.datebtn} onPress={setToday}>
                  <Text style={{ color: "white" }}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.datebtn} onPress={setTomorrow}>
                  <Text style={{ color: "white" }}>Tomorrow</Text>
                </TouchableOpacity>

                {/* Calendar Modal */}
              </View>
            </View>
          </View>

          {/* Book For Women Section */}

          <View style={styles.womenContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../../assets/Images/women.jpg")}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>Book For Women</Text>
              <View style={{ display: "flex", flexDirection: "row", gap: 90 }}>
                <Text style={styles.learnMoreText}>Learn more</Text>
                <Switch
                  value={isSwitchOn}
                  onValueChange={onToggleSwitch}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isSwitchOn ? "#f5dd4b" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>

          {/* Search Button Come Here  */}
          <TouchableOpacity style={styles.Searchbtn} onPress={handleSearch}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <Rect width="24" height="24" fill="none" />
              <Path
                fill="white"
                d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
              />
            </Svg>
            <Text style={{ color: "white", fontSize: 20 }}>Search Buses</Text>
          </TouchableOpacity>
        </View>

        {/* Other Home Section Start Here */}
        <View style={{ flex: 1, marginBottom: 50 }}>
          <GloabalOffer />
          <RateUs />
        </View>
        {/* Other Home Section end Here */}
      </ScrollView>

      {/* Calander come here */}

      {showCalendar && (
        <Modal
          visible={showCalendar}
          onDismiss={() => setShowCalendar(false)}
          contentContainerStyle={{
            padding: 20,
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <Calendar
            onDayPress={onDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#663dff",
              },
            }}
            style={{
              borderRadius: 10,
            }}
          />
        </Modal>
      )}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <MaterialIcons name="home" size={24} color="blue" />
          <Text style={styles.bottomNavText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate("Home")}
        >
          <MaterialIcons name="mode-of-travel" size={24} color="yellow" />
          <Text style={styles.bottomNavText}>Travel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate("Scan")}
        >
          <View style={styles.centerButton}>
            <View style={styles.circle}>
              <MaterialIcons
                name="qr-code-scanner"
                size={45}
                color={Theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate("History")}
        >
          <MaterialIcons name="swap-horiz" size={24} color="skyblue" />
          <Text style={styles.bottomNavText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate("AllServices")}
        >
          <MaterialIcons name="more" size={24} color="pink" />
          <Text style={styles.bottomNavText}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainHomeContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  homeContainer: {
    marginTop: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: Theme.colors.secondary,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transportCard: {
    display: "flex",
    alignItems: "center",
  },

  SearchInputContainer: {
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gray",
    backgroundColor: Theme.colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  InputWithIcon: {
    height: 50,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  svgImage: {
    position: "absolute",
    left: 10,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 35,
    fontSize: 16,
    color: "black",
    border: "none",
    outlineStyle: "none",
  },
  dateAndTime: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-evenly",
  },

  datebtn: {
    alignItems: "center",
    backgroundColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 20,
    color: "white",
  },
  // Women button come here

  womenContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 70,
    height: 70,
    marginRight: 16,
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    // borderRadius: '50%',
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  learnMoreText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 12,
  },

  Searchbtn: {
    alignSelf: "center",
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 20,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    width: 340,
    alignSelf: "center",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: Theme.colors.navbar_color,
  },
  bottomNavItem: {
    alignItems: "center",
  },
  bottomNavText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  centerButton: {
    position: "absolute",
    // top
    bottom: -15,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: Theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
});

export default Home;
