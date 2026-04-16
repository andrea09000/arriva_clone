import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ArrivaColors } from '../constants/colors';
import { getCurrentEmail, signOut } from '../services/localAuth';

export default function ProfileScreen({ onLogoutDone }: { onLogoutDone: () => void }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentEmail().then((v) => {
      if (mounted) setEmail(v);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profilo</Text>
      </View>

      <View style={styles.body}>
        {email == null ? (
          <Text style={{ fontSize: 16 }}>Non sei loggato.</Text>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons name="account-circle" size={100} color={ArrivaColors.cyanArriva} />
            <View style={{ height: 20 }} />
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Loggato come:</Text>
            <Text style={{ marginTop: 4, fontWeight: '800', fontSize: 18 }}>
              {email}
            </Text>
            <View style={{ height: 40 }} />

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.logoutBtn}
              onPress={async () => {
                await signOut();
                onLogoutDone();
              }}
            >
              <MaterialIcons name="logout" color="#fff" size={20} />
              <Text style={styles.logoutText}>ESCI (LOGOUT)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ArrivaColors.greyBg },
  appBar: {
    backgroundColor: '#fff',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  appBarTitle: {
    color: ArrivaColors.purpleDeep,
    fontWeight: '700',
    fontSize: 16,
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoutBtn: {
    backgroundColor: '#F87171', // redAccent-ish
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

