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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function resetarSenha() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Preencha e-mail e nova senha.');
      return;
    }

    try {
      setSalvando(true);
      await resetPassword({ email: email.trim(), password });
      router.replace('/(tabs)' as never);
    } catch (error) {
      Alert.alert('Erro ao resetar senha', error instanceof Error ? error.message : 'Nao foi possivel resetar a senha.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <Text style={styles.title}>Resetar senha</Text>
      <Text style={styles.subtitle}>Informe seu e-mail e defina uma nova senha.</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#697586"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Nova senha</Text>
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
        onPress={resetarSenha}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Salvar nova senha</Text>}
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
