import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const SprintScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { sprint, saveSprint, cancelSprint } = useFeeder();

  const [grams, setGrams] = useState<number>(sprint.grams || 50);
  const [intervalHours, setIntervalHours] = useState<number>(sprint.intervalHours || 4);
  const [totalFeeds, setTotalFeeds] = useState<number>(sprint.totalFeeds || 4);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const intervalOptions = [2, 4, 6, 8, 12];
  const countOptions = [2, 3, 4, 5, 6];

  const saveScale = useRef(new Animated.Value(1)).current;
  const cancelScale = useRef(new Animated.Value(1)).current;

  const handleStartSprint = async () => {
    Animated.sequence([
      Animated.timing(saveScale, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.spring(saveScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    setIsSaving(true);
    try {
      await saveSprint(grams, intervalHours, totalFeeds);
    } catch (e) {
      console.warn('Error saving sprint', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSprint = async () => {
    Animated.sequence([
      Animated.timing(cancelScale, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.spring(cancelScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    await cancelSprint();
  };

  const getTimelinePreviews = () => {
    const now = Date.now();
    const list = [];
    for (let i = 1; i <= totalFeeds; i++) {
      const feedTime = new Date(now + i * intervalHours * 3600 * 1000);
      const timeStr = feedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      list.push({ num: i, time: timeStr });
    }
    return list;
  };

  const timeline = getTimelinePreviews();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Active Sprint Banner */}
      {sprint.enabled ? (
        <View
          style={[
            styles.activeCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.activeHeader}>
            <View style={[styles.activeIconCircle, { backgroundColor: theme.accentOchreTint }]}>
              <Ionicons name="time" size={15} color={theme.accentOchre} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
                RECURRING CYCLE ACTIVE
              </Text>
              <Text style={[styles.activeTitle, { color: theme.textPrimary }]}>
                {sprint.grams}g every {sprint.intervalHours} hours
              </Text>
              <Text style={[styles.activeSubtitle, { color: theme.textSecondary }]}>
                {sprint.completedFeeds} of {sprint.totalFeeds} completed
              </Text>
            </View>
          </View>

          <View style={styles.activeProgressRow}>
            <View style={[styles.progressTrack, { backgroundColor: theme.surfaceLight }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.accentOchre,
                    width: `${(sprint.completedFeeds / Math.max(1, sprint.totalFeeds)) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: theme.accentOchre }]}>
              {sprint.completedFeeds}/{sprint.totalFeeds}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCancelSprint}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.cancelButton,
                {
                  backgroundColor: theme.dangerTint,
                  borderColor: theme.borderLight,
                  transform: [{ scale: cancelScale }],
                },
              ]}
            >
              <Ionicons name="close-circle-outline" size={15} color={theme.danger} style={{ marginRight: 6 }} />
              <Text style={[styles.cancelText, { color: theme.danger }]}>
                Cancel Recurring Schedule
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Configuration Card */}
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
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          AUTONOMOUS DISPENSER
        </Text>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Schedule Configuration
        </Text>
        <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
          The ESP32 runs this schedule autonomously via real-time clock without requiring active phone connection.
        </Text>

        {/* Portion Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
          PORTION SIZE (GRAMS)
        </Text>
        <View style={styles.quickGramsRow}>
          {[25, 40, 50, 65, 80].map((val) => {
            const isSelected = grams === val;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.pillBtn,
                  {
                    backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                    borderColor: isSelected
                      ? isDark
                        ? theme.primaryInteractive
                        : theme.primary
                      : theme.borderLight,
                  },
                ]}
                onPress={() => setGrams(val)}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {val}g
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Interval Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
          INTERVAL BETWEEN DISPENSES
        </Text>
        <View style={styles.quickGramsRow}>
          {intervalOptions.map((val) => {
            const isSelected = intervalHours === val;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.pillBtn,
                  {
                    backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                    borderColor: isSelected
                      ? isDark
                        ? theme.primaryInteractive
                        : theme.primary
                      : theme.borderLight,
                  },
                ]}
                onPress={() => setIntervalHours(val)}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {val}h
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Total Feeds Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
          TOTAL DISPENSE CYCLES
        </Text>
        <View style={styles.quickGramsRow}>
          {countOptions.map((val) => {
            const isSelected = totalFeeds === val;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.pillBtn,
                  {
                    backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                    borderColor: isSelected
                      ? isDark
                        ? theme.primaryInteractive
                        : theme.primary
                      : theme.borderLight,
                  },
                ]}
                onPress={() => setTotalFeeds(val)}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {val}x
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start / Update Button */}
        <TouchableOpacity
          onPress={handleStartSprint}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.saveBtn,
              {
                backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                transform: [{ scale: saveScale }],
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>
              {sprint.enabled ? 'Update Schedule' : 'Start Schedule'}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Generated Timeline Forecast */}
      <View
        style={[
          styles.timelineCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          FORECAST
        </Text>
        <Text style={[styles.timelineTitle, { color: theme.textPrimary }]}>
          Calculated Timeline
        </Text>
        {timeline.map((item, idx) => (
          <View
            key={item.num}
            style={[
              styles.timelineRow,
              { borderBottomColor: theme.borderLight },
              idx === timeline.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            />
            <Text style={[styles.timelineFeedName, { color: theme.textPrimary }]}>
              Feed #{item.num}
            </Text>
            <Text style={[styles.timelineGrams, { color: theme.textMuted }]}>
              {grams}g
            </Text>
            <Text
              style={[
                styles.timelineTime,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              {item.time}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  activeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  activeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionDesc: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
    lineHeight: 15,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 6,
  },
  quickGramsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  timelineCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  timelineDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 10,
  },
  timelineFeedName: {
    fontSize: 12,
    fontWeight: '600',
    width: 75,
  },
  timelineGrams: {
    fontSize: 12,
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
