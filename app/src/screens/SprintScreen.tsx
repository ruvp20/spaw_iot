import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const SprintScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { sprint, saveSprint, cancelSprint } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  // Controlled input strings for direct typing
  const [gramsInput, setGramsInput] = useState<string>(String(sprint.grams || 50));
  const [intervalInput, setIntervalInput] = useState<string>(String(sprint.intervalHours || 4));
  const [feedsInput, setFeedsInput] = useState<string>(String(sprint.totalFeeds || 4));
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Numbers-only sanitizers (strictly no characters, no punctuation, no special characters)
  const handleGramsChange = (text: string) => {
    setGramsInput(text.replace(/[^0-9]/g, ''));
  };

  const handleIntervalChange = (text: string) => {
    setIntervalInput(text.replace(/[^0-9]/g, ''));
  };

  const handleFeedsChange = (text: string) => {
    setFeedsInput(text.replace(/[^0-9]/g, ''));
  };

  const saveScale = useRef(new Animated.Value(1)).current;
  const cancelScale = useRef(new Animated.Value(1)).current;

  const handleStartSprint = async () => {
    const g = parseInt(gramsInput, 10);
    const i = parseInt(intervalInput, 10);
    const f = parseInt(feedsInput, 10);

    if (isNaN(g) || g < 5 || g > 300) {
      Alert.alert('Invalid Portion', 'Portion size must be between 5g and 300g.');
      return;
    }
    if (isNaN(i) || i < 1 || i > 48) {
      Alert.alert('Invalid Interval', 'Interval must be between 1 and 48 hours.');
      return;
    }
    if (isNaN(f) || f < 1 || f > 24) {
      Alert.alert('Invalid Cycles', 'Number of feeds must be between 1 and 24.');
      return;
    }

    Animated.sequence([
      Animated.timing(saveScale, { toValue: 0.94, duration: 70, useNativeDriver: true }),
      Animated.spring(saveScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    setIsSaving(true);
    try {
      await saveSprint(g, i, f);
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

  const parsedGrams = parseInt(gramsInput, 10) || 50;
  const parsedInterval = parseInt(intervalInput, 10) || 4;
  const parsedFeeds = parseInt(feedsInput, 10) || 4;

  const getTimelinePreviews = () => {
    const now = Date.now();
    const list = [];
    const count = Math.min(parsedFeeds, 12);
    for (let i = 1; i <= count; i++) {
      const feedTime = new Date(now + i * parsedInterval * 3600 * 1000);
      const timeStr = feedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      list.push({ num: i, time: timeStr });
    }
    return list;
  };

  const timeline = getTimelinePreviews();

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
        {/* Active Sprint Banner */}
        {sprint.enabled ? (
          <View
            style={[
              styles.activeCard,
              cardResponsiveStyle,
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
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
                  RECURRING CYCLE ACTIVE
                </Text>
                <Text style={[styles.activeTitle, { color: theme.textPrimary, fontSize: isSmallMobile ? 14 : 15 }]}>
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
                    paddingVertical: isSmallMobile ? 8 : 10,
                  },
                ]}
              >
                <Ionicons name="close-circle-outline" size={15} color={theme.danger} style={{ marginRight: 6 }} />
                <Text style={[styles.cancelText, { color: theme.danger, fontSize: isSmallMobile ? 11 : 12 }]}>
                  Cancel Recurring Schedule
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Configuration Card with Direct Numerical Inputs */}
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
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            AUTONOMOUS DISPENSER
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Schedule Configuration
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Set exact values for your recurring feeding cycle. The ESP32 executes on RTC time independently.
          </Text>

          {/* 1. Portion Size Input */}
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
            PORTION SIZE PER FEED
          </Text>
          <View style={[styles.inputRow, { backgroundColor: theme.surfaceLight }]}>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: theme.textPrimary,
                  fontSize: isSmallMobile ? 18 : 20,
                  borderWidth: 0,
                  outlineWidth: 0,
                  outlineStyle: 'none',
                } as any,
              ]}
              value={gramsInput}
              onChangeText={handleGramsChange}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={3}
              placeholder="50"
              placeholderTextColor={theme.textDisabled}
            />
            <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>gms</Text>
          </View>
          {/* Quick presets for Portion */}
          <View style={[styles.presetsRow, { gap: isSmallMobile ? 4 : 6 }]}>
            {[25, 40, 50, 65, 80].map((val) => {
              const isSelected = gramsInput === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                      borderColor: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : 'transparent',
                      paddingVertical: isSmallMobile ? 5 : 6,
                    },
                  ]}
                  onPress={() => setGramsInput(String(val))}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      {
                        color: isSelected
                          ? isDark
                            ? theme.primaryInteractive
                            : theme.primary
                          : theme.textSecondary,
                        fontSize: isSmallMobile ? 10 : 11,
                      },
                    ]}
                  >
                    {val}g
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. Interval Between Feeds Input */}
          <Text style={[styles.fieldLabel, { color: theme.textMuted, marginTop: 14 }]}>
            INTERVAL BETWEEN FEEDS
          </Text>
          <View style={[styles.inputRow, { backgroundColor: theme.surfaceLight }]}>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: theme.textPrimary,
                  fontSize: isSmallMobile ? 18 : 20,
                  borderWidth: 0,
                  outlineWidth: 0,
                  outlineStyle: 'none',
                } as any,
              ]}
              value={intervalInput}
              onChangeText={handleIntervalChange}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={2}
              placeholder="4"
              placeholderTextColor={theme.textDisabled}
            />
            <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>hrs</Text>
          </View>
          {/* Quick presets for Interval */}
          <View style={[styles.presetsRow, { gap: isSmallMobile ? 4 : 6 }]}>
            {[2, 4, 6, 8, 12].map((val) => {
              const isSelected = intervalInput === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                      borderColor: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : 'transparent',
                      paddingVertical: isSmallMobile ? 5 : 6,
                    },
                  ]}
                  onPress={() => setIntervalInput(String(val))}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      {
                        color: isSelected
                          ? isDark
                            ? theme.primaryInteractive
                            : theme.primary
                          : theme.textSecondary,
                        fontSize: isSmallMobile ? 10 : 11,
                      },
                    ]}
                  >
                    {val}h
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 3. Number of Cycles Input */}
          <Text style={[styles.fieldLabel, { color: theme.textMuted, marginTop: 14 }]}>
            NUMBER OF RECURRING FEEDS
          </Text>
          <View style={[styles.inputRow, { backgroundColor: theme.surfaceLight }]}>
            <TextInput
              style={[
                styles.inputField,
                {
                  color: theme.textPrimary,
                  fontSize: isSmallMobile ? 18 : 20,
                  borderWidth: 0,
                  outlineWidth: 0,
                  outlineStyle: 'none',
                } as any,
              ]}
              value={feedsInput}
              onChangeText={handleFeedsChange}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={2}
              placeholder="4"
              placeholderTextColor={theme.textDisabled}
            />
            <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>cycles</Text>
          </View>
          {/* Quick presets for Cycles */}
          <View style={[styles.presetsRow, { gap: isSmallMobile ? 4 : 6 }]}>
            {[2, 3, 4, 5, 6].map((val) => {
              const isSelected = feedsInput === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetChip,
                    {
                      backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                      borderColor: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : 'transparent',
                      paddingVertical: isSmallMobile ? 5 : 6,
                    },
                  ]}
                  onPress={() => setFeedsInput(String(val))}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      {
                        color: isSelected
                          ? isDark
                            ? theme.primaryInteractive
                            : theme.primary
                          : theme.textSecondary,
                        fontSize: isSmallMobile ? 10 : 11,
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
                  paddingVertical: isSmallMobile ? 12 : 14,
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
            cardResponsiveStyle,
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
              <Text
                style={[
                  styles.timelineFeedName,
                  { color: theme.textPrimary, width: isSmallMobile ? 65 : 75, fontSize: isSmallMobile ? 11 : 12 },
                ]}
              >
                Feed #{item.num}
              </Text>
              <Text style={[styles.timelineGrams, { color: theme.textMuted, fontSize: isSmallMobile ? 11 : 12 }]}>
                {parsedGrams} gms
              </Text>
              <Text
                style={[
                  styles.timelineTime,
                  {
                    color: isDark ? theme.primaryInteractive : theme.primary,
                    fontSize: isSmallMobile ? 11 : 12,
                  },
                ]}
              >
                {item.time}
              </Text>
            </View>
          ))}
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
  activeCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
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
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
    minHeight: 44,
  },
  inputField: {
    flex: 1,
    fontWeight: '700',
    paddingVertical: 8,
    borderWidth: 0,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    marginBottom: 4,
    width: '100%',
  },
  presetChip: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  presetChipText: {
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 16,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  timelineCard: {
    borderWidth: 1,
    width: '100%',
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
    fontWeight: '600',
  },
  timelineGrams: {
    flex: 1,
  },
  timelineTime: {
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});
