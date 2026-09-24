import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';
import { HistoryRecord } from '../types';

export const HistoryScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { history, refreshStatus } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'scheduled':
        return {
          label: 'SCHEDULED',
          bg: theme.accentOchreTint,
          color: theme.accentOchre,
          icon: 'calendar-outline',
        };
      case 'fill':
        return {
          label: 'BOWL FILL',
          bg: theme.primaryTint,
          color: isDark ? theme.primaryInteractive : theme.primary,
          icon: 'water-outline',
        };
      case 'manual':
      default:
        return {
          label: 'MANUAL',
          bg: theme.accentSageTint,
          color: theme.accentSage,
          icon: 'hand-left-outline',
        };
    }
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => {
    const typeInfo = getTypeBadge(item.type);
    const isSuccess = item.status === 'success';
    const variance = (item.actualGrams - item.targetGrams).toFixed(1);
    const varianceSign = Number(variance) > 0 ? `+${variance}` : variance;

    return (
      <View
        style={[
          styles.historyCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.cardShadow,
            padding: isSmallMobile ? 12 : 14,
            borderRadius: isSmallMobile ? 14 : 16,
          },
        ]}
      >
        <View style={styles.cardTopRow}>
          <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
            <Ionicons
              name={typeInfo.icon as any}
              size={11}
              color={typeInfo.color}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.typeText, { color: typeInfo.color }]}>
              {typeInfo.label}
            </Text>
          </View>
          <Text style={[styles.timestampText, { color: theme.textMuted }]}>
            {item.timestamp}
          </Text>
        </View>

        <View style={styles.weightComparisonRow}>
          <View style={styles.weightBlock}>
            <Text style={[styles.weightLabel, { color: theme.textMuted }]}>TARGET</Text>
            <Text
              style={[
                styles.weightGrams,
                { color: theme.textPrimary, fontSize: isSmallMobile ? 13 : 15 },
              ]}
            >
              {item.targetGrams}g
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={12}
            color={theme.border}
            style={{ marginHorizontal: isSmallMobile ? 4 : 8 }}
          />

          <View style={[styles.weightBlock, { flex: isSmallMobile ? 1.4 : 1 }]}>
            <Text style={[styles.weightLabel, { color: theme.textMuted }]}>DELIVERED</Text>
            <View style={styles.deliveredRow}>
              <Text
                style={[
                  styles.weightGrams,
                  {
                    color: isSuccess ? theme.textPrimary : theme.danger,
                    fontSize: isSmallMobile ? 13 : 15,
                  },
                ]}
              >
                {item.actualGrams}g
              </Text>
              {isSuccess && (
                <Text
                  style={[
                    styles.varianceText,
                    { color: theme.textMuted, fontSize: isSmallMobile ? 9 : 10 },
                  ]}
                >
                  ({varianceSign}g)
                </Text>
              )}
            </View>
          </View>

          <View style={styles.statusIndicator}>
            {isSuccess ? (
              <View
                style={[
                  styles.statusCapsule,
                  {
                    backgroundColor: theme.successTint,
                    paddingHorizontal: isSmallMobile ? 5 : 7,
                  },
                ]}
              >
                <Ionicons name="checkmark" size={11} color={theme.success} style={{ marginRight: 2 }} />
                <Text style={[styles.statusTextSuccess, { color: theme.success }]}>
                  OK
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.statusCapsule,
                  {
                    backgroundColor: theme.dangerTint,
                    paddingHorizontal: isSmallMobile ? 5 : 7,
                  },
                ]}
              >
                <Ionicons name="alert" size={11} color={theme.danger} style={{ marginRight: 2 }} />
                <Text style={[styles.statusTextFail, { color: theme.danger }]}>
                  {item.status}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.headerWrapper,
          {
            maxWidth: isTabletOrDesktop ? 680 : 640,
            paddingHorizontal: isSmallMobile ? 12 : isNarrow ? 16 : isTabletOrDesktop ? 24 : 18,
          },
        ]}
      >
        <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            AUDIT TELEMETRY
          </Text>
          <Text style={[styles.headerTitle, { color: theme.textPrimary, fontSize: isSmallMobile ? 15 : 16 }]}>
            Feeding History
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {history.length} events logged by HX711 strain gauge
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.refreshBtn,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
          onPress={refreshStatus}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={15} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.surfaceLight }]}>
            <Ionicons name="time-outline" size={24} color={theme.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            No Feeding History Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            Dispense meals manually or set up a recurring schedule to begin logging.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: isSmallMobile ? 12 : isNarrow ? 16 : isTabletOrDesktop ? 24 : 18,
            paddingBottom: 36,
            width: '100%',
            maxWidth: isTabletOrDesktop ? 680 : 640,
            alignSelf: 'center',
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    width: '100%',
    alignSelf: 'center',
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  historyCard: {
    marginBottom: 9,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    width: '100%',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  timestampText: {
    fontSize: 10,
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
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  weightGrams: {
    fontWeight: '700',
  },
  deliveredRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  varianceText: {
    fontFamily: 'monospace',
  },
  statusIndicator: {
    alignItems: 'flex-end',
  },
  statusCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusTextSuccess: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusTextFail: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 15,
  },
});
