import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Push = () => {
  const [oldVisitors, setOldVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOldVisitors();
  }, []);

  // Fetch old visitors for the current user
  const fetchOldVisitors = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.id) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      // Fetch from API
      const res = await axios.get(`http://16.171.188.189:3000/api/visitors/old/${user.id}`);
      const visitorsWithSeen = (res.data.oldVisitors || []).map(v => ({ ...v, seen: false }));

      // Load cleared visitors for this user
      const clearedKey = `clearedVisitors_${user.id}`;
      const cleared = await AsyncStorage.getItem(clearedKey);
      const clearedIds = cleared ? JSON.parse(cleared) : [];

      // Filter out cleared visitors
      const filteredVisitors = visitorsWithSeen.filter(v => !clearedIds.includes(v.idvisitors));
      setOldVisitors(filteredVisitors);

    } catch (error) {
      console.error("Error fetching old visitors:", error.response || error.message);
      Alert.alert("Error", "Failed to fetch old visitors");
    } finally {
      setLoading(false);
    }
  };

  // Handle follow-up for a specific visitor
  const handleFollowUp = async (visitorId, visitorName) => {
    Alert.alert("Follow-up Reminder", `Did you follow up with ${visitorName}?`);

    const storedUser = await AsyncStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user?.id) return;

    const clearedKey = `clearedVisitors_${user.id}`;
    const cleared = await AsyncStorage.getItem(clearedKey);
    const clearedIds = cleared ? JSON.parse(cleared) : [];

    // Add this visitor to cleared
    const newCleared = [...clearedIds, visitorId];
    await AsyncStorage.setItem(clearedKey, JSON.stringify(newCleared));

    // Remove from state
    setOldVisitors(prev => prev.filter(v => v.idvisitors !== visitorId));
  };

  // Clear all notifications
  const clearAll = async () => {
    Alert.alert("Clear All", "Are you sure you want to clear all notifications?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", onPress: async () => {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user?.id) return;

        const clearedKey = `clearedVisitors_${user.id}`;
        const allIds = oldVisitors.map(v => v.idvisitors);
        await AsyncStorage.setItem(clearedKey, JSON.stringify(allIds));

        setOldVisitors([]); // Clear UI
      }}
    ]);
  };

  // Render each visitor
  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, !item.seen && styles.highlight]}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Phone: {item.phone}</Text>
      <Text>Company: {item.company}</Text>
      <Text>Designation: {item.designation}</Text>
      <Text>Program: {item.program}</Text>
      <Text>Requirement: {item.requirement}</Text>

      <TouchableOpacity
        style={styles.followUpButton}
        onPress={() => handleFollowUp(item.idvisitors, item.name)}
      >
        <Text style={styles.buttonText}>Did you follow up?</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {oldVisitors.length === 0 ? (
        <Text style={styles.noData}>No old visitors found.</Text>
      ) : (
        <>
          <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>

          <FlatList
            data={oldVisitors}
            keyExtractor={(item) => item.idvisitors.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </View>
  );
};

export default Push;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemContainer: { 
    backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12, elevation: 2 
  },
  highlight: { borderLeftWidth: 5, borderLeftColor: "#FFC840" },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  noData: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#555" },
  followUpButton: { 
    marginTop: 10, backgroundColor: "#007bff", padding: 10, borderRadius: 6, alignItems: "center" 
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  clearButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ff4d4d",
    borderRadius: 6,
  },
  clearText: { color: "#fff", fontWeight: "bold" },
});
