import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import WheelColorPicker from 'react-native-wheel-color-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Client } from 'paho-mqtt';  // Import Paho MQTT

const AIO_USERNAME = 'jazzfaye7';  // Adafruit IO username
const AIO_KEY = 'aio_XHzM43BcDX46OMZ5ZoG0DYoN6zDr';  // Adafruit IO key
const ESP32_MQTT_TOPIC_COLOR = `${AIO_USERNAME}/feeds/led-control`;  // Define Adafruit IO topic for color
const ESP32_MQTT_TOPIC_BRIGHTNESS = `${AIO_USERNAME}/feeds/led-brightness`;  // Define Adafruit IO topic for brightness

const websocketUrl = 'wss://io.adafruit.com/mqtt';  // WebSocket URL for Adafruit IO

const ColorPickerComponent = () => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('#ff0000');  // Initial color set to red
  const [brightness, setBrightness] = useState(1);  // Initial brightness (1 for full brightness)
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
    // Initialize the MQTT client using Paho
    const client = new Client('io.adafruit.com', 443, 'react-native-mqtt-client');  // Client ID can be any unique string

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Connection lost:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log('Message arrived:', message.payloadString);
    };

    // Connect to Adafruit IO using MQTT over WebSocket
    client.connect({
      useSSL: true,  // For secure WebSocket connections
      userName: AIO_USERNAME,
      password: AIO_KEY,
      onSuccess: () => {
        console.log('Connected to Adafruit IO via Paho MQTT WebSocket');
        setMqttClient(client);
      },
      onFailure: (err) => {
        console.error('Connection error:', err);
      },
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  const sendColorToESP32 = (color, brightness) => {
    const rgb = hexToRgb(color);
    if (rgb && mqttClient) {
      const { r, g, b } = rgb;

      // Format the color message as "r,g,b"
      const colorMessage = `${Math.round(r * brightness)},${Math.round(g * brightness)},${Math.round(b * brightness)}`;

      // Publish the color data to Adafruit IO
      const message = new Client.Message(colorMessage);  // Corrected to use Client.Message
      message.destinationName = ESP32_MQTT_TOPIC_COLOR;
      mqttClient.send(message);

      console.log(`Color sent: ${colorMessage}`);
    }
  };

  const sendBrightnessToESP32 = (brightness) => {
    if (mqttClient) {
      // Publish the brightness value to Adafruit IO
      const message = new Client.Message(brightness.toString());  // Corrected to use Client.Message
      message.destinationName = ESP32_MQTT_TOPIC_BRIGHTNESS;
      mqttClient.send(message);

      console.log(`Brightness sent: ${brightness}`);
    }
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <ImageBackground source={require('../assets/images/gradient.png')} style={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
              <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>LED Setting</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <WheelColorPicker
              initialColor={selectedColor}
              onColorChange={color => {
                setSelectedColor(color);
                sendColorToESP32(color, brightness);
              }}
              style={{ width: 300, height: 300 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
              <TouchableOpacity onPress={() => {
                const newBrightness = Math.max(0, brightness - 0.1);
                setBrightness(newBrightness);
                sendColorToESP32(selectedColor, newBrightness);
                sendBrightnessToESP32(newBrightness);
              }}>
                <Icon name="sunny" size={30} color="#000" />
              </TouchableOpacity>
              <Slider
                style={{ width: 200, marginHorizontal: 10 }}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={brightness}
                onValueChange={(value) => {
                  setBrightness(value);
                  sendColorToESP32(selectedColor, value);
                  sendBrightnessToESP32(value);
                }}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#FFFFFF"
              />
              <TouchableOpacity onPress={() => {
                const newBrightness = Math.min(1, brightness + 0.1);
                setBrightness(newBrightness);
                sendColorToESP32(selectedColor, newBrightness);
                sendBrightnessToESP32(newBrightness);
              }}>
                <Icon name="sunny" size={40} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ColorPickerComponent;
