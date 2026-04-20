import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { APP_CONFIG } from '../constants/AppConfig';

export const FloatingBackButton = ({ onPress }: { onPress: () => void }) => (
  <View style={styles.floatingContainer}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={APP_CONFIG.GRADIENT_COLORS}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text style={styles.backText}>Back</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  floatingContainer: { position: 'absolute', bottom: 30, left: 20, zIndex: 10 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16, paddingLeft: 10, paddingVertical: 10,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 4,
  },
  backText: { fontSize: 14, fontWeight: '700', color: '#ffffff', marginLeft: 4, textTransform: 'uppercase' },
});