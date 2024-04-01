import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Beneficiary from './Beneficiary';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import Principal from './Principal';
import VerificationRequiredScreen from './VerificationRequiredScreen';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const Update = () => {
  const [pensionerType, setPensionerType] = useState(null);
  const [showButtons, setShowButtons] = useState(true);
  const [userVerified, setUserVerified] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userBirthMonth, setUserBirthMonth] = useState(null);
  const [beneficiaryType, setBeneficiaryType] = useState('');

  
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Executing useEffect in Update component');
  
    const checkUserVerification = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          console.log('User Email Verified:', user.email);
          setUserVerified(user.emailVerified);
  
          const userDataString = await AsyncStorage.getItem(`user_${user.uid}_data`);
          console.log('AsyncStorage key:', `user_${user.uid}_data`);
  
          const userData = JSON.parse(userDataString);
          if (userData && userData.birthDay) {
            const birthMonth = new Date(userData.birthDay).getMonth() + 1;
            setUserBirthMonth({
              birthMonth: birthMonth,
              allowedUpdateMonths: userData.allowedUpdateMonths || [],
              firstUpdateAllowedMonths: userData.firstUpdateAllowedMonths || [],
              secondUpdateAllowedMonths: userData.secondUpdateAllowedMonths || [],
            });
          } else {
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            const userDataFirestore = userDoc.data();
            if (userDataFirestore && userDataFirestore.birthDay) {
              const birthMonth = new Date(userDataFirestore.birthDay).getMonth() + 1;
              setUserBirthMonth({
                birthMonth: birthMonth,
                allowedUpdateMonths: userDataFirestore.allowedUpdateMonths || [],
                firstUpdateAllowedMonths: userDataFirestore.firstUpdateAllowedMonths || [],
                secondUpdateAllowedMonths: userDataFirestore.secondUpdateAllowedMonths || [],
              });
              await AsyncStorage.setItem(`user_${user.uid}_data`, JSON.stringify(userDataFirestore));
            }
          }
        }
      } catch (error) {
        console.error('Error checking user verification:', error);
      }
    };

    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUserVerified(authUser ? authUser.emailVerified : false);
    });
  
    checkUserVerification();
  
    return () => {
      console.log('Cleanup function in useEffect');
      unsubscribe();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkLastSubmission = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          if (userData && userData.submitTimestamp) {
            const lastSubmitTime = userData.submitTimestamp.toDate();
            const lastSubmitYear = lastSubmitTime.getFullYear();
            const currentYear = new Date().getFullYear();
            if (currentYear <= lastSubmitYear) {
              navigation.navigate('SubmissionLockScreen');
              return;
            }
          }
        }
      };
      checkLastSubmission();
    }, [navigation])
  );
  


  const handleTypeSelection = async (selectedType) => {
    console.log('Selected Type:', selectedType);
    setPensionerType(selectedType);
    setShowButtons(false);

    // Clear the beneficiaryType if "Principal" is selected
    if (selectedType === 'Principal') {
      setBeneficiaryType('');
    }

    try {
      const user = firebase.auth().currentUser;

      if (user) {
        // Update the pensionerStatus and beneficiaryType in Firestore
        await firebase.firestore().collection('users').doc(user.uid).update({
          pensionerStatus: selectedType,
          ...(selectedType === 'Principal' && { beneficiaryType: firebase.firestore.FieldValue.delete() }), // Conditionally delete the beneficiaryType field if Principal is selected
        });

        // Update the userVerified state to force re-render
        setUserVerified(true);

        console.log('Pensioner status updated successfully:', selectedType);
      } else {
        console.log('User not found. Unable to update pensioner status.');
      }
    } catch (error) {
      console.error('Error updating pensioner status:', error);

      // Log additional details if available
      if (error.code) {
        console.error('Firestore Error Code:', error.code);
      }

      if (error.message) {
        console.error('Firestore Error Message:', error.message);
      }
    }
};

  const handleBackToSelection = () => {
    setPensionerType(null);
    setShowButtons(true);
  };

  const setHomeAddressType = (type) => {
    console.log('Home Address Type:', type);
  };

  const isUpdateAllowed = () => {
    if (userBirthMonth !== null) {
      const currentMonth = new Date().getMonth() + 1;

      console.log('Current Month:', monthNumberToName[currentMonth]);
      console.log('Allowed Months:', userBirthMonth.allowedUpdateMonths.map((month) => monthNumberToName[month]));
      console.log(
        'First Update Allowed Months:',
        userBirthMonth.firstUpdateAllowedMonths.map((month) => monthNumberToName[month])
      );
      console.log(
        'Second Update Allowed Months:',
        userBirthMonth.secondUpdateAllowedMonths.map((month) => monthNumberToName[month])
      );

      const isAllowed =
        userBirthMonth.allowedUpdateMonths.includes(currentMonth) ||
        userBirthMonth.firstUpdateAllowedMonths.includes(currentMonth) ||
        userBirthMonth.secondUpdateAllowedMonths.includes(currentMonth);
      console.log('Is Update Allowed:', isAllowed);

      return isAllowed;
    }
    return false;
  };

  let backgroundImageStyle = styles.container;
  if (pensionerType !== null) {
    backgroundImageStyle = { ...styles.container, ...styles.blurred };
  }


  return (
  <ImageBackground
      source={require('../../assets/login_bg.png')}
      style={styles.imageBackground}
      blurRadius={pensionerType ? 50 : 0} // Apply conditional blur
    >
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAvoidingContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        {userVerified ? (
          showButtons ? (
            <>
              {isUpdateAllowed() ? (
                <>
                  <Text style={styles.textInput}>Type of pensioner?</Text>
                  <TouchableOpacity style={styles.button} onPress={() => handleTypeSelection('Principal')}>
                    <Text style={styles.buttonText}>Principal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleTypeSelection('Beneficiary')}>
                    <Text style={styles.buttonText}>Beneficiary</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.text}>
                  You can only update your information during specific months based on your birth month.
                  {userBirthMonth && (
                    <>
                      {'\n'}{'\n'}For this month, you can update during: {'\n'}
                      {userBirthMonth.allowedUpdateMonths.map((month) => monthNumberToName[month]).join(', ')}
                      {userBirthMonth.firstUpdateAllowedMonths.length > 0 && (
                        <> {'\n'}First Update:{'\n'} {userBirthMonth.firstUpdateAllowedMonths.map((month) => monthNumberToName[month]).join(', ')}</>
                      )}
                      {userBirthMonth.secondUpdateAllowedMonths.length > 0 && (
                        <> {'\n'}{'\n'}Second Update: {'\n'}{userBirthMonth.secondUpdateAllowedMonths.map((month) => monthNumberToName[month]).join(', ')}</>
                      )}
                    </>
                  )}
                </Text>
              )}
            </>
          ) : (
            <>
              {pensionerType === 'Principal' && <Principal setHomeAddressType={setHomeAddressType} />}
              {pensionerType === 'Beneficiary' && (<Beneficiary setHomeAddressType={setHomeAddressType} beneficiaryType={beneficiaryType} setBeneficiaryType={setBeneficiaryType}/> )}
              <View style={styles.backButtonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToSelection}>
                  <Text style={styles.buttonText}>    Back to Selection    </Text>
                </TouchableOpacity>
              </View>
            </>
          )
        ) : (
          <VerificationRequiredScreen />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default Update;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  blurred: {
    opacity: 0.5, // You can adjust this to get the desired dimming effect
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 200,
  },
  textInput: {
    fontSize: 22, // Slightly larger font size
    fontWeight: '600', // Semi-bold
    marginTop: 250, // Adjust as needed
    color: '#FFFFFF', // White color for better contrast
    textAlign: 'center', // Center align the text
    padding: 10, // Add padding
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500', // Semi-bold
    fontSize: 18, // Comfortable reading size
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    borderWidth:1,
    borderColor: 'white',
    marginTop: 20,
    height: 50, // More height for a larger button
    width: '80%', // Relative width to the container
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30, // More rounded corners
    elevation: 5, // Shadow for Android
    shadowColor: '#000000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
    shadowOpacity: 0.25, // Shadow opacity for iOS
    shadowRadius: 3.84, // Shadow blur radius for iOS
  },
  backButtonContainer: {
    marginTop: 30, // More space from the previous element
  },
  backButton: {
    height: 50, // Larger button for better touch
    width: '80%', // Relative width to the container
    borderColor: '#FFFFFF',
    borderWidth: 1,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, // Rounded corners
    elevation: 5, // Shadow for Android
    // Same shadow styles as the main button for consistency
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    marginTop: 300,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginHorizontal: 20,
    padding: 10, // Add padding for better readability
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },

});
