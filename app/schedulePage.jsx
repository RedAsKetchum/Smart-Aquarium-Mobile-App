import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from './AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SchedulePage() {
    const [schedules, setSchedules] = useState([]);  // State for managing schedules

    // Get the new schedule(s) passed from AddSchedule
    const { newSchedule } = useLocalSearchParams();

    // Initial schedules that load the first time the component mounts
    const initialSchedules = [
        {
            time: '9:00 AM',
            days: 'Mo,We,Fr',
            enabled: false
        },
        {
            time: '6:00 PM',
            days: 'Tu,Th,Sa',
            enabled: false
        }
    ];

    // Add the initial schedules ONLY IF the schedules array is empty (i.e., first render)
    useEffect(() => {
        if (schedules.length === 0) {
            setSchedules((prevSchedules) => {
                const initialLoad = [...prevSchedules, ...initialSchedules];
                console.log("Loaded initial schedules:", initialLoad);  // Log initial schedules
                return initialLoad;
            });
        }
    }, []);  // Empty dependency array ensures this only runs once on mount

    // Helper function to add a new schedule
    const addSchedule = (schedule) => {
        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules, { ...schedule, enabled: false }];
            console.log("New Schedule added:", schedule);  // Log the new schedule being added
            return newSchedules;
        });
    };

    // UseEffect to update schedules when newSchedule changes
    useEffect(() => {
        if (newSchedule) {
            try {
                const parsedSchedule = JSON.parse(newSchedule);

                // Log the parsed schedule to confirm correct data
                console.log("Parsed new schedule:", parsedSchedule);

                // Add the parsed schedule to the list
                addSchedule(parsedSchedule);
            } catch (error) {
                console.error('Failed to parse new schedule:', error);
                Alert.alert('Error', 'Failed to add new schedule.');
            }
        }
    }, [newSchedule]);

    // UseEffect to log when schedules change (after adding new ones)
    useEffect(() => {
        console.log("All saved schedules after adding:", schedules);
    }, [schedules]);

    // Handle the toggle switch for individual schedules
    const toggleSwitch = (index) => {
        const updatedSchedules = schedules.map((schedule, i) =>
            i === index ? { ...schedule, enabled: !schedule.enabled } : schedule
        );
        setSchedules(updatedSchedules);  // Update the state to reflect the changes
    };

    return (
        <GestureHandlerRootView style={styles.container}>  
            <SafeAreaView className="bg-primary h-full">
                <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
                {/* Header with Back and Add Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    {/* Back button */}
                    <TouchableOpacity 
                        onPress={() => router.replace('index')} 
                        style={{ padding: 10 }}
                    >
                        <Icon name="arrow-back" size={35} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Feeding Schedule</Text>
                    {/* Add Schedule Button */}
                    <TouchableOpacity onPress={() => router.push('/addSchedule')} style={{ padding: 10 }}>
                        <Icon name="add-outline" size={35} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Schedule list */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>
                    <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginTop: 45 }}>
                        {/* Render all saved schedules */}
                        {schedules.map((schedule, index) => (
                            <View key={`${schedule.time}-${schedule.days}`} style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 15 }}>
                                    {/* Toggle Button for individual schedules */}
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={schedule.enabled ? "#f5dd4b" : "#f4f3f4"}
                                        onValueChange={() => toggleSwitch(index)}  // Toggle individual schedule by index
                                        value={schedule.enabled}
                                        style={{ flex: 0.4 }}
                                    />
                                    {/* Time */}
                                    <Text style={{ fontSize: 20, color: 'purple', flex: 1, fontWeight: 'bold' }}>{schedule.time}</Text>
                                    {/* Days */}
                                    <Text style={{ fontSize: 14, color: 'white', flex: 1, textAlign: 'right' }}>
                                        {schedule.days ? `every ${schedule.days}` : ''}
                                    </Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 2 }} />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
