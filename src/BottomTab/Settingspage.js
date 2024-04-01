import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Settingspage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [pictureUrl, setPictureUrl] = useState(null); // State for storing the picture URL


  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        const currentUserUid = currentUser.uid;

        // Simulate fetching data for 2 seconds
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const userDataString = await AsyncStorage.getItem(`user_${currentUserUid}_data`);
        const userData = JSON.parse(userDataString);
        const filesData = userData['2x2Picture_files'];

        if (filesData && filesData.length > 0) {
          // Assuming the latest picture is at the end of the array
          const latestPicture = filesData[filesData.length - 1];
          setPictureUrl(latestPicture.url); // Set the latest picture URL to state
        }

        if (userData) {
          console.log('User data found:', userData);
          setName(userData.fullName);
          setPhone(userData.phoneNumber);
  
        } else {
          console.log('User data not found in AsyncStorage');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('Settingspage screen is focused. Add your refresh logic here.');
      fetchUserData(); // Fetch data when the screen gains focus
      return () => {
        console.log('Settingspage screen is not focused. Cleanup if needed.');
      };
    }, [])
  );

  const logout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await firebase.auth().signOut();
  
      // Navigate to the 'Login' screen and reset the navigation stack
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Login',
        }),
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigateToContactUs = () => {
    navigation.navigate('ContactUs');
  };

  
  
  

  return (
    <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {pictureUrl ? (
          <Image source={{ uri: pictureUrl }} style={{ width: 150, height: 150, borderRadius: 75, marginTop: 300 }} />
        ) : (
          <View style={{ width: 150, height: 150, borderRadius: 75, marginTop: 300, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16 }}>No Image Uploaded</Text>
          </View>
        )}
        <TouchableOpacity onPress={navigateToContactUs} style={styles.contactButton}>
          <MaterialCommunityIcons name="account-question" size={24} color="white" />
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logout()} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>  Logout    </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Settingspage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row', // Align items horizontally
    marginTop: 20, // Adjust as needed
    backgroundColor: 'red', // A shade of green
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 30, // Horizontal padding
    borderRadius: 25, // Rounded corners
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  logoutText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  contactButton: {
    flexDirection: 'row', // Align items horizontally
    marginTop: 50, // Adjust as needed
    backgroundColor: 'blue', // A shade of green
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 30, // Horizontal padding
    borderRadius: 25, // Rounded corners
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },

  contactButtonText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },


});
