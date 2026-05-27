// 🔥 FORCE FIX FOR IOS + HERMES

import 'react-native-get-random-values';

import { getRandomValues } from 'react-native-get-random-values';

// ensure crypto exists
if (!global.crypto) {
  global.crypto = {};
}

// force assign function
global.crypto.getRandomValues = getRandomValues;

// also patch directly (some libs use this)
global.getRandomValues = getRandomValues;