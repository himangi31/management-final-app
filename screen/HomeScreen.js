import React, { useEffect, useState, useRef } from "react";
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
  FlatList,Animated,Easing
} from "react-native";
import UserSidebar from "./UserSidebar";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const bannerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Local banners
  const banners = [{ image: require("../asset/banner.png") }];

  const [total, setTotal] = useState(0);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [animatedValue] = useState(new Animated.Value(0));
const [displayValue, setDisplayValue] = useState(0);
const [loggedInUser, setLoggedInUser] = useState(null);

useEffect(() => {
  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) setLoggedInUser(JSON.parse(data));
  };
  loadUser();
}, []);

const BASE_URL = "http://16.171.188.189:3000/api/visitors";


  // Auto Slide for banners
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);

      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

 useEffect(() => {
  const fetchTotal = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user?.id) return;

      const totalRes = await axios.get(`${BASE_URL}/total/${user.id}`);
      if (totalRes.data.success) {
        setTotal(totalRes.data.total);
      }
    } catch (error) {
      console.error("Error fetching total visitors:", error);
    }
  };

  fetchTotal();
}, []);
useEffect(() => {
  const listener = animatedValue.addListener(({ value }) => {
    setDisplayValue(Math.round(value));
  });

  Animated.timing(animatedValue, {
    toValue: total,
    duration: 1500,
    easing: Easing.out(Easing.exp),
    useNativeDriver: false,
  }).start();

  return () => animatedValue.removeListener(listener);
}, [total]);
 // 🔥 Popup on New Notifications
useEffect(() => {
  if (notifications > 0) {
    Alert.alert(
      "🔔 New Notification",
      `You have ${notifications} new notifications!`,
      [{ text: "OK" }]
    );
  }
}, [notifications]);


  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => navigation.replace("Userlog") },
    ]);
  };

  const handleBellPress = () => {
  
    // Optionally, you could navigate to Notification screen:
     navigation.navigate("Notification");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
  <Image
    source={require("../asset/logo.png")}
    style={{ width: 160, height: 40, resizeMode: "cover" , marginLeft:1}}
  />
</View>


          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Bell Icon with Notification Badge */}
            <TouchableOpacity style={{ marginRight: 15 }} onPress={handleBellPress}>
              <View>
                <Text style={{ fontSize: 25 }}>🔔</Text>
                {notifications > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -5,
                      top: -5,
                      backgroundColor: "red",
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                      {notifications}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
          
              <Text style={{ fontSize: 20 }}>👤</Text>
        </TouchableOpacity>

            
            
          </View>
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
            <Image source={item.image} style={styles.banner} height={170} />
          )}
        />

        {/* Visitors Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalVisitorsLabel}>Total Visitors</Text>
          <Text style={styles.totalVisitorsNumber}>{displayValue}</Text>

        </View>

        {/* Main Actions */}
        <Text style={styles.sectionTitle}>Main Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("ScanCard")}
          >
            <Text style={styles.actionText}>Scan Visiting Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("EnterCard")}
          >
            <Text style={styles.actionText}>Manual Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("EventStats")}
          >
            <Text style={styles.actionText}>Check-In History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("AddEvent")}
          >
            <Text style={styles.actionText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("EventStats")}>
          <Text style={styles.navItem}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => navigation.navigate("ScanCard")}
        >
          <Text style={styles.plusIcon}>🔍</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("VisitorList")}>
          <Text style={styles.navItem}>Visitors</Text>
        </TouchableOpacity>
     <TouchableOpacity
  onPress={() => {
    if (!loggedInUser) {
      Alert.alert("Please wait", "Loading user data...");
      return;
    }
    navigation.navigate("User", { user: loggedInUser });
  }}
>
  <Text style={styles.navItem}>Profile</Text>
</TouchableOpacity>



        
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f8f8" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  welcomeText: { fontSize: 16, color: "#555" },
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
  totalVisitorsLabel: { fontSize: 16, color: "#222", fontWeight: "600" },
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
  actionText: { fontSize: 15, fontWeight: "600", color: "#333" },
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
  navItem: { fontSize: 14, color: "#444", fontWeight: "600" },
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
  plusIcon: { fontSize: 34, color: "#000", fontWeight: "800" },
});
