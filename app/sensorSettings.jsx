import React, { useState, useEffect } from 'react';
import { View, Text,TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import axios from 'axios';

// ********************* Adafruit IO credentials ***********************/
const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key

export default function SensorSettings() {
  // Limits
  const [temperatureMin, setTemperatureMin] = useState(1);
  const [temperatureMax, setTemperatureMax] = useState(100);

  const [turbidityMin, setTurbidityMin] = useState(1);
  const [turbidityMax, setTurbidityMax] = useState(100);

  const [pHMin, setPHMin] = useState(1);
  const [pHMax, setPHMax] = useState(14); // pH should generally be between 0-14

  const navigation = useNavigation();

  useEffect(() => {
    const loadValues = async () => {
      try {
        const savedTemperatureLimit = await AsyncStorage.getItem('temperatureMin');
        const savedTemperatureMax = await AsyncStorage.getItem('temperatureMax');
        const savedTurbidityLimit = await AsyncStorage.getItem('turbidityMin');
        const savedTurbidityMax = await AsyncStorage.getItem('turbidityMax');
        const savedPHLimit = await AsyncStorage.getItem('pHMin');
        const savedPHMax = await AsyncStorage.getItem('pHMax');

        if (savedTemperatureLimit !== null) {
          setTemperatureMin(parseInt(savedTemperatureLimit, 10));
        }
        if (savedTemperatureMax !== null) {
          setTemperatureMax(parseInt(savedTemperatureMax, 10));
        }
        if (savedTurbidityLimit !== null) {
          setTurbidityMin(parseInt(savedTurbidityLimit, 10));
        }
        if (savedTurbidityMax !== null) {
          setTurbidityMax(parseInt(savedTurbidityMax, 10));
        }
        if (savedPHLimit !== null) {
          setPHMin(parseInt(savedPHLimit, 10));
        }
        if (savedPHMax !== null) {
          setPHMax(parseInt(savedPHMax, 10));
        }
      } catch (error) {
        console.log('Error loading values', error);
      }
    };

    loadValues();
  }, []);

    const saveValues = async () => {
      try {
          // Saving values in AsyncStorage
          await AsyncStorage.setItem('temperatureMin', temperatureMin.toString());
          await AsyncStorage.setItem('temperatureMax', temperatureMax.toString());
          await AsyncStorage.setItem('turbidityMin', turbidityMin.toString());
          await AsyncStorage.setItem('turbidityMax', turbidityMax.toString());
          await AsyncStorage.setItem('pHMin', pHMin.toString());
          await AsyncStorage.setItem('pHMax', pHMax.toString());

          // Create an object to hold all values
          const sensorData = {
              temperatureMin,
              temperatureMax,
              turbidityMin,
              turbidityMax,
              pHMin,
              pHMax
          };

          // Publish the sensor data as a JSON string to the sensor-settings feed
          await publishToAdafruitIO('sensor-settings', sensorData);
      } catch (error) {
          console.log('Error saving values', error);
      }
  };

    // Helper function to publish data to Adafruit IO
    const publishToAdafruitIO = async (feedKey, data) => {
      try {
          // Convert the data object to a JSON string
          const jsonData = JSON.stringify(data);

          // Send the entire JSON string as the value
          await axios.post(
              `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedKey}/data`,
              { value: jsonData }, // Sending the JSON string as a single value
              {
                  headers: { 'X-AIO-Key': AIO_KEY, 'Content-Type': 'application/json' }
              }
          );

          console.log(`Sent data to feed ${feedKey}:`, jsonData);
      } catch (error) {
          console.log(`Error sending data to feed ${feedKey}:`, error);
      }
  };

  return (
    <GestureHandlerRootView className="flex-1">  
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
          resizeMode="cover"
        >
          <View className="flex-row items-center justify-center px-4 mt-20 relative">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="absolute left-0 p-2"
            >
              <Icon name="arrow-back" size={35} color="white" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-2 text-white text-center">Sensor Settings</Text>
          </View>

          {/* Temperature Limit Panel */}
          <View className="mt-5 px-5">
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Temperature Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {temperatureMin}</Text>
              <Slider
                minimumValue={0} //min value of the slider
                maximumValue={100} //max value of the slider
                step={1}           //increments of 1
                value={temperatureMin}//Initialized value set by the useState function. Saves the value set by where the slider is currently at.
                onValueChange={value => setTemperatureMin(value)} //sends the slider value to tempetureMin
                onSlidingComplete={saveValues} // Saves value when sliding ends
                minimumTrackTintColor="#9933ff"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {temperatureMax}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={100} 
                step={1}
                value={temperatureMax}
                onValueChange={value => setTemperatureMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#9933ff"
                maximumTrackTintColor="#000000"
              />
            </View>

            {/* Turbidity Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Turbidity Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {turbidityMin}</Text>
              <Slider
                minimumValue={0}
                maximumValue={100} 
                step={1}
                value={turbidityMin}
                onValueChange={value => setTurbidityMin(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#1a53ff"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {turbidityMax}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={100} 
                step={1}
                value={turbidityMax}
                onValueChange={value => setTurbidityMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#1a53ff"
                maximumTrackTintColor="#000000"
              />
            </View>

            {/* pH Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">pH Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {pHMin}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={14} 
                step={1}
                value={pHMin}
                onValueChange={value => setPHMin(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {pHMax}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={14} 
                step={1}
                value={pHMax}
                onValueChange={value => setPHMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
        
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
