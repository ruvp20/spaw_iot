import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { FeederProvider } from './src/context/FeederContext';
import { Header } from './src/components/Header';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { FillScreen } from './src/screens/FillScreen';
import { SprintScreen } from './src/screens/SprintScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const { theme, isDark } = useTheme();

  // Theme cross-fade animation
  const themeFadeAnim = useRef(new Animated.Value(1)).current;

  // Screen entrance animation on tab change
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const tabSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    themeFadeAnim.setValue(0.7);
    Animated.timing(themeFadeAnim, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  useEffect(() => {
    tabFadeAnim.setValue(0);
    tabSlideAnim.setValue(8);
    Animated.parallel([
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(tabSlideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTab]);

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.View style={[styles.mainWrapper, { opacity: themeFadeAnim }]}>
        <Header />
        <Animated.View
          style={[
            styles.screenContainer,
            {
              opacity: tabFadeAnim,
              transform: [{ translateY: tabSlideAnim }],
            },
          ]}
        >
          {renderCurrentScreen()}
        </Animated.View>
        <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
      </Animated.View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FeederProvider>
        <MainApp />
      </FeederProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
