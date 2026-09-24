import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const QuickFeedCard: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { dispenseFood, isDispensing } = useFeeder();
  const [modalVisible, setModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('35');

  // Interactive button scales
  const btn20Scale = useRef(new Animated.Value(1)).current;
  const btn40Scale = useRef(new Animated.Value(1)).current;
  const btn60Scale = useRef(new Animated.Value(1)).current;
  const btnCustomScale = useRef(new Animated.Value(1)).current;

  const animatePress = (scaleVal: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scaleVal, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleVal, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
    ]).start();
    callback();
  };

  const handleCustomInputChange = (text: string) => {
    // Strictly allow numbers only (no characters, no punctuation, no negative signs, no spaces)
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setCustomInput(digitsOnly);
  };

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
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            MANUAL OVERRIDE
          </Text>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Quick Portions
          </Text>
        </View>

        <View style={[styles.iconBadge, { backgroundColor: theme.primaryTint }]}>
          <Ionicons
            name="flash-outline"
            size={14}
            color={isDark ? theme.primaryInteractive : theme.primary}
          />
        </View>
      </View>

      {/* Grid of 4 portion buttons with tactile scale animations */}
      <View style={styles.buttonsGrid}>
        {/* 20g Snack */}
        <TouchableOpacity
          onPress={() => animatePress(btn20Scale, () => dispenseFood(20))}
          disabled={isDispensing}
          activeOpacity={0.8}
          style={styles.feedBtnWrapper}
        >
          <Animated.View
            style={[
              styles.feedBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
                transform: [{ scale: btn20Scale }],
              },
            ]}
          >
            <Text style={[styles.btnAmount, { color: theme.textPrimary }]}>20g</Text>
            <Text style={[styles.btnLabel, { color: theme.textMuted }]}>Snack</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* 40g Standard - highlighted */}
        <TouchableOpacity
          onPress={() => animatePress(btn40Scale, () => dispenseFood(40))}
          disabled={isDispensing}
          activeOpacity={0.8}
          style={styles.feedBtnWrapper}
        >
          <Animated.View
            style={[
              styles.feedBtn,
              styles.feedBtnRecommended,
              {
                backgroundColor: theme.primaryTint,
                borderColor: isDark ? theme.primaryInteractive : theme.primary,
                transform: [{ scale: btn40Scale }],
              },
            ]}
          >
            <View style={styles.recBadge}>
              <Text
                style={[
                  styles.recBadgeText,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                Meal
              </Text>
            </View>
            <Text
              style={[
                styles.btnAmount,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              40g
            </Text>
            <Text
              style={[
                styles.btnLabel,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              Standard
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* 60g Generous */}
        <TouchableOpacity
          onPress={() => animatePress(btn60Scale, () => dispenseFood(60))}
          disabled={isDispensing}
          activeOpacity={0.8}
          style={styles.feedBtnWrapper}
        >
          <Animated.View
            style={[
              styles.feedBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
                transform: [{ scale: btn60Scale }],
              },
            ]}
          >
            <Text style={[styles.btnAmount, { color: theme.textPrimary }]}>60g</Text>
            <Text style={[styles.btnLabel, { color: theme.textMuted }]}>Generous</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Custom */}
        <TouchableOpacity
          onPress={() => animatePress(btnCustomScale, () => setModalVisible(true))}
          disabled={isDispensing}
          activeOpacity={0.8}
          style={styles.feedBtnWrapper}
        >
          <Animated.View
            style={[
              styles.feedBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
                transform: [{ scale: btnCustomScale }],
              },
            ]}
          >
            <Ionicons
              name="options-outline"
              size={16}
              color={theme.textSecondary}
              style={{ marginBottom: 2 }}
            />
            <Text style={[styles.btnLabel, { color: theme.textSecondary, fontWeight: '600' }]}>
              Custom
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Refined Custom Grams Modal with BORDERLESS input */}
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
                  Specify exact target grams (5g – 300g)
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* BORDERLESS Unified Numeric Input Container */}
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: theme.surfaceLight,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.textPrimary,
                    borderWidth: 0,
                    outlineWidth: 0,
                    outlineStyle: 'none',
                  } as any,
                ]}
                value={customInput}
                onChangeText={handleCustomInputChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={3}
                placeholder="0"
                placeholderTextColor={theme.textDisabled}
                autoFocus
              />
              <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>gms</Text>
            </View>

            {/* Quick preset chips */}
            <View style={styles.chipRow}>
              {[15, 30, 50, 75, 100].map((val) => {
                const isSelected = customInput === String(val);
                return (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                        borderColor: isSelected
                          ? isDark
                            ? theme.primaryInteractive
                            : theme.primary
                          : 'transparent',
                      },
                    ]}
                    onPress={() => handleQuickPreset(val)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? isDark
                              ? theme.primaryInteractive
                              : theme.primary
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {val}g
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                  },
                ]}
                onPress={handleCustomSubmit}
              >
                <Text style={styles.confirmBtnText}>Dispense</Text>
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
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleGroup: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  feedBtnWrapper: {
    flex: 1,
  },
  feedBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  feedBtnRecommended: {
    borderWidth: 1.2,
  },
  recBadge: {
    position: 'absolute',
    top: 4,
  },
  recBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  btnAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 5,
  },
  btnLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
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
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 16,
  },
  input: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 8,
    borderWidth: 0,
    minWidth: 70,
  },
  inputSuffix: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
    paddingTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    paddingVertical: 7,
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
