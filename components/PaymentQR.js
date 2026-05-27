import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Assuming expo is used for icons
import {SafeAreaView} from 'react-native-safe-area-context';

const PaymentQR = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { qrCode } = route.params;

  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation for result screen

  // Fade-in animation for result screen
  useEffect(() => {
    if (paymentResult) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [paymentResult]);

  // WebSocket setup
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          Alert.alert('Authentication Error', 'No token found in storage');
          return;
        }

        const socketUrl = `wss://api.lcrpay.com:8080/recharge/ws/payment?token=${token}`;
        const ws = new WebSocket(socketUrl, [], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ WebSocket connected');
        };

        ws.onmessage = (event) => {
          console.log('📨 WebSocket received:', event.data);
          try {
            const data = JSON.parse(event.data);
            if (data && data.status) {
              setPaymentResult({
                status: data.status,
                txn_id: data.txn_id || null,
                client_txn_id: data.client_txn_id || null,
              });
            }
          } catch (err) {
            console.log('❌ Failed to parse WebSocket message:', err);
            setError('Failed to process payment status.');
          }
        };

        ws.onerror = (error) => {
          console.log('❌ WebSocket error:', error.message);
          setError('Failed to connect to the payment server.');
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket closed');
        };
      } catch (e) {
        console.error('WebSocket setup error:', e);
        setError('An unexpected error occurred.');
      }
    };

    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Error state UI
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Wallet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Payment result UI
  if (paymentResult) {
    const { txn_id, client_txn_id, status } = paymentResult;
    const isSuccess = status === 'success';

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
          <View style={styles.resultCard}>
            <Ionicons
              name={isSuccess ? 'checkmark-circle' : 'close-circle'}
              size={64}
              color={isSuccess ? '#2E7D32' : '#D32F2F'}
            />
            <Text style={isSuccess ? styles.successText : styles.failureText}>
              {isSuccess ? 'Payment Successful 🎉' : 'Payment Failed ❌'}
            </Text>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={styles.value}>{txn_id || 'N/A'}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Client Txn ID:</Text>
              <Text style={styles.value}>{client_txn_id || 'N/A'}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back to Wallet</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // QR code scanning UI
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: qrCode }}
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  webview: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginVertical: 16,
    textAlign: 'center',
  },
  failureText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D32F2F',
    marginVertical: 16,
    textAlign: 'center',
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 12,
    paddingHorizontal: 16,
    flexWrap: 'wrap', // Prevent overflow
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    flexShrink: 0, // Ensure label doesn't shrink
  },
  value: {
    fontSize: 16,
    color: '#212121',
    flex: 1, // Allow value to take remaining space
    textAlign: 'right',
    marginLeft: 8, // Add spacing between label and value
    flexWrap: 'wrap', // Wrap long text
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default PaymentQR;