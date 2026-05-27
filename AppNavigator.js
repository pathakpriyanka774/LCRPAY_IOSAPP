import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserContext from "./src/UserContext";

// Essential screens for initial flow
import History from "./components/History";
import Recharge1 from "./components/Recharge1";
import AadharDetails from "./screens/AadharDetails";
import EnterPin from "./screens/EnterPin";
import HomeScreen from "./screens/HomeScreen";
import LoginCreatePass from "./screens/LoginCreatePass";
import LoginSignUp from "./screens/LoginSignUp";
import OtpVerification from "./screens/OtpVerification";
import PanVerification from "./screens/PanVerification";
import Register from "./screens/Register";
import SplashScreen1 from "./screens/SplashScreen1";
import VerificationCompleted from "./screens/VerificationCompleted";

// Additional screens to fix navigation errors
import AllServices from "./components/AllServices";
import CheckBalanceBanks from "./components/CheckBalanceBanks";
import RechargeScreen from "./components/Recharge";
import FastagTransaction from "./components/miscellaneous/FastagTransaction";
import AboutUs from "./screens/AboutUs";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ComplaintTrackingScreen from "./screens/ComplaintTrackingScreen";
import ContactUs from "./screens/ContactUs";
import FileComplaint from "./screens/FileComplaint";
import ForgetPassword from "./screens/ForgetPassword";
import NotificationScreen from "./screens/NotificationScreen";
import SearchTransactionScreen from "./screens/SearchTransactionScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <UserContext>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen1"
              screenOptions={{ headerShown: false }}
            >
              {/* Splash Screens */}
              <Stack.Screen name="SplashScreen1" component={SplashScreen1} />
              
              {/* Authentication Flow */}
              <Stack.Screen name="LoginSignUp" component={LoginSignUp} />
              <Stack.Screen name="LoginCreatePass" component={LoginCreatePass} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="OtpVerification" component={OtpVerification} />
              <Stack.Screen name="PanVerification" component={PanVerification} />
              <Stack.Screen name="VerificationCompleted" component={VerificationCompleted} />
              <Stack.Screen name="EnterPin" component={EnterPin} />
              
              {/* Main App */}
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              
              {/* Additional Screens */}
              <Stack.Screen name="History" component={History} />
              <Stack.Screen name="AadharDetails" component={AadharDetails} />
              <Stack.Screen name="CheckBalanceBanks" component={CheckBalanceBanks} />
              <Stack.Screen name="Recharge1" component={Recharge1} />
              <Stack.Screen name="Recharge" component={RechargeScreen} />
              <Stack.Screen name="AllServices" component={AllServices} />
              <Stack.Screen name="FastagTransaction" component={FastagTransaction} />
              <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
              <Stack.Screen name="SearchTransactionScreen" component={SearchTransactionScreen} />
              <Stack.Screen name="ContactUs" component={ContactUs} />
              <Stack.Screen name="AboutUs" component={AboutUs} />
              <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
              <Stack.Screen name="FileComplaint" component={FileComplaint} />
              <Stack.Screen name="ComplaintTrackingScreen" component={ComplaintTrackingScreen} />
              <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </UserContext>
  );
}
