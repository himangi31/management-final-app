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

const UserSidebar = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        const parsed = JSON.parse(data);
        setUserData(parsed);
      }
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../asset/k.jpg')}
          style={styles.avatar}
        />

        <Text style={styles.name}>{userData?.name}</Text>
        <Text style={styles.username}>@{userData?.email?.split("@")[0]}</Text>

        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* DETAILS */}
      <View style={styles.listContainer}>

        {renderRow("Email", userData.email)}
        {renderRow("Mobile Number", userData.phone)}

        {/* PASSWORD */}
        <View style={styles.row}>
          <Text style={styles.rowText}>Password</Text>

          <View style={styles.passContainer}>
            <Text style={styles.value}>
              {showPass ? userData.password : "********"}
            </Text>

            {/* 👁 BUTTON */}
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
          onPress={async () => {
            await AsyncStorage.clear();
            navigation.replace("Userlog");
          }}
        >
          <Text style={[styles.rowText, { color: "red" }]}>Log out</Text>
          <Text style={[styles.arrow, { color: "red" }]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// REUSABLE ROW
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

  editBtn: {
    backgroundColor: "#4F7CFE",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  editText: { color: "#fff", fontWeight: "600" },

  listContainer: { paddingHorizontal: 22, marginTop: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  rowText: { fontSize: 16, color: "#333", fontWeight: "500" },
  value: { fontSize: 15, color: "#777" },

  passContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  arrow: { fontSize: 20, color: "#888" },
});

export default UserSidebar;
