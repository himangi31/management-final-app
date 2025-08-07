import React, { useEffect, useState } from 'react';
import { View,Text,StyleSheet,ScrollView,Animated,Easing,Dimensions,} from 'react-native';
import axios from 'axios';
import { PieChart ,BarChart} from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable'; 

const ProgramStatsScreen = () => {
  const [programData, setProgramData] = useState([]);
  const [total, setTotal] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));
  const [displayValue, setDisplayValue] = useState(0);

  const BASE_URL = 'http://10.0.2.2:3000/api/visitors';

  useEffect(() => {
    axios.get(`${BASE_URL}/program`)
      .then((res) => {
        if (res.data.success) {
          setProgramData(res.data.data);
        }
      })
      .catch((err) => console.error('❌ Program fetch error:', err.message));

    axios.get(`${BASE_URL}/total`)
      .then((res) => {
         console.log('✅ Total API response:', res.data); 
        if (res.data.success) {
          setTotal(res.data.total);
        }
      })
      .catch((err) => console.error('❌ Total fetch error:', err.message));
  }, []);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) =>{
      setDisplayValue(Math.round(value));  
    });

    Animated.timing(animatedValue,{
      toValue:total,
      duration:1500,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp),
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [total]);

  const chartData = programData
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      name: item.program || 'Other',
      population: item.count,
      color: COLORS[index % COLORS.length],
      legendFontColor: '#333',
      legendFontSize: 14,
    }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.heading}>
        Total Visitors
      </Animatable.Text>

      <Animated.Text style={styles.animatedText}>
        {displayValue}
      </Animated.Text>

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subheading}>
        Program-wise Distribution
      </Animatable.Text>

      {chartData.length > 0 ? (
        <Animatable.View animation="zoomIn" delay={300}>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={250}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[5, 0]}
            absolute
          />
          <Animatable.Text animation="fadeInUp" delay={800} style={styles.subheading}>
  Program-wise Bar Chart
</Animatable.Text>

<Animatable.View animation="fadeInRight" delay={1000}>
  <BarChart
    data={{
      labels: programData.map((item) => item.program || 'Other'),
      datasets: [
        {
          data: programData.map((item) => item.count),
          colors: programData.map((_, i) => () => COLORS[i % COLORS.length]),
        },
      ],
    }}
    width={Dimensions.get('window').width - 40}
    height={250}
    fromZero
    withCustomBarColorFromData={true}  
    flatColor={true}                   
    showValuesOnTopOfBars={true}
    chartConfig={{
      backgroundColor: '#fff',
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForBackgroundLines: {
        stroke: '#e3e3e3',
      },
    }}
    style={{
      marginVertical: 8,
      borderRadius: 16,
    }}
  />
</Animatable.View>

        </Animatable.View>
      ) : (
        <Text style={{ marginTop: 10 }}>No data to display</Text>
      )}
    </ScrollView>
  );
};

const COLORS = [
  '#4dc9f6', // Blue
  '#f67019', // Orange
  '#f53794', // Pink
  '#537bc4', // Navy
  '#acc236', // Green
  '#166a8f', // Teal
  '#58595b', // Gray
];

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    minHeight: '100%',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  animatedText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00c6ff',
    marginBottom: 14,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    color: '#444',
  },
});

export default ProgramStatsScreen;
