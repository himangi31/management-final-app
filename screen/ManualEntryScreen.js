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
} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const fontFamily = "Inter";  // Clean professional font

const ManualEntryScreen = ({ route }) => {
  const [visitor, setVisitor] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
  });

  const [ocrText, setOcrText] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // 🔥 REQUIREMENTS (STATIC FRONTEND LIST)
  const [requirements] = useState([
    { id: 1, name: "UPS" },
    { id: 2, name: "Li-Ion battery" },
    { id: 3, name: "BESS" },
    { id: 4, name: "Solar Transformer" },
    { id: 5, name: "Others" },
  ]);

  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [reqDropdownVisible, setReqDropdownVisible] = useState(false);

  useEffect(() => { 
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setLoggedUser(userObj);
        }
      } catch (e) {
        console.log("AsyncStorage Error:", e);
      }
    };

    fetchUser();
   },[]);

  useEffect(() => {
    if (route && route.params) {
      const { name, email, phone, company, designation, program, scannedText } = route.params;

      setVisitor({
        name: name || '',
        email: email || '',
        phone: phone || '',
        company: company || '',
        designation: designation || '',
      });

      if (program) setSelectedProgram({ name: program });
      if (scannedText) setOcrText(scannedText);
    }
  }, [route]);

  useEffect(() => {
    axios
      .get('http://16.171.188.189:3000/api/visitors/select')
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

    if (!name || !email || !phone || !selectedProgram || !selectedRequirement) {
      Alert.alert("Missing Fields", "Please fill all required fields including Program & Requirement.");
      return;
    }

    if (!loggedUser || !loggedUser.id) {
      Alert.alert("Error", "User not loaded. Login again.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        company,
        designation,
        program: selectedProgram.name,
        requirement: selectedRequirement.name,
        image: ocrText,
        user_id: loggedUser.id,
      };

      const res = await axios.post(
        "http://16.171.188.189:3000/api/visitors/save",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        Alert.alert("Visitor Saved Successfully ✅", res.data.message);
        setVisitor({ name: "", email: "", phone: "", company: "", designation: "" });
        setSelectedProgram(null);
        setSelectedRequirement(null);
        setOcrText(null);
      } else {
        Alert.alert("Failed", res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit Error:", error.message);
      Alert.alert("Error", "Could not connect to the server");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <ScrollView   contentContainerStyle={[styles.container, { paddingBottom: 120 }]} keyboardShouldPersistTaps="handled">

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.heading}>Manual Visitor Entry</Text>

        {/* OCR BOX (SCROLLABLE + SMALL) */}
{ocrText ? (
  <View style={styles.ocrBox}>
    <Text style={styles.ocrLabel}>Scanned Text</Text>

    <ScrollView style={styles.ocrScroll} nestedScrollEnabled>
      <Text style={styles.ocrText}>{ocrText}</Text>
    </ScrollView>

  </View>
) : (
  <Text style={styles.noText}>No Text Scanned</Text>
)}

          {/* FIELDS */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#999"
            style={styles.input}
            value={visitor.name}
            onChangeText={(t) => handleFieldChange("name", t)}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            style={styles.input}
            value={visitor.email}
            onChangeText={(t) => handleFieldChange("email", t)}
          />

          <TextInput
            placeholder="Phone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            style={styles.input}
            value={visitor.phone}
            onChangeText={(t) => handleFieldChange("phone", t)}
          />

          <TextInput
            placeholder="Company (Optional)"
            placeholderTextColor="#999"
            style={styles.input}
            value={visitor.company}
            onChangeText={(t) => handleFieldChange("company", t)}
          />

          <TextInput
            placeholder="Remarks (Optional)"
            placeholderTextColor="#999"
            style={styles.input}
            value={visitor.designation}
            onChangeText={(t) => handleFieldChange("designation", t)}
          />

          {/* PROGRAM */}
          <Text style={styles.label}>Select Event</Text>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setDropdownVisible(true)}>
            <Text style={styles.dropdownText}>
              {selectedProgram ? selectedProgram.name : "Select Event"}
            </Text>
          </TouchableOpacity>

          {/* REQUIREMENT */}
          <Text style={styles.label}>Select Requirement</Text>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setReqDropdownVisible(true)}>
            <Text style={styles.dropdownText}>
              {selectedRequirement ? selectedRequirement.name : "Select Requirement"}
            </Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save Visitor</Text>
          </TouchableOpacity>
        </View>

        {/* PROGRAM Modal */}
        <Modal visible={dropdownVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalList}>
              <FlatList
                data={programs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedProgram(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={styles.closeBtn} onPress={() => setDropdownVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* REQUIREMENT Modal */}
        <Modal visible={reqDropdownVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalList}>
              <FlatList
                data={requirements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedRequirement(item);
                      setReqDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity style={styles.closeBtn} onPress={() => setReqDropdownVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily,
    marginBottom: 15,
    color: "#222",
    textAlign: "center",
  },
ocrBox: {
  backgroundColor: "#f0f0f0",
  padding: 12,
  borderRadius: 12,
  marginBottom: 20,
  maxHeight: 150,   // SMALL BOX
},

ocrScroll: {
  maxHeight: 120,   // SCROLL AREA
},

ocrLabel: {
  fontWeight: "600",
  fontFamily,
  color: "#333",
  marginBottom: 5,
},

ocrText: {
  fontFamily,
  color: "#222",
  fontSize: 13,
  lineHeight: 18,
},

  noText: {
    textAlign: "center",
    color: "#777",
    fontFamily,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily,
    color: "#333",
    marginBottom: 14,
  },

  label: {
    marginBottom: 6,
    fontFamily,
    color: "#444",
    fontWeight: "600",
  },

  dropdownBtn: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },

  dropdownText: {
    fontFamily,
    color: "#333",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },

  modalList: {
    backgroundColor: "#fff",
    width: "80%",
    maxHeight: 300,
    borderRadius: 12,
    paddingVertical: 10,
    overflow: "hidden",
    elevation: 6,
  },

  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalItemText: {
    fontFamily,
    fontSize: 15,
    color: "#333",
  },

  closeBtn: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#eee",
  },

  submitButton: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,

  },

  submitText: {
    color: "#fff",
    fontFamily,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ManualEntryScreen;
