import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const WeightGauge: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { status, isDispensing, dispenseStage, activeTargetGrams, tareScale } = useFeeder();

  const maxCapacity = 300;
  const percentage = Math.min(100, Math.max(0, (status.weight / maxCapacity) * 100));

  return (
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
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>
            Bowl Scale
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
            Real-time closed-loop telemetry
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.tareButton,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
          onPress={tareScale}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Ionicons name="scale-outline" size={14} color={theme.accentSage} style={{ marginRight: 4 }} />
          <Text style={[styles.tareText, { color: theme.accentSage }]}>Tare</Text>
        </TouchableOpacity>
      </View>

      {/* Main Circular Dial Instrument */}
      <View style={styles.gaugeContainer}>
        {/* Subtle Outer Instrument Ring */}
        <View
          style={[
            styles.outerDial,
            {
              borderColor: isDispensing ? theme.accentClay : theme.border,
              backgroundColor: isDispensing ? theme.accentClayTint : theme.primaryTint,
            },
          ]}
        >
          {/* Inner Display Surface */}
          <View
            style={[
              styles.innerDial,
              {
                backgroundColor: theme.surfaceLight,
                shadowColor: theme.cardShadow,
              },
            ]}
          >
            {isDispensing ? (
              <View style={styles.dispensingOverlay}>
                <ActivityIndicator size="small" color={theme.accentClay} style={{ marginBottom: 8 }} />
                <Text style={[styles.dispenseStageText, { color: theme.accentClay }]}>
                  {dispenseStage}
                </Text>
                <Text style={[styles.dispenseTargetText, { color: theme.textMuted }]}>
                  Target: {activeTargetGrams}g
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.weightValueRow}>
                  <Text style={[styles.weightValue, { color: theme.textPrimary }]}>
                    {status.weight.toFixed(0)}
                  </Text>
                  <Text style={[styles.weightUnit, { color: theme.textMuted }]}>g</Text>
                </View>

                {/* Gate Status Pill */}
                <View
                  style={[
                    styles.servoPill,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.borderLight,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.servoDot,
                      {
                        backgroundColor:
                          status.servo === 'closed' ? theme.success : theme.accentClay,
                      },
                    ]}
                  />
                  <Text style={[styles.servoText, { color: theme.textSecondary }]}>
                    {status.servo === 'closed' ? 'Gate Closed' : `Gate ${status.servo}`}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Minimalist Capacity Bar */}
      <View style={styles.capacitySection}>
        <View style={styles.capacityLabels}>
          <Text style={[styles.capacityText, { color: theme.textMuted }]}>
            Bowl Fill Level
          </Text>
          <Text style={[styles.capacityValueText, { color: theme.textSecondary }]}>
            {status.weight.toFixed(0)} / {maxCapacity}g ({percentage.toFixed(0)}%)
          </Text>
        </View>
        <View
          style={[
            styles.track,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${percentage}%`,
                backgroundColor: isDispensing ? theme.accentClay : theme.primaryInteractive,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  tareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tareText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  outerDial: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  innerDial: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  weightValue: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 3,
  },
  servoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  servoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  servoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dispensingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dispenseStageText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  dispenseTargetText: {
    fontSize: 11,
    marginTop: 4,
  },
  capacitySection: {
    marginTop: 4,
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  capacityValueText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  track: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
