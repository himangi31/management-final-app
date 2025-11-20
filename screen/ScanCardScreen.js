import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Animated,
  Easing,
  ImageBackground
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { useNavigation } from '@react-navigation/native';

export default function ScanCardScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [scannedText, setScannedText] = useState([]);
  const navigation = useNavigation();

  const scanScaleValue = useRef(new Animated.Value(1)).current;

  const animateButton = (animValue) => {
    Animated.loop(
      Animated.sequence([  
        Animated.timing(animValue, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateButton(scanScaleValue);
    requestPermissions();
    handleScan(); // Directly trigger scan
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );
        if (!allGranted) {
          Alert.alert('Permissions Required', 'Camera and storage permissions are needed.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleScan = async () => {
  try {
    const result = await launchCamera({ mediaType: "photo", includeBase64: false, quality: 1 });
    if (!result?.assets?.length) { 
      Alert.alert("Cancelled or Failed to Capture"); 
      return; 
    }

    const uri = result.assets[0].uri;

    // OCR
    const textArray = await TextRecognition.recognize(uri);

    const lines = textArray
      .map(l => l?.trim())    // handle null/undefined
      .filter(Boolean);       // remove empty lines

    const rawText = lines.join("\n");

    // Initialize fields
    let name = "";
    let email = "";
    let phone = "";
    let company = "";

    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\d{10}/;
    const websiteRegex = /(www\.[^\s]+|https?:\/\/[^\s]+)/i;
    const companyKeywords = ["solutions","technologies","pvt","ltd","inc","corp","systems"];

    lines.forEach(line => {
      if (!line) return;

      const l = line.toLowerCase();
      const cleanedLine = line.replace(/\s/g, ""); // safer for phone/email

      // Email
      if (!email && emailRegex.test(cleanedLine)) {
        const match = cleanedLine.match(emailRegex);
        if (match && match[0]) email = match[0];
        return;
      }

      // Phone
      if (!phone && phoneRegex.test(cleanedLine)) {
        const match = cleanedLine.match(phoneRegex);
        if (match && match[0]) phone = match[0];
        return;
      }

      // Company
      if (!company && (companyKeywords.some(kw => l.includes(kw)) || websiteRegex.test(line))) {
        company = line;
        return;
      }

      // Name fallback: line that is not email, phone, company
      if (!name && !email && !phone && !company) {
        name = line;
      }
    });

    console.log({ name, email, phone, company });

    // Pass empty designation for manual entry
    navigation.navigate("EnterCard", {
      name,
      designation: "", // manually entered by user
      email,
      phone,
      company,
      scannedText: rawText
    });

  } catch (error) {
    console.error("OCR Error:", error);
    Alert.alert("OCR Error", error.message);
  }
};


  return (
    
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        {/* Content for ScanCardScreen (if necessary) */}
      </ScrollView>
 
  );
}
