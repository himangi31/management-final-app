import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function AddProgramScreen({ navigation }) {
  const [program, setProgram] = useState('');
  const [programs, setPrograms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/visitors/programs');
      setPrograms(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load programs');
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async () => {
    if (!program.trim()) {
      Alert.alert('Validation', 'Program name is required');
      return;
    }

    try {
      if (editingId) {
        // Update program
        const response = await axios.put(`http://10.0.2.2:3000/api/visitors/program/${editingId}`, {
          program,
        });
        if (response.status === 200) {
          Alert.alert('Updated', 'Program updated successfully');
        }
      } else {
        // Add new program
        const response = await axios.post('http://10.0.2.2:3000/api/visitors/programonly', {
          program,
        });
        if (response.status === 200) {
          Alert.alert('Success', 'Program saved');
        }
      }

      setProgram('');
      setEditingId(null);
      fetchPrograms();

    } catch (err) {
      console.error('Axios Error:', err.message);
      Alert.alert('Error', err.message);
    }
  };

  const handleEdit = (item) => {
    setProgram(item.program);
    setEditingId(item.idprogram); // or item._id depending on backend
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm', 'Delete this program?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://10.0.2.2:3000/api/visitors/program/${id}`);

            Alert.alert('Deleted', 'Program deleted');
            fetchPrograms();
          } catch (err) {
            console.error('Delete error:', err.message);
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Program Name"
        value={program}
        onChangeText={setProgram}
        style={styles.input}
      />
      <Button title={editingId ? 'Update Program' : 'Save Program'} onPress={handleSubmit} />

      <FlatList
        data={programs}
        keyExtractor={(item) => item.idprogram?.toString() || item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.programText}>{item.program}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                <Text style={{ color: 'white' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.idprogram)}
 style={styles.deleteBtn}>
                <Text style={{ color: 'white' }}>Delete</Text>
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
    padding: 20,
    gap: 15,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  programText: {
    fontSize: 16,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 4,
  },
});
