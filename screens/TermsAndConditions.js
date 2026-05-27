import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Theme from "../components/Theme";
import { Bold } from "lucide-react-native";

const TermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.paragraph}>
         The following are the Terms & Conditions for online payments. Please read them carefully. By accessing this website/app, you agree to be bound by the following Terms & Conditions.
        </Text>
<Text style={styles.subHeading}>General Terms</Text>
        <Text style={styles.paragraph}>
          The Company/Payment Service Provider will take all reasonable steps to ensure the accuracy of the payment details; however, the Company/Payment Service Provider will not be liable for any error. The User will not hold the Company/Payment Service Provider responsible for any loss, damages, etc., that may be incurred/suffered by the User by using the payment gateway.
{"\n"}
The User will not hold the Company/Payment Service Provider responsible for rejecting the payment amount due to incorrect or incomplete entries. The User agrees that the debit/credit card details provided for use of the aforesaid Service(s) must be correct and accurate, and that the User shall not use a debit/credit card that is not lawfully owned by them or the use of which is not authorized by the lawful owner thereof. The User further agrees and undertakes to provide correct and valid debit/credit card details.
{"\n"}
The Company/Payment Service Provider shall not be liable for any inaccuracy, error, or delay in, or omission of (a) any data, information, or message, or (b) the transmission or delivery of any such data, information, or message; or (c) any loss or damage arising from or occasioned by any such inaccuracy, error, delay, or omission, non-performance, or interruption in any such data, information, or message.
{"\n"}
The User agrees that the record of the instructions given and transactions done shall be conclusive proof and binding for all purposes and can be used as evidence in any proceeding.
{"\n"}
The User agrees that the services will be at the sole discretion of the Company, and the Company will be at liberty to vary the same from time to time without giving any notice        </Text>
<Text style={styles.subHeading}>Data Usage and Sharing</Text>
        <Text style={styles.paragraph}>
        The Company may use and retain any information or data supplied by the User and will be at liberty to share the information and data with any other associate company or as may be required by any law or regulation.        </Text>
<Text style={styles.subHeading}>Communication</Text>
        <Text style={styles.paragraph}>
         The User agrees to receive all sales or service calls from the Company’s employees/partners/alliances, notwithstanding their registration for the DND registry.

        </Text>
<Text style={styles.subHeading}>Cancellation and Refund</Text>
        <Text style={styles.paragraph}>
         In the event the User wishes to cancel any of the services under this portal, they shall write to the customer support of the Company no later than 7 days after placing the order. The cancellation will be effective only after due confirmation from the Company, and a notification to this effect will be sent to the User. The amount paid by the User will be refunded within 10 days of effective cancellation. No claims for refund/chargeback shall be made by any User if such a cancellation request is made beyond the time specified above.
{"\n"}
If the money was deducted from your account while making a payment and your order was unsuccessful, then your payment will be refunded to your account within 7 days.        </Text>
<Text style={styles.subHeading}>Service Withdrawal</Text>
        <Text style={styles.paragraph}>
          The User agrees that the Company is at liberty to withdraw the Online Payment facility, or any services provided thereunder, in respect of any or all the account(s) without assigning any reason whatsoever, without giving any notice.

        </Text>
<Text style={styles.subHeading}>Payment Gateway Issues</Text>
        <Text style={styles.paragraph}>
          In case the Website or Payment Service webpage linked to the Website/app is experiencing server-related issues like ‘slow down,’ ‘failure,’ or ‘session timeout,’ the User shall, before initiating a second payment, check whether their Bank Account has been debited and accordingly resort to one of the following options:
        </Text>

        <Text style={styles.subParagraph}>
         If the Bank Account appears to be debited, ensure that they do not make the payment twice and immediately contact customer support.
{"\n"}If the Bank Account is not debited, the User may initiate a fresh transaction to make payment.
        </Text>

        <Text style={styles.paragraph}>
          The Company/Payment Service Provider assumes no liability whatsoever for any monetary or other damage suffered by the User on account of:


        </Text>

        <Text style={styles.subParagraph}>
          The delay, failure, interruption, or corruption of any data or other information transmitted in connection with the use of the Payment Gateway or Services in connection thereto; and/or
Any interruption or errors in the operation of the Payment Gateway.
        </Text>

<Text style={styles.subHeading}>Data Security</Text>
        <Text style={styles.paragraph}>
          The User agrees, understands, and confirms that their personal data, including without limitation details relating to debit card/credit card transmitted over the Internet, may be susceptible to misuse, hacking, theft, and/or fraud, and the Company has no control over such matters.
        </Text>

<Text style={styles.subHeading}>Payment Gateway Disclaimer</Text>
        <Text style={styles.paragraph}>
          The Service is provided to facilitate access to pay for the services offered online. The Company does not make any representation of any kind, express or implied, as to the operation of the Payment Gateway other than what is specified on the Website for this purpose. By accepting/agreeing to these Terms and Conditions, the User expressly agrees that their use of the aforesaid online payment Service is entirely at their own risk and responsibility.
        </Text>


      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  subParagraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
    textAlign: "justify",
    marginLeft: 20, // Adds indentation to make it look like a sub-list
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007bff",
    marginVertical: 5,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginLeft: 10,
  },
});

export default TermsAndConditions;
