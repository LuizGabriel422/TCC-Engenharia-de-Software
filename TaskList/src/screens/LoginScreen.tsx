import { Redirect, useRouter } from 'expo-router';
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
  View,
} from 'react-native';

import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, token, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!loading && token) {
    return <Redirect href={'/(tabs)' as never} />;
  }

  async function entrar() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Preencha e-mail e senha.');
      return;
    }

    try {
      setSalvando(true);
      await login({ email: email.trim(), password });
      router.replace('/(tabs)' as never);
    } catch (error) {
      Alert.alert('Erro ao entrar', error instanceof Error ? error.message : 'Nao foi possivel entrar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TaskList</Text>
        <Text style={styles.subtitle}>Entre para visualizar suas tarefas e categorias.</Text>

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

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          placeholderTextColor="#697586"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.primaryButton, salvando && styles.buttonDisabled]} onPress={entrar} disabled={salvando}>
          {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Entrar</Text>}
        </Pressable>

        <Pressable onPress={() => router.push('/resetar-senha' as never)}>
          <Text style={styles.link}>Esqueceu sua senha?</Text>
        </Pressable>

        <View style={styles.registerBox}>
          <Text style={styles.registerText}>Ainda nao tem cadastro?</Text>
          <Pressable onPress={() => router.push('/cadastro' as never)}>
            <Text style={styles.registerLink}>Cadastre-se aqui!</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: '#697586',
    fontSize: 15,
    marginBottom: 28,
    textAlign: 'center',
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
  link: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  registerBox: {
    alignItems: 'center',
    marginTop: 28,
  },
  registerText: {
    color: '#697586',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
});
