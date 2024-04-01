import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Alert, TextInput } from 'react-native';
import { firebase } from './config';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import RNPickerSelect from 'react-native-picker-select'; // Import the RNPickerSelect library
import AsyncStorage from '@react-native-async-storage/async-storage';

const calculateAllowedUpdateMonths = (birthMonth, age) => {
  const normalizeMonth = (month) => (month >= 1 && month <= 12) ? month : (month > 12) ? month - 12 : month + 12;

  if (age >= 70) {
    const firstUpdateMonths = [
      normalizeMonth(birthMonth - 2),
      normalizeMonth(birthMonth - 1),
      normalizeMonth(birthMonth),
    ];
    const secondUpdateMonths = [
      normalizeMonth(birthMonth - 6), 
      normalizeMonth(birthMonth - 7), 
      normalizeMonth(birthMonth - 8)
    ];
    return {
      defaultAllowedMonths: [], // No default months for age 70 and above
      firstUpdateAllowedMonths: firstUpdateMonths,
      secondUpdateAllowedMonths: secondUpdateMonths,
    };
  }

  const monthMap = {
    1: [1, 12, 11],
    2: [2, 1, 12],
    3: [3, 2, 1],
    4: [4, 3, 2],
    5: [5, 4, 3],
    6: [6, 5, 4],
    7: [7, 6, 5],
    8: [8, 7, 6],
    9: [9, 8, 7],
    10: [10, 9, 8],
    11: [11, 10, 9],
    12: [12, 11, 10],
  };

  return {
    defaultAllowedMonths: monthMap[birthMonth] || [],
    firstUpdateAllowedMonths: [], // No first update months for age below 70
    secondUpdateAllowedMonths: [], // No second update months for age below 70
  };
};




const Register = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthMonth: null, // New field to store selected birth month
    phoneNumber: '',
    age: '',
  });

  const ageRef = useRef();
  const fullNameRef = useRef();
  const birthDayRef = useRef();
  const phoneNumberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const onInputChange = (field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const navigation = useNavigation();

  const registerUser = async () => {
    if (inputValues.password !== inputValues.confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match. Please enter matching passwords.'
      );
      return;
    }

    try {
      await firebase.auth().createUserWithEmailAndPassword(
        inputValues.email,
        inputValues.password
      );

      await firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://afppgmc-82e1e.firebaseapp.com',
      });

      Alert.alert(
        'Verification email sent',
        'Please verify your email before logging in.'
      );

      const birthMonth = inputValues.birthMonth || 1; // Default to January if birthMonth is not selected
      const { defaultAllowedMonths, firstUpdateAllowedMonths, secondUpdateAllowedMonths } = calculateAllowedUpdateMonths(birthMonth, inputValues.age);


      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set({
          fullName: inputValues.fullName,
          age: inputValues.age,
          birthDay: inputValues.birthMonth,
          email: inputValues.email,
          phoneNumber: inputValues.phoneNumber,
          allowedUpdateMonths: defaultAllowedMonths,
          firstUpdateAllowedMonths: firstUpdateAllowedMonths || [],
          secondUpdateAllowedMonths: secondUpdateAllowedMonths || [],
        });

      // Set the user's login status in AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Navigate to the "Home" screen after successful registration
      navigation.navigate('Home');
    } catch (error) {
      console.error('Firestore Write Error:', error);
    }
  };


  const onFirstPageInputChange = (field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return (
    <ImageBackground
      source={require('../assets/login_bg.png')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.whiteBox}>
          {currentPage === 1 && (
            <FirstPage
              fullNameRef={fullNameRef}
              birthDayRef={birthDayRef}
              phoneNumberRef={phoneNumberRef}
              ageRef={ageRef}
              onInputChange={onFirstPageInputChange}
              inputValues={inputValues}
              setInputValues={setInputValues}
              calculateAllowedUpdateMonths={calculateAllowedUpdateMonths}
            />
          )}

          {currentPage === 2 && (
            <SecondPage
              emailRef={emailRef}
              passwordRef={passwordRef}
              confirmPasswordRef={confirmPasswordRef}
              onInputChange={onInputChange}
              inputValues={inputValues}
            />
          )}

          <View style={styles.buttonContainer}>
            {currentPage === 1 && (
              <TouchableOpacity
                onPress={() => setCurrentPage(2)}
                style={styles.button}
              >
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Next</Text>
              </TouchableOpacity>
            )}

            {currentPage === 2 && (
              <>
                <TouchableOpacity
                  onPress={() => setCurrentPage(1)}
                  style={styles.button}
                >
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => registerUser()}
                  style={styles.button1}
                >
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Register</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
  whiteBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,  
    borderTopRightRadius: 20,
    overflow: 'hidden', // Ensure the content inside the box doesn't overflow
  },
  button: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#0094FF',
    borderColor: 'white',
    borderWidth: 2,
    width: '80%',
    
  },
  button1: {
    marginTop: 10,
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#0094FF',
    borderColor: 'white',
    borderWidth: 2,
    width: '80%',
    
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 70,
  },
});

export default Register;