import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from './src/config';
import * as Notifications from 'expo-notifications';

import Home from "./src/BottomTab/Home";
import Profile from "./src/BottomTab/Profile";
import Login from "./src/Login";
import Register from "./src/Register";
import Update from "./src/BottomTab/Update";
import Settingspage from "./src/BottomTab/Settingspage";
import ContactUs from "./src/BottomTab/ContactUs";
import VerificationRequiredScreen from './src/BottomTab/VerificationRequiredScreen';
import SubmissionLockScreen from "./src/BottomTab/SubmissionLockScreen";
import Help from "./src/BottomTab/Help";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function CustomTabIcon({ name, color, size, marginTop }) {
  return (
    <View style={{ marginTop }}>
      <MaterialCommunityIcons name={name} color={color} size={size} />
    </View>
  );
}

function App() {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const user = firebase.auth().currentUser;

      if (isLoggedIn === 'true' && user) {
        setIsAuthenticated(true);
        scheduleNotification(); // Add this line to schedule the notification after login
      } else {
        await AsyncStorage.setItem('isLoggedIn', 'false');
        await firebase.auth().signOut();
        setIsAuthenticated(false);
      }

      setInitializing(false);
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      AsyncStorage.setItem('isLoggedIn', (!!user).toString());
      if (!!user) {
        scheduleNotification(); // Add this line to schedule the notification upon auth state change
      }
    });

    checkLoginStatus();

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  async function scheduleNotification() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission not granted');
      return;
    }
    
    // Set up a trigger for 6 AM. Note: The 'hour' and 'minute' are in 24h format.
    const trigger = {
      hour: 6,
      minute: 0,
      repeats: true
    };
  
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "AFP PGMC",
        body: "Please update your account",
      },
      trigger,
    });
  
    console.log(`Notification scheduled for 6 AM daily, id: ${notificationId}`);
  }
  
  // Call this function when your app starts, after the user is authenticated
  scheduleNotification();
  
  
  

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const UpdatePageWrapper = () => {
    const user = firebase.auth().currentUser;
  
    if (user && user.emailVerified) {
      return <Update />;
    } else {
      return <VerificationRequiredScreen />;
    }
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'black'} /> 
      {isAuthenticated ? (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main">
            {() => (
              <Tab.Navigator barStyle={{ backgroundColor: 'green' }} activeColor="black">
                <Tab.Screen 
                  name="Homepage" 
                  component={Home} 
                  options={{
                    tabBarIcon: ({ color }) => <CustomTabIcon name="home" color={color} size={30} marginTop={-5} />,
                  }} 
                />
                <Tab.Screen 
                  name="Profile" 
                  component={Profile} 
                  options={{
                    tabBarIcon: ({ color }) => <CustomTabIcon name="account" color={color} size={30} marginTop={-5} />,
                  }} 
                />
                <Tab.Screen 
                  name="Update Page" 
                  component={UpdatePageWrapper} 
                  options={{
                    tabBarIcon: ({ color }) => <CustomTabIcon name="account-sync" color={color} size={30} marginTop={-5} />,
                  }} 
                />
                <Tab.Screen 
                  name="Settings" 
                  component={Settingspage} 
                  options={{
                    tabBarIcon: ({ color }) => <CustomTabIcon name="cog" color={color} size={30} marginTop={-5} />,
                  }} 
                />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="SubmissionLockScreen" component={SubmissionLockScreen} />
          <Stack.Screen name="HelpScreen" component={Help} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
