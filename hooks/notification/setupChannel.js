// hooks/notification/setupChannel.js
import * as Notifications from 'expo-notifications';
// import notifee, { AndroidImportance } from '@notifee/react-native';
import NotificationSounds from 'react-native-notification-sounds';
import { Platform } from 'react-native';

// Single source of truth for the channel id (used across Expo + Notifee)
export const NOTIFICATION_CHANNEL_ID = 'alerts-sound';

let cachedSystemSoundUrl;

export async function getSystemNotificationSoundUrl() {
  if (cachedSystemSoundUrl !== undefined) return cachedSystemSoundUrl;
  if (Platform.OS !== 'android') {
    cachedSystemSoundUrl = null;
    return cachedSystemSoundUrl;
  }

  try {
    const sounds = await NotificationSounds.getNotifications('notification');
    const withUrl = Array.isArray(sounds)
      ? sounds.find(item => item?.url) || sounds[0]
      : null;

    cachedSystemSoundUrl = withUrl?.url || null;
  } catch (err) {
    console.warn('[notifications] Failed to load system sounds:', err?.message || err);
    cachedSystemSoundUrl = null;
  }

  return cachedSystemSoundUrl;
}

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;

  const systemSoundUrl = await getSystemNotificationSoundUrl();

  // Temporarily disabled Notifee functionality
  // await notifee.createChannel({
  //   id: NOTIFICATION_CHANNEL_ID,
  //   name: 'Alerts with sound',
  //   importance: AndroidImportance.HIGH,
  //   sound: systemSoundUrl || 'default',
  //   vibration: true,
  // });

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: 'Alerts with sound',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
    showBadge: true,
    enableLights: true,
    enableVibrate: true,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.NOTIFICATION,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });
}
