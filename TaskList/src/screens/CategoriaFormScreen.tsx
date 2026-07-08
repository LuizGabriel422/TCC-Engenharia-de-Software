import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api } from '@/src/services/api';
import type { CategoriaPayload } from '@/src/types/task';

const coresSugeridas = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#7c3aed', '#0891b2'];

export default function CategoriaFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const categoriaId = id ? Number(id) : null;
  const editando = Number.isFinite(categoriaId);

  const [form, setForm] = useState<CategoriaPayload>({ nome: '', cor: '#2563eb' });
  const [carregando, setCarregando] = useState(Boolean(editando));
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarCategoria() {
      if (!editando || !categoriaId) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const categoria = await api.buscarCategoria(categoriaId);
        setForm({ nome: categoria.nome, cor: categoria.cor || '#2563eb' });
      } catch (error) {
        Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar categoria.');
      } finally {
        setCarregando(false);
      }
    }

    carregarCategoria();
  }, [editando, categoriaId]);

  async function salvar() {
    if (!form.nome.trim()) {
      Alert.alert('Campo obrigatorio', 'Preencha o nome da categoria.');
      return;
    }

    try {
      setSalvando(true);
      const payload = {
        nome: form.nome.trim(),
        cor: form.cor?.trim() || '',
      };

      if (editando && categoriaId) {
        await api.atualizarCategoria(categoriaId, payload);
      } else {
        await api.criarCategoria(payload);
      }

      router.back();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao salvar categoria.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Estudo"
        placeholderTextColor="#697586"
        value={form.nome}
        onChangeText={(valor) => setForm((atual) => ({ ...atual, nome: valor }))}
      />

      <Text style={styles.label}>Cor</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="#2563eb"
        placeholderTextColor="#697586"
        value={form.cor}
        onChangeText={(valor) => setForm((atual) => ({ ...atual, cor: valor }))}
      />

      <View style={styles.colorList}>
        {coresSugeridas.map((cor) => (
          <Pressable
            key={cor}
            style={[
              styles.colorButton,
              { backgroundColor: cor },
              form.cor?.toLowerCase() === cor && styles.colorButtonActive,
            ]}
            onPress={() => setForm((atual) => ({ ...atual, cor }))}
          />
        ))}
      </View>

      <Pressable
        style={[styles.saveButton, salvando && styles.buttonDisabled]}
        disabled={salvando}
        onPress={salvar}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>
            {editando ? 'Salvar alteracoes' : 'Criar categoria'}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  label: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  colorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  colorButton: {
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    width: 40,
  },
  colorButtonActive: {
    borderColor: '#111827',
    borderWidth: 3,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
