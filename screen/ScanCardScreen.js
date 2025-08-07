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
import { useRoute } from '@react-navigation/native';
import axios from 'axios'; // ✅ Add this line

export default function ScanCardScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [scannedText, setScannedText] = useState([]);
  const route = useRoute();

  const scanScaleValue = useRef(new Animated.Value(1)).current;
  const addScaleValue = useRef(new Animated.Value(1)).current;

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
    animateButton(addScaleValue);
    requestPermissions();
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
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
      });

      if (result?.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        // ✅ Upload to backend using axios
        const formData = new FormData();
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg',
          name: 'visiting-card.jpg',
        });

        let uploadedImageUrl = '';

        try {
          const uploadRes = await axios.post(
           'http://10.0.2.2:3000/api/visitors/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          uploadedImageUrl = uploadRes.data.imageUrl;
        } catch (err) {
          console.log('Image upload error:', err.response?.data || err.message || err);
          Alert.alert('Upload Failed', 'Image could not be uploaded.');
          return;
        }

        const text = await TextRecognition.recognize(uri);
        setScannedText(text);

        if (text.length === 0) {
          Alert.alert('No text found');
          return;
        }

        const cleanedLines = text
          .map(line => line.replace(/^[:\s\-D]+/, '').trim())
          .filter(Boolean);

        const selectedProgram = route?.params?.program || '';

        const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
        const emailLine = cleanedLines.find(line => emailRegex.test(line)) || '';
        const email = emailLine.match(emailRegex)?.[0] || '';

        const phoneRegex = /(\+91[\s-]?|0)?[6-9]\d{9}/;
        const phoneLine = cleanedLines.find(line => phoneRegex.test(line)) || '';
        const phoneMatch = phoneLine.match(phoneRegex);
        const phone = phoneMatch ? phoneMatch[0].replace(/[^\d]/g, '').slice(-10) : '';

        const websiteRegex = /(www\.[^\s]+|https?:\/\/[^\s]+)/i;
        const websiteLine = cleanedLines.find(line => websiteRegex.test(line)) || '';
        const company = websiteLine.match(websiteRegex)?.[0] || cleanedLines[cleanedLines.length - 1];

        const designationKeywords = [
          'executive', 'manager', 'officer', 'lead', 'developer', 'engineer',
          'specialist', 'consultant', 'analyst', 'head', 'intern', 'director', 'ceo', 'cto'
        ];

        let name = '';
        let designation = '';

        const exclusionPatterns = [emailRegex, phoneRegex, websiteRegex];
        const possibleLines = cleanedLines.filter(line =>
          !exclusionPatterns.some(regex => regex.test(line))
        );

        const isLikelyName = line => {
          const words = line.trim().split(/\s+/);
          return (
            words.length >= 2 &&
            words.every(word => /^[A-Z][a-zA-Z]+$/.test(word))
          );
        };

        let nameLineIndex = -1;
        for (let i = 0; i < possibleLines.length; i++) {
          if (isLikelyName(possibleLines[i])) {
            name = possibleLines[i];
            nameLineIndex = i;
            break;
          }
        }

        if (nameLineIndex !== -1) {
          const nextLine = possibleLines[nameLineIndex + 1] || '';
          const hasDesignation = designationKeywords.some(d =>
            nextLine.toLowerCase().includes(d)
          );
          if (hasDesignation) {
            designation = nextLine;
          } else {
            const words = name.split(' ');
            const keywordIndex = words.findIndex(word =>
              designationKeywords.some(d => word.toLowerCase().includes(d))
            );
            if (keywordIndex > 0) {
              designation = words.slice(keywordIndex).join(' ');
              name = words.slice(0, keywordIndex).join(' ');
            }
          }
        } else if (possibleLines.length > 0) {
          name = possibleLines[0];
          designation = possibleLines[1] || '';
        }

        navigation.navigate('EnterCard', {
          name,
          designation,
          email,
          phone,
          company,
          program: selectedProgram,
          rawText: cleanedLines,
          imagePath: uploadedImageUrl, // ✅ Updated to backend URL
        });

      } else {
        Alert.alert('Cancelled or Failed to Capture');
      }
    } catch (error) {
      console.error("OCR Error:", error);
      Alert.alert('OCR Error', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../asset/io.jpg')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Animated.View style={{ transform: [{ scale: addScaleValue }], marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#007BFF',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 30,
              alignItems: 'center'
            }}
            onPress={() => navigation.navigate('AddProgram')}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              + Add New Program
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scanScaleValue }] }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#28a745',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 30,
              alignItems: 'center'
            }}
            onPress={handleScan}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              Scan Visiting Card
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 300, height: 200, marginTop: 20 }}
          />
        )}

        {scannedText.length > 0 && (
          <>
            <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Detected Text:</Text>
            {scannedText.map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}
