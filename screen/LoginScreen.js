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
  Dimensions,
} from 'react-native';
import axios from 'axios';
const { width } = Dimensions.get('window');
const bgImage = require('../asset/oo.jpg'); // ✅ Ensure path is correct

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
     console.log("Trying login with:", email, password);
    try {
      const res = await axios.post('http://10.0.2.2:3000/api/visitors/login'
, { email, password });


      if (res.data.success) {
       // Alert.alert('Success', res.data.message);
        navigation.navigate('Adminhome');
      }
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Server error');
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Welcome Back{'\n'}Admin Log in!</Text>

        <View style={styles.formBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={{ fontSize: 18, paddingHorizontal: 10,color: '#000' }}>
    {showPass ? '🙈' : '👁️'}
  </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.forgot}>Don't have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>LOG IN</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#444' }}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
    color: '#000'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
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
 