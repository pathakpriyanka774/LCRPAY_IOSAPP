import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as ExpoIAP from 'expo-in-app-purchases';

// Product IDs - these must match App Store Connect
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'com.pathakpriyanka.LCRPAY_IOS.premium_monthly',
  CREDITS_100: 'com.pathakpriyanka.LCRPAY_IOS.credits_100',
  CREDITS_500: 'com.pathakpriyanka.LCRPAY_IOS.credits_500',
  AD_FREE: 'com.pathakpriyanka.LCRPAY_IOS.ad_free',
};

export const IAP_TYPES = {
  CONSUMABLE: 'consumable',
  NON_CONSUMABLE: 'non_consumable',
  AUTO_RENEWING: 'auto_renewing',
  NON_RENEWING: 'non_renewing',
};

export const useIAP = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);

  // Initialize IAP connection
  useEffect(() => {
    initializeIAP();
    return () => {
      // Cleanup if needed
    };
  }, []);

  const initializeIAP = async () => {
    try {
      setLoading(true);
      
      // Connect to IAP service
      await ExpoIAP.setPublishingKey('YOUR_SANDBOX_PUBLISHING_KEY'); // For testing
      
      // Get available products
      const { responseCode, results } = await ExpoIAP.getProductsAsync(Object.values(PRODUCT_IDS));
      
      if (responseCode === ExpoIAP.IAPResponseCode.OK) {
        setProducts(results);
        console.log('IAP Products loaded:', results);
      } else {
        throw new Error(`Failed to load products: ${responseCode}`);
      }
      
      // Check for existing purchases
      await checkExistingPurchases();
      
    } catch (err) {
      console.error('IAP Initialization error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingPurchases = async () => {
    try {
      // Get current purchases
      const { responseCode, results } = await ExpoIAP.getPurchaseHistoryAsync();
      
      if (responseCode === ExpoIAP.IAPResponseCode.OK) {
        setPurchasedItems(results);
        console.log('Existing purchases:', results);
        
        // Validate and acknowledge purchases if needed
        for (const purchase of results) {
          if (!purchase.acknowledged) {
            await acknowledgePurchase(purchase);
          }
        }
      }
    } catch (err) {
      console.error('Error checking purchases:', err);
    }
  };

  const purchaseProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting purchase for:', productId);
      
      // Purchase the product
      const { responseCode, results } = await ExpoIAP.purchaseItemAsync(productId);
      
      if (responseCode === ExpoIAP.IAPResponseCode.OK) {
        const purchase = results[0];
        
        // Acknowledge the purchase (required for non-consumable)
        await acknowledgePurchase(purchase);
        
        // Update purchased items
        await checkExistingPurchases();
        
        console.log('Purchase successful:', purchase);
        return { success: true, purchase };
      } else {
        throw new Error(`Purchase failed: ${responseCode}`);
      }
      
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const acknowledgePurchase = async (purchase) => {
    try {
      if (Platform.OS === 'ios') {
        // iOS requires acknowledgment for non-consumable products
        await ExpoIAP.acknowledgePurchaseAsync(purchase.receipt, purchase.receiptData);
      }
      console.log('Purchase acknowledged:', purchase.productId);
    } catch (err) {
      console.error('Acknowledgment error:', err);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await checkExistingPurchases();
      
      return { success: true, message: 'Purchases restored successfully' };
    } catch (err) {
      console.error('Restore error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (productId) => {
    return products.find(product => product.productId === productId);
  };

  const isProductPurchased = (productId) => {
    return purchasedItems.some(item => item.productId === productId);
  };

  const formatPrice = (product) => {
    if (!product) return 'N/A';
    return product.localizedPrice || `${product.price} ${product.currencyCode}`;
  };

  return {
    // Data
    products,
    purchasedItems,
    loading,
    error,
    
    // Methods
    purchaseProduct,
    restorePurchases,
    getProductById,
    isProductPurchased,
    formatPrice,
    refreshProducts: initializeIAP,
  };
};

// Utility functions for receipt validation (server-side)
export const validateReceipt = async (receiptData, productId) => {
  try {
    // Send receipt to your server for validation
    const response = await fetch('https://your-api.com/validate-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receiptData,
        productId,
        platform: Platform.OS,
      }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Receipt validation error:', error);
    throw error;
  }
};

export default useIAP;
