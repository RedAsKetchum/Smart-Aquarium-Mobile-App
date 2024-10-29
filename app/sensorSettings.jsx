import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
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
  
      // Show a confirmation popup
      Alert.alert(
        "Success",
        "Sensor settings have been saved.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.log('Error saving values', error);
    }
  };

  // Helper function to publish data to Adafruit IO
  const publishToAdafruitIO = async (feedKey, data) => {
    try {
      const jsonData = JSON.stringify(data);
      await axios.post(
        `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${feedKey}/data`,
        { value: jsonData },
        { headers: { 'X-AIO-Key': AIO_KEY, 'Content-Type': 'application/json' } }
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
         <View className="flex-row items-center justify-center px-4 mt-20">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="absolute left-0 p-2"
            >
              <Icon name="arrow-back" size={35} color="white" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-2 text-white text-center">
              Sensor Settings
            </Text>

            <TouchableOpacity 
              onPress={saveValues} 
              className="absolute right-0 p-2"
              style={{ marginRight: 18 }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Save</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 px-5">
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Temperature Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {temperatureMin}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={100} 
                step={1}
                value={temperatureMin}
                onValueChange={value => setTemperatureMin(value)}
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
                minimumTrackTintColor="#9933ff"
                maximumTrackTintColor="#000000"
              />
            </View>

            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">pH Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {pHMin}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={14} 
                step={1}
                value={pHMin}
                onValueChange={value => setPHMin(value)}
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
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
            </View>

            <View className="mt-5 p-5 pb-14 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Turbidity Limit:</Text>
              <Text className="text-xl text-white mb-2">Max: {turbidityMax}</Text>
              <Slider
                minimumValue={0} 
                maximumValue={100} 
                step={1}
                value={turbidityMax}
                onValueChange={value => setTurbidityMax(value)}
                minimumTrackTintColor="#1a53ff"
                maximumTrackTintColor="#000000"
              />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

