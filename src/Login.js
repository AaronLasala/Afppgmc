import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, ImageBackground, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from './config';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';


const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const loginUser = async (email, password) => {
    try {
      console.log('Attempting to log in with email:', email);
      console.log('Attempting to log in with password:', password);

      await firebase.auth().signInWithEmailAndPassword(email, password);

      // Store user's login status in AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Navigate to 'Home' after login
      navigation.navigate('Homepage');
    } catch (error) {
      console.error('Login error:', error.message);
      alert(error.message);
    }
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
  
    return hasUpperCase && hasSpecialChar && hasNumber;
  };
  

  const handlePasswordReset = async (email) => {
    if (email.trim() === '') {
      Alert.alert('Enter Email', 'Please enter your email address to reset your password.');
      return;
    }
  
    Alert.alert(
      'Reset Password',
      'A link to reset your password will be sent to your email. Please ensure your new password includes at least one uppercase letter, a special character, and a number.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await firebase.auth().sendPasswordResetEmail(email);
              Alert.alert('Check Your Email', 'A link to reset your password has been sent to your email.');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };
  


  

  const [fontsLoaded] = useFonts({
    'CenturyGothic': require('../assets/fonts/centurygothic.ttf'),
  });

  if (!fontsLoaded) {
    // Font is still loading, return a loading indicator or fallback
    return <View />;
  }

  return (
    <ImageBackground source={require('../assets/login_bg.png')} style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.whiteBox}>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <Text style={styles.text_footer}> Email </Text>
          <View style={styles.inputWithIcon}>
            <MaterialCommunityIcons name="email" size={24} color="black" style={styles.icon} />
            <TextInput
                style={styles.TextInput}
                placeholder='Email (e.g., john@example.com)'
                onChangeText={(email) => setEmail(email)}
                autoCapitalize='none'
                autoCorrect={false}
            />
          </View>
          <Text style={styles.text_footer2}> Password </Text>
          <View style={styles.inputWithIcon}>
            <MaterialCommunityIcons name="lock" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.TextInput}
              placeholder='Enter Password'
              onChangeText={(password) => setPassword(password)}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showPassword} // Use secureTextEntry based on the showPassword state
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
            >
              <MaterialCommunityIcons name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <Text style={styles.fpass} onPress={() => handlePasswordReset(email)}>
          Forgot password?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => loginUser(email, password)}
            style={styles.button} >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textcontainer}>
            <Text style={styles.text1}>
                Dont have an account?
            </Text>
            <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.button1} >
            <Text style={styles.buttonText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'column',
    },
    fpass:{
      color: 'white',
      textDecorationLine: 'underline',
      marginLeft: 200,
      fontSize: 14, 
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        height: 30,
        width: '100%', // Set the width to ensure it takes up the full width
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10, // Add padding to align text with the icon
        paddingRight: 10,
    },

    icon: {
        marginRight: 10,
    },
    textcontainer:{
        position: 'absolute', // Set the position to absolute
        bottom: 50,
    },
    text1:{
      fontSize: 18,
      color: 'white',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    button1:{
        color: 'white',
    },
    TextInput:{
        flex: 1,
        height: 30,
        backgroundColor: 'white',
        fontSize: 16,
    },
    whiteBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,  
        borderTopRightRadius: 20,
        overflow: 'hidden', // Ensure the content inside the box doesn't overflow
    },
    inputContainer: {
        width: '80%',
        marginTop: -280, // Add marginTop to move the input container down
    },
    input: {
        backgroundColor: 'white',
        height: 50,
        fontSize: 16,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    buttonContainer: {
        justifyContent: 'center',  // Center items horizontally
        alignItems: 'center',  // Center items vertically
        marginTop: 20,
        width: '80%',
        height: 45,
    },
    button: {
      padding: 5,
      borderRadius: 10,
      backgroundColor: '#0094FF',
      borderColor: 'white',
      borderWidth: 2,
      width: '60%',
      shadowColor: 'black',  // iOS
      shadowOffset: { width: 0, height: 2 },  // iOS
      shadowOpacity: 0.5,  // iOS
      shadowRadius: 4,  // iOS
      elevation: 10,  // Android
     },
  
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },
    buttonOutlineText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },
    logo: {
        height: '50%',
        width: '70%',
    },
    text_footer: {
      marginTop: 300,
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'CenturyGothic',
      fontWeight: '700',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    text_footer2: {
      textAlign: 'center',
      fontFamily: 'CenturyGothic',
      color: 'white',
      fontSize: 20,
      fontWeight: '700',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
});

export default Login;
