import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure to have this package installed

const ContactUs = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>
      <Text style={styles.description}>
        You can get in touch with us through the below platforms. Our team will reach out to you as soon as possible.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customer Support</Text>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0961 645 0502</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0927 886 6197</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0920 616 4089</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0945 719 0108</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0945 719 0110</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="black" />
          <Text style={styles.infoText}>0927 886 5930</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email" size={24} color="black" />
          <Text style={styles.infoText}>help@AFPPGMC.com</Text>
        </View>
        
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Social Media</Text>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="instagram" size={24} color="#E1306C" />
          <Text style={styles.infoText}>@AFP PGMC</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="twitter" size={24} color="#1DA1F2" />
          <Text style={styles.infoText}>@AFP PGMC</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="facebook" size={24} color="#3b5998" />
          <Text style={styles.infoText}>@AFP PGMC</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Slightly darker background
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green', // Darker background for the header
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    marginLeft: 16,
    fontSize: 20,
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
    elevation: 3, // for Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'center',
    color: 'black', // Change the text color to black
    marginTop: 20, // Add some margin at the top for spacing
    marginBottom: 10, // Add some margin at the bottom for spacing
    lineHeight: 24, // Adjust line height for better readability
    fontWeight: 'bold', // Optional: Change font weight if needed
    
  },


});

export default ContactUs;
