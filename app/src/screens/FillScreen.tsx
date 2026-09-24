import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const FillScreen: React.FC = () => {
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Title Card */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="restaurant" size={24} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Automatic Bowl Fill</Text>
          <Text style={styles.bannerSubtitle}>
            Continuous feedback fills the bowl to the exact measured target.
          </Text>
        </View>
      </View>

      {/* Target Adjuster */}
      <View style={styles.targetCard}>
        <Text style={styles.cardHeader}>TARGET BOWL PORTION</Text>

        <View style={styles.adjusterRow}>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustTarget(-25)}
            disabled={isDispensing || fillTarget <= 100}
          >
            <Ionicons name="remove" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.targetDisplay}>
            <Text style={styles.targetNumber}>{fillTarget}</Text>
            <Text style={styles.targetGramsLabel}>GRAMS</Text>
          </View>

          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustTarget(25)}
            disabled={isDispensing || fillTarget >= 350}
          >
            <Ionicons name="add" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.recommendationText}>
          Standard dog/cat bowl full capacity is 250 grams.
        </Text>
      </View>

      {/* Live Dispense Progress / Action Card */}
      <View style={styles.actionCard}>
        {isDispensing ? (
          <View style={styles.dispensingBox}>
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 12 }} />
            <Text style={styles.dispenseStage}>{dispenseStage}</Text>
            <Text style={styles.currentBowlWeight}>
              Current Weight: {status.weight.toFixed(1)}g / {fillTarget}g
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.fillButton}
              onPress={handleStartFill}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={26} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.fillButtonText}>EXECUTE {fillTarget}g FILL</Text>
            </TouchableOpacity>

            {lastResult && lastResult.status === 'success' && (
              <View style={styles.resultBox}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.resultText}>
                  Last fill: {lastResult.actualGrams}g delivered (Target: {lastResult.targetGrams}g)
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Algorithmic Flow Steps */}
      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>HOW CLOSED-LOOP FILL WORKS</Text>

        <View style={styles.stepItem}>
          <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>1</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Tare Baseline</Text>
            <Text style={styles.stepDesc}>Load cell zeroes out existing bowl or food residue.</Text>
          </View>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.stepItem}>
          <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Bulk Pour & Gate Throttling</Text>
            <Text style={styles.stepDesc}>MG996R servo opens fully to 95°, then narrows flow at 230g.</Text>
          </View>
        </View>

        <View style={styles.stepDivider} />

        <View style={styles.stepItem}>
          <View style={styles.stepNumberBadge}><Text style={styles.stepNum}>3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepHeading}>Snap & Settle</Text>
            <Text style={styles.stepDesc}>Flap snaps shut at target, pauses 300ms, and logs settled weight.</Text>
          </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  targetCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  adjustBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  targetDisplay: {
    alignItems: 'center',
    minWidth: 120,
  },
  targetNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  targetGramsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  recommendationText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 14,
  },
  actionCard: {
    marginBottom: 16,
  },
  fillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  fillButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  dispensingBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dispenseStage: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  currentBowlWeight: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  stepsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1.1,
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
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.cyan,
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  stepDivider: {
    height: 12,
    marginLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderLight,
    marginVertical: 4,
  },
});
