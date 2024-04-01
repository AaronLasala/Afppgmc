// BeneficiaryStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'green',
      alignItems: 'center',
    },
    box: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      padding: 5,
      backgroundColor: 'cyan',
      marginRight: 10, // Adjust the margin as needed
      alignContent: 'center',
      justifyContent: 'center',
    },
    
    keyboardAvoidingContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 300,
    },
    text1: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    disabledButton: {
      backgroundColor: '#ccc', // A light grey color indicating the button is disabled
      borderColor: '#999', // Optional: If you have a border, make it a darker grey
      // Other styles as needed to indicate a disabled state
    },    

    text2: {
      color: 'green',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
    },
  
    textInput: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      color: 'white',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
    alertContainer: {
      padding: 10,
      margin: 10,
      backgroundColor: 'yellow',
      borderRadius: 5,
      // Additional styling can be applied for better visual appearance
    },
    alertText: {
      textAlign: 'center',
      color: 'red',
      fontWeight: 'bold',
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
    textInput4: {
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 60,
      marginBottom: 20,
      color: 'cyan',
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
    button1: {
      borderWidth:1,
      borderColor: 'white',
      marginTop: 20,
      height: 50, // More height for a larger button
      width: '100%', // Relative width to the container
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
    input: {
      width:'80%',
      textAlign: 'center', // Horizontally center placeholder text
      alignSelf: 'center',
      fontSize: 18, // Slightly smaller font size for elegance
      fontWeight: '500', // Not too bold for a lighter appearance
      backgroundColor: '#fff', // White background for the input field
      color: '#333', // Dark grey color for the input text for better readability
      borderRadius: 8, // Rounded corners for a softer look
      borderWidth: 1, // Thin border width
      borderColor: '#ccc', // Light grey border color
      marginTop: 12, // Margin top for spacing from the previous element
      paddingHorizontal: 15, // Horizontal padding for the inner text space
      paddingVertical: 10, // Vertical padding to increase the height of the input field
      elevation: 2, // Slight shadow for a subtle 3D effect
      shadowColor: '#000', // Shadow color
      shadowOffset: { width: 0, height: 1 }, // Shadow offset
      shadowOpacity: 0.2, // Shadow opacity
      shadowRadius: 1, // Shadow blur radius
    },
    uploadedContainer: {
      marginTop: 20, 
      marginLeft: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', 
    },

    sectionContainer: {
      marginTop: 20,
      marginBottom: 10,
    },
  
    sectionTitle: {
      fontSize: 20, // Slightly smaller font size for elegance
      fontWeight: '500', // Not too bold for a lighter appearance
      color: 'white',
      textAlign: 'center',
      marginBottom: 10,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },
  
    separator: {
      borderBottomColor: 'white',
      borderBottomWidth: 2,
      marginVertical: 20,
    },

    infoButton: {
      position: 'absolute',
      top: 15,
      right:50,
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
  
    modalText: {
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'center',
    },
  
    modalButton: {
      backgroundColor: '#026efd',
      padding: 10,
      borderRadius: 5,
      margin: 5,
      flex: 1,
      alignItems: 'center',
    },
    modalButton1: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      margin: 5,
      flex: 1,
      alignItems: 'center',
    },
  
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  
    buttonContainer: {
      flexDirection: 'column',
      marginTop: 200,
      width: '100%',
    },

    textInput5: {
      fontSize: 22, // Slightly larger font size
      fontWeight: '600', // Semi-bold
      color: '#FFFFFF', // White color for better contrast
      textAlign: 'center', // Center align the text
      padding: 10, // Add padding
      borderRadius: 10, // Rounded corners
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 5,
    },

    buttonContainer1: {
      flexDirection: 'row',
      marginTop: 20,
    },

});
