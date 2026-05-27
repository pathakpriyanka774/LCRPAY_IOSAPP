import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  userVerifyOtp,
  userRegister,
} from "../src/features/userRegister/RegisterSlice";
import RNSmsRetriever from "react-native-sms-retriever";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
// (reverted responsive constants)

const OtpVerification = () => {
  const route = useRoute();
  const { phoneNumber } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const autoSubmittedRef = useRef(false);


  const [code, setCode] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Progressive state: 0 sent, 1 waiting, 2 received, 3 confirming, 4 done
  const [progressStep, setProgressStep] = useState(1);

  const info = useSelector((state) => state.register);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Mark OTP Sent -> Waiting on mount (OTP is requested in previous screen)
  useEffect(() => {
    setProgressStep(1);
  }, []);

  const handleCodeChange = (index, text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText.length > 1) return;

    const next = [...code];
    next[index] = numericText;
    setCode(next);
    setError("");

    if (numericText && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };


  const handleKeyPress = (index, key) => {
    if (key === "Backspace") {
      const newCode = [...code];
      if (code[index] !== "") {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpSubmit = async (enteredOtp = code.join("")) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setProgressStep(3);

    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      setIsSubmitting(false);
      return;
    }

    const cleanPhoneNumber = phoneNumber.replace(/^\+91/, "");

    try {
      await dispatch(
        userVerifyOtp({ phoneNumber: cleanPhoneNumber, otp: enteredOtp })
      ).unwrap();
    } catch (error) {
      setError("Invalid OTP or something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setError("");
      setTimer(45);
      setCanResend(false);
      setCode(new Array(6).fill(""));
      const cleanPhoneNumber = phoneNumber.replace(/^\+91/, "");
      dispatch(userRegister(cleanPhoneNumber));
      setProgressStep(0);
      setTimeout(() => setProgressStep(1), 300);
    }
  };



  useEffect(() => {
    if (!info.loading && isSubmitting) {
      if (info?.Register?.status === 'success') {
        setIsSubmitting(false);
        setProgressStep(4);

        const target = (info?.Register?.isLoginPinSet && info?.Register?.referrerID) ? 'HomeScreen' : (info?.Register?.isLoginPinSet ?'RefferalCode':'CreateSecurityPin');
        console.log("info",info?.Register)

        // 🔒 Hard reset: make target the only screen in the stack
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: target }],
          })
        );
      } else {
        setError(info.error || 'Invalid OTP. Please try again.');
        setIsSubmitting(false);
        setProgressStep(1);
      }
    }
  }, [info.loading, info.Register, isSubmitting, navigation]);

  const isButtonEnabled = code.every(digit => digit !== "") && !isSubmitting;





  useEffect(() => {
    const full = code.join("");
    const isSixDigits = /^\d{6}$/.test(full);

    if (isSixDigits && !isSubmitting && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;   // prevent double-fire
      Keyboard.dismiss();
      setProgressStep(2);
      handleOtpSubmit(full);             // call your existing submit
    }

    // If user edits back, allow auto-submit again
    if (!isSixDigits) {
      autoSubmittedRef.current = false;
    }
  }, [code, isSubmitting]);


  /* ---------- ANDROID SMS AUTO-READ (robust: retriever → consent fallback) ---------- */
  useEffect(() => {
    if (Platform.OS !== "android") return;

    let subscription = null;   // will hold the SmsRetriever listener
    let timer = null;          // fallback timer
    let done = false;          // stops duplicate handling

    const cleanup = () => {
      try { subscription && subscription.remove && subscription.remove(); } catch (e) { }
      subscription = null;
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const fillDigits = (six) => {
      const arr = String(six).slice(0, 6).split("");
      setCode((prev) => {
        const next = prev.slice();
        for (let i = 0; i < 6; i++) next[i] = arr[i] || "";
        return next;
      });
      // Submit immediately (guarded)
      if (!isSubmitting && !autoSubmittedRef.current && /^\d{6}$/.test(six)) {
        autoSubmittedRef.current = true;
        setProgressStep(2);
        handleOtpSubmit(six);
      }
    };


    const onSms = (message) => {
      if (done || !message) return;
      const match = String(message).match(/\b(\d{6})\b/); // change 6 to your OTP length if needed
      if (match) {
        done = true;
        fillDigits(match[1]);
        cleanup();
      }
    };

    (async () => {
      try {
        // 1) Silent retriever (works if SMS contains your app hash)
        await RNSmsRetriever.startSmsRetriever();
        subscription = RNSmsRetriever.addSmsListener((e) => onSms(e && e.message));

        // 2) Fallback: after 12s show User Consent dialog (no READ_SMS)
        timer = setTimeout(async () => {
          if (done) return;
          try {
            cleanup(); // remove retriever listener before switching
            // Pass your gateway number instead of null if you want to restrict sender
            await RNSmsRetriever.startSmsUserConsent(null);
            subscription = RNSmsRetriever.addSmsListener((e) => onSms(e && e.message));
          } catch (e) {
            // User Consent could not start (no GMS / OEM restriction) → manual entry
          }
        }, 12000);
      } catch (e) {
        // Retriever couldn't start → try Consent immediately
        try {
          await RNSmsRetriever.startSmsUserConsent(null);
          subscription = RNSmsRetriever.addSmsListener((e) => onSms(e && e.message));
        } catch (e2) {
          // Both APIs unavailable → manual entry
        }
      }
    })();

    return () => {
      cleanup();
      done = false;
    };
  }, []); // add handleVerify here if you enable the optional auto-submit





  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5F259F" />

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
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            Code sent to {phoneNumber}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View>
          {/* Progressive stepper — connectors behind icons and only between */}
          <View style={styles.stepperRow}>
            {[0,1,2,3,4].map((s, i) => {
              const labels = ['OTP Sent','Waiting','Received','Confirming','Done'];
              const icons = ['send','hourglass-empty','sms','verified','celebration'];
              const status = s < progressStep ? 'done' : (s === progressStep ? 'active' : 'pending');
              return (
                <React.Fragment key={`st-${i}`}>
                  <View style={[styles.stepItem, { zIndex: 2 }]}>
                    <View style={[styles.stepCircle, status === 'done' && styles.stepDone, status === 'active' && styles.stepActive]}>
                      {status === 'active' ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <MaterialIcons name={icons[i]} size={16} color={status==='pending' ? '#9CA3AF' : '#fff'} />
                      )}
                    </View>
                    <Text style={[styles.stepLabel, status==='pending' && { color: '#9CA3AF' }]} numberOfLines={1}>{labels[i]}</Text>
                  </View>
                  {i < 4 && (
                    <View style={[styles.connector, (s < progressStep) && styles.connectorDone, { zIndex: 1 }]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {progressStep === 4 && (
            <View style={styles.congratsBox}>
              <MaterialIcons name="check-circle" size={18} color="#10B981" />
              <Text style={styles.congratsText}>Phone verified! Redirecting…</Text>
            </View>
          )}
          <View style={styles.codeInputContainer}>
            {code.map((value, index) => (
              <TextInput
                key={index}
                ref={(input) => (inputsRef.current[index] = input)}
                style={[
                  styles.codeInput,
                  value && styles.codeInputFilled
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={value}
                onChangeText={(text) => handleCodeChange(index, text)}
                onKeyPress={({ nativeEvent: { key } }) =>
                  handleKeyPress(index, key)
                }
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <Text style={[styles.resendLink, !canResend && styles.disabledText]}>
                Resend
              </Text>
            </TouchableOpacity>
            {timer > 0 && (
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>{timer}s</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!isButtonEnabled) && styles.buttonDisabled
            ]}
            onPress={() => handleOtpSubmit()}
            disabled={!isButtonEnabled}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.agreementText}>
            Enter the 6-digit code we sent to your number
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact support from the Profile section
          </Text>
        </View>
      </View>
    </View>
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
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: isSmallDevice ? 44 : 50,
    height: isSmallDevice ? 54 : 60,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  codeInputFilled: {
    borderColor: '#5F259F',
    backgroundColor: '#fff',
    borderWidth: 2,
    shadowColor: '#5F259F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 13,
    color: '#5F259F',
    fontWeight: '700',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  timerBadge: {
    marginLeft: 8,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 12,
    color: '#5F259F',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#5F259F',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5F259F',
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
  /* Stepper */
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepItem: { alignItems: 'center' },
  connector: { height: 2, backgroundColor: '#E5E7EB', flex: 1, marginHorizontal: 8, borderRadius: 2 },
  connectorDone: { backgroundColor: '#5F259F' },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: { backgroundColor: '#5F259F' },
  stepDone: { backgroundColor: '#7C3AED' },
  stepLabel: { marginTop: 6, fontSize: 10, color: '#374151', fontWeight: '600' },
  congratsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  congratsText: { color: '#065F46', fontWeight: '700', fontSize: 12 },
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

export default OtpVerification;
