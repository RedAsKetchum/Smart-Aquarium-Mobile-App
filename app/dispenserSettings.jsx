import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Button, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker'; // Picker for scrollable numbers
import { styled } from 'nativewind'; // Import NativeWind

export default function DispenserSettings() {
  const [scheduledValue, setScheduledValue] = useState(1); // State for Scheduled option
  const [manualValue, setManualValue] = useState(1); // State for Manual option

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

            <Text className="text-2xl font-bold mb-2  text-white text-center">Food Dispenser Settings</Text>
          </View>

          {/* Scrollable Content */}
          <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>

            {/* Scheduled Option */}
            <View className="mt-5 p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">Scheduled Total:</Text>
              <View className="flex-row items-center justify-between">
                <Picker
                  selectedValue={scheduledValue}
                  style={{ height: 100, width: 150, color: 'black' }}
                  onValueChange={(itemValue) => setScheduledValue(itemValue)}
                  itemStyle={{ height: 100 }} // Control the height of picker items
                >
                  {/* Define the range of values */}
                  {[...Array(24).keys()].map(num => (
                    <Picker.Item key={num} label={`${num}`} value={num} />
                  ))}
                </Picker>
                 <TouchableOpacity onPress={() => alert(`Automatic Dispenser Total: ${scheduledValue}`)}>
                    <Text className="text-[17px] font-bold text-purple-800">Save</Text>
                 </TouchableOpacity>
              </View>
            </View>

            {/* Manual Option */}
            <View className="mt-5 p-5 bg-gray-50/40 bg-opacity-80 rounded-lg overflow-hidden">
              <Text className="text-2xl font-bold mb-2 text-white">Manual Total:</Text>
              <View className="flex-row items-center justify-between">
                <Picker
                  selectedValue={manualValue}
                  style={{ height: 100, width: 150, color: 'black' }}
                  onValueChange={(itemValue) => setManualValue(itemValue)}
                  itemStyle={{ height: 100 }} // Control the height of picker items
                >
                  {/* Define the range of values */}
                  {[...Array(24).keys()].map(num => (
                    <Picker.Item key={num} label={`${num}`} value={num} />
                  ))}
                </Picker>
                 <TouchableOpacity onPress={() => alert(`Manual Dispenser Total: ${manualValue}`)}>
                    <Text className="text-[17px] font-bold text-purple-800">Save</Text>
                 </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
