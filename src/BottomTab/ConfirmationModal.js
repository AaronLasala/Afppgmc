import React from 'react';
import { View, Text, TouchableOpacity, Modal as ReactModal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ConfirmationModal = ({ visible, toggleModal, onConfirm }) => {
  return (
    <ReactModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Please confirm the following:
            {'\n\n'}1. All of the contents you inputted are correct.
            {'\n'}2. If caught inputting wrong information, it can result in the deletion of your account.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.modalButtonCancel} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ReactModal>
  );
};

const styles = StyleSheet.create({
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
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  modalButtonCancel: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  modalButtonConfirm: {
    flex: 1,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },

  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ConfirmationModal;
