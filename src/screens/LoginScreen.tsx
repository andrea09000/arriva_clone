import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ArrivaColors } from '../constants/colors';
import { signInWithEmail } from '../services/localAuth';

export default function LoginScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      const e = email.trim();
      const p = password.trim();
      if (!e || !p) {
        setError('Inserisci email e password.');
        return;
      }

      // Login "locale": per non usare Firebase, salviamo solo l'email
      await signInWithEmail(e);
      onBack();
    } catch (e: any) {
      setError(`Errore: ${String(e?.message ?? e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={{ paddingHorizontal: 4 }}>
          <MaterialIcons name="arrow-back-ios" size={22} color={ArrivaColors.purpleDeep} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../assets/arriva/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={[styles.field, { marginTop: 20 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading ? { opacity: 0.8 } : undefined]}
            onPress={onLogin}
            activeOpacity={0.9}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>{loading ? '...' : 'ACCEDI'}</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  appBar: { height: 56, backgroundColor: '#fff', justifyContent: 'center' },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingBottom: 80,
  },
  logo: { height: 40, width: 160, tintColor: ArrivaColors.cyanArriva, alignSelf: 'center' },
  field: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  label: { fontWeight: '700', color: '#6B7280', marginBottom: 6 },
  input: { fontSize: 16, color: '#111' },
  loginBtn: {
    marginTop: 30,
    backgroundColor: ArrivaColors.purpleDeep,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  error: { marginTop: 16, color: '#EF4444', fontWeight: '600', textAlign: 'center' },
});

