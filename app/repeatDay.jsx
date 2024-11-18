import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router } from 'expo-router'; 
import { styles } from './AppStyles';  
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function RepeatDay() {
    const navigation = useNavigation(); 
    const { selectedDevice = "LED", selectedTime, selectedDays: selectedDaysParam, id, isEditMode = 'false' } = useLocalSearchParams();
    const editMode = isEditMode === 'true';
    const initialSelectedDays = selectedDaysParam ? selectedDaysParam.split(',') : [];
    const [selectedDays, setSelectedDays] = useState(initialSelectedDays);
    const [device, setDevice] = useState(selectedDevice);
    const [date, setDate] = useState(new Date());

    console.log('Inside Repeat Day isEditMode:', isEditMode);

    const params = useLocalSearchParams();
    console.log('All params in Repeat Day:', params);
    
    const days = [
        { id: 'Su', label: 'Every Sunday' },
        { id: 'Mo', label: 'Every Monday' },
        { id: 'Tu', label: 'Every Tuesday' },
        { id: 'We', label: 'Every Wednesday' },
        { id: 'Th', label: 'Every Thursday' },
        { id: 'Fr', label: 'Every Friday' },
        { id: 'Sa', label: 'Every Saturday' },
    ];

    // Toggle day selection
    const toggleDay = (dayId) => {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.includes(dayId)
          ? prevSelectedDays.filter((id) => id !== dayId)
          : [...prevSelectedDays, dayId]
      );
    };

    const handleSave = () => {
        // Convert isEditMode to a boolean
        const editMode = isEditMode === 'true' || isEditMode === true;

    
        if (editMode) {
            // Navigate back to editSchedule with selected days
            router.push({
                pathname: '/editSchedule', 
                params: { 
                    selectedDays: selectedDays.join(','), 
                    selectedTime,
                    id,  
                    isEditMode: true,  // Ensure we're in edit mode
                    selectedDevice: device,
                }
            });
        } else {
            // Navigate back to addSchedule with selected days
            router.push({
                pathname: '/addSchedule', 
                params: { 
                    selectedDays: selectedDays.join(','), 
                    selectedTime,
                    isEditMode: false,  // Ensure we're in add mode
                    selectedDevice: device,
                }
            });
        }
    };
    

    return (
        <GestureHandlerRootView style={styles.container}>  
            <SafeAreaView className="bg-primary h-full">
                <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
                
                {/* Header with Cancel and Save */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    <TouchableOpacity  
                        onPress={() => navigation.goBack()}  // Go back to the previous screen
                        style={{ padding: 10, marginLeft: 10 }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'purple' }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Repeat Days</Text>
                    <TouchableOpacity  
                        onPress={handleSave}  // Call handleSave when clicking Save
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
