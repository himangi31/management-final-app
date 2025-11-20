import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';

const AdminVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');

  // selection
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAllVisitors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedUser, searchText, visitors]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://16.171.188.189:3000/api/visitors/fetch`);
      setUsers(res.data.users || []);
    } catch (e) {
      console.log("Error fetching users", e);
    }
  };

  const fetchAllVisitors = async () => {
    try {
      const res = await axios.get(`http://16.171.188.189:3000/api/visitors/allvisitor`);
      setVisitors(res.data.visitors || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch visitors');
    }
  };

  const applyFilters = () => {
    let temp = [...visitors];
    if (selectedUser !== 'all') {
      temp = temp.filter(v => v.user_id == selectedUser);
    }
    temp = temp.filter(v =>
      v.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredVisitors(temp);
  };

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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedVisitors.map(id =>
          axios.delete(`http://16.171.188.189:3000/api/visitors/${id}`)
        )
      );
      setVisitors(visitors.filter(v => !selectedVisitors.includes(v.idvisitors)));
      setSelectedVisitors([]);
      setSelectionMode(false);
      setSelectAll(false);
      Alert.alert('Deleted', 'Selected visitors removed');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete selected visitors');
    }
  };

  const handleExport = async data => {
    try {
      const finalData = data.map(v => ({
        Name: v.name,
        Email: v.email,
        Phone: v.phone,
        Company: v.company,
        Designation: v.designation,
        Event: v.program,
        UserID: v.user_id,
        CreatedAt: v.created_at,
      }));

      const ws = XLSX.utils.json_to_sheet(finalData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const path = `${RNFS.CachesDirectoryPath}/admin_visitors.xlsx`;
      await RNFS.writeFile(path, wbout, 'base64');

      await Share.open({
        title: 'All Visitors Excel',
        url: `file://${path}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       failOnCancel: false,  });
    } catch (err) {
     
      Alert.alert('Error', 'Failed to export Excel');
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
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Event: {item.program}</Text>
        <Text style={styles.info}>Email: {item.email}</Text>
        <Text style={styles.info}>Phone: {item.phone}</Text>
        <Text style={styles.info}>User ID: {item.user_id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        placeholder="🔍 Search visitors"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.search}
      />

      {/* User Filter */}
      <View style={styles.dropdown}>
        <TouchableOpacity
          style={styles.dropdownBox}
          onPress={() => setShowUserList(!showUserList)}
        >
          <Text>{selectedUser === 'all' ? 'All Users' : `User: ${selectedUser}`}</Text>
        </TouchableOpacity>

        {showUserList && (
          <ScrollView style={styles.userList}>
            <TouchableOpacity onPress={() => setSelectedUser('all')}>
              <Text style={styles.userItem}>All Users</Text>
            </TouchableOpacity>
            {users.map(u => (
              <TouchableOpacity key={u.id} onPress={() => setSelectedUser(u.id)}>
                <Text style={styles.userItem}>{u.name} ({u.email})</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Export */}
      <TouchableOpacity onPress={() => handleExport(filteredVisitors)} style={styles.exportBtn}>
        <Text style={styles.exportText}>📁 Export Excel</Text>
      </TouchableOpacity>

      {/* Delete / Select */}
      {selectionMode && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllBtn}>
            <Text style={styles.btnText}>{selectAll ? 'Deselect All' : 'Select All'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteSelected} style={styles.deleteBtn}>
            <Text style={styles.btnText}>🗑 Delete Selected</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredVisitors}
        keyExtractor={item => item.idvisitors.toString()}
        renderItem={renderVisitor}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#f5f5f5' },
  search: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 },
  dropdown: { marginBottom: 15 },
  dropdownBox: { padding: 12, borderRadius: 10, backgroundColor: '#fff', marginTop: 5 },
  userList: { marginTop: 5, backgroundColor: '#fff', maxHeight: 150, borderRadius: 10 },
  userItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  exportBtn: { backgroundColor: '#f0b820ff', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  exportText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  selectAllBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, flex: 1, marginRight: 6 },
  deleteBtn: { backgroundColor: '#ff3b30', padding: 12, borderRadius: 10, flex: 1, marginLeft: 6 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardSelected: { backgroundColor: '#e6f2ff' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1D2671' },
  info: { marginTop: 3, fontSize: 14, color: '#555' },
});

export default AdminVisitor;
