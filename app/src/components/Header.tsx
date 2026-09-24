import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const Header: React.FC<{ title?: string }> = ({ title = 'Spaw IoT' }) => {
  const { connectionStatus, isMockMode, feederIp, status, refreshStatus } = useFeeder();

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'mock_mode':
        return { label: 'DEMO MODE', bg: 'rgba(139, 92, 246, 0.2)', text: Colors.purple, dot: Colors.purple };
      case 'connected':
        return { label: 'ONLINE', bg: 'rgba(16, 185, 129, 0.2)', text: Colors.primary, dot: Colors.primary };
      case 'connecting':
        return { label: 'CONNECTING', bg: 'rgba(245, 158, 11, 0.2)', text: Colors.amber, dot: Colors.amber };
      case 'disconnected':
      default:
        return { label: 'OFFLINE', bg: 'rgba(239, 68, 68, 0.2)', text: Colors.danger, dot: Colors.danger };
    }
  };

  const badge = getStatusBadge();

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleRow}>
          <Ionicons name="paw" size={20} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.subtitle}>
          {isMockMode ? 'Simulated ESP32' : feederIp}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.badge, { backgroundColor: badge.bg }]} 
        onPress={refreshStatus}
        activeOpacity={0.8}
      >
        <View style={[styles.dot, { backgroundColor: badge.dot }]} />
        <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
