import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userData } from '../../src/features/userRegister/RegisterSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import successAnimation from '../../Animation/success.json';
import Theme from '../Theme';
import { BASE_URL } from '../../utils/config';

const ApplyCoupan = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state.register?.user);

    const [loading, setLoading] = useState(false);
    const [coupanCode, setCoupanCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [discount, setDiscount] = useState(0);
    const [applyLoading, setApplyLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // membership/base price (fallback if not present)
    const membershipPrice = useMemo(() => {
        const price = Number(user?.primePrice || user?.membershipPrice || 0);
        return isNaN(price) ? 0 : price;
    }, [user]);

    // Calculate payable amount after discount (subtotal before GST), ensure non-negative
    const payableBeforeGST = useMemo(() => {
        const subtotal = membershipPrice - Number(discount || 0);
        return Number(subtotal < 0 ? 0 : parseFloat(subtotal.toFixed(2)));
    }, [membershipPrice, discount]);

    // GST is calculated on the payable amount AFTER discount
    const gst = useMemo(() => Number((payableBeforeGST * 0.18).toFixed(2)), [payableBeforeGST]);

    // Total payable equals subtotal after discount plus GST
    const totalPayable = useMemo(() => {
        const tot = payableBeforeGST + gst;
        return Number(parseFloat(tot.toFixed(2)));
    }, [payableBeforeGST, gst]);

    useEffect(() => {
        loadData();
    }, []);

    const showAnimatedAlert = (type = 'success', message = '', callback) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVisible(true);
        const timeout = setTimeout(() => {
            setAlertVisible(false);
            if (callback) callback();
            clearTimeout(timeout);
        }, 2500);
    };

    const loadData = async () => {
        // refresh user data
        try {
            setLoading(true);
            await dispatch(userData());
        } catch (err) {
            console.warn('Error loading user data', err);
            showAnimatedAlert('error', 'Unable to load data.');
        } finally {
            setLoading(false);
        }
    };

    const applyCoupan = async () => {
        setErrorMessage('');
        // Prevent calling API with empty coupon (backend defaults to WELCOME500)
        const sentCoupon = coupanCode?.trim();


        try {
            setApplyLoading(true);
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                showAnimatedAlert('error', 'Please login to apply coupon.');
                setApplyLoading(false);
                return;
            }
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };
            let url = `${BASE_URL}/referral/apply-coupan-code`;
            if (coupanCode && coupanCode.trim()) {
                url += `?coupan_code=${encodeURIComponent(coupanCode.trim())}`;
            } else {
                // do not pass parameter if coupon not present - prevent default server coupon
            }
            const res = await axios.post(url, {}, { headers });
            if (res?.data?.status) {
                console.log('Coupan applied', res.data);
                // make discount numeric
                const d = Number(res?.data?.discount || 0);
                // Only set discount if the user actually sent a coupon

                setDiscount(isNaN(d) ? 0 : d);
                // fill the coupon code returned by server (keeps code consistent)
                if (res?.data?.coupan_code) {
                    setCoupanCode(res.data.coupan_code);
                    setAppliedCoupon(res.data.coupan_code);
                } else {
                    setAppliedCoupon(sentCoupon);
                }

                showAnimatedAlert('success', 'Congratulations! Coupon applied successfully.');
            } else {
                setErrorMessage(res?.data?.message || 'Invalid coupon');
                setAppliedCoupon(null);
            }
        } catch (err) {
            console.warn('applyCoupan error', err);
            setErrorMessage('Failed to apply coupon. Try again.');
            setAppliedCoupon(null);
            showAnimatedAlert('error', 'Failed to apply coupon. Try again.');
        } finally {
            setApplyLoading(false);
        }
    };

    useEffect(()=>{
        applyCoupan()
    },[])

    const proceedToPay = async () => {
        setErrorMessage('');
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                showAnimatedAlert('error', 'Please login to continue.');
                return;
            }
            setPaymentLoading(true);
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };
            const res = await axios.get(`${BASE_URL}/gateways/active`, { headers });
            const PaymentMethods = ['razorpay', 'sabpaisa'];
            const selectedMethod = res?.data?.gateway_name;
            console.log('selectedMethod', selectedMethod)
            const amount = totalPayable; // final amount
            if (selectedMethod === PaymentMethods[0]) {
                navigation.navigate('RazorpayPayScreen', {
                    autoStart: false,
                    origin: 'PaymentGatewayScreen',
                    returnTo: 'HomeScreen',
                    amount: Number(amount),
                    payload: { amount: Number(amount), service_type: 'Prime_Activation' },
                });
            } else if (selectedMethod === PaymentMethods[1]) {
                navigation.navigate('payWithSabpaise', {
                    autoStart: false,
                    origin: 'PaymentGatewayScreen',
                    returnTo: 'HomeScreen',
                    amount: Number(amount),
                    payload: { amount: Number(amount), service_type: 'Prime_Activation' },
                });
            } else {
                showAnimatedAlert('error', 'No payment method available');
            }
        } catch (err) {
            console.warn('ProceedToPay error', err);
            showAnimatedAlert('error', 'Failed to initiate payment.');
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.title}>Prime Membership</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Price</Text>
                        <Text style={styles.value}>₹{membershipPrice.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Discount</Text>
                        <Text style={[styles.value, { color: discount ? '#1b7f3a' : '#999' }]}> 
                            {discount ? `- ₹${Number(discount).toFixed(2)}` : '- ₹0.00'}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>₹{payableBeforeGST.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>GST (18%)</Text>
                        <Text style={styles.value}>₹{gst.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.row, styles.rowTotal]}>
                        <Text style={styles.labelTotal}>Total Payable</Text>
                        <Text style={styles.valueTotal}>₹{totalPayable.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.couponArea}>
                    <Text style={styles.couponLabel}>Have a Coupon?</Text>
                    <View style={styles.couponRow}>
                        <TextInput
                             editable={discount>0 ? false : true}
                            style={styles.input}
                            placeholder="Enter coupon code"
                            value={coupanCode}
                            onChangeText={setCoupanCode}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity
                            style={[styles.button, { marginLeft: 10 }, (applyLoading || !!appliedCoupon) ? styles.buttonDisabled : null]}
                            onPress={applyCoupan}
                            disabled={applyLoading || !!appliedCoupon}
                        >
                            {applyLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>{!!appliedCoupon ? 'Applied' : 'Apply'}</Text>
                            )}
                        </TouchableOpacity>
                        
                    </View>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                </View>

                <TouchableOpacity
                    style={[styles.payButton, paymentLoading && { opacity: 0.7 }]}
                    onPress={proceedToPay}
                    disabled={paymentLoading || membershipPrice <= 0}
                >
                    {paymentLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payButtonText}>Proceed to Pay ₹{totalPayable.toFixed(2)}</Text>
                    )}
                </TouchableOpacity>
                {/* Animated Lottie Modal */}
                <Modal visible={alertVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <LottieView
                                source={successAnimation}
                                autoPlay
                                loop={alertType !== 'success' ? false : false}
                                style={{ width: 160, height: 160 }}
                            />
                            <Text style={styles.modalText}>{alertMessage}</Text>
                        </View>
                    </View>
                </Modal>

            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    wrapper: { flex: 1 },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fafafa',
    },
    title: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 12 },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    rowTotal: { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8, paddingTop: 12 },
    label: { fontSize: 14, color: '#666' },
    value: { fontSize: 14, fontWeight: '600' },
    labelTotal: { fontSize: 16, color: '#222', fontWeight: '700' },
    valueTotal: { fontSize: 18, fontWeight: '800', color: '#3c3c3c' },
    couponArea: { marginTop: 8, marginBottom: 18 },
    couponLabel: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    couponRow: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: Theme.colors.primary, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8 },
    buttonDisabled: { backgroundColor: '#bab5b5ff' },
    buttonText: { color: '#fff', fontWeight: '700' },
    payButton: { backgroundColor: Theme.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    payButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    errorText: { color: '#c0392b', marginTop: 8 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '84%',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
    },
    modalText: { marginTop: 10, fontSize: 16, textAlign: 'center', color: '#333' },
});

export default ApplyCoupan;
