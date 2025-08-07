import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function UserDetail() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://198.168.10.53:3000/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://198.168.10.53:3000/api/auth/users/${id}`);
      fetchUsers();
    } catch {
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://10.0.2.2:3000/api/auth/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Details</Text>

      {editingUser && (
        <View style={styles.editBox}>
          <TextInput 
            value={editingUser.name} 
            onChangeText={(t) => setEditingUser({ ...editingUser, name: t })} 
            style={styles.input} 
          />
          <TextInput 
            value={editingUser.email} 
            onChangeText={(t) => setEditingUser({ ...editingUser, email: t })} 
            style={styles.input} 
          />
          <TextInput 
            value={editingUser.phone} 
            onChangeText={(t) => setEditingUser({ ...editingUser, phone: t })} 
            style={styles.input} 
          />
           <TextInput 
            value={editingUser.phone} 
            onChangeText={(t) => setEditingUser({ ...editingUser, password: t })} 
            style={styles.input} 
          />
          <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tableWrapper}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Email</Text>
          <Text style={[styles.cell, styles.headerCell]}>Phone</Text>
          <Text style={[styles.cell, styles.headerCell]}>Action</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.email}</Text>
              <Text style={styles.cell}>{item.phone}</Text>
              <View style={styles.actionBtns}>
                <TouchableOpacity onPress={() => setEditingUser(item)}>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },

  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center'
  },
  headerRow: { backgroundColor: '#f0f0f0' },

  cell: { flex: 1, textAlign: 'center', fontSize: 14, color: '#333' },
  headerCell: { fontWeight: 'bold', fontSize: 16 },

  actionBtns: { flexDirection: 'row', justifyContent: 'center', flex: 1 },
  edit: { color: '#0071EB', marginRight: 10 },
  delete: { color: 'red' },

  editBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  saveBtn: { backgroundColor: '#0071EB', padding: 10, borderRadius: 5 },
  btnText: { color: '#fff', textAlign: 'center' },
});
