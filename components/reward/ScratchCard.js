// import React, { useRef, useState, useEffect } from 'react';
// import {
//   Canvas,
//   Group,
//   Image,
//   Mask,
//   Path,
//   Rect,
//   Skia,
// } from '@shopify/react-native-skia';
// import { View, StyleSheet, Alert } from 'react-native';
// import { useAppStore } from '../../zustand/Store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export const ScratchCard = ({ style, children, image, img_id }) => {
//   const { scratchCards, updateScratchStatus } = useAppStore();
//   const [[width, height], setSize] = useState([0, 0]);
//   const path = useRef(Skia.Path.Make());
//   const [scratchedPixels, setScratchedPixels] = useState(0);
//   const [isContentVisible, setContentVisible] = useState(false);
//   const [isScratching, setIsScratching] = useState(false); // Track active scratching

//   const isRevealed = scratchCards.find(card => card.id === img_id)?.IsScratched || false;

//   useEffect(() => {
//     const totalArea = width * height;
//     const scratchedPercentage = (scratchedPixels / totalArea) * 100;

//     console.log(`ScratchCard ${img_id}: scratchedPixels=${scratchedPixels}, totalArea=${totalArea}, percentage=${scratchedPercentage}%`);

//     if (scratchedPercentage >= 40 && !isRevealed && !isContentVisible) {
//       console.log(`ScratchCard ${img_id}: Reached 40% threshold, revealing content`);
//       setContentVisible(true);
//       updateScratchStatus(img_id);
//       ScratchVoucher(img_id);
//     }
//   }, [scratchedPixels, width, height, isRevealed, img_id]);

//   const ScratchVoucher = async (voucherId) => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       const headers = {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "Authorization": `Bearer ${token}`,
//       };
//       const response = await axios.post(
//         `https://bbpslcrapi.lcrpay.com//network/scratch_voucher`,
//         { voucherid: voucherId },
//         { headers }
//       );

//       if (response.status === 200) {
//         console.log(`ScratchCard ${voucherId}: Successfully scratched`);
//       }
//     } catch (error) {
//       console.error(`ScratchCard ${voucherId}: Error scratching voucher`, error);
//       if (axios.isAxiosError(error)) {
//         Alert.alert("Error", error.response?.data?.detail || "Something went wrong!");
//       } else {
//         Alert.alert("Error", "Unexpected error");
//       }
//     }
//   };

//   const handleTouchStart = ({ nativeEvent }) => {
//     if (isRevealed || isContentVisible) return;

//     setIsScratching(true);
//     const { locationX, locationY } = nativeEvent;
//     path.current.moveTo(locationX, locationY);
//     console.log(`ScratchCard ${img_id}: Touch started at (${locationX}, ${locationY})`);
//   };

//   const handleScratch = ({ nativeEvent }) => {
//     if (isRevealed || isContentVisible || !isScratching) return;

//     const { locationX, locationY } = nativeEvent;
//     path.current.lineTo(locationX, locationY);

//     // Estimate scratched area based on stroke width and path length
//     const strokeWidth = 50; // Match strokeWidth in Path
//     const pathLength = path.current.computeLength() || 1;
//     const estimatedScratchedArea = pathLength * strokeWidth;

//     setScratchedPixels((prev) => {
//       const newValue = Math.min(prev + estimatedScratchedArea, width * height);
//       console.log(`ScratchCard ${img_id}: Updated scratchedPixels to ${newValue}`);
//       return newValue;
//     });
//   };

//   const handleTouchEnd = () => {
//     setIsScratching(false);
//     console.log(`ScratchCard ${img_id}: Touch ended`);
//   };

//   return (
//     <View
//       onLayout={(e) => {
//         const { width, height } = e.nativeEvent.layout;
//         setSize([width, height]);
//         console.log(`ScratchCard ${img_id}: Layout set to ${width}x${height}`);
//       }}
//       style={[styles.container, style]}
//     >
//       {Boolean(image && width && height) && (
//         <>
//           {(isRevealed || isContentVisible) && (
//             <View style={styles.content}>
//               {console.log(`ScratchCard ${img_id}: Showing content (isRevealed=${isRevealed}, isContentVisible=${isContentVisible})`)}
//               {children}
//             </View>
//           )}
//           {!(isRevealed || isContentVisible) && (
//             <Canvas
//               style={styles.canvas}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleScratch}
//               onTouchEnd={handleTouchEnd}
//             >
//               {console.log(`ScratchCard ${img_id}: Rendering Canvas with image`)}
//               <Mask
//                 mode="luminance"
//                 mask={
//                   <Group>
//                     <Rect x={0} y={0} width={width} height={height} color="white" />
//                     <Path
//                       path={path.current}
//                       color="black"
//                       style="stroke"
//                       strokeJoin="round"
//                       strokeCap="round"
//                       strokeWidth={50}
//                     />
//                   </Group>
//                 }
//               >
//                 <Image
//                   image={image}
//                   fit="cover"
//                   x={0}
//                   y={0}
//                   width={width}
//                   height={height}
//                 />
//               </Mask>
//             </Canvas>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     width: 300,
//     height: 300,
//     overflow: 'hidden',
//   },
//   content: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//   },
//   canvas: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//   },
// });

import React, { useRef, useState, useEffect } from "react";
import {
  Canvas,
  Group,
  Image,
  Mask,
  Path,
  Rect,
  Skia,
} from "@shopify/react-native-skia";
import { View, StyleSheet, Alert } from "react-native";
import { useAppStore } from "../../zustand/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Theme from "../Theme";
import { BASE_URL } from "../../utils/config";

export const ScratchCard = ({ style, children, image, img_id }) => {
  const { scratchCards, updateScratchStatus } = useAppStore();
  const [[width, height], setSize] = useState([0, 0]);
  const path = useRef(Skia.Path.Make());
  const [scratchedPixels, setScratchedPixels] = useState(0);
  const [isContentVisible, setContentVisible] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  // Get the current card status from the store
  const cardStatus = scratchCards.find((card) => card.id === img_id);
  const isRevealed = cardStatus?.IsScratched || false;

  // Reset local state when the card changes
  useEffect(() => {
    if (isRevealed) {
      setContentVisible(true);
    } else {
      setContentVisible(false);
      setScratchedPixels(0);
      path.current = Skia.Path.Make();
    }
  }, [img_id, isRevealed]);

  useEffect(() => {
    if (width === 0 || height === 0) return;

    const totalArea = width * height;
    const scratchedPercentage = (scratchedPixels / totalArea) * 100;

    console.log(
      `ScratchCard ${img_id}: scratchedPixels=${scratchedPixels}, totalArea=${totalArea}, percentage=${scratchedPercentage}%`
    );

    if (scratchedPercentage >= 40 && !isRevealed && !isContentVisible) {
      console.log(
        `ScratchCard ${img_id}: Reached 40% threshold, revealing content`
      );
      setContentVisible(true);
      updateScratchStatus(img_id);
      ScratchVoucher(img_id);
    }
  }, [scratchedPixels, width, height, isRevealed, img_id]);

  const ScratchVoucher = async (voucherId) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${BASE_URL}/network/scratch_voucher`,
        { voucherid: voucherId },
        { headers }
      );

      if (response.status === 200) {
        console.log(`ScratchCard ${voucherId}: Successfully scratched`);
      }
    } catch (error) {
      console.error(
        `ScratchCard ${voucherId}: Error scratching voucher`,
        error
      );
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.detail || "Something went wrong!"
        );
      } else {
        Alert.alert("Error", "Unexpected error");
      }
    }
  };

  const handleTouchStart = ({ nativeEvent }) => {
    if (isRevealed || isContentVisible) return;

    setIsScratching(true);
    const { locationX, locationY } = nativeEvent;
    path.current.moveTo(locationX, locationY);
    console.log(
      `ScratchCard ${img_id}: Touch started at (${locationX}, ${locationY})`
    );
  };

  const handleScratch = ({ nativeEvent }) => {
    if (isRevealed || isContentVisible || !isScratching) return;

    const { locationX, locationY } = nativeEvent;
    path.current.lineTo(locationX, locationY);

    const strokeWidth = 50;
    const pathLength = path.current.computeLength() || 1;
    const estimatedScratchedArea = pathLength * strokeWidth;

    setScratchedPixels((prev) => {
      const newValue = Math.min(prev + estimatedScratchedArea, width * height);
      console.log(
        `ScratchCard ${img_id}: Updated scratchedPixels to ${newValue}`
      );
      return newValue;
    });
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
    console.log(`ScratchCard ${img_id}: Touch ended`);
  };

  return (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize([width, height]);
        console.log(`ScratchCard ${img_id}: Layout set to ${width}x${height}`);
      }}
      style={[styles.container, style]}
    >
      {Boolean(image && width && height) && (
        <>
          {isRevealed || isContentVisible ? (
            <View style={styles.content}>
              {console.log(
                `ScratchCard ${img_id}: Showing content (isRevealed=${isRevealed}, isContentVisible=${isContentVisible})`
              )}
              {children}
            </View>
          ) : (
            <Canvas
              style={styles.canvas}
              onTouchStart={handleTouchStart}
              onTouchMove={handleScratch}
              onTouchEnd={handleTouchEnd}
            >
              {console.log(
                `ScratchCard ${img_id}: Rendering Canvas with image`
              )}
              <Mask
                mode="luminance"
                mask={
                  <Group>
                    <Rect
                      x={0}
                      y={0}
                      width={width}
                      height={height}
                      color="white"
                    />
                    <Path
                      path={path.current}
                      color="black"
                      style="stroke"
                      strokeJoin="round"
                      strokeCap="round"
                      strokeWidth={50}
                    />
                  </Group>
                }
              >
                <Image
                  image={image}
                  fit="cover"
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                />
              </Mask>
            </Canvas>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 300,
    height: 300,
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});
