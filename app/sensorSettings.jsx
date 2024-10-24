import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider'; // Import the slider component

export default function DispenserSettings() {
  // Limits
  const [temperatureLimit, setTemperatureLimit] = useState(1);
  const [temperatureMax, setTemperatureMax] = useState(99);
  const [turbidityLimit, setTurbidityLimit] = useState(1);
  const [turbidityMax, setTurbidityMax] = useState(99);
  const [pHLimit, setPHLimit] = useState(1);
  const [pHMax, setPHMax] = useState(14);

  const navigation = useNavigation();

  useEffect(() => {
    const loadValues = async () => {
      try {
        const savedTemperatureLimit = await AsyncStorage.getItem('temperatureLimit');
        const savedTemperatureMax = await AsyncStorage.getItem('temperatureMax');
        const savedTurbidityLimit = await AsyncStorage.getItem('turbidityLimit');
        const savedTurbidityMax = await AsyncStorage.getItem('turbidityMax');
        const savedPHLimit = await AsyncStorage.getItem('pHLimit');
        const savedPHMax = await AsyncStorage.getItem('pHMax');

        if (savedTemperatureLimit !== null) {
          setTemperatureLimit(parseInt(savedTemperatureLimit, 10));
        }
        if (savedTemperatureMax !== null) {
          setTemperatureMax(parseInt(savedTemperatureMax, 10));
        }
        if (savedTurbidityLimit !== null) {
          setTurbidityLimit(parseInt(savedTurbidityLimit, 10));
        }
        if (savedTurbidityMax !== null) {
          setTurbidityMax(parseInt(savedTurbidityMax, 10));
        }
        if (savedPHLimit !== null) {
          setPHLimit(parseInt(savedPHLimit, 10));
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
      await AsyncStorage.setItem('temperatureLimit', temperatureLimit.toString());
      await AsyncStorage.setItem('temperatureMax', temperatureMax.toString());
      await AsyncStorage.setItem('turbidityLimit', turbidityLimit.toString());
      await AsyncStorage.setItem('turbidityMax', turbidityMax.toString());
      await AsyncStorage.setItem('pHLimit', pHLimit.toString());
      await AsyncStorage.setItem('pHMax', pHMax.toString());
    } catch (error) {
      console.log('Error saving values', error);
    }
  };

  const resetToDefault = async () => {
    Alert.alert(
      "Reset to Default",
      "Are you sure you want to reset the values to default?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Reset canceled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            setTemperatureLimit(1);
            setTemperatureMax(99);
            setTurbidityLimit(1);
            setTurbidityMax(99);
            setPHLimit(1);
            setPHMax(14);

            try {
              await AsyncStorage.setItem('temperatureLimit', '1');
              await AsyncStorage.setItem('temperatureMax', '99');
              await AsyncStorage.setItem('turbidityLimit', '1');
              await AsyncStorage.setItem('turbidityMax', '99');
              await AsyncStorage.setItem('pHLimit', '1');
              await AsyncStorage.setItem('pHMax', '14');
              console.log('Values reset to default');
            } catch (error) {
              console.log('Error saving default values', error);
            }

            alert('Values reset to default');
          },
        }
      ],
      { cancelable: false }
    );
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
              <Text className="text-xl text-white mb-2">Min: {temperatureLimit}</Text>
              <Slider
                minimumValue={1}
                maximumValue={temperatureMax}
                step={1}
                value={temperatureLimit}
                onValueChange={value => setTemperatureLimit(value)}
                onSlidingComplete={saveValues} // Save value when sliding ends
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {temperatureMax}</Text>
              <Slider
                minimumValue={temperatureLimit}
                maximumValue={99}
                step={1}
                value={temperatureMax}
                onValueChange={value => setTemperatureMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
            </View>

            {/* Turbidity Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Turbidity Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {turbidityLimit}</Text>
              <Slider
                minimumValue={1}
                maximumValue={turbidityMax}
                step={1}
                value={turbidityLimit}
                onValueChange={value => setTurbidityLimit(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {turbidityMax}</Text>
              <Slider
                minimumValue={turbidityLimit}
                maximumValue={99}
                step={1}
                value={turbidityMax}
                onValueChange={value => setTurbidityMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
            </View>

            {/* pH Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">pH Limit:</Text>
              <Text className="text-xl text-white mb-2">Min: {pHLimit}</Text>
              <Slider
                minimumValue={1}
                maximumValue={pHMax}
                step={1}
                value={pHLimit}
                onValueChange={value => setPHLimit(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
              <Text className="text-xl text-white mb-2">Max: {pHMax}</Text>
              <Slider
                minimumValue={pHLimit}
                maximumValue={14}
                step={1}
                value={pHMax}
                onValueChange={value => setPHMax(value)}
                onSlidingComplete={saveValues}
                minimumTrackTintColor="#FF0000"
                maximumTrackTintColor="#000000"
              />
            </View>

            {/* Reset to Default Button */}
            <TouchableOpacity 
              className="bg-gray-50/40 rounded-full h-16 mt-12 flex items-center justify-center"
              onPress={resetToDefault}
            >
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Reset to Default</Text>
            </TouchableOpacity>
          </View>
        
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
