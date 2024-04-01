import React, { useState, useCallback } from 'react';
import { Text, StyleSheet, ImageBackground, SafeAreaView, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const monthNumberToName = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const Profile = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [addressType, setAddressType] = useState(null);
  const [localAddress, setLocalAddress] = useState('');
  const [abroadAddress, setAbroadAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoClip, setVideoClip] = useState('');
  const [pictureUrl, setPictureUrl] = useState(null); // State for storing the picture URL


  const navigation = useNavigation();

  const fetchUserData = useCallback(async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const currentUserUid = currentUser.uid;
        const userDataString = await AsyncStorage.getItem(`user_${currentUserUid}_data`);
        const userData = JSON.parse(userDataString);
        const filesData = userData['2x2Picture_files'];

        if (filesData && filesData.length > 0) {
          // Assuming the latest picture is at the end of the array
          const latestPicture = filesData[filesData.length - 1];
          setPictureUrl(latestPicture.url); // Set the latest picture URL to state
        }

        if (userData) {
          setName(userData.fullName || '');
          setPhone(userData.phoneNumber || '');
          setAddressType(userData.addressType || '');
          setLocalAddress(userData.localAddress || '');
          setAbroadAddress(userData.abroadAddress || '');

          // Set the birthday using the structure from Firestore
          if (userData.birthday) {
            setBirthday({
              day: userData.birthday.day || '',
              month: userData.birthday.month || '',
              year: userData.birthday.year || '',
            });
          }
        } else {
          console.log('User data not found in Firestore');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const displayAddress = () => {
    console.log(`Address Type: ${addressType}, Local: ${localAddress}, Abroad: ${abroadAddress}`);
    if (addressType.toLowerCase() === 'local' && localAddress) {
      return localAddress;
    } else if (addressType.toLowerCase() === 'abroad' && abroadAddress) {
      return abroadAddress;
    }
    return 'Address not available';
  };

  const formattedBirthday = `${birthday.day} ${birthday.month} ${birthday.year}`;


  return (
    <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {!loading && (
          name && phone ? (
          <View style={styles.infoContainer}>
          {pictureUrl && (
            <View style={styles.infoItem1}>
              <Image source={{ uri: pictureUrl }} style={styles.picture} />
            </View>
          )}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{name} </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{phone} </Text>
           </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Birthday</Text>
            <Text style={styles.infoValue}>{formattedBirthday}</Text>
          </View>
           <View style={styles.infoItem}>
           <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{displayAddress()}</Text>
         </View>
        </View>
     
          ) : (
            <Text style={styles.textInput}>
              User data not found. Please check your internet connection or try again later.
            </Text>
          )
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picture: {
    width: 150, 
    height: 150, 
    borderRadius: 75,
    alignContent: 'center',
    alignSelf: 'center'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    marginBottom: 10,
  },
  userName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
    activeSince: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 5,
  },
    infoContainer: {
    marginVertical: 20,
    marginTop: 300,
  },
  infoItem1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#474787',
    justifyContent:'center',
    
  },
    infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#474787',
    
  },
    infoLabel: {
    color: '#999',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
    infoValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
    editButton: {
    backgroundColor: '#524B63',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
    editButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default Profile;

