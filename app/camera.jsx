import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import CustomButton from '../components/CustomButton';

export default function StreamScreen() {
    const navigation = useNavigation();
    const [streamStats, setStreamStats] = useState({
        resolution: '1920x1080', // API Placeholder
        fps: 30,                 // API Placeholder
        bitrate: '3500 kbps',    // API Placeholder
    });
    const [showYouTubeEmbed, setShowYouTubeEmbed] = useState(true); // Track which view is shown

    useEffect(() => {
        const fetchStreamStats = () => {
            setStreamStats({
                resolution: '1920x1080',
                fps: 30,
                bitrate: '8000 kbps',
            });
        };

        fetchStreamStats();
        const interval = setInterval(fetchStreamStats, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'primary' }}>
                {/* Gradient Background */}
                <ImageBackground 
                    source={require('../assets/images/gradient.png')} 
                    style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
                    resizeMode="cover" 
                />
                
                {/* Header with Back Button */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 10, marginBottom: 40 }}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={{
                            position: 'absolute',
                            left: -10,
                            padding: 20,
                            zIndex: 10,
                        }}
                    >
                        <Icon name="arrow-back" size={35} color="white" />
                    </TouchableOpacity>

                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                        Camera
                    </Text>
                </View>

                {/* Embedded YouTube Stream or WebView */}
                <View style={{ height: 200, borderRadius: 10, overflow: 'hidden', marginHorizontal: 20 }}>
                    {showYouTubeEmbed ? (
                        <WebView 
                            source={{ uri: 'https://www.youtube.com/embed/s4zwI-HIEyk?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=1&disable-related=1&autoplay=1' }}
                            style={{ flex: 1 }}
                            allowsFullscreenVideo
                        />
                    ) : (
                        <WebView 
                            source={{ uri: 'https://www.youtube.com/@MM.MischiefManaged/streams' }}
                            style={{ flex: 1 }}
                            allowsFullscreenVideo
                        />
                    )}
                </View>

                {/* Stream Stats Section */}
                <View style={{ padding: 20, marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Stream Stats:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Resolution Box */}
                        <View style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            minWidth: 90,
                        }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Resolution</Text>
                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>{streamStats.resolution}</Text>
                        </View>

                        {/* FPS Box */}
                        <View style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            minWidth: 90,
                        }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>FPS</Text>
                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>{streamStats.fps}</Text>
                        </View>

                        {/* Bitrate Box */}
                        <View style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            minWidth: 90,
                        }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Bitrate</Text>
                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>{streamStats.bitrate}</Text>
                        </View>
                    </View>

                    {/* Button to Switch Views */}
                    <CustomButton
                        title={showYouTubeEmbed ? 'Switch Stream' : 'Switch Stream'}
                        handlePress={() => setShowYouTubeEmbed(!showYouTubeEmbed)}
                        containerStyles="py-6 px-40 rounded-lg mt-6 mx-auto"
                    />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
