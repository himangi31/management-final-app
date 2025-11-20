import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

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
import Push from './screen/Push';
import BottomNav from './screen/BottomNav'; // adjust path if needed
import UserSidebar from './screen/UserSidebar';
import AdminVisitor from './screen/AdminVisitor';
import AdminStat from './screen/AdminStat';
import Profile from './screen/Profile';
const Stack = createNativeStackNavigator();

// Wrapper component to show BottomNav only on selected screens
const ScreenWrapper = ({ children }) => {
  const route = useRoute();
  const screensWithBottomNav = [
    'VisitorList',
    'AddEvent',
    'EventStats',
    'UserDetails',
    'EnterCard', 
  ];
  const showBottomNav = screensWithBottomNav.includes(route.name);
  return (
    <View style={{ flex: 1 }}>
      {children}
      {showBottomNav && <BottomNav />}
    </View>
  );
};

export default function App() {
  const handleLogout = (navigation) => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Front') },
    ]);
  };

  const logoutButton = (navigation) => (
    <TouchableOpacity onPress={() => handleLogout(navigation)}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Front">
        <Stack.Screen
          name="Front"
          component={FrontPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Userlog" component={UserLogin} />
        <Stack.Screen name="Usersign" component={SignupUser} />
        <Stack.Screen
          name="Adminhome"
          options={({ navigation }) => ({
            title: 'Home',
            headerRight: () => logoutButton(navigation),
          })}
        >
          {(props) => <AdminHome {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: 'Home',
            headerRight: () => logoutButton(navigation),
          })}
        >
          {(props) => <HomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
  name="EnterCard"
>
  {(props) => (
    <ScreenWrapper>
      <ManualEntryScreen {...props} />
    </ScreenWrapper>
  )}
</Stack.Screen>

        <Stack.Screen
          name="UserDetails"
        >
          {(props) => (
            <ScreenWrapper>
              <UserDetail {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen name="ScanCard" component={ScanCardScreen} />
         <Stack.Screen name="User" component={UserSidebar} />
          <Stack.Screen name="AdminStat" component={AdminStat} />
         <Stack.Screen name="AdminVisitor" component={AdminVisitor} />
        <Stack.Screen name="Notification" component={Push} />
        <Stack.Screen name="Profile" component={Profile} />

        <Stack.Screen
          name="VisitorList"
        >
          {(props) => (
            <ScreenWrapper>
              <VisitorListScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="EventStats"
        >
          {(props) => (
            <ScreenWrapper>
              <ProgramStatsScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AddEvent"
        >
          {(props) => (
            <ScreenWrapper>
              <AddProgramScreen {...props} />
            </ScreenWrapper>
          )}
        </Stack.Screen>
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
