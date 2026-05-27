import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import GestureRecognizer from "react-native-swipe-gestures";

const { width, height } = Dimensions.get("window");

const images = [
  require("../assets/promotion.jpg"),
  require("../assets/promotion2.jpg"),
  require("../assets/promotion3.jpg"),
];

const SliderTransition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    translateX.value = withTiming(
      -width,
      { duration: 500, easing: Easing.out(Easing.ease) },
      () => {
        translateX.value = 0;
      }
    );
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1);
    }
    translateX.value = withTiming(
      width,
      { duration: 500, easing: Easing.out(Easing.ease) },
      () => {
        translateX.value = 0;
      }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeLeft={nextImage}
      onSwipeRight={prevImage}
    >
      <View style={styles.sliderContainer}>
        <Animated.Image
          source={images[currentIndex]}
          style={[styles.image, animatedStyle]}
        />
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  sliderContainer: {
    width,
    height,
    overflow: "hidden",
    borderRadius: 20,
  },
  image: {
    width,
    height,
    resizeMode: "cover",
  },
});

export default SliderTransition;
