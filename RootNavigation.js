import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const PENDING_NAV_KEY = 'pending_navigation_target';

export async function setPendingNavigation(target) {
  try {
    if (!target) return;
    await AsyncStorage.setItem(PENDING_NAV_KEY, String(target));
  } catch {}
}

export async function consumePendingNavigation() {
  try {
    const target = await AsyncStorage.getItem(PENDING_NAV_KEY);
    if (!target) return null;
    await AsyncStorage.removeItem(PENDING_NAV_KEY);
    return target;
  } catch {
    return null;
  }
}

export async function navigateToNotification() {
  try {
    if (navigationRef.isReady()) {
      navigationRef.navigate('NotificationScreen');
      return;
    }
    await setPendingNavigation('NotificationScreen');
  } catch {
    await setPendingNavigation('NotificationScreen');
  }
}
