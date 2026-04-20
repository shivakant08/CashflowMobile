import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, BackHandler, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';

// Updated imports based on your structure
import { APP_CONFIG } from '../constants/AppConfig';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { FloatingBackButton } from '../components/FloatingBackButton';
import { OfflineView } from '../components/OfflineView';

export default function FullScreenWebView() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(s => setIsConnected(s.isConnected));
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };

      // 1. Capture the subscription object
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // 2. Call .remove() on that subscription
      return () => subscription.remove(); 
    }, [canGoBack])
  );

  const reload = () => webViewRef.current?.reload();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" translucent={true} backgroundColor={APP_CONFIG.STATUS_BAR_COLOR} />
      <View style={styles.container}>
        {isConnected ? (
          <View style={styles.flexOne}>
            <WebView
              ref={webViewRef}
              source={{ uri: APP_CONFIG.URI }}
              userAgent={APP_CONFIG.USER_AGENT}
              onNavigationStateChange={nav => setCanGoBack(nav.canGoBack)}
              startInLoadingState={true}
              
              domStorageEnabled={true}
              javaScriptEnabled={true}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              renderError={() => <OfflineView onRetry={reload} />}
            />
            {/* {isLoading && <LoadingOverlay />} */}
          </View>
        ) : (
          <OfflineView onRetry={reload} />
        )}

        {canGoBack && isConnected && (
          <FloatingBackButton onPress={() => webViewRef.current?.goBack()} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, position: 'relative' },
  flexOne: { flex: 1 }
});