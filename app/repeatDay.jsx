import React, { useState, useRef } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import { MaterialIcons } from '@expo/vector-icons'; // Using Expo for icons

export default function RepeatDay() {
    const ESP32_IP = 'http://192.168.50.35';  // Replace with your ESP32 IP address

    // Days of the week
    const days = [
        { id: 'Su', label: 'Every Sunday' },
        { id: 'Mo', label: 'Every Monday' },
        { id: 'Tu', label: 'Every Tuesday' },
        { id: 'We', label: 'Every Wednesday' },
        { id: 'Th', label: 'Every Thursday' },
        { id: 'Fr', label: 'Every Friday' },
        { id: 'Sa', label: 'Every Saturday' },
    ];

    // State for selected days
    const [selectedDays, setSelectedDays] = useState([]);

    // Toggle day selection
    const toggleDay = (dayId) => {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.includes(dayId)
          ? prevSelectedDays.filter((id) => id !== dayId)
          : [...prevSelectedDays, dayId]
      );
    };

    return (
        <GestureHandlerRootView style={styles.container}>  
            <SafeAreaView className="bg-primary h-full">
                <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
                
                {/* Header with Cancel and Save */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    <TouchableOpacity  
                        onPress={() => router.push('./addSchedule')} 
                        style={{ padding: 10, marginLeft: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Add</Text>
                    <TouchableOpacity  
                        onPress={() => router.push({pathname: '/addSchedule', params: {selectedDays: selectedDays.join(',')}})} 
                        style={{ padding: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ height: '100%', marginTop: 10 }}>
                    <View style={{ width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginHorizontal: 15, marginTop: 45 }}>
                        
                        {/* Days of the Week with Toggle */}
                        {days.map((day) => (
                            <View key={day.id}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }}
                                    onPress={() => toggleDay(day.id)}
                                >
                                    <Text style={{ fontSize: 18, color: 'white' }}>{day.label}</Text>
                                    {selectedDays.includes(day.id) && (
                                        <MaterialIcons name="check" size={24} color="#6a1b9a"/>
                                    )}
                                </TouchableOpacity>
                                {/* Divider Line */}
                                <View style={{ height: 1, backgroundColor: 'grey', marginHorizontal: 5 }} />
                            </View>
                        ))}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
