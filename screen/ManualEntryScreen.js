import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
  FlatList,
  Image, // <-- ADD THIS
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const ManualEntryScreen = ({ route }) => {
  const [visitor, setVisitor] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
  });

  const [imagePath, setImagePath] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (route && route.params) {
      const { name, email, phone, company, designation, program, imagePath } = route.params;
      setVisitor({
        name: name || '',
        email: email || '',
        phone: phone || '',
        company: company || '',
        designation: designation || '',
      });
      if (program) setSelectedProgram({ name: program });
      if (imagePath) setImagePath(imagePath);
    }
  }, [route]);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/api/visitors/select')
      .then((res) => {
        if (res.data.success) {
          setPrograms(res.data.programs);
        } else {
          Alert.alert('Error', 'Failed to fetch programs');
        }
      })
      .catch((err) => {
        console.error('Fetch Programs Error:', err.message);
        Alert.alert('Error', 'Could not fetch programs');
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setVisitor({ ...visitor, [field]: value });
  };

  const handleSubmit = async () => {
    const { name, email, phone, company, designation } = visitor;
    if (!name || !email || !phone || !company || !designation || !selectedProgram) {
      Alert.alert('Missing Fields', 'Please fill in all fields including Program.');
      return;
    }

      const imageUri = imagePath; 
       
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('company', company);
      formData.append('designation', designation);
      formData.append('program', selectedProgram.name);

      if (imagePath) {
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      const res = await axios.post('http://198.168.10.53:3000/api/visitors/save', formData, {
        headers: {  'Content-Type': 'multipart/form-data', },
      });

      if (res.data.success) {
        Alert.alert('✅ Visitor Saved', res.data.message);
        setVisitor({ name: '', email: '', phone: '', company: '', designation: '' });
        setSelectedProgram(null);
        setImagePath(null);
      } else {
        Alert.alert('❌ Failed', res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit Error:', error.message);
      Alert.alert('❌ Error', 'Could not connect to the server');
    }
  };

  return (
    <LinearGradient colors={['#0046BF', '#f1f2f5ff']} style={styles.gradient}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Manual Visitor Entry</Text>

          {/* IMAGE PREVIEW */}
          {imagePath ? (
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={{ uri: imagePath }}
                style={{ width: 150, height: 150, borderRadius: 10, borderWidth: 1, borderColor: '#ccc' }}
              />
              <Text style={{ color: '#fff', marginTop: 5 }}>Scanned Image Preview</Text>
            </View>
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
              No Image Scanned
            </Text>
          )}

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={visitor.name}
            onChangeText={(text) => handleFieldChange('name', text)}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="email-address"
            value={visitor.email}
            onChangeText={(text) => handleFieldChange('email', text)}
          />
          <TextInput
            placeholder="Phone"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="phone-pad"
            value={visitor.phone}
            onChangeText={(text) => handleFieldChange('phone', text)}
          />
          <TextInput
            placeholder="Company"
            placeholderTextColor="#888"
            style={styles.input}
            value={visitor.company}
            onChangeText={(text) => handleFieldChange('company', text)}
          />
          <TextInput
            placeholder="Designation"
            placeholderTextColor="#888"
            style={styles.input}
            value={visitor.designation}
            onChangeText={(text) => handleFieldChange('designation', text)}
          />

          <Text style={{ color: '#fff', marginBottom: 5 }}>Select Program</Text>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setDropdownVisible(true)}>
            <Text style={{ color: selectedProgram ? '#000' : '#999' }}>
              {selectedProgram ? selectedProgram.name : 'Select Program'}
            </Text>
          </TouchableOpacity>

          <Modal visible={dropdownVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.dropdownList}>
                <FlatList
                  data={programs}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedProgram(item);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.closeBtn} onPress={() => setDropdownVisible(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={handleSubmit}>
            <LinearGradient colors={['#0046BF', '#0071EB']} style={styles.submitButton}>
              <Text style={styles.submitText}>Save Visitor</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, justifyContent: 'center' },
  heading: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 25, alignSelf: 'center' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  dropdownBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: 300,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeBtn: { padding: 12, alignItems: 'center', backgroundColor: '#eee' },
  submitButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 1, height: 2 },
  },
  submitText: { color: '#f9f9fdff', fontSize: 16, fontWeight: '700' },
});

export default ManualEntryScreen;
