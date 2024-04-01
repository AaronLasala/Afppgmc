// SecondPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const SecondPage = ({ emailRef, passwordRef, confirmPasswordRef, onInputChange, inputValues }) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };
  // Call validatePassword function whenever the password input changes
  useEffect(() => {
    setPasswordValid(validatePassword(inputValues.password));
  }, [inputValues.password]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email:</Text>
      <View style={styles.inputWithIcon}>
      <MaterialCommunityIcons name="email" size={24} color="black" style={styles.icon} /> 
      <TextInput
        style={styles.textInput}
        placeholder='Email (e.g., john@example.com)'
        ref={emailRef}
        onChangeText={(email) => onInputChange('email', email)}
        value={inputValues.email}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      </View>
      <Text style={styles.text}>Password:</Text>
      <View style={styles.inputWithIcon}>
        <MaterialCommunityIcons name="lock" size={24} color="black" style={styles.icon} />
        <TextInput
          style={[styles.textInput]} // Highlight input border based on password validity
          ref={passwordRef}
          placeholder='Create your Password'
          onChangeText={(password) => {
            onInputChange('password', password);
          }}
          value={inputValues.password}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.icon}
        >
          <MaterialCommunityIcons name={showPassword ? "eye" : "eye-off"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {!passwordValid && inputValues.password ? (
        <Text style={styles.floatingError}>
          Password must be at least 8 characters, include uppercase and lowercase letters, a number, and a special character.
        </Text>
      ) : null}

      <Text style={styles.text}>Confirm Password:</Text>
      <View style={styles.inputWithIcon}>
        <MaterialCommunityIcons name="shield-check" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder='Confirm your Password'
          ref={confirmPasswordRef}
          onChangeText={(confirmPassword) => onInputChange('confirmPassword', confirmPassword)}
          value={inputValues.confirmPassword}
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.icon}
        >
          <MaterialCommunityIcons name={showConfirmPassword ? "eye" : "eye-off"} size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SecondPage;

const styles = StyleSheet.create({
    container: {
      marginTop: 100,
      marginVertical: 20,
      width: '80%',
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      textAlign: 'center',
      marginBottom: 10,
    },  
    floatingError: {
      position: 'absolute', // Position absolutely to float over other elements
      bottom: '100%', // Position at the bottom of the input field
      left: 0,
      right: 0,
      backgroundColor: 'red', // Or any color that fits the design
      color: 'white',
      padding: 8,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 14,
    },
  
    text: {
      fontSize: 20,
      color: 'white',
      fontWeight: '700',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    textInput: {
        flex: 1,
        height: 40, // Adjusted height to match the container height
        backgroundColor: 'transparent', // Set the background color to transparent
        fontSize: 16,
        borderRadius: 10,
        paddingLeft: 10,
      },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        height: 30, // Adjusted height to provide space for both the icon and text input
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
      },
      
      icon: {
        marginLeft: 5, // Adjusted margin to create space between the icon and text input
      },
  });