import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const WeightGauge: React.FC = () => {
  const { status, isDispensing, dispenseStage, activeTargetGrams, tareScale } = useFeeder();

  // Progress relative to standard 300g bowl capacity
  const maxCapacity = 300;
  const percentage = Math.min(100, Math.max(0, (status.weight / maxCapacity) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <Text style={styles.cardTitle}>BOWL SCALE</Text>
          <Text style={styles.cardSubtitle}>Closed-loop HX711 feedback</Text>
        </View>

        <TouchableOpacity 
          style={styles.tareButton} 
          onPress={tareScale} 
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Ionicons name="scale-outline" size={15} color={Colors.cyan} style={{ marginRight: 4 }} />
          <Text style={styles.tareText}>TARE</Text>
        </TouchableOpacity>
      </View>

      {/* Main Gauge Center */}
      <View style={styles.gaugeContainer}>
        <View style={[styles.outerRing, isDispensing && styles.outerRingDispensing]}>
          <View style={styles.innerCircle}>
            {isDispensing ? (
              <View style={styles.dispensingOverlay}>
                <ActivityIndicator size="large" color={Colors.amber} style={{ marginBottom: 8 }} />
                <Text style={styles.dispenseStageText}>{dispenseStage}</Text>
                <Text style={styles.dispenseTargetText}>Target: {activeTargetGrams}g</Text>
              </View>
            ) : (
              <>
                <Text style={styles.weightValue}>{status.weight.toFixed(0)}</Text>
                <Text style={styles.weightUnit}>GRAMS</Text>
                <View style={styles.servoBadge}>
                  <View style={[
                    styles.servoDot, 
                    { backgroundColor: status.servo === 'closed' ? Colors.primary : Colors.amber }
                  ]} />
                  <Text style={styles.servoText}>
                    Gate {status.servo.toUpperCase()}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Capacity Bar */}
      <View style={styles.capacitySection}>
        <View style={styles.capacityLabels}>
          <Text style={styles.capacityText}>Bowl Capacity ({percentage.toFixed(0)}%)</Text>
          <Text style={styles.capacityText}>{status.weight.toFixed(0)} / {maxCapacity}g</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 1.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  tareText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  outerRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 6,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
  },
  outerRingDispensing: {
    borderColor: Colors.amber,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  innerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  weightValue: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  weightUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: -4,
  },
  servoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  servoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  servoText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  dispensingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dispenseStageText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.amber,
    textAlign: 'center',
  },
  dispenseTargetText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  capacitySection: {
    marginTop: 8,
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  capacityText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.cyan,
    borderRadius: 3,
  },
});
