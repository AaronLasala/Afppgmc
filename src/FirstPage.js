import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FirstPage = ({ fullNameRef, ageRef, birthDayRef, phoneNumberRef, onInputChange, inputValues, setInputValues, calculateAllowedUpdateMonths }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthSelect = (index) => {
    const monthNumber = index + 1; // Convert month to number (1-12)
    onInputChange('birthMonth', monthNumber); // Assuming onInputChange updates the state correctly
    setInputValues({...inputValues, birthMonth: monthNumber}); // Update state
    setModalVisible(false); // Close modal
  };

  const renderMonthItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleMonthSelect(index)} style={styles.monthItem}>
      <Text style={styles.monthText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderAllowedMonths = () => {
    // Make sure birthMonth is defined and has a valid value before calculating allowed months
    if (inputValues.birthMonth) {
      const allowedMonths = calculateAllowedUpdateMonths(inputValues.birthMonth);

      // Ensure allowedMonths is an array before attempting to use map
      if (Array.isArray(allowedMonths) && allowedMonths.length > 0) {
        return (
          <View style={styles.allowedMonthsContainer}>
            {allowedMonths.map((month, index) => (
              <Text key={index} style={styles.allowedMonthText}>
                {month} // Assuming 'month' is a string or has a toString method
              </Text>
            ))}
          </View>
        );
      }
    }
    return null; // Return null if no birthMonth is selected or if allowedMonths is not an array or is empty
  };


  

  return (
    <View style={styles.container}>
      {renderAllowedMonths()}

      <Text style={styles.text1}>Full Name:</Text>
      <View style={styles.inputWithIcon}>
        <MaterialCommunityIcons name="account" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder='Your Fullname'
          ref={fullNameRef}
          onChangeText={(fullName) => onInputChange('fullName', fullName)}
          value={inputValues.fullName}
        />
      </View>

      <Text style={styles.text}>Phone Number:</Text>
      <View style={styles.inputWithIcon}>
        <MaterialCommunityIcons name="phone" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder='Your Phone Number'
          keyboardType="numeric" // This prop ensures that only numeric values can be entered
          maxLength={11}
          ref={phoneNumberRef}
          onChangeText={(phoneNumber) => onInputChange('phoneNumber', phoneNumber)}
          value={inputValues.phoneNumber}
        />
      </View>

      <Text style={styles.text}>Age:</Text>
      <View style={styles.inputWithIcon}>
        <MaterialCommunityIcons name="calendar" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder='Your Age'
          keyboardType="numeric" // This prop ensures that only numeric values can be entered
          maxLength={2}
          ref={ageRef}
          onChangeText={(age) => onInputChange('age', age)}
          value={inputValues.age}
        />
      </View>
      <Text style={styles.text}>Birth Month:</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdown}>
        <Text style={styles.dropdownText}>
          {inputValues.birthMonth ? months[inputValues.birthMonth - 1] : 'Select Birth Month'}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              renderItem={renderMonthItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 140,
    marginVertical: 20,
    width: '80%',
  },

  dropdown: {
    // Styles for your dropdown button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
  },
  dropdownText: {
    // Styles for the dropdown text
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    // Styles for the modal content
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '60%',
  },
  monthItem: {
    // Styles for each month item in the list
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  monthText: {
    // Styles for the month text
    fontSize: 16,
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

  text: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },

  text1: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 50,
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
  allowedMonthsContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  allowedMonthsText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  allowedMonth: {
    fontSize: 14,
    color: 'white',
  },
});

export default FirstPage;
