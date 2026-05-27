// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient"; // Make sure to install expo-linear-gradient
// import { useNavigation } from "@react-navigation/native";
// const Income = () => {
//   const navigation = useNavigation();
//   return (
//     <LinearGradient
//       colors={["#a8e6cf", "#d4f7e4", "#c1e8c4"]}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Choose Your Income Type</Text>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'direct_income', name: "Direct Income"
//         })}
//       >
//         <Text style={styles.optionText}>Direct Income</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'level_income', name: "Level Income"
//         })}
//       >
//         <Text style={styles.optionText}>Level Income</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'magic_income', name: "Magic Income"
//         })}
//       >
//         <Text style={styles.optionText}>Magic Income</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'royalty_income', name: "Royality Income"
//         })}
//       >
//         <Text style={styles.optionText}>Royalty Income</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.optionButton}
//         onPress={() => navigation.navigate("DirectIncome", {
//           endpoint: 'reward_income', name: "Reward Income"
//         })}
//       >
//         <Text style={styles.optionText}>Reward</Text>
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

// export default Income;

import React from "react";
import Theme from "./Theme";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const Income = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {incomeData.map(({ name, endpoint, icon, navigationScreen }) => (
          <TouchableOpacity
            key={endpoint}
            style={styles.card}
            onPress={() =>
              navigation.navigate(navigationScreen, { endpoint, name })
            }
          >
            {/* Wave Image as Background inside Icon Field */}
            <ImageBackground
              source={require("../assets/wave2.png")}
              style={styles.waveImageBackground}
              resizeMode="cover"
            >
              <View style={styles.iconWrapper}>
                <MaterialIcons name={icon} size={40} color="green" />
              </View>
            </ImageBackground>

            <View style={styles.divider} />

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const incomeData = [
  {
    name: "Direct Income",
    endpoint: "direct_income",
    icon: "attach-money",
    navigationScreen: "UserDirectIncome",
  },
  {
    name: "Level Income",
    endpoint: "level_income",
    icon: "trending-up",
    navigationScreen: "UserLevelIncome",
  },
  {
    name: "Magic Income",
    endpoint: "magic_income",
    icon: "stars",
    navigationScreen: "DirectIncome",
  },
  {
    name: "Royalty Income",
    endpoint: "royalty_income",
    icon: "workspace-premium",
    navigationScreen: "DirectIncome",
  },
  {
    name: "Reward Income",
    endpoint: "reward_income",
    icon: "card-giftcard",
    navigationScreen: "DirectIncome",
  },
  {
    name: "Incentive Income",
    endpoint: "received_incentives",
    icon: "card-giftcard",
    navigationScreen: "DirectIncome",
  },
  {
    name: "Coin Reward",
    endpoint: "received_coin_rewards",
    icon: "card-giftcard",
    navigationScreen: "DirectIncome",
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
    borderColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden", // Ensures no unwanted background leaks
  },

  waveImageBackground: {
    width: width * 0.9, // Increase width to 90% of the screen
    aspectRatio: 3.5, // Adjust this to maintain proportions
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Keep the icon on the right
    paddingRight: 15, // Maintain spacing
    overflow: "hidden", // Prevents cutting issues
  },
  iconWrapper: {
    backgroundColor: "transparent", // No background/shadow
    padding: 5, // Optional: small padding for better visibility
  },
  iconWrapper: {
    backgroundColor: "transparent", // Remove background/shadow
    padding: 5, // Keep padding for better visibility
    // marginTop: 5, // Fine-tune the position upward
    marginBottom: 50,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Theme.colors.primary,
    alignSelf: "center",
  },

  textContainer: {
    backgroundColor: Theme.colors.primary,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },

  cardTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
});

export default Income;
