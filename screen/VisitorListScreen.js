import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';

const VisitorListScreen = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

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
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (!user || !user.id) {
        Alert.alert("Error", "User ID not found, please login again!");
        return;
      }
      const res = await axios.get(`http://16.171.188.189:3000/api/visitors/user/${user.id}`);
      setVisitors(res.data.visitors);
    } catch (err) {
      Alert.alert('Error', 'Failed to load visitor data');
    }
  };

  const filteredVisitors = visitors.filter(v =>
    v.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelection = id => {
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

  async function requestStoragePermission() {
    if (Platform.OS !== 'android') return true;
    try {
      if (Platform.Version >= 33) {
        const res = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);
        return (
          res['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED ||
          res['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED ||
          res['android.permission.READ_MEDIA_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const res = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        return (
          res['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          res['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (e) {
      console.log('Permission error:', e);
      return false;
    }
  }

  const handleExport = async visitors => {
    const ok = await requestStoragePermission();
    if (!ok) {
      Alert.alert('Permission Denied', 'Please allow file access permission.');
      return;
    }

    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const data = visitors.map(v => ({
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Company: v.company,
        Designation: v.designation,
        CreatedAt: v.created_at,
        UserID: user.id,
        Event: v.program,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const path = `${RNFS.CachesDirectoryPath}/visitors_export.xlsx`;
      await RNFS.writeFile(path, wbout, 'base64');

      await Share.open({
        title: 'Exported Visitors',
        message: 'Here is the visitor data in Excel format.',
        url: `file://${path}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        showAppsToView: true,
          failOnCancel: false,
      });
    } catch (err) {
      console.log('Export error:', err);
      Alert.alert('❌ Failed', 'Error exporting Excel file.');
    }
  };

  const renderVisitor = ({ item }) => {
    const isSelected = selectedVisitors.includes(item.idvisitors);

    return (
      <TouchableOpacity
        onLongPress={() => toggleSelection(item.idvisitors)}
        onPress={() => selectionMode && toggleSelection(item.idvisitors)}
        style={[styles.card, isSelected && styles.cardSelected]}
      >
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.status}>Event: {item.program}</Text>
          <Text style={styles.contact}>📧 {item.email}</Text>
          <Text style={styles.contact}>📞 {item.phone}</Text>
        </View>
      </TouchableOpacity>
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

      {/* Export Button above the FlatList */}
      <TouchableOpacity onPress={() => handleExport(visitors)} style={styles.exportBtn}>
        <View style={styles.exportGradient}>
          <Text style={styles.exportText}>📁 Export & Share Excel</Text>
        </View>
      </TouchableOpacity>

     

      <FlatList
        data={filteredVisitors}
        keyExtractor={item => item.idvisitors.toString()}
        renderItem={renderVisitor}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },

  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    elevation: 3,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  cardSelected: {
    backgroundColor: '#e6f2ff',
  },

  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D2671',
  },

  status: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },

  contact: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    marginBottom: 10,
  },

  selectAllBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },

  selectAllText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 10,
  },

  deleteText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  exportBtn: {
    width: '100%',
    marginBottom: 10,
  },

  exportGradient: {
    backgroundColor: '#f0b820ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  exportText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default VisitorListScreen;
