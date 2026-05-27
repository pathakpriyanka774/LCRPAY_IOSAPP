import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PaymentSuccess() {
  const navigation = useNavigation();

  const handleShareReceipt = () => {
    const message = encodeURIComponent(
      'Payment of â‚¹10 for mobile recharge to 9220648066 was successful.'
    );
    const whatsappURL = `whatsapp://send?text=${message}`;
    Linking.canOpenURL(whatsappURL)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappURL);
        } else {
          alert('WhatsApp is not installed on your device');
        }
      })
      .catch((err) => console.error('Error launching WhatsApp', err));
  };

  const handleViewDetails = () => {
    navigation.navigate('RechargeSuccess');
  };

  const handleDone = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="check-circle" size={72} color="#fff" />
          <Text style={styles.successText}>Payment Successful</Text>
          <Text style={styles.dateText}>03 June 2025 at 01:21 PM</Text>
        </View>

        {/* Card Section */}
        <View style={styles.card}>
          <View style={styles.rechargeRow}>
            <MaterialIcons name="mobile-friendly" size={28} color="#4A4A4A" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.phoneText}>9220648066</Text>
              <Text style={styles.labelText}>Mobile Recharge</Text>
            </View>
          </View>

          <View style={styles.amountRow}>
            <Text style={styles.amountText}>â‚¹10</Text>
            <Text style={styles.splitText}>Split Expense</Text>
          </View>

          <Text style={styles.noteText}>
            <Text style={styles.noteHighlight}>Note:</Text> Plan benefits have been applied to 9220648066.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleViewDetails}>
              <MaterialIcons name="receipt" size={22} color="#6C63FF" />
              <Text style={styles.actionText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShareReceipt}>
              <MaterialIcons name="share" size={22} color="#6C63FF" />
              <Text style={styles.actionText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Done Button */}
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#28a745',
    alignItems: 'center',
    paddingVertical: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#eafdea',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  rechargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  labelText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  splitText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '500',
  },
  noteText: {
    backgroundColor: '#fff7e6',
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginTop: 20,
    color: '#5a5a5a',
    lineHeight: 18,
  },
  noteHighlight: {
    color: 'orange',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 26,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
  },
  doneButton: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    paddingVertical: 16,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    elevation: 10,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
