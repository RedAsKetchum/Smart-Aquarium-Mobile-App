import React from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const settings = () => {

  const navigation = useNavigation(); // Use useNavigation hook

  // Function to send reboot command to Adafruit IO
  const sendRebootCommand = async () => {
    try {
      const response = await fetch('https://io.adafruit.com/api/v2/RedAsKetchum/feeds/reboot-action/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AIO-Key': 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH',  // Your AIO key
        },
        body: JSON.stringify({
          value: "reboot",  // The value you want to send to the feed
        }),
      });

      const responseData = await response.json();  // Parse the response data
      console.log(responseData);  // Log the full response

      if (response.ok) {
        console.log('Reboot command sent');
      } else {
        console.error('Failed to send reboot command:', responseData);
      }
    } catch (error) {
      console.error('Error sending reboot command:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>  
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
          resizeMode="cover" 
        />
  
        {/* Back button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ 
            position: 'absolute', 
            left: 10, 
            top: 70,  // Adjust this to fit with the dynamic island on your device
            padding: 10 
          }}
        >
          <Icon name="arrow-back" size={35} color="white" />
        </TouchableOpacity>
  
        {/* Centered title */}
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: 'white', 
          position: 'absolute', 
          top: 83,  // Adjust based on dynamic island
          left: 0, 
          right: 0, 
          textAlign: 'center' 
        }}> 
          Settings 
        </Text>
  
        {/* Connected to Network title */}
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 20 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: 'white', 
            textAlign: 'center', 
            marginTop: 70 // Adjust based on space needed below the title
          }}>
            Connected to: "Network Name"
          </Text>
  
          {/* Sensor Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => console.log("Sensor Settings Pressed")}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Sensor Settings
            </Text>
          </TouchableOpacity>
  
          {/* Dispenser Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => router.push('/dispenserSettings')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Food Dispenser Settings
            </Text>
          </TouchableOpacity>
  
          {/* LED Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => router.push('/ledSetting')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              LED Settings
            </Text>
          </TouchableOpacity>
  
          {/* Reboot */}
          <TouchableOpacity style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 48}]} onPress={sendRebootCommand}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Reboot
            </Text>
          </TouchableOpacity>
  
          {/* Format */}
          <TouchableOpacity style={[styles.buttons, { borderRadius: 32.5, height: 64}]} onPress={sendRebootCommand}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>
              Format
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
  
  
};

export default settings;
