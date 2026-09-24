import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
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
  const { theme, isDark } = useTheme();
  const { sprint, status, executeFill, isDispensing, fillTarget } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  const fillBtnScale = useRef(new Animated.Value(1)).current;

  const handleFillPress = () => {
    Animated.sequence([
      Animated.timing(fillBtnScale, { toValue: 0.90, duration: 70, useNativeDriver: true }),
      Animated.spring(fillBtnScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    if (fillTarget <= 0) {
      onNavigateToFill();
    } else {
      executeFill();
    }
  };

  const formatCountdown = (epoch: number) => {
    const diff = epoch - Date.now();
    if (diff <= 0) return 'Due now';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const cardResponsiveStyle = {
    padding: isSmallMobile ? 14 : isNarrow ? 16 : isTabletOrDesktop ? 22 : 18,
    borderRadius: isSmallMobile ? 16 : 20,
    marginBottom: isSmallMobile ? 10 : 12,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: isSmallMobile ? 12 : isNarrow ? 16 : isTabletOrDesktop ? 24 : 18,
          paddingTop: isSmallMobile ? 10 : 14,
          paddingBottom: 36,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.responsiveWrapper, { maxWidth: isTabletOrDesktop ? 680 : 640 }]}>
        {/* Realtime Scale Dial */}
        <WeightGauge />

        {/* Quick Feeding Portions */}
        <QuickFeedCard />

        {/* Fill Card Feature Shortcut */}
        <View
          style={[
            styles.fillBanner,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.fillBannerContent}>
            <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
              ONE-TAP REFILL
            </Text>
            <Text style={[styles.fillTitle, { color: theme.textPrimary, fontSize: isSmallMobile ? 14 : 15 }]}>
              {fillTarget > 0 ? `Bowl Fill • ${fillTarget}g Target` : 'Bowl Fill • Set Target'}
            </Text>
            <Text style={[styles.fillDesc, { color: theme.textSecondary }]}>
              Continuous closed-loop bulk pour with dynamic anti-jam gate throttling.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleFillPress}
            disabled={isDispensing}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.fillActionBtn,
                {
                  backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                  transform: [{ scale: fillBtnScale }],
                  paddingHorizontal: isSmallMobile ? 10 : 14,
                  paddingVertical: isSmallMobile ? 8 : 10,
                },
              ]}
            >
              <Ionicons name="water" size={13} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={styles.fillActionText}>
                {fillTarget > 0 ? 'Fill Bowl' : 'Set Target'}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Sprint Schedule Status Card */}
        <View
          style={[
            styles.card,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
                AUTONOMOUS DISPENSER
              </Text>
              <Text style={[styles.sprintTitle, { color: theme.textPrimary, fontSize: isSmallMobile ? 14 : 15 }]}>
                Interval Schedule
              </Text>
              <Text style={[styles.sprintSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
                {sprint.enabled ? 'Active RTC schedule running autonomously' : 'No active recurring schedule configured'}
              </Text>
            </View>
            <TouchableOpacity onPress={onNavigateToSprint} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text
                style={[
                  styles.manageText,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                Configure
              </Text>
            </TouchableOpacity>
          </View>

          {sprint.enabled ? (
            <View style={[styles.sprintStatsGrid, { gap: isSmallMobile ? 6 : 8 }]}>
              <View style={[styles.statBox, { backgroundColor: theme.surfaceLight, padding: isSmallMobile ? 7 : 10 }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted, fontSize: isSmallMobile ? 9 : 10 }]}>Next Feed</Text>
                <Text style={[styles.statVal, { color: theme.textPrimary, fontSize: isSmallMobile ? 12 : 14 }]}>
                  {formatCountdown(sprint.nextFeedEpoch)}
                </Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.surfaceLight, padding: isSmallMobile ? 7 : 10 }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted, fontSize: isSmallMobile ? 9 : 10 }]}>Portion</Text>
                <Text style={[styles.statVal, { color: theme.textPrimary, fontSize: isSmallMobile ? 12 : 14 }]}>{sprint.grams}g</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.surfaceLight, padding: isSmallMobile ? 7 : 10 }]}>
                <Text style={[styles.statLabel, { color: theme.textMuted, fontSize: isSmallMobile ? 9 : 10 }]}>Progress</Text>
                <Text style={[styles.statVal, { color: theme.textPrimary, fontSize: isSmallMobile ? 12 : 14 }]}>
                  {sprint.completedFeeds}/{sprint.totalFeeds}
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
                size={15}
                color={theme.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.createSprintText, { color: theme.textPrimary }]}>
                Set up scheduled meal interval
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
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
              paddingVertical: isSmallMobile ? 9 : 11,
              paddingHorizontal: isSmallMobile ? 10 : 16,
              borderRadius: isSmallMobile ? 12 : 14,
            },
          ]}
        >
          <View style={styles.telemetryItem}>
            <Ionicons
              name="wifi"
              size={13}
              color={status.wifi ? theme.success : theme.danger}
            />
            <Text style={[styles.telemetryText, { color: theme.textSecondary, fontSize: isSmallMobile ? 10 : 11 }]}>
              {status.wifi ? `Wi-Fi ${status.rssi || -60} dBm` : 'Offline'}
            </Text>
          </View>

          <View style={[styles.telemetryDivider, { backgroundColor: theme.borderLight }]} />

          <View style={styles.telemetryItem}>
            <Ionicons
              name="hardware-chip-outline"
              size={13}
              color={isDark ? theme.accentSage : theme.textSecondary}
            />
            <Text style={[styles.telemetryText, { color: theme.textSecondary, fontSize: isSmallMobile ? 10 : 11 }]}>
              FW v{status.firmware}
            </Text>
          </View>

          <View style={[styles.telemetryDivider, { backgroundColor: theme.borderLight }]} />

          <View style={styles.telemetryItem}>
            <Ionicons name="shield-checkmark-outline" size={13} color={theme.success} />
            <Text style={[styles.telemetryText, { color: theme.textSecondary, fontSize: isSmallMobile ? 10 : 11 }]}>
              Anti-Jam OK
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  responsiveWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  fillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
  },
  fillBannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  fillTitle: {
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
    borderRadius: 12,
  },
  fillActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  card: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sprintTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sprintSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  manageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sprintStatsGrid: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontWeight: '500',
    marginBottom: 3,
  },
  statVal: {
    fontWeight: '700',
  },
  createSprintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
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
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    width: '100%',
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  telemetryText: {
    fontWeight: '600',
  },
  telemetryDivider: {
    width: 1,
    height: 14,
  },
});
