import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export const OfflineView = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.container}>
    <Ionicons name="cloud-offline-outline" size={64} color="#ccc" />
    <Text style={styles.title}>Connection Lost</Text>
    <Text style={styles.text}>Please check your internet settings to continue.</Text>
    <TouchableOpacity style={styles.button} onPress={onRetry}>
      <Text style={styles.buttonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#ffffff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  button: { backgroundColor: '#000', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});