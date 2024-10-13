import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; // Picker for scrollable numbers
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function DispenserSettings() {
  const [scheduledValue, setScheduledValue] = useState(1); // State for Scheduled option
  const [manualValue, setManualValue] = useState(1); // State for Manual option
  const [isScheduledPickerEnabled, setIsScheduledPickerEnabled] = useState(false); // State for enabling/disabling the Scheduled picker
  const [isManualPickerEnabled, setIsManualPickerEnabled] = useState(false); // State for enabling/disabling the Manual picker

  // Retrieve saved values from AsyncStorage when component mounts
  useEffect(() => {
    const loadValues = async () => {
      try {
        const savedScheduledValue = await AsyncStorage.getItem('scheduledValue');
        const savedManualValue = await AsyncStorage.getItem('manualValue');
        if (savedScheduledValue !== null) {
          setScheduledValue(parseInt(savedScheduledValue, 10));
        }
        if (savedManualValue !== null) {
          setManualValue(parseInt(savedManualValue, 10));
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
      await AsyncStorage.setItem('scheduledValue', scheduledValue.toString());
      await AsyncStorage.setItem('manualValue', manualValue.toString());
      alert('Values saved successfully!');
    } catch (error) {
      console.log('Error saving values', error);
    }
  };

  // Function to reset the values to default (set to 1)
  const resetToDefault = async () => {
    setScheduledValue(1);
    setManualValue(1);
    await saveValues(); // Save default values
    alert('Values reset to default');
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
                onPress={() => router.push('/')} 
                className="absolute left-0 p-2"
            >
                <Icon name="arrow-back" size={35} color="white" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-2 text-white text-center">Food Dispenser Settings</Text>
          </View>

          {/* Scheduled Option and Manual Option Panels (Fixed) */}
          <View className="mt-5 px-5">
            {/* Scheduled Option */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden mb-5">
              <Text className="text-2xl font-bold mb-2 text-white">Scheduled Dispenses:</Text>
              <View className="flex-row items-center justify-between">
                {isScheduledPickerEnabled ? (
                  <Picker
                    selectedValue={scheduledValue}
                    style={{ height: 100, width: 150, color: 'black' }}
                    onValueChange={(itemValue) => setScheduledValue(itemValue)}
                    itemStyle={{ height: 100 }} // Control the height of picker items
                  >
                    {[...Array(24).keys()].map(num => (
                      <Picker.Item key={num} label={`${num}`} value={num} />
                    ))}
                  </Picker>
                ) : (
                  <Text className="text-xl text-white">{scheduledValue}</Text>
                )}

                <View>
                  {/* Change Button */}
                  <TouchableOpacity 
                    onPress={() => setIsScheduledPickerEnabled(true)}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'red' }} className="mb-2">Change</Text>

                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity 
                    disabled={!isScheduledPickerEnabled}
                    onPress={() => {
                      saveValues();
                      setIsScheduledPickerEnabled(false);
                    }}
                    className={!isScheduledPickerEnabled ? 'opacity-50' : ''}
                  >
                    <Text className={`text-[17px] mt-2 font-bold ${!isScheduledPickerEnabled ? 'text-gray-400' : 'text-purple-800'}`}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Manual Option */}
            <View className="p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">Manual Dispenses:</Text>
              <View className="flex-row items-center justify-between">
                {isManualPickerEnabled ? (
                  <Picker
                    selectedValue={manualValue}
                    style={{ height: 100, width: 150, color: 'black' }}
                    onValueChange={(itemValue) => setManualValue(itemValue)}
                    itemStyle={{ height: 100 }} // Control the height of picker items
                  >
                    {[...Array(24).keys()].map(num => (
                      <Picker.Item key={num} label={`${num}`} value={num} />
                    ))}
                  </Picker>
                ) : (
                  <Text className="text-xl text-white">{manualValue}</Text>
                )}

                <View>
                  {/* Change Button */}
                  <TouchableOpacity 
                    onPress={() => setIsManualPickerEnabled(true)}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'red' }} className="mb-2">Change</Text>

                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity 
                    disabled={!isManualPickerEnabled}
                    onPress={() => {
                      saveValues();
                      setIsManualPickerEnabled(false);
                    }}
                    className={!isManualPickerEnabled ? 'opacity-50' : ''}
                  >
                    <Text className={`text-[17px] mt-2 font-bold ${!isManualPickerEnabled ? 'text-gray-400' : 'text-purple-800'}`}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Reset to Default Button */}
            <TouchableOpacity 
              className="bg-gray-50/40 rounded-full h-16 mt-6 flex items-center justify-center"
              onPress={resetToDefault}
            >
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Reset to Default</Text>
            </TouchableOpacity>

          </View>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>
            {/* Add any other scrollable content here */}
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
