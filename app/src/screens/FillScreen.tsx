import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const FillScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { status, isDispensing, dispenseStage, dispenseFood, lastResult } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  const [fillTarget, setFillTarget] = useState<number>(250);

  // Micro-animations for buttons
  const minusScale = useRef(new Animated.Value(1)).current;
  const plusScale = useRef(new Animated.Value(1)).current;
  const executeScale = useRef(new Animated.Value(1)).current;

  const animateBtn = (scaleVal: Animated.Value, action: () => void) => {
    Animated.sequence([
      Animated.timing(scaleVal, { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(scaleVal, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    action();
  };

  const handleStartFill = () => {
    animateBtn(executeScale, () => dispenseFood(fillTarget, 'fill'));
  };

  const adjustTarget = (delta: number) => {
    const next = fillTarget + delta;
    if (next >= 100 && next <= 350) {
      setFillTarget(next);
    }
  };

  const presets = [150, 200, 250, 300];

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
        {/* Refined Header Banner */}
        <View
          style={[
            styles.banner,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={[styles.bannerIcon, { backgroundColor: theme.primaryTint }]}>
            <Ionicons
              name="water"
              size={18}
              color={isDark ? theme.primaryInteractive : theme.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
              CLOSED-LOOP OPERATION
            </Text>
            <Text style={[styles.bannerTitle, { color: theme.textPrimary, fontSize: isSmallMobile ? 15 : 16 }]}>
              Bowl Fill
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
              Real-time weight cutoff prevents kinetic kibble overshoot.
            </Text>
          </View>
        </View>

        {/* Target Grams Adjuster Card */}
        <View
          style={[
            styles.targetCard,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            TARGET BOWL CAPACITY
          </Text>

          {/* Stepper Controls with tactile spring feedback */}
          <View style={[styles.adjusterRow, { gap: isSmallMobile ? 12 : 20 }]}>
            <TouchableOpacity
              onPress={() => animateBtn(minusScale, () => adjustTarget(-25))}
              disabled={isDispensing || fillTarget <= 100}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.surfaceLight,
                    borderColor: theme.borderLight,
                    width: isSmallMobile ? 38 : 42,
                    height: isSmallMobile ? 38 : 42,
                    borderRadius: isSmallMobile ? 19 : 21,
                    transform: [{ scale: minusScale }],
                  },
                ]}
              >
                <Ionicons name="remove" size={18} color={theme.textPrimary} />
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.targetDisplay}>
              <View style={styles.numberRow}>
                <Text
                  style={[
                    styles.targetNumber,
                    { color: theme.textPrimary, fontSize: isSmallMobile ? 38 : 46 },
                  ]}
                >
                  {fillTarget}
                </Text>
                <Text style={[styles.targetUnit, { color: theme.textMuted }]}>g</Text>
              </View>
              <Text style={[styles.targetGramsLabel, { color: theme.textMuted }]}>
                Gram Target
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => animateBtn(plusScale, () => adjustTarget(25))}
              disabled={isDispensing || fillTarget >= 350}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.adjustBtn,
                  {
                    backgroundColor: theme.surfaceLight,
                    borderColor: theme.borderLight,
                    width: isSmallMobile ? 38 : 42,
                    height: isSmallMobile ? 38 : 42,
                    borderRadius: isSmallMobile ? 19 : 21,
                    transform: [{ scale: plusScale }],
                  },
                ]}
              >
                <Ionicons name="add" size={18} color={theme.textPrimary} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Quick Target Presets */}
          <View style={[styles.presetsRow, { gap: isSmallMobile ? 6 : 8 }]}>
            {presets.map((val) => {
              const isSelected = fillTarget === val;
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
                      paddingVertical: isSmallMobile ? 5 : 7,
                    },
                  ]}
                  onPress={() => setFillTarget(val)}
                  disabled={isDispensing}
                  activeOpacity={0.7}
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
                        fontSize: isSmallMobile ? 11 : 12,
                      },
                    ]}
                  >
                    {val}g
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action / Dispensing State Card */}
        <View style={styles.actionCard}>
          {isDispensing ? (
            <View
              style={[
                styles.dispensingBox,
                cardResponsiveStyle,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <ActivityIndicator size="small" color={theme.accentClay} style={{ marginBottom: 10 }} />
              <Text style={[styles.dispenseStage, { color: theme.accentClay }]}>
                {dispenseStage}
              </Text>
              <Text style={[styles.currentBowlWeight, { color: theme.textSecondary }]}>
                Live: {status.weight.toFixed(1)}g / {fillTarget}g target
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleStartFill}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.fillButton,
                    {
                      backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                      transform: [{ scale: executeScale }],
                      paddingVertical: isSmallMobile ? 12 : 15,
                    },
                  ]}
                >
                  <Ionicons name="water" size={15} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.fillButtonText}>Execute {fillTarget}g Fill</Text>
                </Animated.View>
              </TouchableOpacity>

              {lastResult && lastResult.status === 'success' && (
                <View
                  style={[
                    styles.resultBox,
                    {
                      backgroundColor: theme.successTint,
                      borderColor: theme.borderLight,
                      padding: isSmallMobile ? 7 : 9,
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={theme.success}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.resultText, { color: theme.success, fontSize: isSmallMobile ? 10 : 11 }]}>
                    Last fill: {lastResult.actualGrams}g delivered ({lastResult.targetGrams}g target)
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Algorithmic Flow Steps */}
        <View
          style={[
            styles.stepsCard,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            PROCESS AUTOMATION
          </Text>
          <Text style={[styles.stepsTitle, { color: theme.textPrimary }]}>
            Staged Dispensing Sequence
          </Text>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
              <Text
                style={[
                  styles.stepNum,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                01
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>
                Zero Baseline Tare
              </Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                The HX711 strain gauge zeros out existing bowl tare and food particles.
              </Text>
            </View>
          </View>

          <View style={[styles.stepDivider, { borderLeftColor: theme.borderLight }]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
              <Text
                style={[
                  styles.stepNum,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                02
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>
                Bulk Pour & Gate Throttling
              </Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                MG996R gate opens to 95°, then throttles to partial flow at 85% capacity.
              </Text>
            </View>
          </View>

          <View style={[styles.stepDivider, { borderLeftColor: theme.borderLight }]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
              <Text
                style={[
                  styles.stepNum,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                03
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>
                Snap Shut & Settle
              </Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Gate snaps shut at exact cutoff, pauses 300ms to record settled weight.
              </Text>
            </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bannerTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  targetCard: {
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  adjustBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  targetDisplay: {
    alignItems: 'center',
    minWidth: 110,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  targetNumber: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  targetUnit: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 3,
  },
  targetGramsLabel: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '500',
  },
  presetsRow: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
  },
  presetChip: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  presetChipText: {
    fontWeight: '600',
  },
  actionCard: {
    marginBottom: 12,
    width: '100%',
  },
  fillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  fillButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  dispensingBox: {
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  dispenseStage: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  currentBowlWeight: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
  },
  resultText: {
    fontWeight: '600',
  },
  stepsCard: {
    borderWidth: 1,
    width: '100%',
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  stepDivider: {
    height: 10,
    marginLeft: 12,
    borderLeftWidth: 1,
    marginVertical: 3,
  },
});
