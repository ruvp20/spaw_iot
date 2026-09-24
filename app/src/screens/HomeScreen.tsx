import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';
import { WeightGauge } from '../components/WeightGauge';
import { QuickFeedCard } from '../components/QuickFeedCard';

interface HomeScreenProps {
  onNavigateToSprint: () => void;
  onNavigateToFill: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSprint, onNavigateToFill }) => {
  const { theme } = useTheme();
  const { sprint, status, executeFill, isDispensing } = useFeeder();

  const formatCountdown = (epoch: number) => {
    const diff = epoch - Date.now();
    if (diff <= 0) return 'Due now';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Realtime Scale Dial */}
      <WeightGauge />

      {/* Quick Feeding Portions */}
      <QuickFeedCard />

      {/* Fill Card Feature Shortcut */}
      <View
        style={[
          styles.fillBanner,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <View style={styles.fillBannerContent}>
          <View style={styles.fillBadgeRow}>
            <View style={[styles.fillDot, { backgroundColor: theme.accentSage }]} />
            <Text style={[styles.fillBadgeLabel, { color: theme.accentSage }]}>
              Automated Fill
            </Text>
          </View>
          <Text style={[styles.fillTitle, { color: theme.textPrimary }]}>
            Bowl Fill • 250g Target
          </Text>
          <Text style={[styles.fillDesc, { color: theme.textMuted }]}>
            Continuous closed-loop bulk pour with anti-jam shutoff.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.fillActionBtn,
            { backgroundColor: theme.primaryInteractive },
          ]}
          onPress={executeFill}
          disabled={isDispensing}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={13} color="#FFF" style={{ marginRight: 4 }} />
          <Text style={styles.fillActionText}>Fill Bowl</Text>
        </TouchableOpacity>
      </View>

      {/* Sprint Schedule Status Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.sprintIconCircle,
              { backgroundColor: theme.accentOchreTint },
            ]}
          >
            <Ionicons name="calendar-outline" size={15} color={theme.accentOchre} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sprintTitle, { color: theme.textSecondary }]}>
              Sprint Schedule
            </Text>
            <Text style={[styles.sprintSubtitle, { color: theme.textMuted }]}>
              {sprint.enabled ? 'Autonomous interval feeds active' : 'No active schedule configured'}
            </Text>
          </View>
          <TouchableOpacity onPress={onNavigateToSprint} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.manageText, { color: theme.primaryInteractive }]}>Configure</Text>
          </TouchableOpacity>
        </View>

        {sprint.enabled ? (
          <View style={styles.sprintStatsGrid}>
            <View style={[styles.statBox, { backgroundColor: theme.surfaceLight }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Next Feed</Text>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>
                {formatCountdown(sprint.nextFeedEpoch)}
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.surfaceLight }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Portion</Text>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>{sprint.grams}g</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.surfaceLight }]}>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Progress</Text>
              <Text style={[styles.statVal, { color: theme.textPrimary }]}>
                {sprint.completedFeeds} / {sprint.totalFeeds}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.createSprintBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={onNavigateToSprint}
            activeOpacity={0.7}
          >
            <Ionicons
              name="add-outline"
              size={16}
              color={theme.accentOchre}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.createSprintText, { color: theme.textPrimary }]}>
              Set up scheduled feeds
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* System Telemetry & Health */}
      <View
        style={[
          styles.telemetryCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.borderLight,
          },
        ]}
      >
        <View style={styles.telemetryItem}>
          <Ionicons
            name="wifi"
            size={14}
            color={status.wifi ? theme.success : theme.danger}
          />
          <Text style={[styles.telemetryText, { color: theme.textSecondary }]}>
            {status.wifi ? `Wi-Fi ${status.rssi || -60} dBm` : 'Offline'}
          </Text>
        </View>

        <View style={[styles.telemetryDivider, { backgroundColor: theme.borderLight }]} />

        <View style={styles.telemetryItem}>
          <Ionicons name="hardware-chip-outline" size={14} color={theme.accentSage} />
          <Text style={[styles.telemetryText, { color: theme.textSecondary }]}>
            FW v{status.firmware}
          </Text>
        </View>

        <View style={[styles.telemetryDivider, { backgroundColor: theme.borderLight }]} />

        <View style={styles.telemetryItem}>
          <Ionicons name="shield-checkmark-outline" size={14} color={theme.success} />
          <Text style={[styles.telemetryText, { color: theme.textSecondary }]}>
            Anti-Jam OK
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fillBannerContent: {
    flex: 1,
    paddingRight: 14,
  },
  fillBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  fillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  fillBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  fillTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  fillDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  fillActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  fillActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sprintIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sprintTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sprintSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  manageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sprintStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  createSprintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
  },
  createSprintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  telemetryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telemetryText: {
    fontSize: 11,
    fontWeight: '500',
  },
  telemetryDivider: {
    width: 1,
    height: 14,
  },
});
