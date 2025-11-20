import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");


const AdminHome = ({ navigation }) => {
  const bannerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [{ image: require("../asset/logo.png") }]; // Banner image

  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("Admin");

  // Auto-slide banners
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      bannerRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

    useEffect(() => {
    axios
      .get(`http://16.171.188.189:3000/api/visitors/total`)
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.total); // Update state with total count
        }
      })
      .catch((err) => console.error("Error fetching total visitors:", err));
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.replace("Login") },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

         <TouchableOpacity style={styles.profileCircle} onPress={handleLogout}>
  <Text style={{ fontSize: 20 }}>👤</Text>
</TouchableOpacity>

        </View>

        {/* Banner Slider */}
        <FlatList
          ref={bannerRef}
          data={banners}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.banner} height={40} />
          )}
        />

        {/* Visitors Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalVisitorsLabel}>Total Visitors</Text>
          <Text style={styles.totalVisitorsNumber}>{total}</Text>
        </View>

        {/* Main Actions */}
        <Text style={styles.sectionTitle}>Main Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("UserDetails")}
          >
            <Text style={styles.actionText}>Sales User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("Adminstat")}
          >
            <Text style={styles.actionText}>View Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("ScanCard")}
          >
            <Text style={styles.actionText}>Scan Visiting Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("AddEvent")}
          >
            <Text style={styles.actionText}>Add event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("AdminVisitor")}
          >
            <Text style={styles.actionText}>Preview Visitors</Text>
          </TouchableOpacity>

              <TouchableOpacity
  style={styles.actionBox}
  onPress={() => navigation.navigate("Profile")}
>
  <Text style={styles.actionText}>Profile</Text>
</TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("AdminHome")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("AdminStat")}>
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

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.navItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  welcomeText: {
    fontSize: 16,
    color: "#555",
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },

  profileCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#eaeaea",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  banner: {
    width: width * 0.95,
    height: 170,
    borderRadius: 14,
    marginHorizontal: 10,
  },

  totalCard: {
    width: width * 0.9,
    height: 100,
    backgroundColor: "#f9d853a6",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 25,
    marginTop: 15,
    alignItems: "center",
  },

  totalVisitorsLabel: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
  },

  totalVisitorsNumber: {
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    marginTop: 0,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginLeft: 22,
    marginTop: 25,
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: width * 0.9,
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  actionBox: {
    width: "48%",
    backgroundColor: "#fff",
    height: 90,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
  },

  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 50,
    width: "92%",
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 75,
    borderRadius: 40,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    elevation: 10,
  },

  navItem: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },

  centerButton: {
    width: 65,
    height: 65,
    backgroundColor: "#FFC840",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
    elevation: 10,
  },

  plusIcon: {
    fontSize: 34,
    color: "#000",
    fontWeight: "800",
  },
});
