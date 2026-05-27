import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import Theme from '../Theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const FORM_URL = 'https://forms.gle/44kUCp69UVZjUHLHA';

const Educations = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef(null);

  const onClose = useCallback(() => {
    // If webview can go back, go back inside webview; otherwise navigate back
    if (canGoBack && webviewRef.current?.goBack) {
      webviewRef.current.goBack();
      return;
    }
    navigation.goBack?.();
  }, [navigation, canGoBack]);

  const handleShouldStartLoadWithRequest = useCallback((request) => {
    // allow all requests but if the domain is external we still open in webview
    // return true to load in webview
    return true;
  }, []);

  const openInBrowser = async () => {
    try {
      await Linking.openURL(FORM_URL);
    } catch (e) {
      setError(true);
    }
  };

  return (
    <SafeAreaView style={styles.wrap}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Close"
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Education Form</Text>
        <TouchableOpacity
          style={styles.headerRight}
          onPress={openInBrowser}
          accessibilityLabel="Open in browser"
        >
          <MaterialCommunityIcons name="open-in-new" size={20} color="#ffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Failed to load the form.</Text>
            <TouchableOpacity onPress={openInBrowser} style={styles.browserButton}>
              <Text style={styles.browserButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webviewRef}
            source={{uri: FORM_URL}}
            onLoadStart={() => {
              setLoading(true);
              setError(false);
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onNavigationStateChange={(navState) => {
              setCanGoBack(!!navState.canGoBack);
            }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Theme.colors.primary} size="large" />
                <Text style={styles.loadingText}>Loading form...</Text>
              </View>
            )}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            style={styles.webview}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrap: {flex: 1, backgroundColor:Theme.colors.primary},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: Theme.colors.primary,
  },
  headerLeft: {width: 44, alignItems: 'flex-start', justifyContent: 'center'},
  headerRight: {width: 44, alignItems: 'flex-end', justifyContent: 'center'},
  headerTitle: {flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#fff'},
  container: {flex: 1, backgroundColor: '#fff'},
  webview: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 12, color: '#666'},
  errorBox: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  errorText: {fontSize: 16, color: '#c0392b', marginBottom: 12},
  browserButton: {backgroundColor: Theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8},
  browserButtonText: {color: '#fff', fontWeight: '700'},
});

export default Educations;
