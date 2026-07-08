import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '@/src/services/api';
import type { Categoria, Tarefa } from '@/src/types/task';

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarHora(hora: string) {
  return hora.slice(0, 5);
}

export default function HomeScreen() {
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      setErro('');
      setCarregando(true);
      const [tarefasApi, categoriasApi] = await Promise.all([
        api.listarTarefas(),
        api.listarCategorias(),
      ]);

      setTarefas(tarefasApi);
      setCategorias(categoriasApi);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar tarefas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const tarefasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return tarefas.filter((tarefa) => {
      const bateBusca =
        !termo ||
        tarefa.nome.toLowerCase().includes(termo) ||
        (tarefa.descricao || '').toLowerCase().includes(termo);

      const bateCategoria =
        !categoriaSelecionada ||
        tarefa.categorias.some((categoria) => categoria.id === categoriaSelecionada);

      return bateBusca && bateCategoria;
    });
  }, [busca, categoriaSelecionada, tarefas]);

  function confirmarExclusao(tarefa: Tarefa) {
    Alert.alert('Excluir tarefa', `Deseja excluir "${tarefa.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.excluirTarefa(tarefa.id);
            carregarDados();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao excluir tarefa.');
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tarefas</Text>
          <Text style={styles.subtitle}>{tarefasFiltradas.length} tarefa(s) encontrada(s)</Text>
        </View>

        <Pressable style={styles.iconButton} onPress={() => router.push('/tarefas/nova' as never)}>
          <Ionicons name="add" size={26} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#697586" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas"
          placeholderTextColor="#697586"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesBar}>
        <Pressable
          style={[styles.categoryChip, categoriaSelecionada === null && styles.categoryChipActive]}
          onPress={() => setCategoriaSelecionada(null)}>
          <Text
            style={[
              styles.categoryChipText,
              categoriaSelecionada === null && styles.categoryChipTextActive,
            ]}>
            Todas
          </Text>
        </Pressable>

        {categorias.map((categoria) => (
          <Pressable
            key={categoria.id}
            style={[
              styles.categoryChip,
              categoriaSelecionada === categoria.id && styles.categoryChipActive,
            ]}
            onPress={() => setCategoriaSelecionada(categoria.id)}>
            <Text
              style={[
                styles.categoryChipText,
                categoriaSelecionada === categoria.id && styles.categoryChipTextActive,
              ]}>
              {categoria.nome}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {carregando ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : erro ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{erro}</Text>
          <Pressable style={styles.secondaryButton} onPress={carregarDados}>
            <Text style={styles.secondaryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={tarefasFiltradas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{item.nome}</Text>
                  {!!item.descricao && <Text style={styles.taskDescription}>{item.descricao}</Text>}
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push(`/tarefas/${item.id}` as never)}>
                    <Ionicons name="create-outline" size={20} color="#2563eb" />
                  </Pressable>
                  <Pressable style={styles.actionButton} onPress={() => confirmarExclusao(item)}>
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={16} color="#475467" />
                <Text style={styles.metaText}>{formatarData(item.data)}</Text>
                <Ionicons name="time-outline" size={16} color="#475467" />
                <Text style={styles.metaText}>
                  {formatarHora(item.hora_inicio)} - {formatarHora(item.hora_termino)}
                </Text>
              </View>

              <View style={styles.tagRow}>
                {item.categorias.length > 0 ? (
                  item.categorias.map((categoria) => (
                    <View key={categoria.id} style={styles.tag}>
                      <View
                        style={[
                          styles.tagColor,
                          { backgroundColor: categoria.cor || '#94a3b8' },
                        ]}
                      />
                      <Text style={styles.tagText}>{categoria.nome}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCategoryText}>Sem categoria</Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#697586',
    fontSize: 14,
    marginTop: 2,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 46,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
  },
  categoriesBar: {
    flexGrow: 0,
    marginVertical: 14,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryChipText: {
    color: '#475467',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  centerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: '#b42318',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  secondaryButton: {
    borderColor: '#2563eb',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    color: '#697586',
    fontSize: 15,
    marginTop: 32,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  taskHeader: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
  },
  taskDescription: {
    color: '#475467',
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  metaText: {
    color: '#475467',
    fontSize: 13,
    marginRight: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    alignItems: 'center',
    backgroundColor: '#eef2f7',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagColor: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  tagText: {
    color: '#344054',
    fontSize: 12,
    fontWeight: '600',
  },
  noCategoryText: {
    color: '#697586',
    fontSize: 13,
  },
});
