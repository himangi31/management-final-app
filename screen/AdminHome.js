import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';

const AdminHome = ({ navigation }) => {
  const handleLogout = () => {    Alert.alert('Logged Out', 'You have been successfully logged out.');
    navigation.replace('Login');
  };

  let scanButtonRef = null;
  let enterCardRef = null;
  let listRef = null;

  const handleScanPress = () => {
    if (scanButtonRef) {
      scanButtonRef.pulse(200).then(() => {
        navigation.navigate('ScanCard');
      });
    } else {
      navigation.navigate('ScanCard');
    }
  };

  const handlecard = () => {
    if (enterCardRef) {
      enterCardRef.pulse(200).then(() => {
        navigation.navigate('EnterCard');
      });
    } else {
      navigation.navigate('EnterCard');
    }
  };

  const handleList = () => {
    if (listRef) {
      listRef.pulse(200).then(() => {
        navigation.navigate('VisitorList');
      });
    } else {
      navigation.navigate('VisitorList');
    }
  };

  return (
    <ImageBackground
      source={require('../asset/doc.jpg')}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
      
        <View style={styles.topBar}>
          <Animatable.Text animation="fadeInDown" duration={1500} style={styles.topWelcome}>
          </Animatable.Text>
          <TouchableOpacity onPress={() => Alert.alert('Profile', 'Profile screen coming soon')}>
            <Text style={styles.emojiIcon}> </Text>
          </TouchableOpacity>
        </View>

        {/* Main Area */}
        <View style={styles.innerContainer}>
          <Animatable.Text animation="zoomIn" delay={300} style={styles.heading}>
            Welcome !
          </Animatable.Text>
            
               <TouchableOpacity onPress={() => navigation.navigate('UserDetails')}>
            <Animatable.View
              animation="slideInUp"
              delay={400}
              duration={700}
              style={styles.animatedButton}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>Registered User</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.navigate('ProgramStats')}>
            <Animatable.View
              animation="slideInUp"
              delay={400}
              duration={700}
              style={styles.animatedButton}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>View Statistics</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleScanPress}>
            <Animatable.View
              ref={(ref) => (scanButtonRef = ref)}
              animation="slideInUp"
              delay={500}
              duration={700}
              style={styles.animatedButton}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>Scan Visiting Card</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlecard}>
            <Animatable.View
              ref={(ref) => (enterCardRef = ref)}
              animation="slideInUp"
              delay={600}
              duration={700}
              style={styles.animatedButton}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>Enter Visitor</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleList}>
            <Animatable.View
              ref={(ref) => (listRef = ref)}
              animation="slideInUp"
              delay={700}
              duration={700}
              style={styles.animatedButton}
            >
              <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.button}>
                <Text style={styles.buttonText}>Preview Visitors</Text>
              </LinearGradient>
            </Animatable.View>
          </TouchableOpacity>

         
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 110,
    marginBottom: 10,
  },
  emojiIcon: {
    fontSize: 32,
    marginRight: 5,
  },
  topWelcome: {
    fontSize: 28,
    fontWeight: '600',
    color: '#093FB4',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom:180,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#093FB4',
  },
  animatedButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    padding: 14,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    elevation: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fcfcfdff',
    fontSize: 18,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 170,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#1756dfee',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#f3f0f0ff',
    fontWeight: '1000',
    fontSize: 16,
    letterSpacing: 0.5,
    fontStyle: 'bold',
  },
});

export default AdminHome;
