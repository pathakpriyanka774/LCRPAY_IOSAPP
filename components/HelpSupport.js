import React from "react";
import { View, Text, StyleSheet, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Theme from "./Theme";

const faqData = [
  { id: "1", question: "How do I reset my PIN?", answer: "Go to Settings > Security > Reset PIN and follow the prompts." },
  { id: "2", question: "Why is my payment pending?", answer: "Most payments clear instantly. If pending, it usually resolves within 5-10 minutes." },
  { id: "3", question: "How can I contact support?", answer: "Email support@lcrpay.com or call +9101169311284 between 9am-6pm IST." },
];

const HelpSupport = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.primary}
        translucent={false}
      />
      <View style={styles.container}>
        <View style={styles.hero}>
          <View>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>Get unstuck fast with answers curated for LCR Pay.</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>24x7</Text>
          </View>
        </View>
        <FlatList
          data={faqData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.subtext,
    marginTop: 6,
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.text,
    marginBottom: 6,
  },
  answer: {
    fontSize: 14,
    color: Theme.colors.subtext,
    lineHeight: 20,
  },
  tag: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
    fontSize: 12,
  },
});

export default HelpSupport;
