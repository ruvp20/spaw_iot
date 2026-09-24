import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const QuickFeedCard: React.FC = () => {
  const { theme } = useTheme();
  const { dispenseFood, isDispensing } = useFeeder();
  const [modalVisible, setModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('35');

  const handleCustomSubmit = () => {
    const parsed = parseInt(customInput, 10);
    if (!isNaN(parsed) && parsed >= 5 && parsed <= 300) {
      setModalVisible(false);
      dispenseFood(parsed);
    }
  };

  const handleQuickPreset = (val: number) => {
    setCustomInput(String(val));
  };

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
      {/* Title Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>
            Quick Feed
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Single-tap calibrated portions
          </Text>
        </View>

        <View style={[styles.iconBadge, { backgroundColor: theme.accentClayTint }]}>
          <Ionicons name="nutrition-outline" size={15} color={theme.accentClay} />
        </View>
      </View>

      {/* Grid of 4 portion buttons */}
      <View style={styles.buttonsGrid}>
        {/* 20g Snack */}
        <TouchableOpacity
          style={[
            styles.feedBtn,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
          onPress={() => dispenseFood(20)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnAmount, { color: theme.textPrimary }]}>20g</Text>
          <Text style={[styles.btnLabel, { color: theme.textMuted }]}>Snack</Text>
        </TouchableOpacity>

        {/* 40g Regular - subtly highlighted as recommended */}
        <TouchableOpacity
          style={[
            styles.feedBtn,
            styles.feedBtnRecommended,
            {
              backgroundColor: theme.primaryTint,
              borderColor: theme.primaryInteractive,
            },
          ]}
          onPress={() => dispenseFood(40)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <View style={styles.recBadge}>
            <Text style={[styles.recBadgeText, { color: theme.primaryInteractive }]}>Meal</Text>
          </View>
          <Text style={[styles.btnAmount, { color: theme.primaryInteractive }]}>40g</Text>
          <Text style={[styles.btnLabel, { color: theme.primaryInteractive }]}>Standard</Text>
        </TouchableOpacity>

        {/* 60g Generous */}
        <TouchableOpacity
          style={[
            styles.feedBtn,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
          onPress={() => dispenseFood(60)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnAmount, { color: theme.textPrimary }]}>60g</Text>
          <Text style={[styles.btnLabel, { color: theme.textMuted }]}>Generous</Text>
        </TouchableOpacity>

        {/* Custom */}
        <TouchableOpacity
          style={[
            styles.feedBtn,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
          onPress={() => setModalVisible(true)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={17} color={theme.accentSage} style={{ marginBottom: 2 }} />
          <Text style={[styles.btnLabel, { color: theme.accentSage, fontWeight: '600' }]}>Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Refined Custom Grams Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.surfaceElevated,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Custom Portion
                </Text>
                <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                  Target grams between 5g and 300g
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Numeric Input Row */}
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={customInput}
                onChangeText={setCustomInput}
                keyboardType="numeric"
                maxLength={3}
                placeholder="0"
                placeholderTextColor={theme.textDisabled}
                autoFocus
              />
              <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>grams</Text>
            </View>

            {/* Quick preset chips */}
            <View style={styles.chipRow}>
              {[15, 30, 50, 75, 100].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: customInput === String(val) ? theme.primaryTint : theme.surfaceLight,
                      borderColor: customInput === String(val) ? theme.primaryInteractive : theme.borderLight,
                    },
                  ]}
                  onPress={() => handleQuickPreset(val)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: customInput === String(val) ? theme.primaryInteractive : theme.textSecondary,
                      },
                    ]}
                  >
                    {val}g
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: theme.surfaceLight }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: theme.primaryInteractive }]}
                onPress={handleCustomSubmit}
              >
                <Text style={styles.confirmBtnText}>Dispense Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  feedBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  feedBtnRecommended: {
    borderWidth: 1.5,
  },
  recBadge: {
    position: 'absolute',
    top: 4,
  },
  recBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  btnAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 4,
  },
  btnLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 26,
    fontWeight: '800',
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  confirmBtn: {
    flex: 1.3,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  confirmBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
