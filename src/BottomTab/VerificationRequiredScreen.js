import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { firebase } from '../config';
import { useFocusEffect } from '@react-navigation/native';

const VerificationRequiredScreen = ({ navigation, onVerificationResent }) => {
    const [refreshing, setRefreshing] = useState(false);
  
    // Function to fetch updated data
    const fetchData = async (nav) => {
      try {
        const currentUser = firebase.auth().currentUser;
    
        if (currentUser && nav) {
          console.log('User Email Verified:', currentUser.emailVerified);
    
          // If the user is verified, navigate to the Update page
          if (currentUser.emailVerified) {
            nav.navigate('Update');
          }
        }
      } catch (error) {
        console.error('Error checking user verification:', error);
      } finally {
        // After checking verification status, reset refreshing state
        setRefreshing(false);
      }
    };
  
    const handleResendVerification = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
  
        if (currentUser) {
          // Set refreshing to true before resending verification email
          setRefreshing(true);
  
          await currentUser.sendEmailVerification();
          console.log('Verification email resent successfully');
  
          // Trigger the callback function if provided
          if (onVerificationResent) {
            onVerificationResent();
          }
        } else {
          console.error('User not found while resending verification email');
          // Handle the case when the user is not found
        }
      } catch (error) {
        console.error('Error resending verification email:', error);
        // Optionally, you can show an error message to the user
      } finally {
        // After resending verification email, reset refreshing state
        setRefreshing(false);
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        // Fetch data when the screen gains focus
        fetchData(navigation);
      }, [navigation]) // Include navigation as a dependency
    );
  

  return (
    <ImageBackground
        source={require('../../assets/login_bg.png')} // Add your image path here
        style={styles.container}
      >
    <View style={styles.container}>
      
      <Text style={styles.text1}>
        Your account is not yet verified. Please check your email and verify your account.
      </Text>
      <Text style={styles.text2}>
        After verifying, please logout and login again. 
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleResendVerification}
        disabled={refreshing}
      >
        <Text style={styles.buttonText}>
          {refreshing ? 'Resending...' : 'Resend Verification Email'}
        </Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default VerificationRequiredScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    padding: 20, // Add padding around the screen
  },
  text1: {
    marginTop: 250,
    fontSize: 20,
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slight dark background for better readability
    padding: 20,
    borderRadius: 10, // Rounded corners for the text background
    overflow: 'hidden', // Ensures the background does not overflow
    marginHorizontal: 10, // Add horizontal margin
  },
  text2: {
    fontSize: 20,
    fontWeight: 'bold', // Make the text bold
    textAlign: 'center',
    color: 'red',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slight dark background for better readability
    padding: 20,
    borderRadius: 10, // Rounded corners for the text background
    overflow: 'hidden', // Ensures the background does not overflow
    marginHorizontal: 10, // Add horizontal margin
    marginVertical: 20, // Add space before the button
  },
  button: {
    backgroundColor: '#ffae00', // A bright color for the button
    paddingHorizontal: 30, // Horizontal padding
    paddingVertical: 15, // Vertical padding
    borderRadius: 25, // Fully rounded corners for a pill-shaped button
    marginTop: 20,
    elevation: 4, // Slight elevation for shadow (Android)
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    textAlign:'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600', // Slightly bolder text
    textTransform: 'uppercase', // Uppercase letters for the button text
  },

});
