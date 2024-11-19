import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import TemperatureIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import TurbidityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PHIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const AIO_USERNAME = 'RedAsKetchum';
const AIO_KEY = 'aio_Ecnw98E4ugDJ18vonFBSkLymwvwj';
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
  const swipeableRef = useRef(null);

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => {
        onDelete(item.id);
        swipeableRef.current.close(); // Close the swipe after deleting
      }}
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: 100,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => {
        // Close any other open swipeable item
        if (openSwipeRef.current && openSwipeRef.current !== swipeableRef.current) {
          openSwipeRef.current.close();
        }
        openSwipeRef.current = swipeableRef.current;
      }}
      onSwipeableClose={() => {
        if (openSwipeRef.current === swipeableRef.current) {
          openSwipeRef.current = null;
        }
      }}
    >
      <View>
        {item.value.includes("temperature") && (
          <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, margin: 12, shadowOpacity: 0.1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formatTimestamp(item.created_at)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
              <TemperatureIcon name="thermometer" size={18} color="#ff1a1a" />
              <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>{`${item.value}`}</Text>
            </View>
          </View>
        )}

        {item.value.includes("turbidity") && (
          <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, margin: 12, shadowOpacity: 0.1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'black' }}>{formatTimestamp(item.created_at)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
              <TurbidityIcon name="water" size={18} color="#2489FD" />
              <Text style={{ color: 'black', fontSize: 16, marginLeft: 8 }}>{`${item.value}`}</Text>
            </View>
          </View>
        )}

        {item.value.includes("pH") && (
          <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, margin: 12, shadowOpacity: 0.1, flexDirection: 'row', alignItems: 'center' }}>
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
    </Swipeable>
  );
};

export default function NotificationPage() {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const openSwipeRef = useRef(null);

  const fetchNotificationData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SENSOR_FEED_URL, {
        headers: {
          'X-AIO-Key': AIO_KEY,
        },
      });
      const data = await response.json();

      const formattedData = data.map((item, index) => ({
        id: index, // Unique ID for each item
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

  const handleDelete = (id) => {
    setNotificationData((prevData) => prevData.filter((item) => item.id !== id));
  };

  useEffect(() => {
    fetchNotificationData();
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
