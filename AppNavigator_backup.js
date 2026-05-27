import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StatusBar, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserContext from "./src/UserContext";

// Essential screens for initial flow
import EnterPin from "./screens/EnterPin";
import HomeScreen from "./screens/HomeScreen";
import LoginCreatePass from "./screens/LoginCreatePass";
import OtpVerification from "./screens/OtpVerification";
import PanVerification from "./screens/PanVerification";
import Register from "./screens/Register";
import SplashScreen1 from "./screens/SplashScreen1";
import SplashScreen22 from "./screens/SplashScreen22";
import SplashScreen3 from "./screens/SplashScreen3";
import SplashScreen4 from "./screens/SplashScreen4";
import VerificationCompleted from "./screens/VerificationCompleted";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const [prevLoggedDone, setPrevLoggedDone] = useState(false);

  // load prevLogged
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("userLogged");
        if (!cancelled) setPrevLogged(!!stored);
      } catch {
        if (!cancelled) setPrevLogged(false);
      } finally {
        if (!cancelled) setPrevLoggedDone(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);


  // load token + user
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = await AsyncStorage.getItem("access_token");
        if (!cancelled) setToken(t || null);

        if (!t) return; // no token = no user check
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${t}` };
        const resp = await axios.get(`${BASE_URL}/register/check_user`, { headers });
        console.log(resp.data)
        if (!cancelled) setUser(resp.data?.user ?? null);
      } catch (err) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setUserCheckDone(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);



  // wait until BOTH are done
  const ready = userCheckDone && prevLoggedDone;

  // decide initial route once everything is ready
  const initialRoute = React.useMemo(() => {
    if (!ready) return "SplashScreen1"; // placeholder, won't be used before ready

    if (user?.introducer_id && user?.LoginPIN) return "MPinLockScreen";
    return prevLogged ? "Register" : "SplashScreen1";

  }, [ready, token, user?.introducer_id, user?.LoginPIN, prevLogged]);

  // remount the STACK (not just the container)
  const stackKey =
    `${Number(ready)}-${Boolean(token)}-${Boolean(user?.introducer_id)}-${Boolean(user?.LoginPIN)}-${Boolean(prevLogged)}`;

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5F259F" />
      </View>
    );
  }

  return (
    <UserContext>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={async () => {
              const pending = await consumePendingNavigation();
              if (pending) {
                try {
                  navigationRef.navigate(pending);
                } catch {}
              }
            }}
          >
            <StatusBar
              barStyle="light-content"
              backgroundColor={Theme.colors.primary}
            />
            <Stack.Navigator
              key={stackKey}
              initialRouteName={initialRoute || "SplashScreen1"}
              // initialRouteName="CreateSecurityPin"

              screenOptions={{ headerShown: false }}
            >

              <Stack.Screen
                name="MPinLockScreen"
                component={MPinLockScreen}
                options={{
                  headerShown: false,
                }}
              />


              <Stack.Screen
                name="Panverify"
                component={Panverify}
                options={{
                  headerTitle: "Verify Your Pan",
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />


              <Stack.Screen
                name="NoInternet"
                component={NoInternetScreen}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />




              <Stack.Screen
                name="BillFetch"
                component={BillFetch}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="BillFetch2"
                component={BillFetch2}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />


              <Stack.Screen
                name="ProceedToPayment"
                component={ProceedToPayment}
                options={{
                  headerShown: true,
                  // headerTitle: "Step 4",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerRight: () => (
                    <Image
                      source={require("./assets/WHBharatConnect.png")}
                      style={{ width: 60, height: 60, marginRight: 15 }}
                      resizeMode="contain"
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="PayElectricityBill"
                component={PayElectricityBill}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />


              <Stack.Screen
                name="DigitalMarketing"
                component={DigitalMarketing}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />


              <Stack.Screen
                name="RealStateScreen"
                component={RealStateScreen}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />




              <Stack.Screen
                name="CreateSecurityPin"
                component={CreateSecurityPin}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="RechargeTrxPin"
                component={RechargeTrxPin}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />


              <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="RechargeSuccess"
                component={RechargeSuccess}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="BbpsTransactionPin"
                component={BbpsTransactionPin}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

            
              <Stack.Screen
                name="OfflineKyc"
                component={OfflineKyc}
                options={{
                  headerShown: true,
                  headerTitle: "Offline Kyc",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
              <Stack.Screen
                name="SplashScreen22"
                component={SplashScreen22}
              />
              <Stack.Screen name="SplashScreen3" component={SplashScreen3} />
              <Stack.Screen name="SplashScreen4" component={SplashScreen4} />

              <Stack.Screen
                name="SelectedSim"
                component={SelectedSim}
                options={{
                  headerShown: false,
                  headerTitle: "Select Your Sim",
                  headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                }}
              />

              <Stack.Screen
                name="Register"
                component={Register}
                options={{
                  headerShown: false,
                  headerTitle: "Register",
                  headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                }}
              />
              <Stack.Screen
                name="PanDetailsWb"
                component={PanDetailsWb}
                options={{
                  headerShown: true,
                  headerTitle: "Pan Details",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="PanDetails"
                component={PanDetails}
                options={{
                  headerShown: true,
                  headerTitle: "Pan Details",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="LabelIncome"
                component={LabelIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Income",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Sign In",
                  gestureEnabled: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ForgetPasswordScreen"
                component={ForgotPasswordScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Forget Your Password",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="LoginCreatePass"
                component={LoginCreatePass}
                options={{
                  headerShown: true,
                  headerTitle: "Create Login Password",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="CreateNewPasswordScreen"
                component={CreateNewPasswordScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Sign In",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="MovieAnimation"
                component={MovieAnimation}
                options={{
                  headerShown: true,
                  headerTitle: "Sign In",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="RefferalCode"
                component={RefferalCode}
                options={{
                  headerShown: true,
                  headerTitle: "Referral Code",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PasswordCreatedScreen"
                component={PasswordCreatedScreen}
                options={{
                  headerShown: false,
                  headerTitle: "Verified",
                  headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                }}
              />

              <Stack.Screen
                name="FingerPrint"
                component={FingerPrint}
                options={{
                  headerShown: false,
                  headerTitle: "Finger Print",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                }}
              />

              <Stack.Screen
                name="OtpVerification"
                component={OtpVerification}
                options={{
                  headerShown: true,
                  headerTitle: "Sign In",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="VerificationCompleted"
                component={VerificationCompleted}
                options={{
                  headerShown: true,
                  headerTitle: "Verification Completed",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ToMobile"
                component={ToMobile}
                options={{
                  headerShown: true,
                  headerTitle: "To Mobile",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="FastagTransaction"
                component={FastagTransaction}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerRight: () => (
                    <Image
                      source={require("./assets/WHBharatConnect.png")}
                      style={{ width: 60, height: 60, marginRight: 15 }}
                      resizeMode="contain"
                    />
                  ),
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ToSelf"
                component={ToSelf}
                options={{
                  headerShown: true,
                  headerTitle: "Self",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Proceed"
                component={Proceed}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="AddAmount"
                component={AddAmount}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddBankAccount"
                component={AddBankAccount}
                options={{
                  headerShown: true,
                  headerTitle: " Add Bank Account",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="BankDetails"
                component={BankDetails}
                options={{
                  headerShown: true,
                  headerTitle: "Your Bank Details",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="CheckBalanceBanks"
                component={CheckBalanceBanks}
                options={{
                  headerShown: true,
                  headerTitle: "LCR Money",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="CheckBalancePin"
                component={CheckBalancePin}
                options={{
                  headerShown: true,
                  headerTitle: "Check Your LCR Money",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="CoinBalance"
                component={CoinBalance}
                options={{
                  headerShown: true,
                  headerTitle: "Check Your Balance",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Your Payment Screen",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="CheckBalance"
                component={CheckBalance}
                options={{
                  headerShown: true,
                  headerTitle: "Check Your Balance",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="SelfPaymentPin"
                component={SelfPaymentPin}
                options={{
                  headerShown: true,
                  headerTitle: "Self Payment Pin",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ScanPayScreenPin"
                component={ScanPayScreenPin}
                options={{
                  headerShown: true,
                  headerTitle: "Scan Pay ",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="FAST"
                component={FAST}

                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerTitle: "Search Billers", // keep your title
                  headerRight: () => (
                    <Image
                      source={require("./assets/BharatConnectReverseLogo.png")}
                      style={{
                        width: 80,
                        height: 30,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="Municiple"
                component={Municiple}
                options={{
                  headerShown: true,
                  headerTitle: "Municiple",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="AllServices"
                component={AllServices}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerTitle: "Bharat Connect Billers", // keep your title
                  headerRight: () => (
                    <Image
                      source={require("./assets/BharatConnectReverseLogo.png")}
                      style={{
                        width: 80,
                        height: 30,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="ToBank"
                component={ToBank}
                options={{
                  headerShown: true,
                  headerTitle: "Send Money To Bank Account",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    // fontWeight: "bold",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="AddUpiScreen"
                component={AddUpiScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Add UPI Id",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    // fontWeight: "bold",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="NewBank"
                component={NewBank}
                options={{
                  headerShown: true,
                  headerTitle: "Add New Bank",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="Wallet"
                component={Wallet}
                options={{
                  headerShown: true,
                  headerTitle: "Wallet",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="TransactionSuccessScreen"
                component={TransactionSuccessScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Transaction Successful",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="BbpsTransactionSuccess"
                component={BbpsTransactionSuccess}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="HelpSupport"
                component={HelpSupport}
                options={{
                  headerShown: false,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="ScratchCardScreen"
                component={ScratchCardScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Scratch and win Rewards",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ReferralScreen"
                component={ReferralScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Invite and Earn",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Membership"
                component={Membership}
                options={{
                  headerShown: true,
                  headerTitle: "Prime Membership",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Network"
                component={Network}
                options={{
                  headerShown: true,
                  headerTitle: "Network",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="NetworkTable"
                component={NetworkTable}
                options={{
                  headerShown: true,
                  headerTitle: "Direct Team",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="LevelTable"
                component={LevelTable}
                options={{
                  headerShown: true,
                  headerTitle: "Level Team",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Income"
                component={Income}
                options={{
                  headerShown: true,
                  headerTitle: "Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="UserDirectIncome"
                component={UserDirectIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Direct Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="UserLevelIncome"
                component={UserLevelIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Level Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="UserLevelNetwork"
                component={UserLevelNetwork}
                options={{
                  headerShown: true,
                  headerTitle: "Level Team",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="UserDirectNetwork"
                component={UserDirectNetwork}
                options={{
                  headerShown: true,
                  headerTitle: "Direct Network",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="OperatorPopup"
                component={OperatorPopup}
                options={{
                  headerShown: true,
                  headerTitle: "Direct Network",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  headerShown: true,
                  headerTitle: "Forget Password",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="SetForgotPassword"
                component={SetForgotPassword}
                options={{
                  headerShown: true,
                  headerTitle: "Set Password",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="DirectIncome"
                component={DirectIncome}
                options={{
                  headerShown: true,

                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="membershipSuccess"
                component={MembershipSuccess}
                options={{
                  headerShown: true,

                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />


              <Stack.Screen
                name="LevelIncome"
                component={LevelIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Level Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="MagicIncome"
                component={MagicIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Magic Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="RoyaltyIncome"
                component={RoyaltyIncome}
                options={{
                  headerShown: true,
                  headerTitle: "Royalty Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Reward"
                component={Reward}
                options={{
                  headerShown: true,
                  headerTitle: "Reward Income",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Scan"
                component={Scan}
                options={{
                  headerShown: false,
                  headerTitle: "Scanner",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />

              <Stack.Screen
                name="History"
                component={History}
                options={{
                  headerShown: true,
                  headerTitle: "History",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="TopUp"
                component={TopUp}
                options={{
                  headerShown: true,
                  headerTitle: "More Services",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    // fontWeight: "bold",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="EnterPin"
                component={EnterPin}
                options={{
                  headerShown: true,
                  headerTitle: "Enter Your Pin",
                  headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen name="HomeScreen" component={HomeScreen} />

              <Stack.Screen
                name="Recharge"
                component={Recharge}
                options={{
                  headerShown: true,
                  headerTitle: "Mobile Prepaid",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="AadhaarDetailsWb"
                component={AadhaarDetailsWb}
                options={{
                  headerShown: true,
                  headerTitle: "Aadhaar Details",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="SetTransactionPin"
                component={SetTransactionPin}
                options={{
                  headerShown: true,
                  headerTitle: "Set Transaction Pin",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />


              <Stack.Screen
                name="RechargeScreenPay"
                component={RechargeScreenPay}
                options={{
                  headerShown: true,
                  headerTitle: "Pay",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="Recharge1"
                component={Recharge1}
                options={{
                  headerShown: true,
                  headerTitle: "Mobile Prepaid",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="SearchTransactionScreen"
                component={SearchTransactionScreen}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerTitle: "Search Transaction",
                  headerRight: () => (
                    <Image
                      source={require("./assets/BharatConnectReverseLogo.png")}
                      style={{
                        width: 80,
                        height: 30,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  headerShown: true,
                  headerTitle: "Aadhar Card Verification",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Profile2"
                component={Profile2}
                options={{
                  headerShown: true,
                  headerTitle: "Step 2",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="AadharOtp"
                component={AadharOtp}
                options={{
                  headerShown: true,
                  headerTitle: "Aadhar Otp Verification",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="AadharDetails"
                component={AadharDetails}
                options={{
                  headerShown: true,
                  headerTitle: "Your Aadhar Details",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="EmailVerification"
                component={EmailVerification}
                options={{
                  headerShown: true,
                  headerTitle: "Email Otp Verification",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Profile3"
                component={Profile3}
                options={{
                  headerShown: true,
                  headerTitle: "Pan Detail Verification",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="KycSubmited"
                component={KycSubmited}
                options={{
                  headerShown: true,
                  headerTitle: "KYC SUBMITED",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PanVerification"
                component={PanVerification}
                options={{
                  headerShown: true,
                  headerTitle: "Pan Verification",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="Profile4"
                component={Profile4}
                options={{
                  headerShown: true,
                  headerTitle: "Email Verification",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ProfileMain"
                component={ProfileMain}
                options={{
                  headerShown: true,
                  headerTitle: "User Profile",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="KycVerificationComplited"
                component={KycVerificationComplited}
                options={{
                  headerShown: true,
                  headerTitle: "Step 4",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen name="UserProfile" component={UserProfile} />

              <Stack.Screen
                name="VehicleRegistration"
                component={VehicleRegistration}
                options={{
                  headerShown: true,
                  // headerTitle: "Step 4",
                  // headerTitleAlign: "center",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerRight: () => (
                    <Image
                      source={require("./assets/WHBharatConnect.png")}
                      style={{ width: 60, height: 60, marginRight: 15 }}
                      resizeMode="contain"
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Change Your Password",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                }}
              />
              <Stack.Screen
                name="AboutUs"
                component={AboutUs}
                options={{
                  headerShown: true,
                  headerTitle: "About Us",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="ContactUs"
                component={ContactUs}
                options={{
                  headerShown: true,
                  headerTitle: "Contact Us",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />


              <Stack.Screen
                name="FileComplaint"
                component={FileComplaint}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerTitle: "File Complaint", // keep your title
                  headerRight: () => (
                    <Image
                      source={require("./assets/BharatConnectReverseLogo.png")}
                      style={{
                        width: 80,
                        height: 30,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="ComplaintTrackingScreen"
                component={ComplaintTrackingScreen}
                options={{
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                  headerTitle: "Complaint Tracking", // keep your title
                  headerRight: () => (
                    <Image
                      source={require("./assets/BharatConnectReverseLogo.png")}
                      style={{
                        width: 80,
                        height: 30,
                        marginRight: 10,
                        resizeMode: "contain",
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="MoreServices"
                component={MoreServices}
                options={{
                  headerShown: true,
                  headerTitle: "More Services",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PrivacyAndPolicy"
                component={PrivacyAndPolicy}
                options={{
                  headerShown: true,
                  headerTitle: "Privacy And Policy",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />


              <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
              />

              {/*  */}
              {/* bus booking */}
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerShown: true,
                  headerTitle: "Book Your Destination Bus",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="LoanSelectionScreen"
                component={LoanSelectionScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Loan Selection",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />


              <Stack.Screen
                name="PaymentGatewayScreen"
                component={PaymentGatewayScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Select payment method",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="RazorpayPayScreen"
                component={RazorpayPayScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Razorpay Payment",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />



              <Stack.Screen
                name="Education"
                component={Educations}
                options={{
                  headerShown: false,
                }}
              />


              <Stack.Screen
                name="BludClub"
                component={BludClub}
                options={{
                  headerShown: true,
                  headerTitle: "Blud Club",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />



              <Stack.Screen
                name="Insurance"
                component={Insurance}
                options={{
                  headerShown: true,
                  headerTitle: "Insurance",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />



              <Stack.Screen
                name="payWithSabpaise"
                component={payWithSabpaise}
                options={{
                  headerShown: true,
                  headerTitle: "Online Payment",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="ComplaintSuccessScreen"
                component={ComplaintSuccessScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Complaint Success",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />
              <Stack.Screen
                name="searchpage"
                component={SearchPage}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="aboutOffer"
                options={{ title: "Offers" }}
                component={AboutOffer}
              />


              <Stack.Screen
                name="ApplyCoupan"
                options={{
                  headerShown: true,
                  headerTitle: "Proceed to Activate Prime",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
                component={ApplyCoupan}
              />

              <Stack.Screen
                name="singleSearch"
                component={SingleSearch}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="MakeBooking"
                component={MakeBooking}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="PaymentStatus"
                component={PaymentStatus}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="SelfPaymentStatus"
                component={SelfPaymentStatus}
                options={{ headerShown: false }}
              />



              <Stack.Screen
                name="SuccessScreen"
                component={SuccessScreen}
                options={{ headerShown: false }}
              />


              <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                  headerShown: true,
                  headerTitle: "Setting",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              {/* TermsAndConditions.js */}
              <Stack.Screen
                name="TransactionPin"
                component={TransactionPin}
                options={{
                  headerShown: true,
                  headerTitle: "Transaction PIN",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                }}
              />

              <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
                options={{
                  headerShown: true,
                  headerTitle: "Terms And Conditions",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 25,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="UserInformation"
                component={UserInformation}
                options={{
                  headerShown: true,
                  headerTitle: "User Details",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PaymentQR"
                component={PaymentQR}
                options={{
                  headerShown: true,
                  headerTitle: "QR",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="PaymentSuccess"
                component={PaymentSuccess}
                options={{
                  headerShown: true,
                  headerTitle: "QR",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />

              <Stack.Screen
                name="RechargeSuccess1"
                component={RechargeSuccess1}
                options={{
                  headerShown: true,
                  headerTitle: "Recharge Success",
                  headerStyle: {
                    backgroundColor: Theme.colors.primary,
                  },
                  headerTitleStyle: {
                    color: Theme.colors.HeaderTint,
                    fontSize: 20,
                  },
                  headerTintColor: Theme.colors.HeaderTint,
                }}
              />



















              <Stack.Screen
                name="PersonalLoanScreen"
                component={PersonalLoanScreen}
                options={{ title: 'Personal Loan' }}
              />
              <Stack.Screen
                name="AutoLoanScreen"
                component={AutoLoanScreen}
                options={{ title: 'Auto Loan' }}
              />

              <Stack.Screen
                name="BusinessLoanScreen"
                component={BusinessLoanScreen}
                options={{ title: 'Business Loan' }}
              />

              <Stack.Screen
                name="LAPScreen"
                component={LAPScreen}
                options={{ title: 'Loan Against Property' }}
              />

              <Stack.Screen
                name="MachineryLoanScreen"
                component={MachineryLoanScreen}
                options={{ title: 'Machinery Loan' }}
              />
              <Stack.Screen
                name="PrivateFundingScreen"
                component={PrivateFundingScreen}
                options={{ title: 'Private Funding' }}
              />

              <Stack.Screen
                name="UserLoanInfoScreen"
                component={UserLoanInfoScreen}
                options={{ title: 'Application Summary' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </UserContext>
  );
}
