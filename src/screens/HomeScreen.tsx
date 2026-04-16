import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ArrivaColors } from '../constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <Image
          source={require('../../assets/arriva/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.purpleHero}>
          <View style={styles.cityRow}>
            <View style={styles.cityLeft}>
              <Text style={styles.cityText}>Brescia</Text>
              <MaterialIcons name="edit" size={26} color="#fff" style={{ marginLeft: 12 }} />
            </View>
            <MaterialIcons name="info-outline" size={28} color="#fff" />
          </View>

          <View style={{ height: 30 }} />

          <View style={styles.whiteButton}>
            <MaterialIcons name="confirmation-number" size={26} color={ArrivaColors.purpleDeep} />
            <Text style={styles.whiteButtonText}>Biglietti a tariffa fissa</Text>
            <MaterialIcons name="chevron-right" size={22} color="#111" />
          </View>

          <View style={{ height: 15 }} />

          <View style={styles.whiteButton}>
            <MaterialIcons name="credit-card" size={26} color={ArrivaColors.purpleDeep} />
            <Text style={styles.whiteButtonText}>Abbonamenti</Text>
            <MaterialIcons name="chevron-right" size={22} color="#111" />
          </View>

          <View style={{ height: 30 }} />

          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>
              Orari invernali in vigore dal 12 {'\n'}
              settembre 2025!
            </Text>
            <View style={{ height: 10 }} />
            <Text style={styles.noticeText}>
              Dal 12 settembre sono in vigore gli orari invernali. Per maggiori info visita il sito
              brescia.arriva.it
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ArrivaColors.greyBg,
  },
  appBar: {
    backgroundColor: ArrivaColors.cyanArriva,
    height: 64,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  logo: { height: 28, width: 140, tintColor: '#fff' },
  content: { paddingBottom: 140 }, // evita sovrapposizione con bottom nav
  purpleHero: {
    backgroundColor: ArrivaColors.purpleDeep,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 35,
    width: '100%',
  },
  cityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cityLeft: { flexDirection: 'row', alignItems: 'center' },
  cityText: { color: '#fff', fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  whiteButton: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteButtonText: { flex: 1, marginLeft: 18, fontSize: 17, fontWeight: '700', color: '#111' },
  noticeBox: {
    backgroundColor: ArrivaColors.blueWarning,
    borderRadius: 16,
    padding: 20,
  },
  noticeTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    lineHeight: 24,
  },
  noticeText: { color: '#fff', fontSize: 14, lineHeight: 20 },
});

