import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './AppStyles'; // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';

const settings = () => {
  const navigation = useNavigation(); // Use useNavigation hook
  const [currentFeed, setCurrentFeed] = useState(null); // Tracks the active feed
  const intervalRef = useRef(null);

  const AIO_USERNAME = 'RedAsKetchum'; // Your Adafruit IO username
  const AIO_KEY = 'aio_Ecnw98E4ugDJ18vonFBSkLymwvwj'; // Your Adafruit IO key

  // Function to send data to Adafruit IO feed
  const sendDataToFeed = async (feed, value) => {
    try {
      const response = await fetch(`https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feed}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AIO-Key': AIO_KEY,
        },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        console.log(`Data sent to ${feed}: ${value}`);
      } else {
        console.error(`Failed to send data to ${feed}`);
      }
    } catch (error) {
      console.error(`Error sending data to ${feed}:`, error);
    }
  };

  // Function to start sending data in a loop
  const startLoop = (feed, value) => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set the current feed and start a new interval
    setCurrentFeed({ feed, value });
    intervalRef.current = setInterval(() => {
      sendDataToFeed(feed, value);
    }, 3000); // Sends data every 3 seconds
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground
          source={require('../assets/images/gradient.png')}
          className="flex-1 absolute top-0 left-0 right-0 bottom-0"
          resizeMode="cover"
        />

        <View className="flex-row items-center justify-center px-4 mt-5 relative">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-0 p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Expands clickable area
          >
            <Icon name="arrow-back" size={35} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 20 }}>
          {/* Turbidity Buttons */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20 }}>
            Turbidity Settings
          </Text>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 20 }]}
            onPress={() => startLoop('turbidity-extra', '3.3')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Clean: 3.3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 10 }]}
            onPress={() => startLoop('turbidity-extra', '2.0')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Murky: 2.0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 10 }]}
            onPress={() => startLoop('turbidity-extra', '0.00')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Dark: 0.00</Text>
          </TouchableOpacity>

          {/* pH Buttons */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20 }}>
            pH Settings
          </Text>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 20 }]}
            onPress={() => startLoop('ph-extra', '0.0')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'red' }}>0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 10 }]}
            onPress={() => startLoop('ph-extra', '4.0')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>4.0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 10 }]}
            onPress={() => startLoop('ph-extra', '7.0')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>7.0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 10 }]}
            onPress={() => startLoop('ph-extra', '10.0')}
          >
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>10.0</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default settings;
