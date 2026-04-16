import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ArrivaColors } from '../constants/colors';

type NavItem = {
  key: number;
  label: string;
  asset: any; // require()
  size: number;
};

type Props = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function BottomNav({ selectedIndex, onSelect }: Props) {
  const items: NavItem[] = [
    {
      key: 0,
      label: 'Home',
      asset: require('../../assets/arriva/icon_home.png'),
      size: 28,
    },
    {
      key: 1,
      label: 'Biglietteria',
      asset: require('../../assets/arriva/icon_shop.png'),
      size: 38,
    },
    {
      key: 2,
      label: 'I miei acquisti',
      asset: require('../../assets/arriva/icon_ticket.png'),
      size: 28,
    },
    {
      key: 3,
      label: 'Profilo',
      asset: require('../../assets/arriva/icon_profile.png'),
      size: 34,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerShadow}>
        <View style={styles.row}>
          {items.map((item) => {
            const active = selectedIndex === item.key;
            return (
              <TouchableOpacity key={item.key} style={styles.item} onPress={() => onSelect(item.key)}>
                <Image
                  source={item.asset}
                  style={[
                    styles.icon,
                    {
                      height: item.size,
                      tintColor: active ? ArrivaColors.purpleDeep : '#757575',
                    },
                  ]}
                  resizeMode="contain"
                />
                <Text style={[styles.label, active ? styles.labelActive : undefined]} numberOfLines={1}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  innerShadow: {
    backgroundColor: '#fff',
    paddingTop: 6,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  item: {
    alignItems: 'center',
    width: '25%',
  },
  icon: {
    width: 34,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '400',
    color: '#757575',
    textAlign: 'center',
  },
  labelActive: {
    color: ArrivaColors.purpleDeep,
    fontWeight: '700',
  },
});

