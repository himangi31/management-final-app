import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window");

const ProgramStatsScreen = () => {
  const [programData, setProgramData] = useState([]);
  const [total, setTotal] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  const [displayValue, setDisplayValue] = useState(0);

  const BASE_URL = "http://16.171.188.189:3000/api/visitors";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user?.id) return;

        const programRes = await axios.get(`${BASE_URL}/program/${user.id}`);
        if (programRes.data.success) setProgramData(programRes.data.data);

        const totalRes = await axios.get(`${BASE_URL}/total/${user.id}`);
        if (totalRes.data.success) setTotal(totalRes.data.total);

      } catch (err) {
        console.error("❌ Fetch error:", err.message);
      }
    };

    fetchData();
  }, []);

  // Number Animation
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

  const pieData = programData
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      name: item.program || "Other",
      population: item.count,
      color: COLORS[index % COLORS.length],
      legendFontColor: "#fff",
      legendFontSize: 14,
    }));

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Visitor Statistics</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{displayValue}</Text>
            <Text style={styles.statLabel}>Total Visitors</Text>
          </View>

          <View style={styles.statRightBox}>
            <Text style={styles.statSmall}>Programs: {programData.length}</Text>
            <Text style={styles.statSmall}>Total Entries: {total}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Program Distribution</Text>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={width - 40}
            height={260}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
            center={[10, 0]}
            absolute
          />
        ) : (
          <Text style={styles.noData}>No program data found</Text>
        )}
      </View>
    </ScrollView>
  );
};

const COLORS = [
  "#FFD029",
  "#FF7F00",
  "#FF2E63",
  "#40A9FF",
  "#00C9A7",
  "#7A5AF8",
];

const chartConfig = {
  backgroundGradientFrom: "#111",
  backgroundGradientTo: "#111",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => `#fff`,
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#faf7f7ff",
    padding: 15,
  },

  headerCard: {
    backgroundColor: "#0d0e0cd8",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFD029",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    flex: 1,
  },

  statNumber: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD029",
  },

  statLabel: {
    fontSize: 14,
    color: "#ddd",
  },

  statRightBox: {
    alignItems: "flex-end",
  },

  statSmall: {
    color: "#ccc",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  cardTitle: {
    color: "#FFD029",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  noData: {
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ProgramStatsScreen;
