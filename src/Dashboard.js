import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from './config';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const currentUserUid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserUid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setName(userData.firstName);
          setPhone(userData.phoneNumber);
        } else {
          console.log('User does not exist');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../assets/login_bg.png')} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.textInput}>
          Hello, {name}, your number is {phone}
        </Text>
        <TouchableOpacity onPress={() => firebase.auth().signOut()} style={styles.button}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 350,
    color: 'white',
  },
  button: {
    marginTop: 50,
    height: 70,
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});
