import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,Image
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://16.171.188.189:3000/api/visitors/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.success) {
        navigation.replace('Adminhome'); // Navigate to the home screen after successful login
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
    <LinearGradient colors={['#FFF7C9', '#FFE58A']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.header}>Welcome {'\n'}BPE Admin</Text>
        <Text style={styles.subHeader}>Please Sign in to continue</Text>

        <View style={styles.formBox}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setShowPass(!showPass)}
              style={{
                position: 'absolute',
                right: 20,
                top: 15,
              }}
            >
              <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.forgot}>Don't have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient
              colors={['#FFD84D', '#FFC700']}
              style={[styles.button, loading && { opacity: 0.5 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'LOG IN'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#444' }}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ fontWeight: 'bold', color: '#460066' }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom:230,
  },
  header: {
    color: '#010b16ff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
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
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 15,
    color: '#000',
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
