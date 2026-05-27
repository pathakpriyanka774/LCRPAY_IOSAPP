import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
  StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = { primary:'#5F259F', bg:'#F6F7FB', white:'#FFFFFF', text:'#111827', border:'#E5E7EB' };

const WEB_URL = 'https://learn.digitalazadi.com/web/checkout/65eb33bc41ec746147ecf49a?affiliate=65fcb58711a546f0a60ce99f';
const COUPON = 'SUFREE';

// Optional: pass real user info via props/context if you have it
const DEFAULT_USER = {
  name: 'LCR User',
  email: 'user+dm@lcrpay.app',
  phone: '9999999999', // 10-digit Indian mobile
};

const DigitalMarketing = ({ navigation }) => {
  const webRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const injectAutoApply = useCallback(() => {
    if (!webRef.current) return;
    const js = `
      (function(){
        const RNW = window.ReactNativeWebView;
        const say = (type,msg)=>{try{RNW.postMessage(JSON.stringify({type,msg}))}catch(e){}};

        // robust setter so React picks up value
        const setVal = (el, val) => {
          try {
            const d = Object.getOwnPropertyDescriptor(el.__proto__, 'value') ||
                      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            d && d.set ? d.set.call(el, val) : el.value = val;
          } catch { el.value = val; }
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.dispatchEvent(new Event('change', {bubbles:true}));
          el.blur && el.blur();
        };

        // Try repeatedly while the page hydrates
        let tries = 0;
        const maxTries = 40; // ~12s total
        const tick = () => {
          tries++;
          try {
            const qs = (s)=>document.querySelector(s);


            // 2) Fill Coupon field
            const couponInput =
              qs("input[placeholder*='coupon' i]") ||
              qs("input[name*='coupon' i]") ||
              qs("input[id*='coupon' i]") ||
              qs("input[placeholder*='code' i]");

            if (couponInput) {
              setVal(couponInput, ${JSON.stringify(COUPON)});
            }

            // 3) Click "Apply Coupon" button (it may be disabled until fields valid)
            const buttons = Array.from(document.querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"]'));
            const applyBtn = buttons.find(b=>{
              const t = (b.innerText || b.value || '').trim().toLowerCase();
              return /apply\\s*coupon|apply code|apply/i.test(t);
            });

            // If present and not disabled, click it
            if (applyBtn && !applyBtn.disabled && !applyBtn.getAttribute('aria-disabled')) {
              applyBtn.click();
              say('coupon:clicked','Clicked Apply Coupon');
              return true;
            }

            // If coupon or fields still not ready, retry
            if (tries < maxTries) return setTimeout(tick, 300);
            say('coupon:timeout','Could not auto-apply within time');
            return false;
          } catch(e){
            say('coupon:error', String(e && e.message || e));
            return false;
          }
        };
        tick();
        true;
      })();
    `;
    webRef.current.injectJavaScript(js);
  }, []);

  const onMessage = useCallback((e)=>{
    try {
      const { type, msg } = JSON.parse(e?.nativeEvent?.data || '{}');
      if (!type) return;
      // Optional: show lightweight feedback
      if (type === 'coupon:clicked') return;
      // if (type === 'coupon:timeout') Alert.alert('Coupon', 'Auto-apply took too long. Tap the Apply button again.');
      if (type === 'coupon:error') Alert.alert('Coupon', 'Could not auto-apply coupon on this page.');
    } catch {}
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={()=>navigation?.goBack?.()} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back-ios" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>Digital Marketing</Text>

        <TouchableOpacity style={styles.iconBtn} onPress={injectAutoApply} activeOpacity={0.7}>
          <MaterialIcons name="sell" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Hint */}
      <View style={styles.couponBar}>
        <MaterialIcons name="local-offer" size={16} color={COLORS.primary} />
        <Text style={styles.couponText}>Auto-filling details & applying coupon </Text>
        <Text style={[styles.couponText,{fontWeight:'800',color:COLORS.primary}]}>{COUPON}</Text>
      </View>

      {/* WebView */}
      <View style={styles.webContainer}>
        {loading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />}
        <WebView
          ref={webRef}
          source={{ uri: WEB_URL }}
          startInLoadingState
          onLoadEnd={() => {
            setLoading(false);
            // auto-try after load
            setTimeout(injectAutoApply, 600);
          }}
          onMessage={onMessage}
          javaScriptEnabled
          domStorageEnabled
          cacheEnabled
          allowsInlineMediaPlayback
          originWhitelist={['*']}
          injectedJavaScriptBeforeContentLoaded={`window.ReactNativeWebView && (window.__RN_READY__=true); true;`}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DigitalMarketing;

const styles = StyleSheet.create({
  safeArea:{ flex:1, backgroundColor:COLORS.bg },
  header:{
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    backgroundColor:COLORS.white, paddingHorizontal:12, paddingVertical:12,
    borderBottomWidth:1, borderBottomColor:COLORS.border, elevation:2,
    shadowColor:'#000', shadowOpacity:0.06, shadowRadius:4, shadowOffset:{width:0,height:2},
  },
  iconBtn:{ width:36, height:36, alignItems:'center', justifyContent:'center' },
  headerTitle:{ fontSize:16, fontWeight:'700', color:COLORS.text, flex:1, textAlign:'center' },
  couponBar:{ flexDirection:'row', alignItems:'center', gap:6, paddingHorizontal:12, paddingVertical:8, backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.border },
  couponText:{ fontSize:12, color:COLORS.text },
  webContainer:{ flex:1, backgroundColor:COLORS.bg },
  loader:{ position:'absolute', top:'45%', left:0, right:0 },
});
