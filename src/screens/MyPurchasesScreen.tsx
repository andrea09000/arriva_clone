import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ArrivaColors } from '../constants/colors';
import { Clock4Icon, RouteIcon } from '../components/ArrivaSvgIcon';

const BYPASS_LOGIN = true;

function TabButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.tabLabel, active ? styles.tabLabelActive : undefined]}>{label}</Text>
      <View style={[styles.tabIndicator, active ? styles.tabIndicatorActive : undefined]} />
    </TouchableOpacity>
  );
}

export default function MyPurchasesScreen({
  onRequireLogin,
  onOpenTicketActive,
}: {
  onRequireLogin: () => void;
  onOpenTicketActive: () => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);

  if (!BYPASS_LOGIN) {
    return (
      <NeedLoginPlaceholder onRequireLogin={onRequireLogin} />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>I miei acquisti</Text>

        <View style={styles.tabRow}>
          <TabButton active={tabIndex === 0} label="DISPONIBILI" onPress={() => setTabIndex(0)} />
          <TabButton active={tabIndex === 1} label="SCADUTI" onPress={() => setTabIndex(1)} />
        </View>
      </View>

      {tabIndex === 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          <View style={styles.headerGrey}>
            <Text style={styles.headerGreyText}>Ticket attivi</Text>
          </View>

          <View style={{ height: 15 }} />

          <TouchableOpacity activeOpacity={0.9} onPress={onOpenTicketActive}>
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Image source={require('../../assets/arriva/logo.png')} style={styles.cardLogo} />
                <View style={styles.badgeActive}>
                  <Text style={styles.badgeActiveText}>Attivo</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>Abbonamento Annuale Studenti</Text>
              <View style={styles.divider} />
              <View style={{ height: 6 }} />

              <DetailRow icon={<RouteIcon color="#111" size={18} />} label="Tratta:" value="LOGRATO - ORZINUOVI" />
              <DetailRow icon={<Clock4Icon color="#111" size={17} />} label="Valido fino al:" value="31/08/2026" />

              <View style={{ height: 15 }} />
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Costo</Text>
                <Text style={styles.costValue}>472,00 €</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={{ color: '#111' }}>Nessun ticket scaduto</Text>
        </View>
      )}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconWrap}>{icon}</View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function NeedLoginPlaceholder({ onRequireLogin }: { onRequireLogin: () => void }) {
  return (
    <View style={styles.needLoginScreen}>
      <View style={styles.needLoginAppBar}>
        <Text style={styles.needLoginAppBarTitle}>I miei acquisti</Text>
      </View>

      <View style={styles.needLoginBody}>
        <MaterialIcons name="hiking" size={120} color={ArrivaColors.cyanAcquisti} />
        <View style={{ height: 30 }} />
        <Text style={styles.needLoginText}>
          Effettua l'accesso per visualizzare i tuoi{'\n'}biglietti.
        </Text>
        <View style={{ height: 20 }} />
        <TouchableOpacity onPress={onRequireLogin} activeOpacity={0.8}>
          <Text style={styles.needLoginAccedi}>Accedi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ArrivaColors.greyBg },
  appBar: {
    backgroundColor: '#fff',
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  appBarTitle: {
    textAlign: 'center',
    color: ArrivaColors.cyanAcquisti,
    fontWeight: '700',
    fontSize: 16,
    paddingBottom: 4,
  },
  tabRow: { flexDirection: 'row' },
  tabBtn: { flex: 1, alignItems: 'center' },
  tabLabel: { fontWeight: '500', fontSize: 14, color: '#9CA3AF', paddingTop: 6 },
  tabLabelActive: { color: ArrivaColors.cyanAcquisti },
  tabIndicator: { marginTop: 6, height: 5, width: 40, borderRadius: 10, backgroundColor: 'transparent' },
  tabIndicatorActive: { backgroundColor: ArrivaColors.cyanAcquisti },
  headerGrey: { backgroundColor: '#F4F5F7', paddingVertical: 13, paddingHorizontal: 16 },
  headerGreyText: { fontWeight: '700', fontSize: 14, color: '#111' },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgb(224,224,224)',
    padding: 16,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLogo: { height: 18, width: 90, tintColor: ArrivaColors.cyanArriva },
  badgeActive: { backgroundColor: 'rgb(215,243,220)', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 5 },
  badgeActiveText: { color: 'rgb(0,93,62)', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
  cardTitle: { marginTop: 3, fontWeight: '800', fontSize: 14, color: '#111' },
  divider: { height: 1, backgroundColor: ArrivaColors.divisore, opacity: 0.9, marginTop: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  detailIconWrap: { width: 24, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { color: '#111', fontSize: 14, marginLeft: 8, fontWeight: '400' },
  detailValue: { marginLeft: 6, fontWeight: '700', color: '#111', fontSize: 14 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costLabel: { fontWeight: '500', fontSize: 16, color: '#111' },
  costValue: { fontWeight: '700', fontSize: 15, color: '#111' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  needLoginScreen: { flex: 1, backgroundColor: '#fff' },
  needLoginAppBar: { height: 56, alignItems: 'center', justifyContent: 'center' },
  needLoginAppBarTitle: { color: ArrivaColors.cyanAcquisti, fontWeight: '700', fontSize: 16 },
  needLoginBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  needLoginText: { fontSize: 16, fontWeight: '800', color: '#111', textAlign: 'center', lineHeight: 22 },
  needLoginAccedi: { color: ArrivaColors.purpleDeep, fontSize: 18, fontWeight: '800', textDecorationLine: 'underline' },
});

