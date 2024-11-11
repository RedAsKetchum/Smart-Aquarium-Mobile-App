import React, {useState, useEffect, useRef} from 'react';
import { Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { styles } from './AppStyles';  // Importing the styles from the new file
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';


const settings = () => {

  const navigation = useNavigation(); // Use useNavigation hook

  const [networkName, setNetworkName] = useState('');
  const networkNameRef = useRef(null);  // Use useRef to store networkName persistently
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const AIO_USERNAME = 'RedAsKetchum';  // Your Adafruit IO username
  const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Your Adafruit IO key
  const FEED_KEY = 'wifi-network';  // Your feed key

  useEffect(() => {
    const fetchWifiNetworkName = async () => {
      setLoading(true); // Start loading state
      
      try {
        //Check if a cached network name exists
        const cachedName = await AsyncStorage.getItem('networkName');
        if (cachedName) {
          setNetworkName(cachedName); // Set cached name immediately
        }
  
        const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data?X-AIO-Key=${AIO_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
  
        if (data && data.length > 0 && data[0].value) {
          const parsedData = JSON.parse(data[0].value);
          if (parsedData.network_name) {
            const newNetworkName = parsedData.network_name;
            setNetworkName(newNetworkName); // Set the updated network name
            
            // Cache the network name
            await AsyncStorage.setItem('networkName', newNetworkName);
          }
        }
      } catch (err) {
        console.error('Error fetching Wi-Fi network name:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchWifiNetworkName();
  }, []);
    
    // Function to send reboot command to Adafruit IO
    const sendRebootCommand = async () => {
      try {F
        const response = await fetch('https://io.adafruit.com/api/v2/RedAsKetchum/feeds/reboot-action/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH',  // Your AIO key
          },
          body: JSON.stringify({
            value: "reboot",  // The value you want to send to the feed
          }),
        });

        const responseData = await response.json();  // Parse the response data
        console.log(responseData);  // Log the full response

        if (response.ok) {
          console.log('Reboot command sent');
        } else {
          console.error('Failed to send reboot command:', responseData);
        }
      } catch (error) {
        console.error('Error sending reboot command:', error);
      }
    };

    // Function to send format command to Adafruit IO
    const sendFormatCommand = async () => {
      try {
        const response = await fetch('https://io.adafruit.com/api/v2/RedAsKetchum/feeds/format-action/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AIO-Key': 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH',
          },
          body: JSON.stringify({
            value: "format",
          }),
        });
  
        const responseData = await response.json();
        console.log(responseData);
  
        if (response.ok) {
          console.log('Format command sent');
        } else {
          console.error('Failed to send format command:', responseData);
        }
      } catch (error) {
        console.error('Error sending format command:', error);
      }
    };

  return (
    <GestureHandlerRootView style={styles.container}>  
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          className="flex-1 absolute top-0 left-0 right-0 bottom-0" 
          resizeMode="cover" 
        />
        {/* Back button and Settings title sharing the same marginTop */}
        <View className="flex-row items-center justify-center px-4 mt-5 relative">
          {/* Back button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="absolute left-0 p-2 ml-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}  // Expands clickable area
          >
            <Icon name="arrow-back" size={35} color="white" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-white text-center">
            Settings
          </Text>
        </View>

        {/* Connected to Network title */}
        <ScrollView contentContainerStyle={{ height: '100%', marginTop: 20 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: 'white', 
            textAlign: 'center', 
            marginTop: 0 
          }}>
            Wi-Fi: {networkName || 'Disconnected'}
           
          </Text>
  
          {/* Sensor Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => router.push('/sensorSettings')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Sensor Settings
            </Text>
          </TouchableOpacity>
  
          {/* Dispenser Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => router.push('/dispenserSettings')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Food Dispenser Settings
            </Text>
          </TouchableOpacity>
  
          {/* LED Settings */}
          <TouchableOpacity style={styles.buttons} onPress={() => router.push('/ledSetting')}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              LED Settings
            </Text>
          </TouchableOpacity>
  
          {/* Reboot */}
          <TouchableOpacity style={[styles.buttons, { borderRadius: 32.5, height: 64, marginTop: 48}]} onPress={sendRebootCommand}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'white' }}>
              Reboot
            </Text>
          </TouchableOpacity>
  
          {/* Format */}
          <TouchableOpacity style={[styles.buttons, { borderRadius: 32.5, height: 64}]} onPress={sendFormatCommand}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>
              Format
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
  
};

export default settings;
