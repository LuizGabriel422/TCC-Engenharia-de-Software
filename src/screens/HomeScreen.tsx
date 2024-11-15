import React, {useEffect, useLayoutEffect} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Tipagem dos dados de tarefas
interface Tarefa {
  id: string;
  tarefa: string;
  data: string;
  horaInicio: string;
  horaTermino: string;
  categoria: string;
}

const HomeScreen: React.FC = () => {

  const navigation = useNavigation();

  // Desativa o cabeçalho quando a tela for carregada
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Remove o cabeçalho
    });
  }, [navigation]);

  // Dados de exemplo
  const tarefas: Tarefa[] = [
    { id: '1', tarefa: 'Estudar React Native', data: '15/11/2024', horaInicio: '10:00', horaTermino: '14:00', categoria: 'Estudo' },
    { id: '2', tarefa: 'Reunião de Trabalho', data: '16/11/2024', horaInicio: '14:00', horaTermino: '18:00', categoria: 'Trabalho' },
    { id: '3', tarefa: 'Palestra', data: '17/11/2024', horaInicio: '18:00', horaTermino: '20:00', categoria: 'Estudo' },
    { id: '4', tarefa: 'Estudar para Prova', data: '18/11/2024', horaInicio: '18:00', horaTermino: '22:00', categoria: 'Estudo' },
    { id: '5', tarefa: 'Jogar', data: '19/11/2024', horaInicio: '16:00', horaTermino: '18:00', categoria: 'Lazer' },
  ];

  return (
    <View style={styles.container}>
      {/* Botões no topo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Categorias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Tarefas Calendário</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Barra de seleção de categorias */}
      <View style={styles.categoriesBar}>
        <Text style={styles.category}>Todas</Text>
        <Text style={styles.category}>Estudo</Text>
        <Text style={styles.category}>Trabalho</Text>
        <Text style={styles.category}>Lazer</Text>
      </View>

      {/* Tabela */}
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        style={styles.table}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.tarefa}</Text>
            <Text style={styles.tableCell}>{item.data}</Text>
            <Text style={styles.tableCell}>{item.horaInicio}</Text>
            <Text style={styles.tableCell}>{item.horaTermino}</Text>
            <Text style={styles.tableCell}>{item.categoria}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableHeaderCell}>Tarefa</Text>
            <Text style={styles.tableHeaderCell}>Data</Text>
            <Text style={styles.tableHeaderCell}>Hora Inicio</Text>
            <Text style={styles.tableHeaderCell}>Hora Termino</Text>
            <Text style={styles.tableHeaderCell}>Categorias</Text>
          </View>
        )}
      />

      {/* Botão Nova Tarefa */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Nova Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 40,
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  categoriesBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  table: {
    flex: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;