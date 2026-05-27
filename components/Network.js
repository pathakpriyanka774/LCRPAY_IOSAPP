// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native";

// const Network = () => {
//   const navigation = useNavigation();
//   return (
//     <LinearGradient
//       colors={["#a8e6cf", "#d4f7e4", "#c1e8c4"]}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Choose Your Network Type</Text>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'direct_network', name: "Direct Network"
//         })}
//       >
//         <Text style={styles.optionText}>Direct</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.optionButton}
//         onPress={() => navigation.navigate("LabelIncome", {
//           endpoint: 'label_network', name: "Level Network"
//         })}
//       >
//         <Text style={styles.optionText}>Level</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 40,
//     color: "green",
//     textAlign: "center",
//     fontFamily: "Arial",
//   },
//   optionButton: {
//     width: "80%",
//     padding: 18,
//     marginVertical: 15,
//     backgroundColor: "green",
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   optionText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#fff",
//   },
// });

// export default Network;

import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Network = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {networkData.map(
          ({
            name,
            endpoint,
            backgroundImage,
            iconImage,
            navigationScreen,
          }) => (
            <TouchableOpacity
              key={endpoint}
              style={styles.card}
              onPress={() =>
                navigation.navigate(navigationScreen, { endpoint, name })
              }
            >
              {/* Different Background Image for Each Card */}
              <ImageBackground
                source={backgroundImage}
                style={styles.waveImageBackground}
                resizeMode="cover"
              >
                <View style={styles.imageWrapper}>
                  <Image source={iconImage} style={styles.iconImage} />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  );
};

// Data with Different Images for Each Card
const networkData = [
  {
    name: "Direct Network",
    endpoint: "direct_network",
    backgroundImage: require("../assets/DireactTeam.jpg"),
    navigationScreen: "UserDirectNetwork",
  },
  {
    name: "Level Network",
    endpoint: "level_network",
    // backgroundImage: require("../assets/2.jpg"),
    navigationScreen: "UserLevelNetwork",
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { alignItems: "center", padding: 20 },

  card: {
    flexDirection: "column",
    width: "100%",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
  },

  waveImageBackground: {
    width: 380,
    height: 380,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centering the icon in the image
  },

  imageWrapper: {
    backgroundColor: "transparent",
    padding: 5,
  },

  iconImage: {
    width: 60, // Increased icon size for better visibility
    height: 60,
    resizeMode: "contain",
  },
});

export default Network;
