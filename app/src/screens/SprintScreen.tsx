import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const SprintScreen: React.FC = () => {
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

  // Generate preview feed timestamps
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Active Sprint Banner */}
      {sprint.enabled ? (
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <View style={styles.activeIconCircle}>
              <Ionicons name="flash" size={18} color={Colors.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>SPRINT IN PROGRESS</Text>
              <Text style={styles.activeSubtitle}>
                {sprint.grams}g every {sprint.intervalHours} hours ({sprint.completedFeeds} of {sprint.totalFeeds} completed)
              </Text>
            </View>
          </View>

          <View style={styles.activeProgressRow}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(sprint.completedFeeds / Math.max(1, sprint.totalFeeds)) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressPct}>
              {sprint.completedFeeds}/{sprint.totalFeeds}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSprint}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={18} color={Colors.danger} style={{ marginRight: 6 }} />
            <Text style={styles.cancelText}>Cancel Active Schedule</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Configuration Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>CONFIGURE SPRINT SCHEDULE</Text>
        <Text style={styles.sectionDesc}>
          The ESP32 runs this schedule autonomously, even if the mobile app is closed.
        </Text>

        {/* Portion Selector */}
        <Text style={styles.fieldLabel}>FOOD PER FEED (GRAMS)</Text>
        <View style={styles.quickGramsRow}>
          {[25, 40, 50, 65, 80].map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.pillBtn, grams === val && styles.pillBtnActive]}
              onPress={() => setGrams(val)}
            >
              <Text style={[styles.pillText, grams === val && styles.pillTextActive]}>
                {val}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Interval Selector */}
        <Text style={styles.fieldLabel}>INTERVAL BETWEEN FEEDS</Text>
        <View style={styles.quickGramsRow}>
          {intervalOptions.map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.pillBtn, intervalHours === val && styles.pillBtnActive]}
              onPress={() => setIntervalHours(val)}
            >
              <Text style={[styles.pillText, intervalHours === val && styles.pillTextActive]}>
                {val} hrs
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Feeds Selector */}
        <Text style={styles.fieldLabel}>NUMBER OF FEEDS</Text>
        <View style={styles.quickGramsRow}>
          {countOptions.map(val => (
            <TouchableOpacity
              key={val}
              style={[styles.pillBtn, totalFeeds === val && styles.pillBtnActive]}
              onPress={() => setTotalFeeds(val)}
            >
              <Text style={[styles.pillText, totalFeeds === val && styles.pillTextActive]}>
                {val}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start / Update Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleStartSprint}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Ionicons name="timer-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>
            {sprint.enabled ? 'UPDATE SPRINT SCHEDULE' : 'START SPRINT SCHEDULE'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Generated Timeline Forecast */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>ESTIMATED FEED TIMELINE</Text>
        {timeline.map((item, idx) => (
          <View key={item.num} style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineFeedName}>Feed #{item.num}</Text>
            <Text style={styles.timelineGrams}>{grams}g</Text>
            <Text style={styles.timelineTime}>{item.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  activeCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.purple,
    letterSpacing: 1,
  },
  activeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 6,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 4,
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.purple,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.purple,
    letterSpacing: 1.1,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  quickGramsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pillBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: Colors.purple,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.purple,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.purple,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.6,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 1,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLight,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
    marginRight: 10,
  },
  timelineFeedName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    width: 70,
  },
  timelineGrams: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    color: Colors.cyan,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
