import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { styles } from './AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';  // Axios for Adafruit IO requests
import AsyncStorage from '@react-native-async-storage/async-storage';

// Adafruit IO Configuration
const ADAFRUIT_IO_USERNAME = 'RedAsKetchum';  // Replace with your Adafruit IO username
const ADAFRUIT_IO_KEY = 'aio_Ecnw98E4ugDJ18vonFBSkLymwvwj';  // Replace with your Adafruit IO key
const ADAFRUIT_IO_FEED = 'feeding-schedule';  // Replace with your Adafruit IO feed

export default function SchedulePage() {
    const [schedules, setSchedules] = useState([]);  
    const [updating, setUpdating] = useState(false); 
    const {newSchedule, device } = useLocalSearchParams();  
    const feederSchedules = schedules.filter(schedule => schedule.device === 'Feeder');
    const ledSchedules = schedules.filter(schedule => schedule.device === 'LED');

    // Function to send a new schedule to Adafruit IO
    const sendScheduleToAdafruitIO = async (schedule) => {
        try {
            const response = await axios.post(
                `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`,
                {
                    value: JSON.stringify({
                        ...schedule,
                        device: schedule.device // Include device type (Feeder or LED)
                    })
                },
                {
                    headers: {
                        'X-AIO-Key': ADAFRUIT_IO_KEY
                    }
                }
            );

            console.log("Schedule sent to Adafruit IO:", response.data);
        } catch (error) {
            console.error('Error adding schedule to Adafruit IO:', error);
            Alert.alert('Error', 'Failed to add schedule to Adafruit IO.');
        }
    };


        // Function to fetch all schedules from Adafruit IO
    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data`, {
                headers: {
                    'X-AIO-Key': ADAFRUIT_IO_KEY
                }
            });

            // Log full response data to check for 'id' field presence
            console.log("Fetched Schedules from Adafruit IO:", response.data);

            // Map through the response data and parse the inner 'value' field
            const fetchedSchedules = response.data.map(item => {
                try {
                    const parsedSchedule = JSON.parse(item.value);
                    parsedSchedule.id = item.id;  // Ensure the ID is stored for each schedule
                    return parsedSchedule;
                } catch (error) {
                    console.error('Failed to parse schedule data:', item.value, error);
                    return null;  // Skip this item if it can't be parsed
                }
            }).filter(item => item !== null);  // Filter out any null values (failed parses)

            setSchedules(fetchedSchedules);
        } catch (error) {
            console.error('Error fetching schedules from Adafruit IO:', error);
            Alert.alert('Error', 'Failed to fetch schedules.');
        }
    };


    useEffect(() => {
        fetchSchedules();  // Fetch schedules on mount
    }, []);

    // Flag to prevent adding multiple schedules simultaneously
    let isAddingSchedule = false;

    // Function to add a new schedule
    const addSchedule = async (schedule) => {
        if (isAddingSchedule) {
            console.log("A schedule is already being added. Skipping this request.");
            return;
        }

        isAddingSchedule = true;

        try {
            const existsLocally = schedules.some(s => s.time === schedule.time && s.days === schedule.days && s.device === schedule.device);
            if (existsLocally) {
                console.log("Schedule already exists locally. Skipping addition.");
                isAddingSchedule = false;
                return;
            }

            // Include device information when sending to Adafruit IO
            await sendScheduleToAdafruitIO({ ...schedule, device: schedule.device, enabled: true, executed: false });
            fetchSchedules();  // Re-fetch schedules after adding
        } catch (error) {
            console.error('Error adding schedule:', error);
        } finally {
            isAddingSchedule = false;
        }
    };
    
    useEffect(() => {
        if (newSchedule) {
            try {
                const parsedSchedule = JSON.parse(newSchedule);
    
                console.log("Number of Dispenses:", parsedSchedule.scheduledDispenses);
                if (device) {
                    console.log("Device selected:", device); // Logs the device received from addSchedule
                }
    
                const exists = schedules.some(s => s.time === parsedSchedule.time && s.days === parsedSchedule.days);
                if (!exists) {
                    addSchedule(parsedSchedule);
                } else {
                    console.log("Schedule already exists. Skipping addition.");
                }
            } catch (error) {
                console.error('Failed to parse new schedule:', error);
                Alert.alert('Error', 'Failed to add new schedule.');
            }
        }
    }, [newSchedule, device]);
    
    const toggleSwitch = async (scheduleId) => {
        if (updating) return;
    
        // Find the schedule by ID in the full schedules array
        const scheduleIndex = schedules.findIndex(schedule => schedule.id === scheduleId);
        if (scheduleIndex === -1) {
            console.error("Schedule ID not found:", scheduleId);
            Alert.alert("Error", "Schedule not found.");
            return;
        }
    
        const scheduleToToggle = schedules[scheduleIndex];
    
        const updatedSchedule = {
            ...scheduleToToggle, 
            enabled: !scheduleToToggle.enabled,
            executed: scheduleToToggle.executed || false
        };
    
        const finalPayload = { value: JSON.stringify(updatedSchedule) };
        const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${scheduleToToggle.id}`;
    
        setUpdating(true);
    
        try {
            const response = await axios.put(url, finalPayload, {
                headers: { 'X-AIO-Key': ADAFRUIT_IO_KEY }
            });
            console.log(`Schedule with ID ${scheduleToToggle.id} updated successfully.`);
    
            // Update only the toggled schedule in the state
            const updatedSchedules = [...schedules];
            updatedSchedules[scheduleIndex] = { ...updatedSchedule, id: scheduleToToggle.id };
            setSchedules(updatedSchedules);
    
        } catch (error) {
            console.error('Error updating schedule:', error);
            Alert.alert('Error', 'Failed to update schedule.');
        } finally {
            setUpdating(false);
        }
    };
    
    const deleteAllSchedules = async () => {
        Alert.alert(
            'Delete All Schedules',
            'Are you sure you want to delete all schedules?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            // Set a loading state if necessary
                            setUpdating(true);
    
                            // Loop through each schedule and delete from Adafruit IO
                            for (const schedule of schedules) {
                                const id = schedule.id;  // Get the ID for deletion
                                const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${ADAFRUIT_IO_FEED}/data/${id}`;
    
                                try {
                                    // Send DELETE request for each schedule
                                    await axios.delete(url, {
                                        headers: {
                                            'X-AIO-Key': ADAFRUIT_IO_KEY
                                        }
                                    });
                                    
                                    console.log(`Deleted schedule with ID: ${id}`);
                                } catch (error) {
                                    console.error(`Error deleting schedule with ID ${id}:`, error);
                                }
                            }
    
                            // After all deletions, clear the local schedules state
                            setSchedules([]);
                            console.log('All schedules deleted successfully.');
                        } catch (error) {
                            console.error('Error deleting schedules from Adafruit IO:', error);
                            Alert.alert('Error', 'Failed to delete all schedules from Adafruit IO.');
                        } finally {
                            // Reset the updating state
                            setUpdating(false);
                        }
                    }
                },
            ],
            { cancelable: true }
        );
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
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Schedule</Text>
                    {/* Add Schedule Button */}
                    <TouchableOpacity onPress={() => router.push('/addSchedule')} style={{ padding: 10 }}>
                        <Icon name="add-outline" size={35} color="white" />
                    </TouchableOpacity>
                </View>
                
                {/* Schedule list */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}>
              {/* Feeder Schedules */}
                {feederSchedules.length > 0 && (
                    <>
                        <Text style={{ fontSize: 22, color: 'purple', marginBottom: 10, fontWeight:'bold', marginTop: 20 }}>Feeder Schedules</Text>
                        <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginTop: 15 }}>
                            {feederSchedules.map((schedule, index) => (
                                <TouchableOpacity
                                    key={schedule.id}
                                    style={{ marginBottom: 20 }}
                                    onPress={() => router.push({
                                        pathname: '/editSchedule',
                                        params: { 
                                            id: schedule.id, 
                                            selectedTime: schedule.time, 
                                            selectedDays: schedule.days,  
                                            isEditMode: true, 
                                            selectedDevice: schedule.device
                                        }
                                    })}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 15 }}>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#4527A0" }}
                                            thumbColor={schedule.enabled ? "#f4f3f4" : "#f4f3f4"}
                                            onValueChange={() => toggleSwitch(schedule.id)} // Pass schedule.id
                                            value={schedule.enabled}
                                            style={{ flex: 0.4 }}
                                        />
                                        <Text style={{ fontSize: 20, color: 'purple', flex: 1, fontWeight: 'bold' }}>
                                            {schedule.time}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'white', flex: 1, textAlign: 'right' }}>
                                            {schedule.days ? `every ${schedule.days}` : ''}
                                        </Text>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 2 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
                   
                {ledSchedules.length > 0 && (
                    <>
                        <Text style={{ fontSize: 22, color: 'purple', marginBottom: 10, fontWeight:'bold', marginTop: 20 }}>LED Schedules</Text>
                        <View style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 15, marginTop: 15 }}>
                            {ledSchedules.map((schedule, index) => (
                                <TouchableOpacity
                                    key={schedule.id}
                                    style={{ marginBottom: 20 }}
                                    onPress={() => router.push({
                                        pathname: '/editSchedule',
                                        params: { 
                                            id: schedule.id, 
                                            selectedTime: schedule.time, 
                                            selectedDays: schedule.days,  
                                            isEditMode: true, 
                                        }
                                    })}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 15 }}>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#4527A0" }}
                                            thumbColor={schedule.enabled ? "#f4f3f4" : "#f4f3f4"}
                                            onValueChange={() => toggleSwitch(schedule.id)} // Pass schedule.id
                                            value={schedule.enabled}
                                            style={{ flex: 0.4 }}
                                        />

                                        <Text style={{ fontSize: 20, color: 'purple', flex: 1, fontWeight: 'bold' }}>
                                            {schedule.time}
                                        </Text>
                                        <Text style={{ fontSize: 14, color: 'white', flex: 1, textAlign: 'right' }}>
                                            {schedule.days ? `every ${schedule.days}` : ''}
                                        </Text>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 2 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
                <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65}]} 
                    onPress={deleteAllSchedules}>
                    <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Delete All Schedule</Text>
                </TouchableOpacity>
                </ScrollView>    
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
