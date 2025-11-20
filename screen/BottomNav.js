import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BottomNav = () => {
  const navigation = useNavigation(); // useNavigation hook gives access to navigation

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.navItem}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ProgramStats")}>
        <Text style={styles.navItem}>Stats</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("ScanCard")}
      >
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("VisitorList")}>
        <Text style={styles.navItem}>Visitors</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert("Logout")}>
        <Text style={styles.navItem}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute", // fixed at bottom
    bottom: 50,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 75,
    backgroundColor: "#fff",
    borderRadius: 40,
    elevation: 10,
    paddingHorizontal: 10,
  },
  navItem: { fontSize: 14, color: "#444", fontWeight: "600" },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#FFC840",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -32,
    elevation: 5,
  },
  plusIcon: { fontSize: 34, fontWeight: "bold" },
});

export default BottomNav;
