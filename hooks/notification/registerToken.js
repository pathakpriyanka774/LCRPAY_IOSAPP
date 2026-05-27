import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { BASE_URL } from '../../utils/config';

export async function getFcmToken() {
  const m = getMessaging(getApp());
  const status = await requestPermission(m);
  const enabled =
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL;
  if (!enabled) return null;
  return await getToken(m);
}

export function listenTokenRefresh(cb) {
  const m = getMessaging(getApp());
  // returns unsubscribe function
  return onTokenRefresh(m, cb);
}

export async function registerTokenWithBackend(token) {

  

  const access_token = await AsyncStorage.getItem("access_token");
  try {
    const res = await fetch(`${BASE_URL}/notification/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ token, platform: Platform.OS, "app_version": "1.0.0" }),
    });

    console.log("Push Notification1----->",res,access_token)
  } catch (e) {
    console.warn('Failed to register FCM token:', e);
  }
}

