import React, { useState, useRef, useEffect } from 'react';
import { Text, View, ImageBackground, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

export default function StreamScreen() {
    const navigation = useNavigation();
    const webviewRef = useRef(null);

    const [isVideoReady, setIsVideoReady] = useState(false);
    const [streamStats, setStreamStats] = useState({
        resolution: '1920x1080', // API Placeholder
        fps: 30,                 // API Placeholder
        bitrate: '3500 kbps',    // API Placeholder
    });

    const htmlContent = ` 
        <html>
            <head>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                    }
                    iframe {
                        display: block;
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <iframe 
                    id="video-player"
                    src="https://www.youtube.com/embed/h4tT30Et_IE?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=1&disable-related=1&autoplay=1"
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
            </body>
        </html>
    `;

    const handleVideoLoad = () => {
        setIsVideoReady(true); // Set video to ready when it starts loading
    };

    // Sample function to simulate fetching stream stats
    useEffect(() => {
        const fetchStreamStats = () => {
            // Update this logic with actual API calls if available
            setStreamStats({
                resolution: '1920x1080',
                fps: 30,
                bitrate: '4000 kbps',
            });
        };

        // Call initially, and set an interval to fetch updated stats every few seconds
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

                {/* WebView Container */}
                <View style={{ width: '95%', aspectRatio: 16/9, overflow: 'hidden', alignSelf: 'center', position: 'relative' }}>
                    <WebView
                        ref={webviewRef}
                        originWhitelist={['*']}
                        source={{ html: htmlContent }}
                        style={{
                            width: '100%',
                            height: '100%',
                            opacity: isVideoReady ? 1 : 0,
                            zIndex: 2,
                            borderRadius: 8,
                        }}
                        onLoad={handleVideoLoad}
                    />
                </View>

                {/* Stream Stats Section */}
                <View style={{ padding: 20, marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Azul Cam Stats:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Resolution Box */}
                        <View style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  // Semi-transparent grey
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            minWidth: 90, // Minimum width for a uniform button-like appearance
                        }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Resolution</Text>
                            <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>{streamStats.resolution}</Text>
                        </View>

                        {/* FPS Box */}
                        <View style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  // Semi-transparent grey
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
                            backgroundColor: 'rgba(128, 128, 128, 0.3)',  // Semi-transparent grey
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
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
