import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loanTypes } from "../../config/loanCatlog";

const LoanSelectionScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  
  const getNumColumns = () => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  };

  const numColumns = getNumColumns();

  const handleLoanSelect = (loan) => {
    navigation.navigate(loan.screen);
  };

  const renderLoanCard = ({ item: loan }) => {
    return (
      <TouchableOpacity
        style={[
          styles.loanCard,
          { width: width < 600 ? width - 40 : (width - 60) / numColumns }
        ]}
        onPress={() => handleLoanSelect(loan)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: loan.color + "20" }
          ]}
        >
          <MaterialCommunityIcons
            name={loan.icon}
            size={36}
            color={loan.color}
          />
        </View>
        
        <Text style={styles.loanName}>{loan.name}</Text>
        <Text style={styles.loanDescription}>{loan.description}</Text>
        
        <View style={[styles.arrowContainer, { backgroundColor: loan.color }]}>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="white"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Loan</Text>
        <Text style={styles.subtitle}>
          Select a loan type to get started with your application
        </Text>
      </View>

      <FlatList
        data={loanTypes}
        renderItem={renderLoanCard}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <MaterialCommunityIcons name="shield-check" size={18} color="#5F259F" />
        <Text style={styles.footerText}>
          Secure & Confidential • Fast Approval • Flexible Terms
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 24,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  loanCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: "relative",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loanName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
  },
  loanDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 22,
    marginBottom: 16,
  },
  arrowContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  footerText: {
    fontSize: 12,
    color: "#7F8C8D",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default LoanSelectionScreen;
