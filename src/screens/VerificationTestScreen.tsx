import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ArrivaColors } from '../constants/colors';
import { verifyCfFromCamera } from '../services/verificationService';

export default function VerificationTestScreen() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [cf, setCf] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Compila i dati e scatta la foto per iniziare il test.');
  const [messageColor, setMessageColor] = useState('#6B7280');

  async function onAvviaVerifica() {
    const cfInserito = cf.trim().toUpperCase();

    if (!cfInserito) {
      setMessage('Inserisci almeno il Codice Fiscale per fare il test.');
      setMessageColor('orange');
      return;
    }

    setLoading(true);
    setMessage('Apertura fotocamera in corso...');
    setMessageColor('#111');

    try {
      const result = await verifyCfFromCamera(cfInserito);
      if ('cancelled' in result) {
        setMessage('Operazione annullata.');
        setMessageColor('#111');
        return;
      }

      if (result.matchFound) {
        setMessage(
          '✅ SUCCESSO!\nCodice Fiscale verificato.\nRichiesta in attesa di approvazione Admin.\n(Foto distrutte con successo)'
        );
        setMessageColor(ArrivaColors.greenTicket);
      } else {
        setMessage(
          '❌ ERRORE!\nIl CF inserito non combacia con il documento o la foto è sfuocata.\n(Foto scartate e distrutte)'
        );
        setMessageColor('#EF4444');
      }
    } catch (e: any) {
      setMessage(`Si è verificato un errore: ${String(e?.message ?? e)}`);
      setMessageColor('#EF4444');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Acquista Abbonamento</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Inserisci i dati anagrafici</Text>
          <View style={{ height: 20 }} />

          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <View style={{ height: 10 }} />

          <TextInput
            value={cognome}
            onChangeText={setCognome}
            placeholder="Cognome"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <View style={{ height: 10 }} />

          <TextInput
            value={cf}
            onChangeText={(t) => setCf(t.toUpperCase())}
            placeholder="Codice Fiscale"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            autoCapitalize="characters"
          />

          <View style={{ height: 30 }} />

          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.button} onPress={onAvviaVerifica} activeOpacity={0.9}>
              <MaterialIcons name="camera-alt" color="#fff" size={20} />
              <Text style={styles.buttonText}>Fotografa Documento e Verifica</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 30 }} />

          <View style={styles.resultBox}>
            <Text style={[styles.resultText, { color: messageColor }]}>{message}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  appBar: {
    backgroundColor: ArrivaColors.cyanArriva,
    paddingVertical: 14,
    alignItems: 'center',
  },
  appBarTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  button: {
    backgroundColor: ArrivaColors.purpleDeep,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  resultBox: {
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resultText: { textAlign: 'center', fontSize: 16, fontWeight: '800', lineHeight: 22 },
});

