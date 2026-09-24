import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const SprintScreen: React.FC = () => {
  const { theme } = useTheme();
  const { sprint, saveSprint, cancelSprint } = useFeeder();

  const [grams, setGrams] = useState<number>(sprint.grams || 50);
  const [intervalHours, setIntervalHours] = useState<number>(sprint.intervalHours || 4);
  const [totalFeeds, setTotalFeeds] = useState<number>(sprint.totalFeeds || 4);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const intervalOptions = [2, 4, 6, 8, 12];
  const countOptions = [2, 3, 4, 5, 6];

  const handleStartSprint = async () => {
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
              <Ionicons name="time" size={16} color={theme.accentOchre} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activeTitle, { color: theme.textPrimary }]}>
                Active Schedule
              </Text>
              <Text style={[styles.activeSubtitle, { color: theme.textMuted }]}>
                {sprint.grams}g every {sprint.intervalHours}h ({sprint.completedFeeds} of {sprint.totalFeeds} delivered)
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
            style={[
              styles.cancelButton,
              {
                backgroundColor: theme.dangerTint,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={handleCancelSprint}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={16} color={theme.danger} style={{ marginRight: 6 }} />
            <Text style={[styles.cancelText, { color: theme.danger }]}>
              Cancel Active Schedule
            </Text>
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
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Schedule Settings
        </Text>
        <Text style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Feeds execute automatically on the ESP32 RTC clock without needing your phone online.
        </Text>

        {/* Portion Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Food Portion per Feed
        </Text>
        <View style={styles.quickGramsRow}>
          {[25, 40, 50, 65, 80].map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: grams === val ? theme.primaryTint : theme.surfaceLight,
                  borderColor: grams === val ? theme.primaryInteractive : theme.borderLight,
                },
              ]}
              onPress={() => setGrams(val)}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: grams === val ? theme.primaryInteractive : theme.textSecondary,
                    fontWeight: grams === val ? '700' : '500',
                  },
                ]}
              >
                {val}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Interval Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Interval Between Feeds
        </Text>
        <View style={styles.quickGramsRow}>
          {intervalOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: intervalHours === val ? theme.primaryTint : theme.surfaceLight,
                  borderColor: intervalHours === val ? theme.primaryInteractive : theme.borderLight,
                },
              ]}
              onPress={() => setIntervalHours(val)}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: intervalHours === val ? theme.primaryInteractive : theme.textSecondary,
                    fontWeight: intervalHours === val ? '700' : '500',
                  },
                ]}
              >
                {val}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Feeds Selector */}
        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
          Number of Feeds
        </Text>
        <View style={styles.quickGramsRow}>
          {countOptions.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.pillBtn,
                {
                  backgroundColor: totalFeeds === val ? theme.primaryTint : theme.surfaceLight,
                  borderColor: totalFeeds === val ? theme.primaryInteractive : theme.borderLight,
                },
              ]}
              onPress={() => setTotalFeeds(val)}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: totalFeeds === val ? theme.primaryInteractive : theme.textSecondary,
                    fontWeight: totalFeeds === val ? '700' : '500',
                  },
                ]}
              >
                {val}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start / Update Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primaryInteractive }]}
          onPress={handleStartSprint}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.saveBtnText}>
            {sprint.enabled ? 'Update Schedule' : 'Start Schedule'}
          </Text>
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
        <Text style={[styles.timelineTitle, { color: theme.textSecondary }]}>
          Estimated Timeline
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
            <View style={[styles.timelineDot, { backgroundColor: theme.accentSage }]} />
            <Text style={[styles.timelineFeedName, { color: theme.textPrimary }]}>
              Feed #{item.num}
            </Text>
            <Text style={[styles.timelineGrams, { color: theme.textMuted }]}>
              {grams}g
            </Text>
            <Text style={[styles.timelineTime, { color: theme.accentSage }]}>
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
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
  activeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
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
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionDesc: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 6,
  },
  quickGramsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pillBtn: {
    flex: 1,
    paddingVertical: 9,
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
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 14,
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
    fontSize: 13,
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
    width: 6,
    height: 6,
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
