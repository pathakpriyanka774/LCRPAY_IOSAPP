import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { useIAP, PRODUCT_IDS, IAP_TYPES } from '../services/IAPService';
import Theme from './Theme';

const COLORS = {
  primary: Theme?.colors?.primary || "#5F259F",
  secondary: "#FFFFFF",
  bg: "#F6F7FB",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

const IAPStore = () => {
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const {
    products,
    purchasedItems,
    loading,
    error,
    purchaseProduct,
    restorePurchases,
    isProductPurchased,
    formatPrice,
    refreshProducts,
  } = useIAP();

  const productConfig = {
    [PRODUCT_IDS.PREMIUM_MONTHLY]: {
      title: "Premium Monthly",
      description: "Unlock all premium features with monthly subscription",
      icon: "star",
      color: "#FFD700",
      type: IAP_TYPES.AUTO_RENEWING,
      features: [
        "Ad-free experience",
        "Priority support",
        "Advanced analytics",
        "Unlimited transactions"
      ]
    },
    [PRODUCT_IDS.CREDITS_100]: {
      title: "100 Credits",
      description: "Get 100 credits for transactions",
      icon: "monetization-on",
      color: "#10B981",
      type: IAP_TYPES.CONSUMABLE,
      features: [
        "100 transaction credits",
        "No expiration",
        "Instant delivery"
      ]
    },
    [PRODUCT_IDS.CREDITS_500]: {
      title: "500 Credits",
      description: "Get 500 credits and save 20%",
      icon: "savings",
      color: "#3B82F6",
      type: IAP_TYPES.CONSUMABLE,
      features: [
        "500 transaction credits",
        "20% savings",
        "Bonus 50 credits"
      ]
    },
    [PRODUCT_IDS.AD_FREE]: {
      title: "Ad-Free Forever",
      description: "Remove all ads permanently",
      icon: "block",
      color: "#8B5CF6",
      type: IAP_TYPES.NON_CONSUMABLE,
      features: [
        "Lifetime ad removal",
        "Cleaner interface",
        "Better performance"
      ]
    },
  };

  const handlePurchase = async (productId) => {
    if (loading) return;
    
    const config = productConfig[productId];
    if (!config) return;

    // Show confirmation dialog
    Alert.alert(
      `Purchase ${config.title}`,
      `Are you sure you want to purchase ${config.title} for ${formatPrice(products.find(p => p.productId === productId))}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Purchase", 
          onPress: async () => {
            const result = await purchaseProduct(productId);
            
            if (result.success) {
              Alert.alert(
                "Purchase Successful!",
                `Thank you for purchasing ${config.title}!`,
                [{ text: "OK", onPress: () => navigation.goBack() }]
              );
            } else {
              Alert.alert(
                "Purchase Failed",
                result.error || "Something went wrong. Please try again.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
  };

  const handleRestore = async () => {
    if (loading) return;
    
    const result = await restorePurchases();
    
    if (result.success) {
      Alert.alert(
        "Restore Successful",
        "Your purchases have been restored successfully.",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Restore Failed",
        result.error || "Unable to restore purchases.",
        [{ text: "OK" }]
      );
    }
  };

  const renderProductCard = (productId) => {
    const product = products.find(p => p.productId === productId);
    const config = productConfig[productId];
    const isPurchased = isProductPurchased(productId);
    
    if (!product || !config) return null;

    return (
      <View key={productId} style={[styles.productCard, { borderLeftColor: config.color }]}>
        <View style={styles.productHeader}>
          <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
            <MaterialIcons name={config.icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{config.title}</Text>
            <Text style={styles.productDescription}>{config.description}</Text>
            <Text style={styles.productPrice}>{formatPrice(product)}</Text>
          </View>
          {isPurchased && (
            <View style={styles.purchasedBadge}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.purchasedText}>Owned</Text>
            </View>
          )}
        </View>
        
        <View style={styles.featuresList}>
          {config.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <MaterialIcons name="check" size={16} color={COLORS.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            isPurchased && styles.purchasedButton,
            { backgroundColor: isPurchased ? COLORS.success : config.color }
          ]}
          onPress={() => handlePurchase(productId)}
          disabled={isPurchased || loading}
        >
          {loading && selectedProduct === productId ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              {isPurchased ? "Purchased" : "Purchase Now"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaViewContext style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={48} color={COLORS.danger} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaViewContext>
    );
  }

  return (
    <SafeAreaViewContext style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Store</Text>
        <TouchableOpacity onPress={handleRestore}>
          <MaterialIcons name="restore" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <MaterialIcons name="diamond" size={48} color={COLORS.primary} />
          <Text style={styles.introTitle}>Unlock Premium Features</Text>
          <Text style={styles.introDescription}>
            Get the most out of LCR Pay with our premium offerings
          </Text>
        </View>

        {loading && products.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {Object.values(PRODUCT_IDS).map(productId => renderProductCard(productId))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All purchases are secure and managed by Apple
          </Text>
          <Text style={styles.footerSubtext}>
            Terms and conditions apply
          </Text>
        </View>
      </ScrollView>
    </SafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.subtext,
  },
  productsContainer: {
    gap: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  purchasedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
  },
  purchasedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  purchaseButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchasedButton: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 10,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default IAPStore;
