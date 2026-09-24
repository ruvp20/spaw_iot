import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';
import { FeederProvider } from './src/context/FeederContext';
import { Header } from './src/components/Header';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { FillScreen } from './src/screens/FillScreen';
import { SprintScreen } from './src/screens/SprintScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToSprint={() => setCurrentTab('sprint')}
            onNavigateToFill={() => setCurrentTab('fill')}
          />
        );
      case 'fill':
        return <FillScreen />;
      case 'sprint':
        return <SprintScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <HomeScreen
            onNavigateToSprint={() => setCurrentTab('sprint')}
            onNavigateToFill={() => setCurrentTab('fill')}
          />
        );
    }
  };

  return (
    <FeederProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <Header />
        <View style={styles.screenContainer}>
          {renderCurrentScreen()}
        </View>
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
      </SafeAreaView>
    </FeederProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
