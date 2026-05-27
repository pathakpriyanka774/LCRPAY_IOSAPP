import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Theme from "./Theme";

const LevelTable = () => {
  const [selectedLevel, setSelectedLevel] = useState("1");
  const [open, setOpen] = useState(false);

  // ✅ Creating table data (Added "level" column)
  const levelsData = Array.from({ length: 10 }, (_, i) => ({
    level: (i + 1).toString(),
    users: Array.from({ length: 10 }, (_, j) => ({
      srNo: j + 1,
      userId: `U100${j + 1}`,
      name: `User ${j + 1}`,
      sponserId: `S200${j + 1}`,
      mobile: `98XXXXXX${j + 1}8`,
      level: i + 1, // ✅ Level 1 to 10 assigned here
      joiningDate: `2025-01-${String(j + 1).padStart(2, "0")}`,
      activationDate: `2025-01-${String(j + 5).padStart(2, "0")}`,
      package: `₹${(j + 1) * 1000}`,
    })),
  }));

  const selectedTableData =
    levelsData.find((level) => level.level === selectedLevel)?.users || [];

  return (
    <View style={styles.container}>
      {/* ✅ Dropdown Picker remains same */}
      <DropDownPicker
        open={open}
        value={selectedLevel}
        items={Array.from({ length: 10 }, (_, i) => ({
          label: `Level ${i + 1}`,
          value: (i + 1).toString(),
        }))}
        setOpen={setOpen}
        setValue={setSelectedLevel}
        placeholder="Select Level"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Level {selectedLevel}</Text>

        {/* ✅ Horizontal scrolling for the table */}
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator
        >
          <View style={styles.table}>
            {/* ✅ Table Header */}
            <View style={styles.tableRowHeader}>
              {[
                "Sr No.",
                "User-ID",
                "Name",
                "SponserID",
                "Mobile",
                "Level", // ✅ Added "Level" column
                "JoiningDate",
                "ActivationDate",
                "Package",
              ].map((header, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tableCell,
                    styles.headerCell,
                    index === 0 ? styles.srNoCell : {}, // Custom width for "Sr No."
                  ]}
                >
                  {header}
                </Text>
              ))}
            </View>

            {/* ✅ FlatList for vertical scrolling with alternating row colors */}
            <FlatList
              data={selectedTableData}
              keyExtractor={(item) => item.userId}
              nestedScrollEnabled
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: index % 2 === 0 ? "#E6F9E6" : "#FFFFFF",
                    }, // Alternating row colors
                  ]}
                >
                  <Text style={[styles.tableCell, styles.srNoCell]}>
                    {item.srNo}
                  </Text>
                  <Text style={styles.tableCell}>{item.userId}</Text>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.sponserId}</Text>
                  <Text style={styles.tableCell}>{item.mobile}</Text>
                  <Text style={styles.tableCell}>{item.level}</Text>
                  <Text style={styles.tableCell}>{item.joiningDate}</Text>
                  <Text style={styles.tableCell}>{item.activationDate}</Text>
                  <Text style={styles.tableCell}>{item.package}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.secondary,
  },
  dropdown: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
    borderColor: Theme.colors.primary,
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: Theme.colors.secondary,
    borderColor: Theme.colors.primary,
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
    minWidth: 70,
    textAlign: "center",
    padding: 10,
    fontSize: 10,
  },
  srNoCell: {
    minWidth: 50,
  },
  headerCell: {
    fontWeight: "bold",
    color: Theme.colors.secondary,
  },
});

export default LevelTable;
