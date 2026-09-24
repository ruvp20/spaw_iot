import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type TabKey = 'home' | 'fill' | 'sprint' | 'history' | 'settings';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { theme, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isTabletOrDesktop = width >= 768;

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
      <View
        style={[
          styles.innerRow,
          {
            maxWidth: isTabletOrDesktop ? 680 : '100%',
            paddingHorizontal: isSmallMobile ? 4 : 8,
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const activeColor = isDark ? theme.primaryInteractive : theme.primary;
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
                  {
                    paddingHorizontal: isSmallMobile ? 10 : 14,
                    paddingVertical: isSmallMobile ? 3 : 4,
                  },
                  isActive && {
                    backgroundColor: theme.primaryTint,
                  },
                ]}
              >
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={isSmallMobile ? 16 : 17}
                  color={isActive ? activeColor : theme.textMuted}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? activeColor : theme.textMuted,
                    fontSize: isSmallMobile ? 9 : 10,
                  },
                  isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 22,
    alignItems: 'center',
    width: '100%',
  },
  innerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconContainer: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 26,
  },
  tabLabel: {
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
