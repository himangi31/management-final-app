import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = ({ navigation }) => {
  const [adminData, setAdminData] = useState({
    
    email: "",
    password: "",
    totalVisitors: 0,
  });

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 📌 Admin Login Data from AsyncStorage
        const data = await AsyncStorage.getItem("admin");

        if (data) {
          const parsed = JSON.parse(data);
          setAdminData((prev) => ({
            ...prev,
            name: parsed.name,
            email: parsed.email,
            password: parsed.password,
          }));
        }

        // 📌 Total Visitors Fetch from API
        const res = await axios.get(
          "http://16.171.188.189:3000/api/visitors/total"
        );

        if (res.data.success) {
          setAdminData((prev) => ({
            ...prev,
            totalVisitors: res.data.total,
          }));
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
         source={require('../asset/k.jpg')}
         style={styles.avatar}
        />

        <Text style={styles.name}>{ "Admin"}</Text>
        <Text style={styles.username}>
          @{adminData.email ? adminData.email.split("@")[0] : "admin"}
        </Text>
      </View>

      {/* DETAILS */}
      <View style={styles.listContainer}>

       
        {renderRow("Email", adminData.email)}
        {renderRow("Total Visitors", adminData.totalVisitors)}

        {/* PASSWORD ROW */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Password</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.value}>
              {showPass ? adminData.password : "********"}
            </Text>

            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={{ fontSize: 22, marginLeft: 8 }}>
                👁
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[styles.row, { marginTop: 30 }]}
          onPress={handleLogout}
        >
          <Text style={[styles.rowText, { color: "red" }]}>Log out</Text>
          <Text style={[styles.arrow, { color: "red" }]}>›</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const renderRow = (title, value) => (
  <View style={styles.row}>
    <Text style={styles.rowText}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  header: { alignItems: "center", paddingVertical: 35 },
  avatar: { width: 110, height: 110, borderRadius: 80, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold", color: "#222" },
  username: { fontSize: 14, color: "#666", marginBottom: 15 },

  listContainer: { paddingHorizontal: 22, marginTop: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  rowText: { fontSize: 16, color: "#333", fontWeight: "500" },
  value: { fontSize: 15, color: "#777" },
  arrow: { fontSize: 20, color: "#888" },
});

export default Profile;
