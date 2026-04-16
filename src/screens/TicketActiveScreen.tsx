import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';

import { ArrivaColors } from '../constants/colors';
import WaveBanner from '../components/WaveBanner';
import {
  Clock4Icon,
  IdCardIcon,
  LockKeyholeIcon,
  SendIcon,
  TicketIcon,
} from '../components/ArrivaSvgIcon';
import type { TicketData } from '../types/TicketData';
import { loadLockState, loadTicketData, saveLockState, saveTicketData } from '../services/ticketStorage';

const TEST_TICKET: TicketData = {
  partenza: 'LOGRATO',
  destinazione: 'ORZINUOVI',
  validoDal: '05/01/2026',
  validoAl: '31/08/2026',
  emessoIl: '29/09/2025 - 15:00',
  prezzo: '472,00 €',
  codiceTicket: '9905/208672',
};

function twoDigits(n: number) {
  return n.toString().padStart(2, '0');
}

export default function TicketActiveScreen({ onBack }: { onBack: () => void }) {
  useKeepAwake();

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [lockNumber, setLockNumber] = useState<number | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const lastHourRef = useRef<number>(new Date().getHours());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const boot = async () => {
      await loadOrCreateTicket();
      await initLockNumber();
      interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        if (now.getHours() !== lastHourRef.current) {
          lastHourRef.current = now.getHours();
          generateLockNumber();
        }
      }, 1000);
    };

    boot();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const timeString = useMemo(() => {
    return `${twoDigits(currentTime.getHours())}:${twoDigits(
      currentTime.getMinutes()
    )}:${twoDigits(currentTime.getSeconds())}`;
  }, [currentTime]);

  async function loadOrCreateTicket() {
    const saved = await loadTicketData();
    const data = saved ?? TEST_TICKET;
    if (!saved) await saveTicketData(TEST_TICKET);
    setTicketData(data);
  }

  async function initLockNumber() {
    const now = new Date();
    const currentHour = now.getHours();
    lastHourRef.current = currentHour;

    const saved = await loadLockState();
    if (saved && saved.lockHour === currentHour) {
      setLockNumber(saved.lockNumber);
      return;
    }

    await generateAndPersistNewLockNumber(currentHour);
  }

  async function generateAndPersistNewLockNumber(currentHour: number) {
    const newNumber = 100 + Math.floor(Math.random() * 401); // 100..500
    setLockNumber(newNumber);
    await saveLockState({ lockNumber: newNumber, lockHour: currentHour });
  }

  function generateLockNumber() {
    const now = new Date();
    // Fire-and-forget: la UI non deve bloccarsi.
    void generateAndPersistNewLockNumber(now.getHours());
  }

  return (
    <View style={styles.screen}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back-ios" color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Ticket attivo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/arriva/logo.png')}
            style={styles.cardLogo}
            resizeMode="contain"
          />

          <Text style={styles.cardTitle}>Abbonamento Annuale Studenti</Text>
          <Text style={styles.cardSubtitle}>
            Abbonamento annuale studenti valido sulla rete extraurbana Arriva
          </Text>

          <View style={styles.greyInfo}>
            <View style={styles.greyInfoRow}>
              <View style={styles.greyInfoLeft}>
                <IdCardIcon color={ArrivaColors.purpleDeep} size={25} />
                <Text style={styles.greyInfoText}>Informazioni tessera</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={22} color={ArrivaColors.cyanAcquisti} />
            </View>
          </View>

          <View style={[styles.greyInfo, { marginTop: 16 }]}>
            <View style={styles.greyTicketHeader}>
              <View style={styles.greyInfoLeft}>
                <TicketIcon color={ArrivaColors.purpleDeep} size={25} />
                <Text style={styles.greyInfoText}>Controllo e validazione</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-up" size={22} color={ArrivaColors.cyanAcquisti} />
            </View>

            <View style={{ height: 20 }} />

            <View style={styles.qrWrap}>
              <Image
                source={require('../../assets/arriva/qrcode.png')}
                style={{ width: 220, height: 220, resizeMode: 'contain' }}
              />
            </View>

            <Text style={styles.qrHint}>Ingrandisci QRCode</Text>

            <View style={styles.clockLockRow}>
              <View style={styles.clockLockItem}>
                <Clock4Icon color={ArrivaColors.cyanAcquisti} size={22} />
                <Text style={styles.clockLockText}>{timeString}</Text>
              </View>

              <View style={styles.clockLockItem}>
                <LockKeyholeIcon color={ArrivaColors.cyanAcquisti} size={15} />
                <Text style={styles.clockLockTextSmall}>
                  {lockNumber != null ? String(lockNumber) : '...'}
                </Text>
              </View>
            </View>
          </View>

          <WaveBanner />

          <View style={styles.ticketGreenSection}>
            <Text style={styles.ticketGreenText}>
              <Text style={{ fontWeight: '400' }}>Da </Text>
              <Text style={{ fontWeight: '700' }}>{ticketData?.partenza ?? '...'}</Text>
              <Text style={{ fontWeight: '400' }}> a </Text>
              <Text style={{ fontWeight: '700' }}>{ticketData?.destinazione ?? '...'}</Text>
            </Text>

            <Text style={styles.ticketGreenText}>
              <Text style={{ fontWeight: '400' }}>Valido dal </Text>
              <Text style={{ fontWeight: '700' }}>{ticketData?.validoDal ?? '...'}</Text>
              <Text style={{ fontWeight: '400' }}> a </Text>
              <Text style={{ fontWeight: '700' }}>{ticketData?.validoAl ?? '...'}</Text>
            </Text>
          </View>

          <Text style={styles.labelEmesso}>Emesso il:</Text>
          <Text style={styles.emessoIl}>{ticketData?.emessoIl ?? '...'}</Text>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Costo</Text>
            <Text style={styles.costValue}>{ticketData?.prezzo ?? '...'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Codice Ticket:</Text>
            <Text style={styles.codeValue}>{ticketData?.codiceTicket ?? '...'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCtaOuter}>
        <TouchableOpacity style={styles.bottomCtaButton} activeOpacity={0.9} onPress={() => {}}>
          <View style={styles.bottomCtaInner}>
            <View style={{ position: 'absolute', left: 18 }}>
              <SendIcon color={ArrivaColors.greyBg} size={20} />
            </View>
            <Text style={styles.bottomCtaText}>Trasferisci ticket</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ArrivaColors.greenTicket },
  appBar: {
    backgroundColor: ArrivaColors.greenTicket,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  appBarTitle: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 18 },
  scrollContent: {
    paddingBottom: 160,
    paddingTop: 10,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  cardLogo: { height: 22, width: 160, tintColor: ArrivaColors.cyanArriva },
  cardTitle: { marginTop: 7, fontSize: 17, fontWeight: '700', color: '#111' },
  cardSubtitle: { marginTop: 4, fontSize: 13, fontWeight: '500', color: '#111', lineHeight: 18 },
  greyInfo: {
    marginTop: 14,
    padding: 16,
    backgroundColor: '#F4F5F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  greyInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greyTicketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0 },
  greyInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  greyInfoText: { marginLeft: 12, fontWeight: '700', fontSize: 14, color: '#111' },
  qrWrap: { alignItems: 'center', justifyContent: 'center' },
  qrHint: {
    marginTop: 20,
    textAlign: 'center',
    color: ArrivaColors.purpleDeep,
    textDecorationLine: 'underline',
    fontWeight: '700',
    fontSize: 15,
  },
  clockLockRow: {
    marginTop: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clockLockItem: { flexDirection: 'row', alignItems: 'center' },
  clockLockText: { marginLeft: 8, color: ArrivaColors.cyanAcquisti, fontSize: 18, fontWeight: '500' },
  clockLockTextSmall: { marginLeft: 8, color: ArrivaColors.cyanAcquisti, fontSize: 15, fontWeight: '500' },
  ticketGreenSection: {
    marginTop: 10,
    backgroundColor: ArrivaColors.greenTicket,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ticketGreenText: { color: '#fff', fontSize: 14, letterSpacing: -0.2 },
  labelEmesso: { marginTop: 16, fontSize: 14, fontWeight: '400', color: '#111' },
  emessoIl: { marginTop: 3, fontSize: 14, fontWeight: '600', color: '#111' },
  costRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costLabel: { fontSize: 18, fontWeight: '400', color: '#111' },
  costValue: { fontSize: 18, fontWeight: '700', color: '#111' },
  divider: { marginTop: 10, backgroundColor: ArrivaColors.divisore, height: 1 },
  codeRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeLabel: { fontSize: 14, fontWeight: '400', color: '#111' },
  codeValue: { fontSize: 15, fontWeight: '400', color: '#6B7280', flex: 1, textAlign: 'right' },
  bottomCtaOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  bottomCtaButton: {
    backgroundColor: ArrivaColors.purpleDeep,
    borderRadius: 50,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  bottomCtaInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCtaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

