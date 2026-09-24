import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';
import { HistoryRecord } from '../types';

export const HistoryScreen: React.FC = () => {
  const { history, refreshStatus } = useFeeder();

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'scheduled':
        return { label: 'SCHEDULED', bg: 'rgba(139, 92, 246, 0.15)', color: Colors.purple, icon: 'calendar-outline' };
      case 'fill':
        return { label: 'FILL 250g', bg: 'rgba(16, 185, 129, 0.15)', color: Colors.primary, icon: 'restaurant-outline' };
      case 'manual':
      default:
        return { label: 'MANUAL', bg: 'rgba(6, 182, 212, 0.15)', color: Colors.cyan, icon: 'hand-left-outline' };
    }
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => {
    const typeInfo = getTypeBadge(item.type);
    const isSuccess = item.status === 'success';

    return (
      <View style={styles.historyCard}>
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
            <Ionicons name={typeInfo.icon as any} size={12} color={typeInfo.color} style={{ marginRight: 4 }} />
            <Text style={[styles.typeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
          </View>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </View>

        <View style={styles.weightComparisonRow}>
          <View style={styles.weightBlock}>
            <Text style={styles.weightLabel}>Target</Text>
            <Text style={styles.weightGrams}>{item.targetGrams}g</Text>
          </View>

          <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} style={{ marginHorizontal: 8 }} />

          <View style={styles.weightBlock}>
            <Text style={styles.weightLabel}>Actual Delivered</Text>
            <Text style={[styles.weightGrams, { color: isSuccess ? Colors.primary : Colors.danger }]}>
              {item.actualGrams}g
            </Text>
          </View>

          <View style={styles.statusIndicator}>
            {isSuccess ? (
              <View style={styles.successBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={styles.statusTextSuccess}>SUCCESS</Text>
              </View>
            ) : (
              <View style={styles.failBadge}>
                <Ionicons name="alert-circle" size={20} color={Colors.danger} />
                <Text style={styles.statusTextFail}>{item.status.toUpperCase()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>24-HOUR FEEDING LOG</Text>
          <Text style={styles.headerSubtitle}>
            {history.length} events recorded via load cell telemetry
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={refreshStatus}>
          <Ionicons name="refresh-outline" size={18} color={Colors.cyan} />
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color={Colors.borderLight} />
          <Text style={styles.emptyTitle}>No Feeding History Yet</Text>
          <Text style={styles.emptySubtitle}>
            Dispense meals manually or start a Sprint schedule to begin recording.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 1.1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestampText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  weightComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightBlock: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  weightGrams: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statusIndicator: {
    alignItems: 'flex-end',
  },
  successBadge: {
    alignItems: 'center',
  },
  statusTextSuccess: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  failBadge: {
    alignItems: 'center',
  },
  statusTextFail: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.danger,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
