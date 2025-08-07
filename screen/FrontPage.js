import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const FrontPage = ({ navigation }) => {
  const adminButtonRef = useRef(null);
  const userButtonRef = useRef(null);

  const handleAdminPress = () => {
    adminButtonRef.current?.pulse(500);
    setTimeout(() => navigation.navigate('Login'), 300);
  };

  const handleUserPress = () => {
    userButtonRef.current?.pulse(500);
    setTimeout(() => navigation.navigate('Userlog'), 300);
  };

  return (
    <ImageBackground
      source={require('../asset/doc.jpg')}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      {/* Animated Gradient Layer 1 */}
      <Animatable.View
        animation={{
          0: { translateX: -width },
          1: { translateX: width },
        }}
        iterationCount="infinite"
        duration={9000}
        style={styles.animatedOverlayLeft}
      >
        <LinearGradient
          colors={['rgba(219, 205, 205, 0.15)', 'rgba(228, 230, 231, 0.25)', 'rgba(231, 233, 238, 0.1)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientOverlay}
        />
      </Animatable.View>

      {/* Animated Gradient Layer 2 (delay for wave effect) */}
      <Animatable.View
        animation={{
          0: { translateX: width },
          1: { translateX: -width },
        }}
        iterationCount="infinite"
        duration={12000}
        delay={3000}
        style={styles.animatedOverlayRight}
      >
        <LinearGradient
          colors={['rgba(219, 205, 205, 0.15)', 'rgba(228, 230, 231, 0.25)', 'rgba(231, 233, 238, 0.1)']}
         start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
      </Animatable.View>

      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.welcomeText}>
          Welcome to Visitor App
        </Animatable.Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAdminPress} activeOpacity={0.8}>
            <Animatable.View
              ref={adminButtonRef}
              animation={{
                0: { translateY: 0 },
                0.5: { translateY: -5 },
                1: { translateY: 0 },
              }}
              iterationCount="infinite"
              duration={2000}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>Admin Login</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleUserPress} activeOpacity={0.8}>
            <Animatable.View
              ref={userButtonRef}
              animation={{
                0: { translateY: 0 },
                0.5: { translateY: -5 },
                1: { translateY: 0 },
              }}
              iterationCount="infinite"
              duration={2200}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>User Login</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  animatedOverlayLeft: {
  ...StyleSheet.absoluteFillObject,
  left: -width, // Start off-screen from the left
},

animatedOverlayRight: {
  ...StyleSheet.absoluteFillObject,
  right: -width, // Start off-screen from the right
},

  gradientOverlay: {
    width: width * 2,
    height: height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#093FB4',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    padding: 14,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default FrontPage;
