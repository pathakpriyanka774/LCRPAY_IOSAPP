import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Keyboard, Dimensions, InteractionManager, NativeModules } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { userRegister } from "../src/features/userRegister/RegisterSlice";
import RNSmsRetriever from "react-native-sms-retriever";
import { SafeAreaView } from "react-native-safe-area-context";
const { PhoneHint } = NativeModules;



const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayNumber, setDisplayNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();



  const hasAutoSubmitted = useRef(false);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 5) {
      return cleaned;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
  };

  const isValidPhone = phoneNumber.length === 10 && /^[6789]\d{9}$/.test(phoneNumber);
  const isButtonEnabled = isValidPhone && !isLoading;
  const isButtonVisible = phoneNumber.length === 10;

  useEffect(() => {
    if (isValidPhone && !hasAutoSubmitted.current && !isLoading) {
      hasAutoSubmitted.current = true;
      setError("");
      Keyboard.dismiss();
      setTimeout(() => {
        handleSendCode();
      }, 300);
    }
  }, [isValidPhone]);

  useEffect(() => {
    if (phoneNumber.length < 10) {
      hasAutoSubmitted.current = false;
    }
  }, [phoneNumber]);

  const handleSendCode = async () => {
    if (isLoading) return;

    const cleanedNumber = phoneNumber.replace(/\D/g, "");


    if (cleanedNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    if (!/^[6789]/.test(cleanedNumber)) {
      setError("Phone number must start with 6, 7, 8, or 9");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await dispatch(userRegister(cleanedNumber)).unwrap();
      console.log("result", result)
      navigation.navigate("OtpVerification", {
        phoneNumber: `+91${cleanedNumber}`,
      });
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };


      // Modern API
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );






  // Refs
  const phoneRef = useRef(phoneNumber);
  const pickerLockRef = useRef(false);
  const lastAutoSubmittedRef = useRef(""); // prevents duplicate auto-submits for same number
  phoneRef.current = phoneNumber;

  // Helpers
  const normalizeTo10 = (e164OrAny = "") =>
    e164OrAny.replace(/^\+91/, "").replace(/\D/g, "").slice(-10);

  const isValidMobile = (n) => /^[6789]\d{9}$/.test(n);

  const pickNumber = useCallback(async () => {
    if (Platform.OS !== "android") return;
    if (pickerLockRef.current) return; // 🔒 avoid re-entrancy
    pickerLockRef.current = true;

    try {
      let raw = null;

      // 1) Try GIS Phone Number Hint (bottom sheet look)
      if (PhoneHint?.getPhoneNumber) {
        try {
          raw = await PhoneHint.getPhoneNumber(); // e.g. "+919876543210"
        } catch (e) {
          // fall through to SmsRetriever
        }
      }

      // 2) Fallback: SmsRetriever hint (may appear as dialog)
      // if (!raw && RNSmsRetriever?.requestPhoneNumber) {
      //   try {
      //     raw = await RNSmsRetriever.requestPhoneNumber();
      //   } catch (e) {
      //     // user canceled / not available
      //   }
      // }

      if (!raw) return;

      const normalized = normalizeTo10(raw);
      if (!normalized) return;

      setPhoneNumber(normalized);
      setDisplayNumber(formatPhoneNumber(normalized)); // keep your pretty spacing
      setError?.("");

      // optional: auto-submit once per unique valid number
      if (isValidMobile(normalized) && lastAutoSubmittedRef.current !== normalized) {
        lastAutoSubmittedRef.current = normalized;
        // slight delay to ensure state is set
        setTimeout(() => {
          handleSendCode();
        }, 0);
      }
    } catch (err) {
      console.log(
        "Phone picker not available / canceled:",
        typeof err?.message === "string" ? err.message : String(err)
      );
    } finally {
      setTimeout(() => {
        pickerLockRef.current = false;
      }, 300);
    }
  }, [handleSendCode, formatPhoneNumber, setPhoneNumber, setDisplayNumber]);

  // Prefill via picker when screen focuses (once per focus)
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        // Only try to pick if input is empty (avoid re-trigger if user already typed)
        if (!phoneRef.current) pickNumber();
      });
      return () => task.cancel();
    }, [pickNumber])
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5F259F' }}>
      <StatusBar translucent={false} backgroundColor="#5F259F" barStyle="light-content" />
      <View style={styles.container}>

        <View style={styles.backgroundDecor}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
        </View>

        <View style={styles.purpleSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/lccr.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Verify your phone number</Text>
            <Text style={styles.subtitle}>
              We'll send you a code to keep your account secure.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Phone number</Text>

              <View style={[
                styles.inputContainer,
                phoneNumber.length > 0 && styles.inputContainerActive
              ]}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                  <View style={styles.divider} />
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="10-digit phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  maxLength={11}
                  value={displayNumber}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, "");
                    setPhoneNumber(cleaned);
                    setDisplayNumber(formatPhoneNumber(cleaned));
                    setError("");
                  }}
                  autoFocus={false}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {isButtonVisible && (
              <TouchableOpacity
                style={[
                  styles.button,
                  (!isButtonEnabled || isLoading) && styles.buttonDisabled
                ]}
                onPress={handleSendCode}
                disabled={!isButtonEnabled || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify Number</Text>
                )}
              </TouchableOpacity>
            )}

            <Text style={styles.agreementText}>
              By continuing, you agree to receive an SMS for verification.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Need help? Contact support from the Profile section
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5F259F',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  purpleSection: {
    paddingBottom: 20,
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  blob1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#fff',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  blob2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#fff',
    bottom: -width * 0.2,
    left: -width * 0.25,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? height * 0.1 : height * 0.08,
    marginBottom: 20,
  },
  logoCircle: {
    width: isSmallDevice ? 100 : 120,
    height: isSmallDevice ? 100 : 120,
    borderRadius: isSmallDevice ? 50 : 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: isSmallDevice ? 60 : 75,
    height: isSmallDevice ? 60 : 75,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'space-between',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  inputContainerActive: {
    borderColor: '#5F259F',
    backgroundColor: '#fff',
    shadowColor: '#5F259F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: '100%',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginLeft: 12,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#5F259F',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9e2828ff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  agreementText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Register;