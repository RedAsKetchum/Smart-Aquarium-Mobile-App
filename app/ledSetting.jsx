import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import WheelColorPicker from 'react-native-wheel-color-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Client, Message } from 'paho-mqtt';
import { styles } from './AppStyles';  

const AIO_USERNAME = 'RedAsKetchum';  // Adafruit IO username
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';  // Adafruit IO key
const LED_CONTROL_FEED = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/led-control/data`;  // HTTPS Adafruit IO feed for color and brightness
const ESP32_MQTT_TOPIC_COLOR = `${AIO_USERNAME}/feeds/led-control`;  // Define Adafruit IO topic for color

const ColorPickerComponent = () => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('#00ff00');  // Default to green (RGB: 0, 255, 0)
  const [brightness, setBrightness] = useState(1);  // Initial brightness (1 for full brightness)
  const [mqttClient, setMqttClient] = useState(null);

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
        if (data.length > 0) {
          const [r, g, b, brightnessValue] = data[0].value.split(',');  
          setSelectedColor(rgbToHex(Number(r), Number(g), Number(b)));
          setBrightness(Number(brightnessValue));
          sendColorAndBrightnessToESP32(selectedColor, Number(brightnessValue));
        }
      } catch (error) {
        console.error("Error fetching saved settings: ", error.message || error);
      }
    };

    fetchSavedSettings();

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
        setMqttClient(client);
        sendColorAndBrightnessToESP32('#00ff00', 1);
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
    const rgb = hexToRgb(color);
    if (rgb && mqttClient) {
      const { r, g, b } = rgb;
      const adjustedR = Math.round(r * brightness);
      const adjustedG = Math.round(g * brightness);
      const adjustedB = Math.round(b * brightness);

      const controlMessage = `${adjustedR},${adjustedG},${adjustedB},${brightness}`;
      const message = new Message(controlMessage);
      message.destinationName = ESP32_MQTT_TOPIC_COLOR;
      mqttClient.send(message);
      console.log(`Color and brightness sent: ${controlMessage}`);
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return { r, g, b };
  };

  const rgbToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  const saveToAdafruitIO = async (color, brightness) => {
    const rgb = hexToRgb(color);
    const controlMessage = `${rgb.r},${rgb.g},${rgb.b},${brightness}`;
    try {
      await fetch(LED_CONTROL_FEED, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AIO-Key': AIO_KEY,
        },
        body: JSON.stringify({ value: controlMessage }),
      });
      console.log(`Color and brightness saved to Adafruit IO: ${controlMessage}`);
    } catch (error) {
      console.error("Error saving to Adafruit IO: ", error.message || error);
    }
  };

  const resetToDefault = () => {
    const defaultColor = '#00ff00';  
    const defaultBrightness = 1;
    setSelectedColor(defaultColor);
    setBrightness(defaultBrightness);
    sendColorAndBrightnessToESP32(defaultColor, defaultBrightness);
    saveToAdafruitIO(defaultColor, defaultBrightness);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView className="bg-primary h-full">
        <ImageBackground source={require('../assets/images/gradient.png')} className="flex-1 absolute top-0 left-0 right-0 bottom-0" resizeMode="cover"></ImageBackground>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 10}}>
          <TouchableOpacity onPress={() => router.back()} style={{padding: 10, marginLeft: 10}}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveToAdafruitIO(selectedColor, brightness)} style={{padding: 10, marginRight: 18}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, marginTop: 20}}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>LED Setting</Text>
        </View>
        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
          <WheelColorPicker
            color={selectedColor}
            onColorChange={color => {
              setSelectedColor(color);
              sendColorAndBrightnessToESP32(color, brightness);
            }}
            style={{width: 380, height: 400}}
            sliderSize={35}
            sliderHidden={true}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, width: 380}}>
            <TouchableOpacity onPress={() => {
              const newBrightness = Math.max(0, brightness - 0.1);
              setBrightness(newBrightness);
              sendColorAndBrightnessToESP32(selectedColor, newBrightness);
            }}>
              <Icon name="sunny" size={30} color="#000" />
            </TouchableOpacity>
            <View style={{position: 'relative', flex: 1, height: 40, justifyContent: 'center'}}>
              <Slider
                style={{width: '100%'}}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={brightness}
                onValueChange={(value) => {
                  setBrightness(value);
                  sendColorAndBrightnessToESP32(selectedColor, value);
                }}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#FFFFFF"
              />
            </View>
            <TouchableOpacity onPress={() => {
              const newBrightness = Math.min(1, brightness + 0.1);
              setBrightness(newBrightness);
              sendColorAndBrightnessToESP32(selectedColor, newBrightness);
            }}>
              <Icon name="sunny" size={40} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[styles.buttons, { borderRadius: 30, height: 65, marginTop: 50}]} onPress={resetToDefault}>
          <Text style={{ fontSize: 19, fontWeight: 'bold', color: 'red' }}>Reset to default</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ColorPickerComponent;
