import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from './AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';  // Axios for Adafruit IO requests

// Adafruit IO Configuration
const ADAFRUIT_IO_USERNAME = 'RedAsKetchum';  // Replace with your Adafruit IO username
const ADAFRUIT_IO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Replace with your Adafruit IO key
const ADAFRUIT_IO_FEED = 'feeding-schedule';  // Replace with your Adafruit IO feed

export default function SchedulePage() {
    const [schedules, setSchedules] = useState([]);  // State for managing schedules
    const [updating, setUpdating] = useState(false); // Throttle updates to Adafruit IO
    const { newSchedule } = useLocalSearchParams();  // Get new schedule from parameters

    // Helper function to add a schedule to Adafruit IO
    const sendScheduleToAdafruitIO = async (schedule) => {
        try {
            await axios.post(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`, {
                value: JSON.stringify(schedule)
            }, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });
            console.log("Schedule sent to Adafruit IO:", schedule);
        } catch (error) {
            console.error('Error adding schedule to Adafruit IO:', error);
            Alert.alert('Error', 'Failed to add schedule to Adafruit IO.');
        }
    };

    // Helper function to update a schedule in Adafruit IO
    const updateScheduleInAdafruitIO = async (id, updatedSchedule) => {
        try {
            setUpdating(true); // Prevent duplicate updates
            await axios.put(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${id}`, {
                value: JSON.stringify(updatedSchedule)
            }, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });
            console.log("Schedule updated in Adafruit IO:", updatedSchedule);
            setUpdating(false);
        } catch (error) {
            console.error('Error updating schedule in Adafruit IO:', error);
            setUpdating(false);
            Alert.alert('Error', 'Failed to update schedule in Adafruit IO.');
        }
    };

    // Fetch existing schedules from Adafruit IO on component mount
    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });
            const fetchedSchedules = response.data.map(item => ({
                ...JSON.parse(item.value),
                id: item.id  // Keep track of the ID for updates or deletion
            }));
            setSchedules(fetchedSchedules);  // Set the fetched schedules
        } catch (error) {
            console.error('Error fetching schedules from Adafruit IO:', error);
            Alert.alert('Error', 'Failed to fetch schedules.');
        }
    };

    useEffect(() => {
        fetchSchedules();  // Fetch schedules on mount
    }, []);

    // Helper function to add a new schedule
    const addSchedule = (schedule) => {
        // Check if the schedule already exists to prevent duplicates
        const exists = schedules.some(s => s.time === schedule.time && s.days === schedule.days);
        if (exists) {
            console.log("Schedule already exists. Skipping addition.");
            return;
        }

        setSchedules((prevSchedules) => {
            const newSchedules = [...prevSchedules, { ...schedule, enabled: false }];
            console.log("New schedules state after adding:", newSchedules);  // Log the new state after adding
            return newSchedules;
        });

        // Send the new schedule to Adafruit IO
        sendScheduleToAdafruitIO(schedule).then(() => {
            fetchSchedules();  // Re-fetch the schedules after adding
        });
    };

    // Handle new schedule received via local params
    useEffect(() => {
        if (newSchedule) {
            try {
                const parsedSchedule = JSON.parse(newSchedule);

                // Log the parsed schedule
                console.log("Parsed new schedule:", parsedSchedule);

                // Add the parsed schedule to the list if it doesn't already exist
                addSchedule(parsedSchedule);
            } catch (error) {
                console.error('Failed to parse new schedule:', error);
                Alert.alert('Error', 'Failed to add new schedule.');
            }
        }
    }, [newSchedule]);

    // Handle the toggle switch for individual schedules
    const toggleSwitch = (index) => {
        if (updating) return; // Prevent updating if already in process

        const updatedSchedules = schedules.map((schedule, i) =>
            i === index ? { ...schedule, enabled: !schedule.enabled } : schedule
        );
        setSchedules(updatedSchedules);  // Update the state to reflect the changes

        // Send the updated schedule to Adafruit IO by updating the existing one using its ID
        const scheduleToUpdate = updatedSchedules[index];
        updateScheduleInAdafruitIO(scheduleToUpdate.id, scheduleToUpdate);
    };

    // Function to delete all schedules from Adafruit IO
    const deleteAllSchedules = async () => {
        try {
            // Fetch all schedules from Adafruit IO
            const response = await axios.get(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });

            const dataPoints = response.data;

            // Loop through each data point and delete it
            for (let dataPoint of dataPoints) {
                await axios.delete(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${dataPoint.id}`, {
                    headers: {
                        'X-AIO-Key': ADAFRUIT_IO_KEY
                    }
                });
            }

            // Clear the local schedules state
            setSchedules([]);

            console.log('All schedules deleted successfully.');
            Alert.alert('Success', 'All schedules deleted successfully.');

        } catch (error) {
            console.error('Error deleting schedules from Adafruit IO:', error);
            Alert.alert('Error', 'Failed to delete schedules from Adafruit IO.');
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>  
            <SafeAreaView className="bg-primary h-full">
                <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
                {/* Header with Back and Add Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    {/* Back button */}
                    <TouchableOpacity 
                        onPress={() => router.push('/')} 
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
                <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65}]} 
                    onPress={deleteAllSchedules}>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Delete All Schedule</Text>
                </TouchableOpacity>
                {/* Schedule list */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>
                    <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginTop: 15 }}>
                        {/* Render all saved schedules */}
                        {schedules.map((schedule, index) => (
                            <View key={`${schedule.time}-${schedule.days}-${schedule.id}`} style={{ marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 15 }}>
                                    {/* Toggle Button for individual schedules */}
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#4527A0" }}
                                        thumbColor={schedule.enabled ? "#f4f3f4" : "#f4f3f4"}
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
