import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type TabKey = 'home' | 'fill' | 'sprint' | 'history' | 'settings';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { theme } = useTheme();

  const tabs: {
    key: TabKey;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconActive: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: 'home', label: 'Feeder', icon: 'paw-outline', iconActive: 'paw' },
    { key: 'fill', label: 'Fill 250g', icon: 'water-outline', iconActive: 'water' },
    { key: 'sprint', label: 'Schedule', icon: 'calendar-outline', iconActive: 'calendar' },
    { key: 'history', label: 'Logs', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
    { key: 'settings', label: 'Settings', icon: 'options-outline', iconActive: 'options' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.borderLight,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && {
                  backgroundColor: theme.primaryTint,
                },
              ]}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={18}
                color={isActive ? theme.primaryInteractive : theme.textMuted}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.primaryInteractive : theme.textMuted },
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconContainer: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
