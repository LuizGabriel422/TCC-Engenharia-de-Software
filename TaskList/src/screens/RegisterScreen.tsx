import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { useAuth } from '@/src/contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function cadastrar() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Preencha nome, e-mail e senha.');
      return;
    }

    try {
      setSalvando(true);
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace('/(tabs)' as never);
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error instanceof Error ? error.message : 'Nao foi possivel cadastrar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <Text style={styles.title}>Criar cadastro</Text>
      <Text style={styles.subtitle}>Seu cadastro separa suas tarefas e categorias dos outros usuarios.</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        placeholder="Seu nome"
        placeholderTextColor="#697586"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Login</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#697586"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder="Minimo de 6 caracteres"
        placeholderTextColor="#697586"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        style={[styles.primaryButton, salvando && styles.buttonDisabled]}
        disabled={salvando}
        onPress={cadastrar}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Cadastrar</Text>}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 24,
  },
  subtitle: {
    color: '#697586',
    fontSize: 15,
    marginBottom: 18,
    marginTop: 6,
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
    minHeight: 48,
    paddingHorizontal: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginTop: 22,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
