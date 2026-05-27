import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    Linking,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';


export default function PhonePeLoginScreen() {

    const name = "ABHISHEK KUMAR";
    const phone = "+91 9919701660";
    const onContinue = () => { };
    const onLoginAnother = () => { };
    const avatarUri = "https://i.pravatar.cc/150?img=12";
    const profileSource = useMemo(() => {
        if (avatarUri) return { uri: avatarUri };
        // fallback placeholder — replace with your asset
        return {
            uri: "https://i.pravatar.cc/150?img=12",
        };
    }, [avatarUri]);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <View style={styles.container}>
                {/* The empty black space at the top (like your screenshot) */}
                <View style={styles.heroSpacer} />

                {/* Bottom sheet card */}
                <View style={styles.sheet}>
                    {/* PhonePe logo in a purple circle with Devanagari 'पे' */}
                    <View style={styles.logoWrap}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>पे</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Log in to PhonePe</Text>

                    {/* Profile card */}
                    <View style={styles.profileCard}>
                        <View style={styles.profileLeft}>
                            <Image source={profileSource} style={styles.avatar} />
                            <View style={styles.miniBadge}>
                                <Text style={styles.miniBadgeText}>पे</Text>
                            </View>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text numberOfLines={1} style={styles.profileName}>
                                {name}
                            </Text>
                            <Text style={styles.profilePhone}>{phone}</Text>
                        </View>
                    </View>

                    {/* Primary CTA */}
                    <TouchableOpacity
                        onPress={onContinue}
                        activeOpacity={0.9}
                        style={styles.primaryBtn}
                    >
                        <Text style={styles.primaryBtnText}>Continue as {name}</Text>
                    </TouchableOpacity>

                    {/* Secondary link */}
                    <TouchableOpacity
                        onPress={onLoginAnother}
                        activeOpacity={0.7}
                        style={styles.secondaryLinkWrap}
                    >
                        <Text style={styles.secondaryLink}>
                            Login with another PhonePe Account
                        </Text>
                    </TouchableOpacity>

                    {/* Terms line */}
                    <Text style={styles.termsText}>
                        By proceeding, you are agreeing to PhonePe&apos;s{" "}
                        <Text
                            style={styles.link}
                            onPress={() => Linking.openURL("https://www.phonepe.com/terms")}
                        >
                            Terms and Conditions
                        </Text>{" "}
                        &{" "}
                        <Text
                            style={styles.link}
                            onPress={() => Linking.openURL("https://www.phonepe.com/privacy")}
                        >
                            Privacy Policy
                        </Text>
                        .
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const PURPLE = "#7B3AED"; // close to PhonePe purple
const BG = "#0B0B0B";
const CARD_BG = "#16161A";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "#B3B3B3";

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: BG,
    },
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    heroSpacer: {
        flex: 1, // large black top area like screenshot
    },
    sheet: {
        backgroundColor: CARD_BG,
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 26,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        // slight outer shadow lift
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
        elevation: 16,
    },
    logoWrap: {
        alignItems: "flex-start",
        marginBottom: 14,
    },
    logoCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
    },
    title: {
        color: TEXT_PRIMARY,
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 14,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: BORDER,
        backgroundColor: "#121216",
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
    },
    profileLeft: {
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 8,
    },
    miniBadge: {
        position: "absolute",
        right: -6,
        bottom: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#0F0F0F",
    },
    miniBadgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "800",
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: TEXT_PRIMARY,
        fontSize: 15.5,
        fontWeight: "700",
        marginBottom: 2,
    },
    profilePhone: {
        color: TEXT_SECONDARY,
        fontSize: 13.5,
    },
    primaryBtn: {
        backgroundColor: PURPLE,
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 4,
    },
    primaryBtnText: {
        color: "#FFFFFF",
        fontSize: 15.5,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    secondaryLinkWrap: {
        marginTop: 12,
        marginBottom: 6,
        alignItems: "center",
    },
    secondaryLink: {
        color: "#A78BFA",
        fontSize: 14,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    termsText: {
        color: TEXT_SECONDARY,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 8,
    },
    link: {
        color: "#93C5FD",
        textDecorationLine: "underline",
    },
});
