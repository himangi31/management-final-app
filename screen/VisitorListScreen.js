import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';

const logo = require('../asset/icon.png');
const cardBg = require('../asset/aa.jpg');

const VisitorCard = ({ visitor }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();

  const onPressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.cardInner, { transform: [{ scale: scaleAnim }] }]}>
      <ImageBackground source={cardBg} style={styles.cardInner} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.cardLeft}>
          <Text style={styles.name}>{visitor.name}</Text>
          <Text style={styles.details}>{visitor.designation} • {visitor.company}</Text>
          <Text style={styles.details}>{visitor.email}</Text>
          <Text style={styles.details}>{visitor.phone}</Text>
        </View>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </ImageBackground>
    </Animated.View>
  );
};

const VisitorListScreen = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editVisitor, setEditVisitor] = useState(null);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get('http://10.0.2.2:3000/api/visitors');
      setVisitors(res.data.visitors);
    } catch (e) {
      Alert.alert('Error', 'Failed to load visitor data');
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(v =>
    v.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelection = (id) => {
    let updated;
    if (selectedVisitors.includes(id)) {
      updated = selectedVisitors.filter(i => i !== id);
    } else {
      updated = [...selectedVisitors, id];
    }
    setSelectedVisitors(updated);
    setSelectionMode(updated.length > 0);
    setSelectAll(updated.length === filteredVisitors.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedVisitors([]);
      setSelectionMode(false);
      setSelectAll(false);
    } else {
      const allIds = filteredVisitors.map(v => v.idvisitors);
      setSelectedVisitors(allIds);
      setSelectionMode(true);
      setSelectAll(true);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedVisitors.map(id =>
        axios.delete(`http://10.0.2.2:3000/api/visitors/${id}`)
      ));
      setVisitors(visitors.filter(v => !selectedVisitors.includes(v.idvisitors)));
      setSelectedVisitors([]);
      setSelectionMode(false);
      setSelectAll(false);
      Alert.alert('Deleted', 'Selected visitors removed.');
    } catch (e) {
      Alert.alert('Error', 'Failed to delete selected.');
    }
  };

  const handleExport = async () => {
    const data = visitors.map(v => ({
      Name: v.name, Email: v.email, Phone: v.phone,
      Company: v.company, Designation: v.designation
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const path = `${RNFS.DownloadDirectoryPath}/visitors_export.xlsx`;
    await RNFS.writeFile(path, wbout, 'ascii');
    Alert.alert('Exported', `Excel file saved to:\n${path}`);
  };

  const renderVisitor = ({ item }) => {
    const isSelected = selectedVisitors.includes(item.idvisitors);
    return (
      <View style={[styles.cardRow, isSelected && styles.cardSelected]}>
        <TouchableOpacity onPress={() => toggleSelection(item.idvisitors)} style={styles.checkbox}>
          <View style={[styles.checkboxBox, isSelected && styles.checkboxChecked]}>
            {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (selectionMode) {
              toggleSelection(item.idvisitors);
            } else {
              setSelectedVisitor(item);
              setModalVisible(true);
              setEditMode(false);
            }
          }}
          onLongPress={() => toggleSelection(item.idvisitors)}
          style={{ flex: 1 }}
        >
          <VisitorCard visitor={item} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="🔍 Search by name..."
        style={styles.search}
        value={searchText}
        onChangeText={setSearchText}
      />

      {filteredVisitors.length > 0 && (
        <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllRow}>
          <View style={[styles.checkboxBox, selectAll && styles.checkboxChecked]}>
            {selectAll && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
          <Text style={styles.selectAllText}>{selectAll ? 'Unselect All' : 'Select All'}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredVisitors}
        keyExtractor={item => item.idvisitors}
        renderItem={renderVisitor}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity onPress={handleExport} style={styles.exportBtn}>
        <View style={styles.exportGradient}><Text style={styles.exportText}>📁 Export to Excel</Text></View>
      </TouchableOpacity>

      {selectionMode && (
        <TouchableOpacity onPress={handleDeleteSelected} style={[styles.exportBtn, { bottom: 80 }]}>
          <View style={[styles.exportGradient, { backgroundColor: '#ff3b30' }]}>
            <Text style={styles.exportText}>🗑️ Delete Selected</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedVisitor && !editMode ? (
              <>
                <Text style={styles.modalName}>{selectedVisitor.name}</Text>
                <Text style={styles.modalDetail}>📧 {selectedVisitor.email}</Text>
                <Text style={styles.modalDetail}>📞 {selectedVisitor.phone}</Text>
                <Text style={styles.modalDetail}>🏢 {selectedVisitor.company}</Text>
                <Text style={styles.modalDetail}>💼 {selectedVisitor.designation}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setEditVisitor({ ...selectedVisitor });
                    setEditMode(true);
                  }}
                  style={[styles.closeBtn, { backgroundColor: '#1D2671', marginTop: 10 }]}
                >
                  <Text style={styles.closeText}> Edit</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalName}>Edit Visitor</Text>
                <TextInput style={styles.search} placeholder="Name" value={editVisitor?.name} onChangeText={text => setEditVisitor({ ...editVisitor, name: text })} />
                <TextInput style={styles.search} placeholder="Email" value={editVisitor?.email} onChangeText={text => setEditVisitor({ ...editVisitor, email: text })} />
                <TextInput style={styles.search} placeholder="Phone" value={editVisitor?.phone} onChangeText={text => setEditVisitor({ ...editVisitor, phone: text })} />
                <TextInput style={styles.search} placeholder="Company" value={editVisitor?.company} onChangeText={text => setEditVisitor({ ...editVisitor, company: text })} />
                <TextInput style={styles.search} placeholder="Designation" value={editVisitor?.designation} onChangeText={text => setEditVisitor({ ...editVisitor, designation: text })} />
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await axios.put(`http://198.168.10.53:3000/api/visitors/${editVisitor.idvisitors}`, editVisitor);
                      setModalVisible(false);
                      setEditMode(false);
                      fetchVisitors();
                      Alert.alert('Updated', 'Visitor details updated.');
                    } catch (e) {
                      Alert.alert('Error', 'Failed to update visitor.');
                    }
                  }}
                  style={[styles.closeBtn, { backgroundColor: '#1D2671', marginTop: 10 }]}
                >
                  <Text style={styles.closeText}> Save</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEditMode(false);
              }}
              style={[styles.closeBtn, { backgroundColor: '#C33764', marginTop: 10 }]}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  search: { backgroundColor: '#fff', padding: 12, borderRadius: 10, fontSize: 16, marginBottom: 10, elevation: 3 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderRadius: 16 },
  cardInner: { flex: 1, padding: 16, borderRadius: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flex: 1, marginRight: 10 },
  logo: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#ffffff88' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1D2671' ,alignContent: 'center', textAlign:'center' },
  details: { fontSize: 16, color: '#1D2671', marginTop: 2 ,alignContent: 'center', textAlign:'center'},
  exportBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', width: '90%' },
  exportGradient: { backgroundColor: '#1d4471ff', padding: 14, borderRadius: 10, alignItems: 'center' },
  exportText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cardSelected: { backgroundColor: '#e6f2ff' },
  checkbox: { padding: 6 },
  checkboxBox: { width: 24, height: 24, borderWidth: 2, borderColor: '#007bff', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#007bff' },
  checkboxTick: { color: '#fff', fontWeight: 'bold' },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectAllText: { fontSize: 16, marginLeft: 8, color: '#1D2671', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '85%', elevation: 5 },
  modalName: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalDetail: { fontSize: 16, color: '#555', marginBottom: 6 },
  closeBtn: { marginTop: 10, alignSelf: 'flex-end', backgroundColor: '#C33764', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: '600' },
});

export default VisitorListScreen;
