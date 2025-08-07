import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

const bgImage = require('../asset/oo.jpg');

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://10.0.2.2:3000/api/visitors/signup', {
        email,
        password,
      });

      if (res.data.success) {
        Alert.alert('Success', res.data.message, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        Alert.alert('Signup Failed', 'Email already registered');
      } else {
        Alert.alert('Error', err.response?.data?.message ||'Server error');
      }
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Hello{'\n'} Admin Sign up!</Text>

        <View style={styles.formBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.forgot}>Already have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignup}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#444' }}>Back to </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontWeight: 'bold', color: '#460066' }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  header: {
    color: '#0071EB',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 30,
  },
  formBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    elevation: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  forgotWrap: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgot: {
    color: '#555',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#0071EB',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
