import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupScreen';
import ScanCardScreen from './screen/ScanCardScreen';
import HomeScreen from './screen/HomeScreen';
import ManualEntryScreen from './screen/ManualEntryScreen';
import VisitorListScreen from './screen/VisitorListScreen';
import ProgramStatsScreen from './screen/ProgramStatsScreen';
import AddProgramScreen from './screen/AddProgramScreen';
import UserLogin from './screen/UserLogin';
import SignupUser from './screen/SignUpUser';
import UserDetail from './screen/UserDetail';
import FrontPage from './screen/FrontPage';
import AdminHome from './screen/AdminHome';

const Stack = createNativeStackNavigator();

export default function App() {
  const handleLogout = (navigation) => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Front') },
    ]);
  };

  const gradientHeader = () => (
    <LinearGradient
      colors={['#0046BF', '#0071EB']}
      style={StyleSheet.absoluteFill}  // yeh header ko proper cover karega
    />
  );

  const logoutButton = (navigation) => (
    <TouchableOpacity onPress={() => handleLogout(navigation)}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Front"
        screenOptions={{
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          headerBackTitleVisible: false,
          headerBackground: gradientHeader,
        }}
      >
        <Stack.Screen name="Front" component={FrontPage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Userlog" component={UserLogin} />
        <Stack.Screen name="Usersign" component={SignupUser} />
        <Stack.Screen
          name="Adminhome"
          component={AdminHome}
          options={({ navigation }) => ({
            title: 'Home',
            headerRight: () => logoutButton(navigation),
          })}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Home',
            headerRight: () => logoutButton(navigation),
          })}
        />
        <Stack.Screen name="EnterCard" component={ManualEntryScreen} options={{ title: 'Manual Entry' }} />
        <Stack.Screen name="UserDetails" component={UserDetail} />
        <Stack.Screen name="ScanCard" component={ScanCardScreen} />
        <Stack.Screen name="VisitorList" component={VisitorListScreen} />
        <Stack.Screen name="ProgramStats" component={ProgramStatsScreen} />
        <Stack.Screen name="AddProgram" component={AddProgramScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logoutText: {
    color: '#fff',
    marginRight: 15,
    fontSize: 16,
  },
});
