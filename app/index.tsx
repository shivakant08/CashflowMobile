import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, BackHandler, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo'; // Ensure this is installed

export default function FullScreenWebView() {
  const webViewRef = useRef<WebView>(null);
  const canGoBack = useRef(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  // 1. Monitor Network Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack.current && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleRetry = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {isConnected ? (
          <WebView
            ref={webViewRef}
            source={{ uri: 'https://ecashdiary.com' }}
            userAgent="CashFlow-Mobile-App-v1"
            domStorageEnabled={true}
            cacheEnabled={true}
            sharedCookiesEnabled={true}
            javaScriptEnabled={true}
            onNavigationStateChange={(navState) => {
              canGoBack.current = navState.canGoBack;
            }}
            // Handles server errors or DNS failures
            renderError={() => <OfflineView onRetry={handleRetry} />}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
          />
        ) : (
          <OfflineView onRetry={handleRetry} />
        )}
      </View>
    </SafeAreaView>
  );
}

// 2. Custom Offline Component
function OfflineView({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineTitle}>Connection Lost</Text>
      <Text style={styles.offlineText}>
        It looks like you're offline. Please check your internet settings.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  offlineTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  offlineText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});