import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const WeightGauge: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { status, isDispensing, dispenseStage, activeTargetGrams, tareScale } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  const maxCapacity = 300;
  const percentage = Math.min(100, Math.max(0, (status.weight / maxCapacity) * 100));

  // Animations
  const dialEntrance = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tareScaleAnim = useRef(new Animated.Value(1)).current;

  // Mount entrance
  useEffect(() => {
    Animated.spring(dialEntrance, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  // Dial pulsing: dynamic speed based on whether it is dispensing or idle
  useEffect(() => {
    let anim: Animated.CompositeAnimation;
    if (isDispensing) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.98,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.01,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.995,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    }
    anim.start();
    return () => anim.stop();
  }, [isDispensing]);

  const handleTarePress = () => {
    Animated.sequence([
      Animated.timing(tareScaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(tareScaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    tareScale();
  };

  const dialOuterSize = isSmallMobile ? 172 : 196;
  const dialInnerSize = isSmallMobile ? 152 : 174;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
          padding: isSmallMobile ? 14 : isNarrow ? 16 : isTabletOrDesktop ? 22 : 18,
          borderRadius: isSmallMobile ? 16 : 20,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            TELEMETRY • HX711
          </Text>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Bowl Weight
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleTarePress}
          disabled={isDispensing}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.tareButton,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
                transform: [{ scale: tareScaleAnim }],
              },
            ]}
          >
            <Ionicons name="scale-outline" size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[styles.tareText, { color: theme.textSecondary }]}>Tare</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Main Circular Dial Instrument with Entrance & Breathing Pulse */}
      <View style={styles.gaugeContainer}>
        <Animated.View
          style={[
            styles.outerDial,
            {
              width: dialOuterSize,
              height: dialOuterSize,
              borderRadius: dialOuterSize / 2,
              borderColor: isDispensing ? theme.accentClay : theme.border,
              backgroundColor: isDispensing ? theme.accentClayTint : theme.surfaceLight,
              transform: [{ scale: Animated.multiply(dialEntrance, pulseAnim) }],
            },
          ]}
        >
          {/* Inner Display Surface */}
          <View
            style={[
              styles.innerDial,
              {
                width: dialInnerSize,
                height: dialInnerSize,
                borderRadius: dialInnerSize / 2,
                backgroundColor: theme.surface,
                borderColor: theme.borderLight,
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
                  <Text
                    style={[
                      styles.weightValue,
                      { color: theme.textPrimary, fontSize: isSmallMobile ? 40 : 50 },
                    ]}
                  >
                    {status.weight.toFixed(0)}
                  </Text>
                  <Text style={[styles.weightUnit, { color: theme.textMuted }]}>g</Text>
                </View>

                {/* Gate Status Pill */}
                <View
                  style={[
                    styles.servoPill,
                    {
                      backgroundColor: theme.surfaceLight,
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
        </Animated.View>
      </View>

      {/* Capacity Progress Bar */}
      <View style={styles.capacitySection}>
        <View style={styles.capacityLabels}>
          <Text style={[styles.capacityText, { color: theme.textMuted }]}>
            Capacity
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
                backgroundColor: isDispensing
                  ? theme.accentClay
                  : isDark
                  ? theme.primaryInteractive
                  : theme.primary,
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
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  tareText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  outerDial: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  innerDial: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  weightValue: {
    fontWeight: '800',
    letterSpacing: -2,
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
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    gap: 5,
  },
  servoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  servoText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
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
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
