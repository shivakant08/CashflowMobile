import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { APP_CONFIG } from '../constants/AppConfig';

// Get screen dimensions for perfect scaling
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// scale logo based on screen width (30% width)
const LOGO_SCALE = SCREEN_WIDTH * 0.90;

export const LoadingOverlay = () => (
  // We use the brand gradient for the background now, not just solid white
  <LinearGradient 
    colors={['#ffffff', '#ffffff']} // Keep loader white for now; can switch to brand gradient later
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.loaderContainer}
  >
    <View style={styles.brandContainer}>
      {/* 1. Add your Logo Image */}
      <Image
        // Fix: Make sure this path is correct based on your file structure
        source={require('../assets/images/logo.png')} 
        style={styles.logoStyle}
        resizeMode="contain"
      />
      
      {/* 2. Text Brand Name */}
      {/* <Text style={styles.brandTitle}>
        <Text style={styles.ecashText}>e-Cash</Text>
        <Text style={styles.diaryText}>Diary</Text>
      </Text> */}
    </View>

    {/* 3. The subtle loading indicator */}
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="small" color={APP_CONFIG.GRADIENT_COLORS[0]} />
      <Text style={styles.loaderText}>Loading...</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff', // Ensures no flash before gradient loads
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Must be higher than the WebView
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.1, // Pushes logo up slightly
    marginTop: -SCREEN_WIDTH * 0.1
  },
  logoStyle: {
    width: LOGO_SCALE,
    height: LOGO_SCALE,
    marginBottom: 15,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1,
    textTransform: 'lowercase', // Matches the concept text
  },
  ecashText: {
    color: '#333333', // Subtle text for "e"
  },
  diaryText: {
    color: APP_CONFIG.GRADIENT_COLORS[0], // Main brand purple
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 50, // Pushes spinner near the bottom of the screen
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});