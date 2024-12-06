import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Client, Message } from 'paho-mqtt';
import { styles } from './AppStyles';  
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const AIO_USERNAME = 'RedAsKetchum';  
const AIO_KEY = 'aio_Ecnw98E4ugDJ18vonFBSkLymwvwj'; 
const LED_CONTROL_FEED = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/led-control/data`;  
const ESP32_MQTT_TOPIC_COLOR = `${AIO_USERNAME}/feeds/led-control`;  

const colorSwatches = [];
const steps = [0, 64, 128, 192, 255]; 

steps.forEach((r) => {
  steps.forEach((g) => {
    steps.forEach((b) => {
      colorSwatches.push(`rgb(${r}, ${g}, ${b})`);
    });
  });
});

const ColorPickerComponent = () => {
  const navigation = useNavigation(); 
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('#00ff00');  
  const [brightness, setBrightness] = useState(1); 
  const [mqttClient, setMqttClient] = useState(null);
  const [initialColor, setInitialColor] = useState('#00ff00'); 
  const [initialBrightness, setInitialBrightness] = useState(1); 
  const [isSaved, setIsSaved] = useState(true); 
  const [isLedOn, setIsLedOn] = useState(true); 
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const colorSwatches = [
    // Whites, Grays, and Blacks
    '#FFFFFF',
    '#E0E0E0',
    '#C0C0C0',
    '#A0A0A0',
    '#808080',
    '#606060',
    '#404040',
    '#202020',
    '#000000',
  
    // Blues
    '#A2CBEA',
    '#94C1EC',
    '#88CCDD',
    '#6AB4C8',
    '#2883A4',
    '#2880B9',
    '#28B6D8',
    '#28547C',
    '#004376',
    '#003E6A',
  
    // Purples
    '#8496C8',
    '#C1A0FF',
    '#8463A7',
    '#7277DA',
    '#B34FB3',
    '#844486',
  
    // Reds
    '#FF0000',
    '#FF0038',
    '#A31F44',
    '#D12D25',
    '#FF3333',
    '#A83462',
  
    // Oranges
    '#FE6600',
    '#FF6600',
    '#E3691D',
    '#FF9966',
    '#FFB000',
  
    // Yellows
    '#F9E71D',
    '#FFD700',
    '#FFFF00',
    '#F5A721',
    '#FFFFCC',
    '#FFFFE0',
  
    // Greens
    '#BCE228',
    '#C1EA7E',
    '#88C86E',
    '#00ff00',
    '#6BAA5C',
    '#6E9C60',
    '#39A93B',
  
    // Teals and Aquas
    '#28976F',
    '#66FFCC',
    '#99FFCC',
    '#99FFFF',
    '#66FFFF',
    '#CCFFFF',
    '#CCF0E1',
  
    // Pinks
    '#FF4DA6',
    '#FFCC99',
  
    // Other Pastels and Light Shades
    '#DAE7E7',
    '#E5FFCC',
    '#CCFFCC',
    
    '#FFD8E4', 
    '#B0E0E6' 
  ];
  
  // Function to convert HEX to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return { r, g, b };
  };

  // Function to convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

    // Define handleSwatchPress to handle color selection
  const handleSwatchPress = (color) => {
    setSelectedColor(color);
    sendColorAndBrightnessToESP32(color, brightness);
    setIsSaved(false); // Mark as unsaved when color is changed
  };

  useEffect(() => {
    const fetchSavedSettings = async () => {
      try {
        const response = await fetch(LED_CONTROL_FEED, {
          method: 'GET',
          headers: {
            'X-AIO-Key': AIO_KEY,
          },
        });
        const data = await response.json();
  
        // Find the first entry with "SAVED" in its value
        const savedEntry = data.find((item) => item.value.includes('SAVED'));
  
        if (savedEntry) {
          console.log("Fetched SAVED data from Adafruit IO:", savedEntry.value);
          console.log("Selected color updated to:", selectedColor);
  
          // Extract RGB and brightness values from the entry
          const [r, g, b, brightnessValue] = savedEntry.value.split(',');
          const savedColor = rgbToHex(Number(r), Number(g), Number(b));
          const savedBrightness = Number(brightnessValue);
  
          // Update the state with fetched values
          setSelectedColor(savedColor);
          setBrightness(savedBrightness);
          setIsLedOn(savedBrightness > 0);
          setInitialColor(savedColor);
          setInitialBrightness(savedBrightness);
          setIsSaved(true); // Mark as saved
          await saveToAdafruitIO(savedColor, savedBrightness);
        } else {
          console.log("No SAVED data found, using default values.");
          setSelectedColor('#00ff00'); // Default color
          setBrightness(1); // Default brightness
          setIsLedOn(true); // Default LED state
        }
      } catch (error) {F
        console.error("Error fetching saved settings: ", error.message || error);
        // Handle error by setting defaults
        setSelectedColor('#00ff00'); // Default color
        setBrightness(1); // Default brightness
        setIsLedOn(true); // Default LED state
      } finally {
        setIsInitialLoad(false); // Mark initial load as complete
      }
    };
  
    const client = new Client('wss://io.adafruit.com/mqtt', `mqtt-client-${Date.now()}`);
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection lost:', responseObject.errorMessage);
      }
    };
  
    client.onMessageArrived = (message) => {
      console.log('Message arrived:', message.payloadString);
    };
  
    client.connect({
      useSSL: true,
      userName: AIO_USERNAME,
      password: AIO_KEY,
      onSuccess: () => {
        console.log('Connected to Adafruit IO via MQTT');
        fetchSavedSettings(); // Fetch saved settings after connection
      },
      onFailure: (err) => {
        console.error('MQTT connection error:', err.message || err);
      },
    });
  
    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);
  
  const sendColorAndBrightnessToESP32 = (color, brightness) => {
    if (isInitialLoad || !mqttClient) return; // Ensure MQTT client is connected and not during initial load
  
    const rgb = hexToRgb(color);
    if (rgb) {
      const { r, g, b } = rgb;
      const adjustedR = Math.round(r * brightness);
      const adjustedG = Math.round(g * brightness);
      const adjustedB = Math.round(b * brightness);
  
      const controlMessage = `${adjustedR},${adjustedG},${adjustedB},${brightness}`;
      const message = new Message(controlMessage);
      message.destinationName = ESP32_MQTT_TOPIC_COLOR;
      mqttClient.send(message);
      console.log(`Color and brightness sent: ${controlMessage}`);
      setIsLedOn(brightness > 0);
    }
  };
  
  
  const saveToAdafruitIO = async (color, brightness) => {
    const rgb = hexToRgb(color);
    const controlMessage = `${rgb.r},${rgb.g},${rgb.b},${brightness},SAVED`;  // Add "SAVED" as an indicator
    try {
      await fetch(LED_CONTROL_FEED, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AIO-Key': AIO_KEY,
        },
        body: JSON.stringify({ value: controlMessage }),
      });
      console.log(`Color and brightness saved to Adafruit IO with indicator: ${controlMessage}`);

      // Mark the settings as saved
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving to Adafruit IO: ", error.message || error);
    }
  };

  const resetToDefault = () => {
    const defaultColor = '#00ff00';  
    const defaultBrightness = 1;
    setSelectedColor(defaultColor);
    setBrightness(defaultBrightness);
    setIsLedOn(true);
    sendColorAndBrightnessToESP32(defaultColor, defaultBrightness);
    saveToAdafruitIO(defaultColor, defaultBrightness);
  };

  const handleBackPress = () => {
    if (!isSaved) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to discard them?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            onPress: () => {
              // Revert to the initial values if user chooses to discard changes
              setSelectedColor(initialColor);
              setBrightness(initialBrightness);
              setIsLedOn(initialBrightness > 0);
              navigation.goBack();
            },
            style: "destructive",
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover" />
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
  {/* Back Button */}
  <TouchableOpacity onPress={handleBackPress} style={{ padding: 10 }}>
    <Icon name="arrow-back" size={35} color="white" />
  </TouchableOpacity>

  {/* Centered LED Setting */}
  <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>LED Setting</Text>

  {/* Save Button */}
  <TouchableOpacity onPress={() => saveToAdafruitIO(selectedColor, brightness)} style={{ padding: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Save</Text>
  </TouchableOpacity>
</View>

  
        {/* Swatches */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
          {colorSwatches.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => handleSwatchPress(color)}
              style={{
                width: 40,
                height: 40,
                backgroundColor: color,
                margin: 2,
                borderColor: selectedColor === color ? 'white' : 'transparent',
                borderWidth: 2,
              }}
            />
          ))}
        </View>
  
        {/* Brightness Slider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
          <TouchableOpacity onPress={() => {
            const newBrightness = Math.max(0, brightness - 0.1);
            setBrightness(newBrightness);
            sendColorAndBrightnessToESP32(selectedColor, newBrightness);
            setIsSaved(false);
          }}>
            <Icon name="sunny" size={30} color="#000" />
          </TouchableOpacity>
          <View style={{ position: 'relative', flex: 1, height: 40, justifyContent: 'center'}}>
            <Slider
              style={{ width: '100%' }}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={brightness}
              onValueChange={(value) => {
                setBrightness(value);
                sendColorAndBrightnessToESP32(selectedColor, value);
                setIsLedOn(value > 0);
                setIsSaved(false);
              }}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#FFFFFF"
            />
          </View>
          <TouchableOpacity onPress={() => {
            const newBrightness = Math.min(1, brightness + 0.1);
            setBrightness(newBrightness);
            sendColorAndBrightnessToESP32(selectedColor, newBrightness);
            setIsSaved(false);
          }}>
            <Icon name="sunny" size={40} color="#000" />
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65, marginTop: 50 }]} onPress={resetToDefault}>
          <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Reset to default</Text>
        </TouchableOpacity>
        
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default ColorPickerComponent;
