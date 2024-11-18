import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import TemperatureIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TurbidityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PHIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const AIO_USERNAME = 'RedAsKetchum';
const AIO_KEY = 'aio_FXeu11JxZcmPv3ey6r4twxbIyrfH';
const SENSOR_FEED_KEY = 'notifications';
const SENSOR_FEED_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${SENSOR_FEED_KEY}/data?limit=50`;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${month}.${day} ${formattedHours}:${minutes} ${ampm}`;
};

const RenderNotification = ({ item, onDelete, openSwipeRef }) => {
  const translateX = useRef(new Animated.Value(0)).current; // Animation for swipe
  const panRef = useRef(null);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === 5) {
      // If the swipe is large enough, delete the item
      if (nativeEvent.translationX < -100) {
        onDelete(item.id);
      } else {
        // Reset swipe position
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <View style={{ position: 'relative', marginBottom: 12, borderRadius: 8 }}>
    {/* Background with "Delete" text */}
    <View
      style={{
        position: 'absolute',
        top: '50%',
        right: 16,
        transform: [{ translateY: -12 }], // Center vertically (adjust translateY based on new height)
        backgroundColor: 'red',
        paddingVertical: 8, 
        paddingHorizontal: 15,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        Delete
      </Text>
    </View>
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
          backgroundColor: 'white',
          borderRadius: 8,
          margin: 12,
          shadowOpacity: 0.1,
        }}
      >
        <View>
          {item.value.includes('temperature') && (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formatTimestamp(item.created_at)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <TemperatureIcon name="thermometer" size={18} color="#ff1a1a" />
                <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>{`${item.value}`}</Text>
              </View>
            </View>
          )}

          {item.value.includes('turbidity') && (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formatTimestamp(item.created_at)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <TurbidityIcon name="water" size={18} color="#2489FD" />
                <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>{`${item.value}`}</Text>
              </View>
            </View>
          )}

          {item.value.includes('pH') && (
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formatTimestamp(item.created_at)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
                <PHIcon name="test-tube" size={18} color="#9933ff" />
                <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>{`${item.value}`}</Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
    </View>
  );
};
export default function NotificationPage() {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const openSwipeRef = useRef(null);
  const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState(null); 

  const fetchLatestData = async () => {
    try {
        const response = await fetch(`${SENSOR_FEED_URL}?limit=1`, {
            headers: { 'X-AIO-Key': AIO_KEY },
        });
        const [latestData] = await response.json();

        const latestTimestamp = new Date(latestData.created_at);

        // Check if the fetched timestamp is newer
        if (!lastFetchedTimestamp || latestTimestamp > lastFetchedTimestamp) {
            setLastFetchedTimestamp(latestTimestamp); // Update the timestamp
            fetchNotificationData(); // Fetch the full dataset or handle new data
        }
    } catch (error) {
        console.error('Error fetching latest data:', error);
    }
};

const fetchNotificationData = async () => {
  setLoading(true);
  try {
    const response = await fetch(SENSOR_FEED_URL, {
      headers: {
        'X-AIO-Key': AIO_KEY,
      },
    });
    const data = await response.json();

    const formattedData = data.map((item) => ({
      id: item.id, // Adafruit IO's unique ID for the data point
      value: item.value,
      created_at: item.created_at,
    }));

    setNotificationData(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id) => {
  try {
    // Find the notification by ID
    const notificationToDelete = notificationData.find((item) => item.id === id);
    if (!notificationToDelete) {
      console.error('Notification not found.');
      return;
    }

    const url = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${SENSOR_FEED_KEY}/data/${notificationToDelete.id}`;

    // Send DELETE request
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-AIO-Key': AIO_KEY,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Fetch error details
      throw new Error(`Failed to delete notification: ${response.status} - ${errorDetails}`);
    }

    console.log(`Notification with ID ${notificationToDelete.id} deleted successfully.`);
    setNotificationData((prevData) => prevData.filter((item) => item.id !== id));
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

  useEffect(() => {
    const interval = setInterval(fetchLatestData, 30000);
    fetchNotificationData();
    return () => clearInterval(interval); 
}, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground 
          source={require('../assets/images/gradient.png')} 
          style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginTop: 10, marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', left: 0, padding: 8 }}
          >
            <Icon name="arrow-back" size={35} color="white" />
          </TouchableOpacity>

          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Notifications</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
        ) : (
          <FlatList
            data={notificationData}
            renderItem={({ item }) => <RenderNotification item={item} onDelete={handleDelete} openSwipeRef={openSwipeRef} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}