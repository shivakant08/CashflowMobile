import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, BackHandler, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'

export default function FullScreenWebView() {
  const webViewRef = useRef<WebView>(null);

  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Monitor Network Connection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // 2. Handle Android Hardware Back Button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [canGoBack])
  );

  const handleManualBack = () => {
    if (webViewRef.current) webViewRef.current.goBack();
  };

  const handleRetry = () => {
    if (webViewRef.current) webViewRef.current.reload();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" backgroundColor="#ffffff" />

      <View style={styles.container}>
        {/* WebView Content */}
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
              setCanGoBack(navState.canGoBack);
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            renderError={() => <OfflineView onRetry={handleRetry} />}
          />
        ) : (
          <OfflineView onRetry={handleRetry} />
        )}

        {/* 3. Floating Back Button (Bottom Right FAB Style) */}
        {canGoBack && isConnected && (
          <View style={styles.floatingHeader}>
            <TouchableOpacity
              onPress={handleManualBack}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#7f00ff', '#e100ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backButton}
              >

                <Ionicons name="arrow-back" size={24} color="#ffffff" />
                <Text style={styles.backText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Custom Offline Component
function OfflineView({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.offlineContainer}>
      <Ionicons name="cloud-offline-outline" size={64} color="#ccc" />
      <Text style={styles.offlineTitle}>Connection Lost</Text>
      <Text style={styles.offlineText}>
        Please check your internet settings to continue managing your cash flow.
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
    backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loaderText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  floatingHeader: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C5CE7',
    paddingRight: 16,
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 4,
    textTransform: 'uppercase',
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
    marginTop: 20,
    marginBottom: 10
  },
  offlineText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
});