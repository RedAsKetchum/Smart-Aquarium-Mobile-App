import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

export default function RepeatDay() {
    const navigation = useNavigation();
    const webviewRef = useRef(null);  // Reference for WebView

    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isVideoPaused, setIsVideoPaused] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

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
                    src="https://www.youtube.com/embed/QKSJLZ8p6mQ?controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&enablejsapi=1&disable-related=1&autoplay=1"
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
                <script>
                    var player = document.querySelector('iframe');
                    player.addEventListener('pause', function() {
                        window.ReactNativeWebView.postMessage('paused');
                    });
                    player.addEventListener('play', function() {
                        window.ReactNativeWebView.postMessage('playing');
                    });
                </script>
            </body>
        </html>
    `;

    // Handle video load event
    const handleVideoLoad = () => {
        setIsVideoReady(true); // Set video to ready when it starts loading
    };

    // Handle WebView message (Pause, Play, etc.)
    const handleWebViewMessage = (event) => {
        const message = event.nativeEvent.data;
        if (message === 'paused') {
            setIsVideoPaused(true);  // Video is paused
        } else if (message === 'playing') {
            setIsVideoPaused(false);  // Video is playing
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>  
            <SafeAreaView style={{ flex: 1, backgroundColor: 'primary' }}>
                <ImageBackground source={require('../assets/images/gradient.png')} style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />

                {/* Header with Cancel */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 10, marginBottom: 50 }}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={{
                            position: 'absolute',
                            left: -10,
                            padding: 20, // Increased padding for larger touchable area
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
                <View style={{ width: '95%', aspectRatio: 16/9, overflow: 'hidden', alignSelf: 'center' }}>
                    {!isVideoReady || isVideoPaused ? (
                        <Image
                            source={require('../assets/images/bones.png')} // Custom placeholder image
                            style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 10, objectFit: 'cover' }}
                        />
                    ) : null}

                    <WebView
                        ref={webviewRef}  // Reference to the WebView
                        originWhitelist={['*']}
                        source={{ html: htmlContent }}
                        style={{
                            width: '100%',
                            height: '100%',
                            opacity: isVideoReady && !isVideoPaused ? 1 : 0,
                            zIndex: 0,
                            borderRadius: 8,
                        }}
                        onLoad={handleVideoLoad}
                        onMessage={handleWebViewMessage}
                    />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
