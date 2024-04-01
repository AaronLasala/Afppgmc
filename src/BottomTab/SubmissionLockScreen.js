import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubmissionLockScreen = ({ onUnlockAttempt }) => {

const navigation = useNavigation();


const navigateToHome = () => {
    navigation.navigate('Homepage');
  };

  return (
  <ImageBackground source={require('../../assets/login_bg.png')} style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Submission Locked</Text>
      <Text style={styles.message}>
        You have already submitted your information this year. 
        You will be able to submit new information starting from next year.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onUnlockAttempt}>
        <Text style={styles.buttonText}>    Check Again    </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={navigateToHome}>
        <Text style={styles.buttonText}>         Home         </Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 250,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    padding: 5,
    borderRadius: 10, // Rounded corners for the text background
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight dark background for better readability
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slight dark background for better readability
    padding: 20,
    borderRadius: 10, // Rounded corners for the text background
    overflow: 'hidden', // Ensures the background does not overflow
    marginHorizontal: 10, // Add horizontal margin'
  },
  button: {
    borderWidth:1,
      borderColor: 'white',
      marginTop: 20,
      height: 50, // More height for a larger button
      width: '60%', // Relative width to the container
      backgroundColor: '#026efd',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 30, // More rounded corners
      elevation: 5, // Shadow for Android
      shadowColor: '#000000', // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
      shadowOpacity: 0.25, // Shadow opacity for iOS
      shadowRadius: 3.84, // Shadow blur radius for iOS
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SubmissionLockScreen;
