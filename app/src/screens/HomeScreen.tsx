import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';
import { WeightGauge } from '../components/WeightGauge';
import { QuickFeedCard } from '../components/QuickFeedCard';

interface HomeScreenProps {
  onNavigateToSprint: () => void;
  onNavigateToFill: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSprint, onNavigateToFill }) => {
  const { sprint, status, executeFill, isDispensing } = useFeeder();

  const formatCountdown = (epoch: number) => {
    const diff = epoch - Date.now();
    if (diff <= 0) return 'Due now';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Realtime Scale Dial */}
      <WeightGauge />

      {/* Quick Feeding Portions */}
      <QuickFeedCard />

      {/* Fill Card Feature Shortcut */}
      <View style={styles.fillBanner}>
        <View style={styles.fillBannerContent}>
          <Text style={styles.fillTitle}>FILL OPERATION</Text>
          <Text style={styles.fillDesc}>Target 250g bowl refill with continuous closed-loop feedback.</Text>
        </View>
        <TouchableOpacity
          style={styles.fillActionBtn}
          onPress={executeFill}
          disabled={isDispensing}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={16} color="#000" style={{ marginRight: 4 }} />
          <Text style={styles.fillActionText}>FILL 250g</Text>
        </TouchableOpacity>
      </View>

      {/* Sprint Schedule Status Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.sprintIconCircle}>
            <Ionicons name="calendar-outline" size={16} color={Colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sprintTitle}>SPRINT SCHEDULE</Text>
            <Text style={styles.sprintSubtitle}>
              {sprint.enabled ? 'Automatic Interval Feeding Active' : 'No Active Schedule'}
            </Text>
          </View>
          <TouchableOpacity onPress={onNavigateToSprint}>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {sprint.enabled ? (
          <View style={styles.sprintStatsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Next Feed In</Text>
              <Text style={styles.statVal}>{formatCountdown(sprint.nextFeedEpoch)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Portion</Text>
              <Text style={styles.statVal}>{sprint.grams}g</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statVal}>{sprint.completedFeeds} / {sprint.totalFeeds}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.createSprintBtn} onPress={onNavigateToSprint}>
            <Ionicons name="add-circle-outline" size={18} color={Colors.purple} style={{ marginRight: 6 }} />
            <Text style={styles.createSprintText}>Set Up Interval Feeds</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* System Telemetry & Health */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryItem}>
          <Ionicons name="wifi-outline" size={16} color={status.wifi ? Colors.primary : Colors.danger} />
          <Text style={styles.telemetryText}>
            {status.wifi ? `Wi-Fi (${status.rssi || -60} dBm)` : 'Offline'}
          </Text>
        </View>

        <View style={styles.telemetryDivider} />

        <View style={styles.telemetryItem}>
          <Ionicons name="cog-outline" size={16} color={Colors.cyan} />
          <Text style={styles.telemetryText}>FW v{status.firmware}</Text>
        </View>

        <View style={styles.telemetryDivider} />

        <View style={styles.telemetryItem}>
          <Ionicons name="shield-checkmark-outline" size={16} color={Colors.primary} />
          <Text style={styles.telemetryText}>Anti-Jam Active</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  fillBannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  fillTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  fillDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  fillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  fillActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sprintIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sprintTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.purple,
    letterSpacing: 1.1,
  },
  sprintSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  manageText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.cyan,
  },
  sprintStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  createSprintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  createSprintText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.purple,
  },
  telemetryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telemetryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  telemetryDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.borderLight,
  },
});
