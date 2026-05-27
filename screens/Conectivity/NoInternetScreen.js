import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const NoInternetScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/NoInternet.jpeg')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>No internet connection</Text>
        <Text style={styles.subtitle}>
          Please check your internet connection{'\n'}and try again.
        </Text>

        <View style={styles.reconnectContainer}>
          <ActivityIndicator size="small" color="#ffffff" style={styles.loader} />
          <Text style={styles.reconnectText}>Trying to reconnect</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: width * 1.1,
    height: height * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: height * 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  reconnectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: width - 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loader: {
    marginRight: 12,
  },
  reconnectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NoInternetScreen;