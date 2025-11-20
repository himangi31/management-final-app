import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

export default function SignupUser({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !number || !name) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const res = await axios.post(
        'http://16.171.188.189:3000/api/visitors/usersignup',
        { email, password, number, name }
      );

      if (res.data.success) {
        Alert.alert('Success', res.data.message, [
          { text: 'OK', onPress: () => navigation.navigate('Userlog') },
        ]);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        Alert.alert('Signup Failed', 'Email or Number already registered');
      } else {
        Alert.alert('Error', err.response?.data?.message || 'Server error');
      }
    }
  };

  return (
    <LinearGradient colors={['#FFF7C9', '#FFE58A']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>User Registration</Text>

        <View style={styles.formBox}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />

          {/* Password Field */}
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
              style={styles.eyeIcon}
            >
              <Text style={{ fontSize: 18 }}>
                {showPass ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.forgot}>Already have an account?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignup}>
            <LinearGradient colors={['#FFD84D', '#FFC700']} style={styles.button}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.bottomText}>
            <Text style={{ color: '#444' }}>Back to </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontWeight: 'bold', color: '#460066' }}>Log in</Text>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  header: {
    color: '#010b16',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 15,
    color: '#000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
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
