import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const FillScreen: React.FC = () => {
  const { theme } = useTheme();
  const { status, isDispensing, dispenseStage, dispenseFood, lastResult } = useFeeder();
  const [fillTarget, setFillTarget] = useState<number>(250);

  const handleStartFill = () => {
    dispenseFood(fillTarget, 'fill');
  };

  const adjustTarget = (delta: number) => {
    const next = fillTarget + delta;
    if (next >= 100 && next <= 350) {
      setFillTarget(next);
    }
  };

  const presets = [150, 200, 250, 300];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Refined Header Banner */}
      <View
        style={[
          styles.banner,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <View style={[styles.bannerIcon, { backgroundColor: theme.primaryTint }]}>
          <Ionicons name="water" size={20} color={theme.primaryInteractive} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>
            Bowl Fill
          </Text>
          <Text style={[styles.bannerSubtitle, { color: theme.textMuted }]}>
            Closed-loop bulk pour with dynamic gate throttling.
          </Text>
        </View>
      </View>

      {/* Target Grams Adjuster Card */}
      <View
        style={[
          styles.targetCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <Text style={[styles.cardHeader, { color: theme.textSecondary }]}>
          Target Weight
        </Text>

        {/* Stepper Controls */}
        <View style={styles.adjusterRow}>
          <TouchableOpacity
            style={[
              styles.adjustBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => adjustTarget(-25)}
            disabled={isDispensing || fillTarget <= 100}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.targetDisplay}>
            <View style={styles.numberRow}>
              <Text style={[styles.targetNumber, { color: theme.textPrimary }]}>
                {fillTarget}
              </Text>
              <Text style={[styles.targetUnit, { color: theme.textMuted }]}>g</Text>
            </View>
            <Text style={[styles.targetGramsLabel, { color: theme.textMuted }]}>
              Target capacity
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.adjustBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => adjustTarget(25)}
            disabled={isDispensing || fillTarget >= 350}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Quick Target Presets */}
        <View style={styles.presetsRow}>
          {presets.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.presetChip,
                {
                  backgroundColor: fillTarget === val ? theme.primaryTint : theme.surfaceLight,
                  borderColor: fillTarget === val ? theme.primaryInteractive : theme.borderLight,
                },
              ]}
              onPress={() => setFillTarget(val)}
              disabled={isDispensing}
            >
              <Text
                style={[
                  styles.presetChipText,
                  {
                    color: fillTarget === val ? theme.primaryInteractive : theme.textSecondary,
                  },
                ]}
              >
                {val}g
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action / Dispensing State Card */}
      <View style={styles.actionCard}>
        {isDispensing ? (
          <View
            style={[
              styles.dispensingBox,
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
              Scale: {status.weight.toFixed(1)}g / {fillTarget}g target
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.fillButton, { backgroundColor: theme.primaryInteractive }]}
              onPress={handleStartFill}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.fillButtonText}>Start {fillTarget}g Fill</Text>
            </TouchableOpacity>

            {lastResult && lastResult.status === 'success' && (
              <View
                style={[
                  styles.resultBox,
                  {
                    backgroundColor: theme.successTint,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.success}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.resultText, { color: theme.success }]}>
                  Last fill: {lastResult.actualGrams}g delivered (Target: {lastResult.targetGrams}g)
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
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.stepsTitle, { color: theme.textSecondary }]}>
          Closed-Loop Sequence
        </Text>

        <View style={styles.stepItem}>
          <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
            <Text style={[styles.stepNum, { color: theme.accentSage }]}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>Zero Load Cell</Text>
            <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
              HX711 tares out bowl tare and residual food particles.
            </Text>
          </View>
        </View>

        <View style={[styles.stepDivider, { borderLeftColor: theme.borderLight }]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
            <Text style={[styles.stepNum, { color: theme.accentSage }]}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>
              Bulk Pour & Gate Throttling
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
              MG996R gate opens to 95°, then throttles to partial flow near cutoff.
            </Text>
          </View>
        </View>

        <View style={[styles.stepDivider, { borderLeftColor: theme.borderLight }]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepNumberBadge, { backgroundColor: theme.surfaceLight }]}>
            <Text style={[styles.stepNum, { color: theme.accentSage }]}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={[styles.stepHeading, { color: theme.textPrimary }]}>
              Snap Shut & Settle
            </Text>
            <Text style={[styles.stepDesc, { color: theme.textMuted }]}>
              Gate snaps closed at exact target, pauses 300ms to record settled weight.
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  targetCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  targetDisplay: {
    alignItems: 'center',
    minWidth: 120,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  targetNumber: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  targetUnit: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 3,
  },
  targetGramsLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    width: '100%',
  },
  presetChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionCard: {
    marginBottom: 14,
  },
  fillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  fillButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  dispensingBox: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  dispenseStage: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  currentBowlWeight: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepsCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
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
    height: 12,
    marginLeft: 10,
    borderLeftWidth: 1,
    marginVertical: 4,
  },
});
