import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import BottomNav from './src/components/BottomNav';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import TicketActiveScreen from './src/screens/TicketActiveScreen';
import { ArrivaColors } from './src/constants/colors';

type RouteName = 'main' | 'login' | 'ticketActive';

export default function App() {
  const [route, setRoute] = useState<RouteName>('main');
  const [selectedIndex, setSelectedIndex] = useState(2); // default: “I miei acquisti”

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={ArrivaColors.cyanArriva} />

      {route === 'main' ? (
        <>
          <MainScreen
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            onRequireLogin={() => setRoute('login')}
            onOpenTicketActive={() => setRoute('ticketActive')}
            onLogoutDone={() => setRoute('main')}
          />
          <BottomNav selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        </>
      ) : null}

      {route === 'login' ? <LoginScreen onBack={() => setRoute('main')} /> : null}

      {route === 'ticketActive' ? (
        <TicketActiveScreen
          onBack={() => {
            setRoute('main');
            setSelectedIndex(2);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ArrivaColors.greyBg,
  },
});
