import React from 'react';
import { StyleSheet, View, Button, Alert,Text } from 'react-native';
import { Link } from 'expo-router';


const settings = () => {
  const ESP32_IP = 'http://192.168.50.35'; // Replace <ESP32-IP-ADDRESS> with your ESP32's IP address
  
  // // Function to deactivate the servo motor
  // const deactivateServo = async () => {
  //   try {
  //     const response = await fetch(`${ESP32_IP}/deactivate_servo`);
  //     if (response.ok) {
  //       Alert.alert('Success', 'Servo Deactivated');
  //     } else {
  //       Alert.alert('Error', 'Failed to deactivate servo');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', `Failed to send request: ${error.message}`);
  //   }
  // };
  
  return (
    // <View style={styles.container}>
    <View>
      {/* <Button title="Deactivate Servo" onPress={deactivateServo} /> */}
      {/* <View style={styles.spacer} /> */}

    <Text>This is the Settings page.</Text>


    </View>
  );
};


export default settings

