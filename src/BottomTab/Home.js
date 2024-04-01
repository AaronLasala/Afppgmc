import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../config';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    const currentUser = firebase.auth().currentUser;
  
    if (currentUser) {
      setLoading(true);
      const currentUserUid = currentUser.uid;
  
      try {
        const userDocRef = firebase.firestore().collection('users').doc(currentUserUid);
        const doc = await userDocRef.get(); // Attempt to fetch data from Firestore
  
        if (doc.exists) {
          const userDataFirestore = doc.data();
          setName(userDataFirestore.fullName);
          AsyncStorage.setItem(`user_${currentUserUid}_data`, JSON.stringify(userDataFirestore)); // Update AsyncStorage with new data
        } else {
          console.log("No such document in Firestore!");
          // Optionally, fallback to AsyncStorage data if Firestore document does not exist
          const userDataString = await AsyncStorage.getItem(`user_${currentUserUid}_data`);
          if (userDataString) {
            const userData = JSON.parse(userDataString);
            setName(userData.fullName);
          }
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
        // Fallback to AsyncStorage in case of an error
        const userDataString = await AsyncStorage.getItem(`user_${currentUserUid}_data`);
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setName(userData.fullName);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const unsubscribe = fetchUserData().catch(console.error);

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = fetchUserData().catch(console.error);

      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }, [])
  );

  const handleUpdatePageNavigation = () => {
    navigation.navigate('Update Page'); // Adjust according to your actual navigation structure
  };

  return (
    <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
      <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>Hello, {name}!</Text>
            <View style={styles.quickLinksContainer}>
              <TouchableOpacity style={[styles.quickLinkButton, styles.bookingButton]} onPress={handleUpdatePageNavigation}>
                <MaterialCommunityIcons name="update" size={24} color="black" />
                <Text style={styles.quickLinkText}>Update Pension</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickLinkButton, styles.activityButton]} onPress={() => navigation.navigate('Profile')}>
                <MaterialCommunityIcons name="account" size={24} color="black" />
                <Text style={styles.quickLinkText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickLinkButton, styles.musicButton]} onPress={() => navigation.navigate('ContactUs')}>
                <MaterialCommunityIcons name="contacts" size={24} color="black" />
                <Text style={styles.quickLinkText}>Contact Us!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickLinkButton, styles.educationButton]} onPress={() => navigation.navigate('HelpScreen')}>
                <MaterialCommunityIcons name="contacts" size={24} color="black" />
                <Text style={styles.quickLinkText}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    marginTop: 200,
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  quickLinksContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  quickLinkButton: {
    width: '80%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 4, // for shadow
  },
  bookingButton: {
    backgroundColor: 'cyan', // Example color, adjust based on your design
  },
  activityButton: {
    backgroundColor: '#00BFFF', // Example color, adjust based on your design
  },
  musicButton: {
    backgroundColor: '#800080', // Example color, adjust based on your design
  },
  educationButton: {
    backgroundColor: 'white', // Example color, adjust based on your design
  },
  quickLinkText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 15,
  },

  loadingText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Home;
