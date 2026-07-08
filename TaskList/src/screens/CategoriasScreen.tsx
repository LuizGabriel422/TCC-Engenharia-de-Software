import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '@/src/services/api';
import type { Categoria } from '@/src/types/task';

export default function CategoriasScreen() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarCategorias = useCallback(async () => {
    try {
      setErro('');
      setCarregando(true);
      setCategorias(await api.listarCategorias());
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao carregar categorias.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarCategorias();
    }, [carregarCategorias])
  );

  function confirmarExclusao(categoria: Categoria) {
    Alert.alert('Excluir categoria', `Deseja excluir "${categoria.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.excluirCategoria(categoria.id);
            carregarCategorias();
          } catch (error) {
            Alert.alert(
              'Erro',
              error instanceof Error ? error.message : 'Erro ao excluir categoria.'
            );
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Categorias</Text>
          <Text style={styles.subtitle}>{categorias.length} categoria(s) cadastrada(s)</Text>
        </View>

        <Pressable style={styles.iconButton} onPress={() => router.push('/categorias/nova' as never)}>
          <Ionicons name="add" size={26} color="#fff" />
        </Pressable>
      </View>

      {carregando ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : erro ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{erro}</Text>
          <Pressable style={styles.secondaryButton} onPress={carregarCategorias}>
            <Text style={styles.secondaryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>}
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryColor, { backgroundColor: item.cor || '#94a3b8' }]} />
                <View>
                  <Text style={styles.categoryName}>{item.nome}</Text>
                  <Text style={styles.categoryHex}>{item.cor || 'Sem cor definida'}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => router.push(`/categorias/${item.id}` as never)}>
                  <Ionicons name="create-outline" size={20} color="#2563eb" />
                </Pressable>
                <Pressable style={styles.actionButton} onPress={() => confirmarExclusao(item)}>
                  <Ionicons name="trash-outline" size={20} color="#dc2626" />
                </Pressable>
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
    backgroundColor: '#f8fafc',
    flex: 1,
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
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 14,
  },
  categoryInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  categoryColor: {
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    width: 38,
  },
  categoryName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
  },
  categoryHex: {
    color: '#697586',
    fontSize: 13,
    marginTop: 2,
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
});
