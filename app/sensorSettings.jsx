import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; // Picker for scrollable numbers
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Alert } from 'react-native'; // Import Alert component

import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function DispenserSettings() {

  //Limits
  const [temperatureLimit, setTemperatureLimit] = useState(1); // State for Temperature Limit
  const [turbidityLimit, setTurbidityLimit] = useState(1); // State for Turbidity Limit
  const [pHLimit, setPHLimit] = useState(1); // State for pH Limit

  //Pickers
  const [isTemperaturePickerEnabled, setIsTemperaturePickerEnabled] = useState(false); // Enable/disable Temperature picker
  const [isTurbidityPickerEnabled, setIsTurbidityPickerEnabled] = useState(false); // Enable/disable Turbidity picker
  const [isPHPickerEnabled, setIsPHPickerEnabled] = useState(false); // Enable/disable pH picker

  const navigation = useNavigation(); // Use useNavigation hook

  // Retrieve saved values from AsyncStorage when component mounts
  useEffect(() => {
    const loadValues = async () => {
      try {
        const savedTemperatureLimit = await AsyncStorage.getItem('temperatureLimit');
        const savedTurbidityLimit = await AsyncStorage.getItem('turbidityLimit');
        const savedPHLimit = await AsyncStorage.getItem('pHLimit');
        if (savedTemperatureLimit !== null) {
          setTemperatureLimit(parseInt(savedTemperatureLimit, 10));
        }
        if (savedTurbidityLimit !== null) {
          setTurbidityLimit(parseInt(savedTurbidityLimit, 10));
        }
        if (savedPHLimit !== null) {
          setPHLimit(parseInt(savedPHLimit, 10));
        }
      } catch (error) {
        console.log('Error loading values', error);
      }
    };

    loadValues();
  }, []);

  // Function to save values to AsyncStorage
  const saveValues = async () => {
    try {
      await AsyncStorage.setItem('temperatureLimit', temperatureLimit.toString());
      await AsyncStorage.setItem('turbidityLimit', turbidityLimit.toString());
      await AsyncStorage.setItem('pHLimit', pHLimit.toString());
    } catch (error) {
      console.log('Error saving values', error);
    }
  };

  // Function to reset the values to default (set to 1)
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
            // Update the UI state
            setTemperatureLimit(1);
            setTurbidityLimit(1);
            setPHLimit(1);
            
            try {
              // Save the default values to AsyncStorage
              await AsyncStorage.setItem('temperatureLimit', '1');
              await AsyncStorage.setItem('turbidityLimit', '1');
              await AsyncStorage.setItem('pHLimit', '1');
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
        {/* Keep the ImageBackground */}
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
          resizeMode="cover"
        >
          {/* Header with Back Button */}
          <View className="flex-row items-center justify-center px-4 mt-20 relative">
            {/* Back button */}
            <TouchableOpacity 
                onPress={() => navigation.goBack()} // Navigate back to the previous screen
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
              <View className="flex-row items-center justify-between">
                {isTemperaturePickerEnabled ? (
                  <Picker
                    selectedValue={temperatureLimit}
                    style={{ height: 100, width: 150, color: 'black' }}
                    onValueChange={(itemValue) => setTemperatureLimit(itemValue)}
                    itemStyle={{ height: 100 }} // Control the height of picker items
                  >
                    {[...Array(99).keys()].map(num => (
                      <Picker.Item key={num + 1} label={`${num + 1}`} value={num + 1} />
                    ))}
                  </Picker>
                ) : (
                  <Text className="text-xl text-white">{temperatureLimit}</Text>
                )}

                <View>
                  {/* Change Button */}
                  <TouchableOpacity 
                    onPress={() => setIsTemperaturePickerEnabled(true)}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'red' }} className="mb-2">Change</Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity 
                    disabled={!isTemperaturePickerEnabled}
                    onPress={() => {
                      saveValues();
                      setIsTemperaturePickerEnabled(false);
                    }}
                    className={!isTemperaturePickerEnabled ? 'opacity-50' : ''}
                  >
                    <Text className={`text-[17px] mt-2 font-bold ${!isTemperaturePickerEnabled ? 'text-gray-400' : 'text-purple-800'}`}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Turbidity Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Turbidity Limit:</Text>
              <View className="flex-row items-center justify-between">
                {isTurbidityPickerEnabled ? (
                  <Picker
                    selectedValue={turbidityLimit}
                    style={{ height: 100, width: 150, color: 'black' }}
                    onValueChange={(itemValue) => setTurbidityLimit(itemValue)}
                    itemStyle={{ height: 100 }} // Control the height of picker items
                  >
                    {[...Array(99).keys()].map(num => (
                      <Picker.Item key={num + 1} label={`${num + 1}`} value={num + 1} />
                    ))}
                  </Picker>
                ) : (
                  <Text className="text-xl text-white">{turbidityLimit}</Text>
                )}

                <View>
                  {/* Change Button */}
                  <TouchableOpacity 
                    onPress={() => setIsTurbidityPickerEnabled(true)}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'red' }} className="mb-2">Change</Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity 
                    disabled={!isTurbidityPickerEnabled}
                    onPress={() => {
                      saveValues();
                      setIsTurbidityPickerEnabled(false);
                    }}
                    className={!isTurbidityPickerEnabled ? 'opacity-50' : ''}
                  >
                    <Text className={`text-[17px] mt-2 font-bold ${!isTurbidityPickerEnabled ? 'text-gray-400' : 'text-purple-800'}`}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* pH Limit Panel */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">pH Limit:</Text>
              <View className="flex-row items-center justify-between">
                {isPHPickerEnabled ? (
                  <Picker
                    selectedValue={pHLimit}
                    style={{ height: 100, width: 150, color: 'black' }}
                    onValueChange={(itemValue) => setPHLimit(itemValue)}
                    itemStyle={{ height: 100 }} // Control the height of picker items
                  >
                    {[...Array(14).keys()].map(num => (
                      <Picker.Item key={num + 1} label={`${num + 1}`} value={num + 1} />
                    ))}
                  </Picker>
                ) : (
                  <Text className="text-xl text-white">{pHLimit}</Text>
                )}

                <View>
                  {/* Change Button */}
                  <TouchableOpacity 
                    onPress={() => setIsPHPickerEnabled(true)}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'red' }} className="mb-2">Change</Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity 
                    disabled={!isPHPickerEnabled}
                    onPress={() => {
                      saveValues();
                      setIsPHPickerEnabled(false);
                    }}
                    className={!isPHPickerEnabled ? 'opacity-50' : ''}
                  >
                    <Text className={`text-[17px] mt-2 font-bold ${!isPHPickerEnabled ? 'text-gray-400' : 'text-purple-800'}`}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
