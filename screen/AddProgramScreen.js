import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import axios from 'axios';

export default function AddProgramScreen({ navigation }) {
  const [program, setProgram] = useState('');
  const [programs, setPrograms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchPrograms = async () => {
    try {
      const res = await axios.get('http://16.171.188.189:3000/api/visitors/programs');
      setPrograms(res.data);
    } catch (err) {
      Alert.alert('Error', 'Unable to load programs');
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async () => {
    if (!program.trim()) {
      return Alert.alert('Required', 'Program name cannot be empty');
    }

    try {
      if (editingId) {
        await axios.put(`http://16.171.188.189:3000/api/visitors/program/${editingId}`, { program });
        Alert.alert('Updated', 'Program updated successfully');
      } else {
        await axios.post('http://16.171.188.189:3000/api/visitors/programonly', { program });
        Alert.alert('Success', 'Program saved successfully');
      }

      setProgram('');
      setEditingId(null);
      fetchPrograms();
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = (item) => {
    setProgram(item.program);
    setEditingId(item.idprogram);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Program', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://16.171.188.189:3000/api/visitors/program/${id}`);
            fetchPrograms();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete program');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Event Manager</Text>
      <Text style={styles.subHeader}>Create, edit or delete available Event</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter Event Name"
          placeholderTextColor="#777"
          value={program}
          onChangeText={setProgram}
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.saveBtnText}>
            {editingId ? 'Update Program' : 'Save Event'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listHeader}>Available Event</Text>

      <FlatList
        data={programs}
        keyExtractor={(item) => item.idprogram?.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.programText}>{item.program}</Text>

            <View style={styles.actionBtns}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item.idprogram)} style={styles.deleteBtn}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: '#F4F6F9',
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101820',
  },

  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },

  card: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    color: '#111',
  },

  saveBtn: {
    backgroundColor: '#040f1dff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  listHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#101820',
  },

  listItem: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  programText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#222',
  },

  actionBtns: {
    flexDirection: 'row',
    gap: 10,
  },

  editBtn: {
    backgroundColor: '#4f9e0fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  deleteBtn: {
    backgroundColor: '#E63946',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});
