import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Theme from '../components/Theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#5F259F',      // LCR PAY purple
  bg: '#F6F7FB',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />

      {/* Header with search box */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back-ios" size={20} color={"white"} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color={COLORS.subtext} />
          <TextInput
            style={styles.input}
            placeholder="Search services..."
            placeholderTextColor={COLORS.subtext}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="cancel" size={18} color={COLORS.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main content */}
      <View style={styles.container}>
        <Image
          source={require('../assets/browser.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Services not available</Text>
        <Text style={styles.subtitle}>
          We're currently expanding our network. Please check back later.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Theme.colors.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.9,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});
