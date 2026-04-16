import React from 'react';
import HomeScreen from './HomeScreen';
import VerificationTestScreen from './VerificationTestScreen';
import MyPurchasesScreen from './MyPurchasesScreen';
import ProfileScreen from './ProfileScreen';

export type MainScreenProps = {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onRequireLogin: () => void;
  onOpenTicketActive: () => void;
  onLogoutDone: () => void;
};

export default function MainScreen({
  selectedIndex,
  onRequireLogin,
  onOpenTicketActive,
  onLogoutDone,
}: MainScreenProps) {
  // Nota: Bottom nav fuori da questo componente, qui rendiamo solo la “pagina” corrente.
  switch (selectedIndex) {
    case 0:
      return <HomeScreen />;
    case 1:
      return <VerificationTestScreen />;
    case 2:
      return <MyPurchasesScreen onRequireLogin={onRequireLogin} onOpenTicketActive={onOpenTicketActive} />;
    case 3:
      return <ProfileScreen onLogoutDone={onLogoutDone} />;
    default:
      return <MyPurchasesScreen onRequireLogin={onRequireLogin} onOpenTicketActive={onOpenTicketActive} />;
  }
}

