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
import { useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const bgImage = require('../asset/oo.jpg'); // Ensure path is correct

export default function UserLogin({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please enter email/phone and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://10.0.2.2:3000/api/visitors/userlogin', {
        emailOrPhone,
        password,
      });

      if (res.data.success) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user)); // storing user info
        navigation.replace('Home', { email: res.data.user.email });
      } else {
        Alert.alert('Login Failed', res.data.message);
      }
    } catch (err) {
      console.log('Login error:', err);
      Alert.alert('Login Failed', err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Welcome Back{'\n'} User Log in!</Text>

        <View style={styles.formBox}>
          <TextInput
            placeholder="Email or Phone"
            placeholderTextColor="#999"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            style={styles.input}
            autoCapitalize="none"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 }}>
  <TextInput
    placeholder="Password"
    placeholderTextColor="#999"
    secureTextEntry={!showPass}
    value={password}
    onChangeText={setPassword}
    style={{ flex: 1, height: 50, fontSize: 16, paddingHorizontal: 5 }}
  />
  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
    <Text style={{ fontSize: 18, paddingHorizontal: 10, color: '#000' }}>
      {showPass ? '🙈' : '👁️'}
    </Text>
  </TouchableOpacity>
</View>

            
          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('Usersign')}>
            <Text style={styles.forgot}>Don't have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <View style={[styles.button, loading && { opacity: 0.5 }]}>
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'LOG IN'}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#444' }}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Usersign')}>
              <Text style={{ fontWeight: 'bold', color: '#460066' }}>Sign up</Text>
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
