// Test component for IAP functionality
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import IAPButton from './IAPButton';
import { useIAP } from '../services/IAPService';

const IAPTest = () => {
  const { products, loading, error, purchasedItems, isProductPurchased } = useIAP();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IAP Test Component</Text>
      
      <IAPButton />
      
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Products loaded: {products.length}</Text>
        <Text style={styles.infoText}>Purchased items: {purchasedItems.length}</Text>
        <Text style={styles.infoText}>Loading: {loading ? 'Yes' : 'No'}</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  infoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
  },
});

export default IAPTest;
