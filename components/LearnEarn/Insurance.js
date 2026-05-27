import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Theme from '../../components/Theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#5F259F',      // LCR PAY purple
  bg: '#F6F7FB',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
};

const Insurance = () => {
  // search is removed for a minimal iconic design
  const [notified, setNotified] = useState(false);
  const [loading, setLoading] = useState(false);
  const notifyAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const handleNotify = () => {
    if (notified) return;
    setLoading(true);
    // fake a network request for UX
    setTimeout(() => {
      setLoading(false);
      setNotified(true);
      Animated.timing(notifyAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />

    

      {/* Main content */}
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="health-and-safety" size={44} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.title}>Insurance</Text>
        <Text style={styles.subtitle}>
          We’re expanding our network to support Insurance premium payments. We’ll notify you when the service is live.
        </Text>

        <View style={styles.actionsRowCentered}>
          <TouchableOpacity
            style={[styles.primaryBtn, notified && styles.primaryBtnDisabled]}
            onPress={handleNotify}
            disabled={notified || loading}
            accessibilityLabel="Notify me when available"
          >
            {loading ? (
              <MaterialIcons name="hourglass-top" size={18} color={Theme.colors.HeaderTint} />
            ) : (
              <Text style={styles.primaryBtnText}>{notified ? 'Requested' : 'Notify me'}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryLink}
            onPress={() => navigation.navigate('AllServices')}
            accessibilityLabel="Explore other services"
          >
            <Text style={styles.secondaryLinkText}>Explore other services</Text>
          </TouchableOpacity>
        </View>

        {notified && (
          <Animated.View style={[styles.notifyBox, { opacity: notifyAnim }] }>
            <MaterialIcons name="check-circle" size={18} color={Theme.colors.success} />
            <Text style={styles.notifyText}>We will notify you when Insurance is available</Text>
          </Animated.View>
        )}

        <TouchableOpacity style={styles.contactRow} onPress={() => navigation.navigate('ContactUs')}>
          <Text style={styles.contactText}>Contact Support if you need this urgently</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Insurance;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
 
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  // image removed in favor of a centered icon
  iconWrap: {
    marginBottom: 18,
    alignItems: 'center',
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  actionsRowCentered: { width: '100%', marginTop: 14, flexDirection: 'column', alignItems: 'center' },
  primaryBtn: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '72%',
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: Theme.colors.HeaderTint, fontWeight: '700', fontSize: 15 },
  secondaryLink: {
    marginTop: 12,
    paddingVertical: 8,
  },
  secondaryLinkText: { color: Theme.colors.primary, fontWeight: '700' },
  notifyBox: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  notifyText: { marginLeft: 8, color: Theme.colors.success, fontWeight: '700' },
  contactRow: { marginTop: 22 },
  contactText: { color: COLORS.subtext, textDecorationLine: 'underline' },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '86%',
    marginBottom: 10,
  },
});
