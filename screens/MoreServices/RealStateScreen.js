import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';

const COLORS = {
  primary: '#5F259F',
  bg: '#F6F7FB',
  white: '#FFFFFF',
  text: '#111827',
  border: '#E5E7EB',
};

const WEB_URL =
  'https://learn.estatevisionarieshub.com/web/checkout/679279093189bbfbe80aa056?affiliate=68ba89ef56f8c5a6153550b7';

const RealStateScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Real Estate
        </Text>

        {/* Spacer to balance back icon */}
        <View style={styles.iconBtn} />
      </View>

      {/* WebView */}
      <View style={styles.webContainer}>
        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}
        <WebView
          source={{ uri: WEB_URL }}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled
          allowsInlineMediaPlayback
          originWhitelist={['*']}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default RealStateScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center' },
  webContainer: { flex: 1, backgroundColor: COLORS.bg },
  loader: { position: 'absolute', top: '45%', left: 0, right: 0 },
});
