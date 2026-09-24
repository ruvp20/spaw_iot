import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const Header: React.FC<{ title?: string }> = ({ title = 'spaw' }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { connectionStatus, isMockMode, feederIp, refreshStatus } = useFeeder();

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'mock_mode':
        return {
          label: 'Demo',
          bg: theme.accentOchreTint,
          color: theme.accentOchre,
          dot: theme.accentOchre,
        };
      case 'connected':
        return {
          label: 'Online',
          bg: theme.successTint,
          color: theme.success,
          dot: theme.success,
        };
      case 'connecting':
        return {
          label: 'Connecting',
          bg: theme.accentClayTint,
          color: theme.accentClay,
          dot: theme.accentClay,
        };
      case 'disconnected':
      default:
        return {
          label: 'Offline',
          bg: theme.dangerTint,
          color: theme.danger,
          dot: theme.danger,
        };
    }
  };

  const status = getStatusInfo();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.borderLight }]}>
      {/* Brand & Subtitle */}
      <View style={styles.brandGroup}>
        <View style={styles.titleRow}>
          <View style={[styles.brandIcon, { backgroundColor: theme.primaryTint }]}>
            <Ionicons name="paw" size={16} color={theme.accentSage} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.badgeEdition, { color: theme.textMuted }]}>iot</Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {isMockMode ? 'Simulated Feeder' : feederIp}
        </Text>
      </View>

      {/* Right Actions: Status Badge & Theme Toggle */}
      <View style={styles.actionGroup}>
        {/* Connection status pill */}
        <TouchableOpacity
          style={[styles.statusPill, { backgroundColor: status.bg, borderColor: theme.borderLight }]}
          onPress={refreshStatus}
          activeOpacity={0.7}
        >
          <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </TouchableOpacity>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          style={[styles.themeBtn, { backgroundColor: theme.surfaceLight, borderColor: theme.borderLight }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={16}
            color={isDark ? theme.accentOchre : theme.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandGroup: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  badgeEdition: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
    fontFamily: 'monospace',
    letterSpacing: -0.2,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
