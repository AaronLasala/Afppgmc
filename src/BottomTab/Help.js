import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure to have this package installed
import { useNavigation } from '@react-navigation/native';


const Help = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Update Your Data</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 1: Login</Text>
        <Text style={styles.stepDescription}>
          Open the app and enter your credentials to log in to your account. If you do not remember your password, use the "Forgot Password?" feature to reset it.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 2: Verify Email</Text>
        <Text style={styles.stepDescription}>
          After verifying your email, logout and login again, in order to update your information.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 3: Navigate to Update Page</Text>
        <Text style={styles.stepDescription}>
          Once logged in, navigate to the "Update Information" section found in the home or at the bottom.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 4: Update Information</Text>
        <Text style={styles.stepDescription}>
          On the "Update Information" page, you can edit your personal details. Make sure all information is current and correct.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 5: Submit Changes</Text>
        <Text style={styles.stepDescription}>
          After verifying that all the information is accurate, submit your changes.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.stepTitle}>Step 6: Confirmation</Text>
        <Text style={styles.stepDescription}>
          Once your update is submitted, you will only be able to update again on your next updating period.
        </Text>
      </View>

      <Text style={styles.note}>
        Note: Keep in mind that we are checking what you put in the update. If you inputted a wrong data, you can find our contacts in{' '}
        <Text
          style={styles.hyperlink}
          onPress={() => navigation.navigate('ContactUs')} // Use the correct route name for your ContactUs component
        >
          here.
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    marginLeft: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  hyperlink: {
    color: 'blue', // Usually, links are styled in blue
    textDecorationLine: 'underline', // Underline to indicate it's clickable
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    color: 'black',
  },
});

export default Help;
