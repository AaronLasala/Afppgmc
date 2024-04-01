// Modal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal as ReactModal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MyModal = ({ visible, toggleModal }) => {
  return (
    <ReactModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}
    >
      <View style={styles.infoModalContainer}>
        <View style={styles.infoModalContent}>
          <Text style={styles.infoModalText}>
            Please make sure to state your NAME, DATE TODAY, SERIAL NUMBER and hold your id in front of the camera 
            while recording the video clip.
          </Text>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.infoModalClose}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactModal>
  );
};



const styles = StyleSheet.create({
  infoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  infoModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  infoModalText: {
    fontSize: 16,
    marginBottom: 10,
  },

  infoModalClose: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'right',
  },
});

export default MyModal;
