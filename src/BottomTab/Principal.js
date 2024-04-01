import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal as ReactModal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import mime from "mime";
import MyModal from './Modal';
import PrincipalStyles from './PrincipalStyles';
import ConfirmationModal from './ConfirmationModal'; // Update the path if needed
import { useNavigation } from '@react-navigation/native';



const Principal = ({ navigate, setHomeAddressType }) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [localAddress, setLocalAddress] = useState('');
  const [localPensionerID, setLocalPensionerID] = useState('');
  const [addressType, setAddressType] = useState(null);
  const [showAbroadQuestions, setShowAbroadQuestions] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState('');
  const [birthdayInput, setBirthdayInput] = useState({
    month: '',
    day: '',
    year: '',
  });
  const [fullNameInput, setFullNameInput] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [abroadAddress, setAbroadAddress] = useState('');
  const [recordVideoModalVisible, setRecordVideoModalVisible] = useState(false);
  const navigation = useNavigation();


  // New state to track file upload status
  const [fileUploaded, setFileUploaded] = useState({
    oathofAllegiance: false,
    passport: false,
    'pensionID': false,
    '2x2Picture': false,
    'retOrder': false,
    videoClip: false,
    certofNaturalization: false,
    identificationDualCitizen: false,
  });

  const toggleRecordVideoModal = () => {
    setRecordVideoModalVisible(!recordVideoModalVisible);
  };

  const toggleConfirmModal = () => {
    setConfirmModalVisible(!confirmModalVisible);
  };

  const handleRecordVideoConfirm = () => {
    // Close the modal
    toggleRecordVideoModal();

    // Start recording the video
    pickDocument('videoClip');
  };

  const handleFormSubmission = () => {
    if (!fileUploaded.videoClip) {
      Alert.alert('Upload Required', 'You must upload your video clip before submitting.');
    } else {
      toggleConfirmModal(); // Open confirmation modal only if the video is uploaded
    }
  };


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = firebase.auth().currentUser;
  
        if (user) {
          setCurrentUserUid(user.uid);
  
          // Fetch user details from the local cache
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
  
          if (userDoc.exists) {
            const userData = userDoc.data();
            setBirthdayInput(userData.birthDay); // Assuming 'birthDay' is the correct field name
            // Fetch other user details and set state variables accordingly
          } else {
            console.log('User data not found in local cache. Trying to fetch from the server.');
  
            // Try fetching from the server if not available in the local cache
            const serverUserDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            const serverUserData = serverUserDoc.data();
  
            if (serverUserData) {
              setBirthdayInput(serverUserData.birthDay);
              // Fetch other user details and set state variables accordingly
            } else {
              console.log('User data not found in Firestore');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);

  const handleHomeAddressType = async (type) => {
    try {
      console.log('Updating address type:', type);
  
      // Update local state
      setAddressType(type);
      setHomeAddressType(type);
  
      // Update Firestore database
      const user = firebase.auth().currentUser;
  
      if (user) {
        await firebase.firestore().collection('users').doc(user.uid).update({
          addressType: type,
        });
  
        console.log('Address type updated in Firestore successfully:', type);
      } else {
        console.log('User not found. Unable to update address type.');
      }
    } catch (error) {
      console.error('Error updating address type:', error);
  
      // Log additional details if available
      if (error.code) {
        console.error('Firestore Error Code:', error.code);
      }
  
      if (error.message) {
        console.error('Firestore Error Message:', error.message);
      }
    }
  
    // Add additional logs to trace the flow
    console.log('Type:', type);
  
    // Note: This state update will be asynchronous, so the value may not be immediately reflected.
    setShowAbroadQuestions(type === 'Abroad');
    console.log('showAbroadQuestions:', showAbroadQuestions);
  
    // For debugging purposes, log the current state after the update
    setTimeout(() => {
      console.log('Updated showAbroadQuestions:', showAbroadQuestions);
    }, 500);
  };
  

  const getFileTypeFromExtension = (extension) => {
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      // Add more cases for other file types as needed
      default:
        return 'application/octet-stream'; // Default to generic type
    }
  };

  const pickDocument = async (fieldName) => {
    try {
      let result;
      if (fieldName === 'videoClip') {
        // Launch camera for capturing a video
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1, 
        });
  
        if (!result.cancelled) {
          // Process the captured video here if needed
          console.log('Captured video:', result);
  
          // Apply the fix for videoClip
          const newVideoUri = result.assets[0]?.uri || result.uri; // Check if assets array is available
  
          const formData = new FormData();
          formData.append(fieldName, {
            uri: newVideoUri,
            type: mime.getType(newVideoUri),
            name: newVideoUri.split("/").pop(),
          });
  
          // Upload the video or handle it as per your requirements
          uploadFile(fieldName, { uri: newVideoUri, type: 'video/mp4', name: 'video.mp4' });
          
          // Mark the file as uploaded in state
          setFileUploaded((prev) => ({ ...prev, [fieldName]: true }));
        } else {
          // Video recording was cancelled
          console.log('Video recording was cancelled.');
        }
      } else {
  
  
        // Default behavior for other document types using DocumentPicker
        const documentResult = await DocumentPicker.getDocumentAsync({
          type: '*/*', // Allow all file types
        });
  
        console.log(`${fieldName} picked result:`, documentResult);
  
        if (!documentResult.cancelled) {
          if (documentResult.assets.length > 0 && documentResult.assets[0].name) {
            const fileExtension = getFileExtension(documentResult.assets[0].name);
            if (fileExtension) {
              const fileType = getFileTypeFromExtension(fileExtension);
              uploadFile(fieldName, { uri: documentResult.assets[0].uri, type: fileType, name: documentResult.assets[0].name });
              // Mark the file as uploaded in state
              setFileUploaded((prev) => ({ ...prev, [fieldName]: true }));
            } else {
              console.log('File extension could not be determined.');
            }
          } else {
            console.log('File name is undefined or null');
          }
        } else {
          console.log(`${fieldName} picker cancelled or an error occurred.`);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const getFileExtension = (fileName) => {
    if (fileName) {
      const parts = fileName.split('.');
      return parts.length > 1 ? parts.pop().toLowerCase() : null; // Extract file extension
    } else {
      console.log('File name is undefined or null');
      return null;
    }
  };

  const RecordVideoModal = ({ visible, onClose, onConfirm, onCancel }) => {
    return (
      <ReactModal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={PrincipalStyles.modalContainer}>
          <View style={PrincipalStyles.modalContent}>
            <Text style={PrincipalStyles.modalText}>
              Please make sure to state your NAME, DATE TODAY, SERIAL NUMBER, and hold your ID in front of the camera while recording the video clip.
            </Text>
            <View style={PrincipalStyles.buttonContainer}>
              <TouchableOpacity style={PrincipalStyles.modalButton1} onPress={onClose}>
                <Text style={PrincipalStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={PrincipalStyles.modalButton} onPress={onConfirm}>
                <Text style={PrincipalStyles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ReactModal>
    );
  };

  const uploadFile = async (fieldName, file) => {
    try {
      const storageRef = firebase.storage().ref();
      const userFilesRef = storageRef.child(`user_files/${currentUserUid}/${fieldName}/`);
      const fileRef = userFilesRef.child(file.name);
  
      // Upload the file to Firebase Storage
      const blob = await fetch(file.uri).then(response => response.blob());
      await fileRef.put(blob, { contentType: file.type });
      const fileUrl = await fileRef.getDownloadURL();
  
      // Generate a client-side timestamp
      const timestamp = new Date();
  
      // Prepare the file data object, including the URL and the timestamp
      const fileData = {
        url: fileUrl,
        name: file.name,
        timestamp: timestamp.getTime(), // Use getTime() to get the timestamp in milliseconds
      };
  
      // Get the user's document reference
      const userDocRef = firebase.firestore().collection('users').doc(currentUserUid);
  
      // Fetch the current file array from Firestore
      const userDoc = await userDocRef.get();
      let files = userDoc.data()[`${fieldName}_files`] || [];
  
      // Add the new file data to the array
      files.push(fileData);
  
      // If there are more than 2 files, sort by timestamp and remove the oldest
      if (files.length > 2) {
        files.sort((a, b) => a.timestamp - b.timestamp); // Sort in ascending order of timestamp
        const oldestFile = files.shift(); // Remove the oldest file (the first one in the array)
  
        // Delete the oldest file from Firebase Storage
        const oldestFileRef = storageRef.child(`user_files/${currentUserUid}/${fieldName}/${oldestFile.name}`);
        await oldestFileRef.delete();
      }
  
      // Update the Firestore document with the new files array
      await userDocRef.update({
        [`${fieldName}_files`]: files,
      });
  
      console.log(`File ${fieldName} uploaded successfully. File data:`, fileData);
    } catch (error) {
      console.error(`File ${fieldName} upload error:`, error);
  
      // Log additional details if available
      if (error.code) {
        console.error(`Error code: ${error.code}`);
      }
      if (error.message) {
        console.error(`Error message: ${error.message}`);
      }
    }
  };
  
  
  

  const monthNameToNumber = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const handleNextButtonClick = async () => {
    try {
      const { month, day, year } = birthdayInput;

      if (!month || !day || !year || !fullNameInput || !serialNumber) {
        Alert.alert(
          'Error',
          'Please fill in all required fields (Birthday, Full Name, Serial Number).',
          [{ text: 'OK' }]
        );
        return;
      }
  
      const currentTime = new Date();
      const currentYear = currentTime.getFullYear();

      const userDoc = await firebase.firestore().collection('users').doc(currentUserUid).get();
      const userData = userDoc.data();

      // Check if last submission was less than a year ago
      if (userData && userData.submitTimestamp) {
        const lastSubmitTime = userData.submitTimestamp.toDate(); // Convert Firestore Timestamp to JS Date
        const lastSubmitYear = lastSubmitTime.getFullYear();

        if (currentYear <= lastSubmitYear) {
          Alert.alert(
            'Hold On',
            'You can only submit new information once per year. Please try again next year.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // No submission in the current year found, proceed with update
      await firebase.firestore().collection('users').doc(currentUserUid).update({
        // ... other fields ...
        submitTimestamp: firebase.firestore.FieldValue.serverTimestamp(), // Use Firestore's server timestamp
      });

      
      // Convert selected birth month to a number using the monthNameToNumber object
      const enteredBirthMonth = monthNameToNumber[month?.toLowerCase().trim()];
      console.log('Entered Birth Month (before conversion):', month);
      console.log('Entered Birth Month (converted):', enteredBirthMonth);
      if (month) {
        const lowercasedMonth = month.toLowerCase();
        console.log('Entered Birth Month (converted):', lowercasedMonth);
      } else {
        console.log('Entered Birth Month is undefined.');
      }

  
      // Ensure the mapping is correct by logging the entire object
      console.log('Month to Number Mapping:', monthNameToNumber);

  
      if (userData && userData.birthday) {
        const storedBirthMonth = userData.birthday.month; // Adjust this line based on your actual Firestore structure
        console.log('Stored Birth Month:', storedBirthMonth);
  
        if (storedBirthMonth !== enteredBirthMonth) {
          // Birth month is different, show an alert
          Alert.alert(
            'Error',
            `Entered birth month (${enteredBirthMonth}) does not match the stored birth month (${storedBirthMonth}). Please check and try again.`,
            [{ text: 'OK' }]
          );
          return;
        }
      } else {
        console.log('User data not found or birthday is undefined.');
      }
  
  
      // Update user data in Firestore
      await firebase.firestore().collection('users').doc(currentUserUid).update({
        birthday: birthdayInput,
        fullName: fullNameInput,
        serialNumber,
        localAddress,
        abroadAddress,
        // Add other fields as needed
      });
  
      console.log('Information updated in Firestore successfully.');
  
      // Reset state fields
      setBirthdayInput({ month: '', day: '', year: '' });
      setFullNameInput('');
      setSerialNumber('');
      setAbroadAddress('');
      setLocalAddress('');
      // Reset any other states as needed
  
      // Show a success alert and navigate home
      Alert.alert(
        'Success',
        'Information submitted successfully.',
        [{
          text: 'OK', onPress: () => navigation.navigate('Homepage') // Replace 'HomeScreen' with your home screen route name
        }]
      );
    } catch (error) {
      console.error('Firestore Update Error:', error);
      Alert.alert('Error', 'There was a problem submitting the information.');
    }
  };
    
  
  

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Function to toggle the visibility of the information modal
  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  return (
    <KeyboardAwareScrollView>
    {/* Section 1 */}
    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.textInput4}>Principal</Text>

      <Text style={PrincipalStyles.sectionTitle}>             Enter your birthday:            </Text>
      <TextInput
        style={PrincipalStyles.input}
        placeholder="Month"
        onChangeText={(text) => setBirthdayInput((prev) => ({ ...prev, month: text }))}
        // You might want to add validation here to ensure only valid month names or numbers are entered
      />
      <TextInput
        style={PrincipalStyles.input}
        placeholder="Day"
        keyboardType="numeric" // This prop ensures that only numeric values can be entered
        maxLength={2} // This prop limits the input to 2 digits, suitable for a day field
        onChangeText={(text) => setBirthdayInput((prev) => ({ ...prev, day: text, year: prev.year }))}
      />
      <TextInput
        style={PrincipalStyles.input}
        placeholder="Year"
        keyboardType="numeric" // This prop ensures that only numeric values can be entered
        maxLength={4} // This prop limits the input to 4 digits, suitable for a year field
        onChangeText={(text) => setBirthdayInput((prev) => ({ ...prev, month: prev.month, day: prev.day, year: text }))}
      />  
    </View>
    <View style={PrincipalStyles.separator} />

    {/* Section 2 */}
    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.sectionTitle}>Enter your Full name:</Text>
      <TextInput
        style={PrincipalStyles.input}
        placeholder="Juan C. Dela Cruz"
        onChangeText={(text) => setFullNameInput(text)}
      /> 
    </View>
    <View style={PrincipalStyles.separator} />

    {/* Section 3 */}
    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.sectionTitle}>Serial Number:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[PrincipalStyles.prefixStyle]}>O -</Text>
        <TextInput
          style={[PrincipalStyles.input, { flex: 1 }]} // The flex property gives the input field the priority to take up the remaining space
          placeholder="123456"
          value={serialNumber}
          onChangeText={(text) => setSerialNumber(text)}
          keyboardType="numeric"
        />
      </View>
    </View>
    <View style={PrincipalStyles.separator} />

    {/* Section 4 */}
    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.sectionTitle}>Pensioners ID PDF/Photo:</Text>
      {fileUploaded['pensionID'] ? (         
        <View style={PrincipalStyles.uploadedContainer}>
          <View style={PrincipalStyles.box}>
            <Text style={PrincipalStyles.text2}> File Uploaded</Text>
          </View>  
          <MaterialCommunityIcons name="check" size={28} color="black" />
        </View>
      ) : (
        <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('pensionID')}>
          <Text style={PrincipalStyles.text1}>Pick Document</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={PrincipalStyles.separator} />

    {/* Section 5 */}
    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.sectionTitle}>2x2 Picture:</Text>
      {fileUploaded['2x2Picture'] ? (         
        <View style={PrincipalStyles.uploadedContainer}>
          <View style={PrincipalStyles.box}>
            <Text style={PrincipalStyles.text2}> File Uploaded</Text>
          </View>  
          <MaterialCommunityIcons name="check" size={28} color="black" />
        </View>
      ) : (
        <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('2x2Picture')}>
          <Text style={PrincipalStyles.text1}>Pick Document</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={PrincipalStyles.separator} />

    <View style={PrincipalStyles.sectionContainer}>
      <Text style={PrincipalStyles.sectionTitle}>Retirement Order:</Text>
      {fileUploaded['retOrder'] ? (         
        <View style={PrincipalStyles.uploadedContainer}>
          <View style={PrincipalStyles.box}>
            <Text style={PrincipalStyles.text2}> File Uploaded</Text>
          </View>  
          <MaterialCommunityIcons name="check" size={28} color="black" />
        </View>
      ) : (
        <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('retOrder')}>
          <Text style={PrincipalStyles.text1}>Pick Document</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={PrincipalStyles.separator} />


    <View style={PrincipalStyles.sectionContainer}>
    {!fileUploaded.videoClip && (
        <View style={PrincipalStyles.alertContainer}>
          <Text style={PrincipalStyles.alertText}>
            Please record and upload your video clip first.
          </Text>
        </View>
      )}
        <Text style={PrincipalStyles.textInput}>Video Clip</Text>
        <TouchableOpacity style={PrincipalStyles.infoButton} onPress={toggleInfoModal}>
          <MaterialCommunityIcons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
        </View>
        <MyModal visible={infoModalVisible} toggleModal={toggleInfoModal} />
          {fileUploaded.videoClip ? (         
            <View style={PrincipalStyles.uploadedContainer}>
              <View style={PrincipalStyles.box}>
                <Text style={PrincipalStyles.text2}> Video Uploaded</Text>
              </View>  
              <MaterialCommunityIcons name="check" size={28} color="black" />
            </View>
            
          ) : (
            <TouchableOpacity style={PrincipalStyles.button} onPress={toggleRecordVideoModal}>
              <Text style={PrincipalStyles.text1}>Record Video</Text>
            </TouchableOpacity>
            

            
          )}
          <RecordVideoModal 
            visible={recordVideoModalVisible} 
            onClose={toggleRecordVideoModal} 
            onConfirm={handleRecordVideoConfirm} 
          />
    <View style={PrincipalStyles.separator} />

    {addressType !== 'Abroad' && addressType !== 'Local' && (
      <>

        <Text style={PrincipalStyles.textInput}>Home Address Type:</Text>
        <TouchableOpacity style={PrincipalStyles.button} onPress={() => handleHomeAddressType('Local')}>
          <Text style={PrincipalStyles.text1}>Local</Text>
        </TouchableOpacity>
      </>
    )}

    {addressType !== 'Local' && addressType !== 'Abroad' && (
      <>
        <TouchableOpacity style={PrincipalStyles.button} onPress={() => handleHomeAddressType('Abroad')}>
          <Text style={PrincipalStyles.text1}>Abroad</Text>
        </TouchableOpacity>
      </>
    )}

    {addressType === 'Abroad' && (
      <Text style={PrincipalStyles.textInput4}>Address Type: Abroad</Text>
    )}

    {addressType === 'Local' && (
      <Text style={PrincipalStyles.textInput4}>Address Type: Local</Text>
    )
    
    }
    
    {showAbroadQuestions && (
        <>
          <View style={PrincipalStyles.separator} />
          <Text style={PrincipalStyles.textInput}>Foreign Address:</Text>
          <TextInput 
            style={PrincipalStyles.input} 
            placeholder="Enter your address abroad"
            onChangeText={(text) => setAbroadAddress(text)}
          />
          <View style={PrincipalStyles.separator} />

          
          <Text style={PrincipalStyles.textInput}>Passport:</Text>
          {fileUploaded.passport ? (         
            <View style={PrincipalStyles.uploadedContainer}>
              <View style={PrincipalStyles.box}>
                <Text style={PrincipalStyles.text2}> File Uploaded</Text>
              </View>  
              <MaterialCommunityIcons name="check" size={28} color="black" />
            </View>
            
          ) : (
            <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('passport')}>
              <Text style={PrincipalStyles.text1}>Pick Document</Text>
            </TouchableOpacity>
          )}

          <View style={PrincipalStyles.separator} />

          {/* PDF file */}
          <Text style={PrincipalStyles.textInput}>Oath of Allegiance pdf:</Text>
          {fileUploaded.oathofAllegiance ? (         
            <View style={PrincipalStyles.uploadedContainer}>
              <View style={PrincipalStyles.box}>
                <Text style={PrincipalStyles.text2}> File Uploaded</Text>
              </View>  
              <MaterialCommunityIcons name="check" size={28} color="black" />
            </View>
            
          ) : (
            <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('oathofAllegiance')}>
              <Text style={PrincipalStyles.text1}>Pick Document</Text>
            </TouchableOpacity>
          )}

          <View style={PrincipalStyles.separator} />

          <Text style={PrincipalStyles.textInput}>Certificate of Naturalization:</Text>
          {fileUploaded.certofNaturalization ? (         
            <View style={PrincipalStyles.uploadedContainer}>
              <View style={PrincipalStyles.box}>
                <Text style={PrincipalStyles.text2}> File Uploaded</Text>
              </View>  
              <MaterialCommunityIcons name="check" size={28} color="black" />
            </View>
            
          ) : (
            <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('certofNaturalization')}>
              <Text style={PrincipalStyles.text1}>Pick Document</Text>
            </TouchableOpacity>
          )}
          <View style={PrincipalStyles.separator} />

          <Text style={PrincipalStyles.textInput}>Identification of Dual Citizenship:</Text>
          {fileUploaded.identificationDualCitizen ? (         
            <View style={PrincipalStyles.uploadedContainer}>
              <View style={PrincipalStyles.box}>
                <Text style={PrincipalStyles.text2}> File Uploaded</Text>
              </View>  
              <MaterialCommunityIcons name="check" size={28} color="black" />
            </View>
            
          ) : (
            <TouchableOpacity style={PrincipalStyles.button} onPress={() => pickDocument('identificationDualCitizen')}>
              <Text style={PrincipalStyles.text1}>Pick Document</Text>
            </TouchableOpacity>
          )}
        </>
      )}

          {addressType === 'Local' && (
            <>
              <View style={PrincipalStyles.separator} />

              <Text style={PrincipalStyles.textInput}>                Home Address:              </Text>
              <TextInput
                placeholder="Enter your local address"
                style={PrincipalStyles.input}
                onChangeText={(text) => setLocalAddress(text)}
              />
            </>
          )}
        

        <View style={PrincipalStyles.separator} />
        <View style={PrincipalStyles.sectionContainer}>
          <TouchableOpacity
            style={[PrincipalStyles.button, !fileUploaded.videoClip && PrincipalStyles.disabledButton]}
            onPress={handleFormSubmission}
            disabled={!fileUploaded.videoClip}
          >
            <Text style={PrincipalStyles.text1}>Submit</Text>
          </TouchableOpacity>
        </View>

      {/* Confirmation Modal: Calls handleNextButtonClick upon confirmation */}
      <ConfirmationModal
        visible={confirmModalVisible}
        toggleModal={toggleConfirmModal} // This function simply toggles the modal's visibility
        onConfirm={() => {
          handleNextButtonClick(); // This function is called only after user confirmation
          toggleConfirmModal(); // Optionally close the modal after confirmation
        }}
      />


    </KeyboardAwareScrollView>
    
  );
};

export default Principal;