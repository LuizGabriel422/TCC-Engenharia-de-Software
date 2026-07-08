import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import type { Categoria, TarefaPayload } from '@/src/types/task';

const camposIniciais: TarefaPayload = {
  nome: '',
  descricao: '',
  data: '',
  hora_inicio: '',
  hora_termino: '',
  categoria_ids: [],
};

type PickerAberto = 'data' | 'hora_inicio' | 'hora_termino' | null;

function aplicarMascaraData(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 8);
  const partes = [numeros.slice(0, 2), numeros.slice(2, 4), numeros.slice(4, 8)].filter(Boolean);

  return partes.join('/');
}

function aplicarMascaraHora(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 4);

  if (numeros.length <= 2) {
    return numeros;
  }

  return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
}

function dataApiParaTela(data: string) {
  const [ano, mes, dia] = data.split('-');

  if (!ano || !mes || !dia) {
    return '';
  }

  return `${dia}/${mes}/${ano}`;
}

function dataTelaParaApi(data: string) {
  const [dia, mes, ano] = data.split('/');

  if (!dia || !mes || !ano) {
    return '';
  }

  return `${ano}-${mes}-${dia}`;
}

function criarDataDoFormulario(data: string, hora = '12:00') {
  const [dia, mes, ano] = data.split('/').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);

  if (!dia || !mes || !ano) {
    return new Date();
  }

  return new Date(ano, mes - 1, dia, horas || 0, minutos || 0);
}

function formatarDataPicker(data: Date) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarHoraPicker(data: Date) {
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`;
}

export default function TarefaFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tarefaId = id ? Number(id) : null;
  const editando = Number.isFinite(tarefaId);

  const [form, setForm] = useState<TarefaPayload>(camposIniciais);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(Boolean(editando));
  const [salvando, setSalvando] = useState(false);
  const [pickerAberto, setPickerAberto] = useState<PickerAberto>(null);

  useEffect(() => {
    async function carregarTela() {
      try {
        setCarregando(true);
        const categoriasApi = await api.listarCategorias();
        setCategorias(categoriasApi);

        if (editando && tarefaId) {
          const tarefa = await api.buscarTarefa(tarefaId);
          setForm({
            nome: tarefa.nome,
            descricao: tarefa.descricao || '',
            data: dataApiParaTela(tarefa.data),
            hora_inicio: tarefa.hora_inicio.slice(0, 5),
            hora_termino: tarefa.hora_termino.slice(0, 5),
            categoria_ids: tarefa.categorias.map((categoria) => categoria.id),
          });
        }
      } catch (error) {
        Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar tarefa.');
      } finally {
        setCarregando(false);
      }
    }

    carregarTela();
  }, [editando, tarefaId]);

  const categoriasSelecionadas = useMemo(
    () => new Set(form.categoria_ids || []),
    [form.categoria_ids]
  );

  function atualizarCampo(campo: keyof TarefaPayload, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarDataDigitada(valor: string) {
    atualizarCampo('data', aplicarMascaraData(valor));
  }

  function alterarHoraDigitada(campo: 'hora_inicio' | 'hora_termino', valor: string) {
    atualizarCampo(campo, aplicarMascaraHora(valor));
  }

  function alterarPicker(event: DateTimePickerEvent, dataSelecionada?: Date) {
    if (event.type === 'dismissed') {
      setPickerAberto(null);
      return;
    }

    if (!dataSelecionada || !pickerAberto) {
      setPickerAberto(null);
      return;
    }

    if (pickerAberto === 'data') {
      atualizarCampo('data', formatarDataPicker(dataSelecionada));
    } else {
      atualizarCampo(pickerAberto, formatarHoraPicker(dataSelecionada));
    }

    setPickerAberto(null);
  }

  function alternarCategoria(categoriaId: number) {
    setForm((atual) => {
      const ids = new Set(atual.categoria_ids || []);

      if (ids.has(categoriaId)) {
        ids.delete(categoriaId);
      } else {
        ids.add(categoriaId);
      }

      return { ...atual, categoria_ids: Array.from(ids) };
    });
  }

  async function salvar() {
    if (!form.nome.trim() || form.data.length !== 10 || form.hora_inicio.length !== 5 || form.hora_termino.length !== 5) {
      Alert.alert('Campos obrigatorios', 'Preencha nome, data, hora de inicio e hora de termino.');
      return;
    }

    try {
      setSalvando(true);
      const payload: TarefaPayload = {
        nome: form.nome.trim(),
        descricao: form.descricao?.trim() || '',
        data: dataTelaParaApi(form.data.trim()),
        hora_inicio: form.hora_inicio.trim(),
        hora_termino: form.hora_termino.trim(),
        categoria_ids: form.categoria_ids || [],
      };

      if (editando && tarefaId) {
        await api.atualizarTarefa(tarefaId, payload);
      } else {
        await api.criarTarefa(payload);
      }

      router.back();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao salvar tarefa.');
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
        placeholder="Ex: Estudar React Native"
        placeholderTextColor="#697586"
        value={form.nome}
        onChangeText={(valor) => atualizarCampo('nome', valor)}
      />

      <Text style={styles.label}>Descricao</Text>
      <TextInput
        multiline
        style={[styles.input, styles.textArea]}
        placeholder="Detalhes da tarefa"
        placeholderTextColor="#697586"
        textAlignVertical="top"
        value={form.descricao}
        onChangeText={(valor) => atualizarCampo('descricao', valor)}
      />

      <Text style={styles.label}>Data</Text>
      <View style={styles.inputWithButton}>
        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          style={styles.inputWithIcon}
          placeholder="__/__/____"
          placeholderTextColor="#697586"
          value={form.data}
          onChangeText={alterarDataDigitada}
        />
        <Pressable style={styles.fieldIconButton} onPress={() => setPickerAberto('data')}>
          <Ionicons name="calendar-outline" size={22} color="#2563eb" />
        </Pressable>
      </View>

      <View style={styles.twoColumns}>
        <View style={styles.column}>
          <Text style={styles.label}>Inicio</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              keyboardType="number-pad"
              maxLength={5}
              style={styles.inputWithIcon}
              placeholder="__:__"
              placeholderTextColor="#697586"
              value={form.hora_inicio}
              onChangeText={(valor) => alterarHoraDigitada('hora_inicio', valor)}
            />
            <Pressable style={styles.fieldIconButton} onPress={() => setPickerAberto('hora_inicio')}>
              <Ionicons name="time-outline" size={22} color="#2563eb" />
            </Pressable>
          </View>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Termino</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              keyboardType="number-pad"
              maxLength={5}
              style={styles.inputWithIcon}
              placeholder="__:__"
              placeholderTextColor="#697586"
              value={form.hora_termino}
              onChangeText={(valor) => alterarHoraDigitada('hora_termino', valor)}
            />
            <Pressable style={styles.fieldIconButton} onPress={() => setPickerAberto('hora_termino')}>
              <Ionicons name="time-outline" size={22} color="#2563eb" />
            </Pressable>
          </View>
        </View>
      </View>

      <Text style={styles.label}>Categorias</Text>
      <View style={styles.categoryList}>
        {categorias.length === 0 ? (
          <Text style={styles.helperText}>Cadastre uma categoria antes de vincular tarefas.</Text>
        ) : (
          categorias.map((categoria) => {
            const selecionada = categoriasSelecionadas.has(categoria.id);

            return (
              <Pressable
                key={categoria.id}
                style={[styles.categoryItem, selecionada && styles.categoryItemActive]}
                onPress={() => alternarCategoria(categoria.id)}>
                <View style={[styles.categoryColor, { backgroundColor: categoria.cor || '#94a3b8' }]} />
                <Text style={[styles.categoryText, selecionada && styles.categoryTextActive]}>
                  {categoria.nome}
                </Text>
                {selecionada && <Ionicons name="checkmark" size={18} color="#fff" />}
              </Pressable>
            );
          })
        )}
      </View>

      <Pressable
        style={[styles.saveButton, salvando && styles.buttonDisabled]}
        disabled={salvando}
        onPress={salvar}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>{editando ? 'Salvar alteracoes' : 'Criar tarefa'}</Text>
        )}
      </Pressable>

      {pickerAberto && (
        <DateTimePicker
          mode={pickerAberto === 'data' ? 'date' : 'time'}
          display="default"
          value={criarDataDoFormulario(
            form.data,
            pickerAberto === 'hora_termino' ? form.hora_termino : form.hora_inicio
          )}
          is24Hour
          onChange={alterarPicker}
        />
      )}
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
  inputWithButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 46,
  },
  inputWithIcon: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  fieldIconButton: {
    alignItems: 'center',
    height: 46,
    justifyContent: 'center',
    width: 44,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 12,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d8dee8',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 12,
  },
  categoryItemActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryColor: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  categoryText: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  helperText: {
    color: '#697586',
    fontSize: 14,
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
