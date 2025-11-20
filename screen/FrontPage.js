import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const FrontPage = ({ navigation }) => {
  const btnRef = useRef(null);

  const handlePress = () => {
    btnRef.current?.pulse(500);
    setTimeout(() => navigation.navigate('Userlog'), 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- TOP LEFT SHAPES ---------- */}
      <View style={styles.topCircleGreen}></View>
      <View style={styles.topCircleYellow}></View>

      {/* ---------- MAIN CONTENT ---------- */}
      
      <View style={styles.centerContent}>
      <Animatable.Image
  animation="pulse"
  iterationCount="infinite"
  easing="linear"       // linear → smooth blink
  duration={500}        // fast
  source={require('../asset/logo.png')}
  style={styles.topLogo}
/>


        <Animatable.Image
          animation="fadeInDown"
          duration={900}
          source={require('../asset/a.png')}
          style={styles.locationIcon}
        />

        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          BPE Konnect
        </Animatable.Text>

        {/* BUTTON */}
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
          <Animatable.View ref={btnRef}  iterationCount="infinite">
            <View style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </View>
          </Animatable.View>
        </TouchableOpacity>

        <Text style={styles.laterText}>click here</Text>
      </View>

      {/* ---------- BOTTOM SHAPES ---------- */}
      <View style={styles.bottomCircleGreen}></View>
      <View style={styles.bottomCircleYellow}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  topLogo: {
  width: 230,
  height: 70,
  // optional, if you want to tint
},


  /* TOP LEFT SHAPES */
  topCircleGreen: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#6CD067',
    borderRadius: width * 0.25,
    top: -width * 0.15,
    left: -width * 0.1,
  },
  topCircleYellow: {
    position: 'absolute',
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: '#FFD257',
    borderRadius: width * 0.175,
    top: width * 0.05,
    left: -width * 0.15,
  },

  /* BOTTOM RIGHT SHAPES */
  bottomCircleGreen: {
    position: 'absolute',
    width: width * 0.45,
    height: width * 0.45,
    backgroundColor: '#6CD067',
    borderRadius: width * 0.225,
    bottom: -width * 0.15,
    right: -width * 0.1,
  },
  bottomCircleYellow: {
    position: 'absolute',
    width: width * 0.35,
    height: width * 0.35,
    backgroundColor: '#FFD257',
    borderRadius: width * 0.175,
    bottom: width * 0.05,
    right: -width * 0.15,
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40, // ensures button is above home bar
  },

  locationIcon: {
    width: 65,
    height: 65,
    marginBottom: 25,
    tintColor: '#000',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#6CD067',
    paddingVertical: 14,
    paddingHorizontal: 90,
    borderRadius: 40,
    elevation: 4,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  laterText: {
    marginTop: 18,
    fontSize: 15,
    color: '#444',
  },
});

export default FrontPage;
