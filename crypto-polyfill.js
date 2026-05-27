// Crypto polyfill - must be loaded before anything else
//import 'react-native-get-random-values';
import { Buffer } from "buffer";
global.Buffer = Buffer;

// Robust crypto polyfill setup with multiple fallbacks
try {
  const cryptoPolyfill = require('react-native-get-random-values');
  
  // Set up global crypto object
  if (!global.crypto) {
    global.crypto = {};
  }
  
  // Try different ways to get getRandomValues
  if (typeof cryptoPolyfill === 'function') {
    global.crypto.getRandomValues = cryptoPolyfill;
  } else if (cryptoPolyfill.getRandomValues && typeof cryptoPolyfill.getRandomValues === 'function') {
    global.crypto.getRandomValues = cryptoPolyfill.getRandomValues;
  } else if (cryptoPolyfill.default && typeof cryptoPolyfill.default === 'function') {
    global.crypto.getRandomValues = cryptoPolyfill.default;
  } else if (cryptoPolyfill.default && cryptoPolyfill.default.getRandomValues) {
    global.crypto.getRandomValues = cryptoPolyfill.default.getRandomValues;
  } else {
    // Last resort - create a simple fallback
    global.crypto.getRandomValues = function(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }
} catch (error) {
  console.warn('Crypto polyfill failed, using fallback:', error);
  // Simple fallback
  if (!global.crypto) global.crypto = {};
  global.crypto.getRandomValues = function(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}
