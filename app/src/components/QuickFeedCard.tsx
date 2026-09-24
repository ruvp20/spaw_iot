import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const QuickFeedCard: React.FC = () => {
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

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="fast-food-outline" size={16} color={Colors.amber} />
        </View>
        <Text style={styles.title}>QUICK DISPENSE</Text>
      </View>

      <View style={styles.buttonsGrid}>
        <TouchableOpacity
          style={styles.feedBtn}
          onPress={() => dispenseFood(20)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Text style={styles.btnAmount}>20g</Text>
          <Text style={styles.btnLabel}>Snack</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.feedBtn, styles.feedBtnPrimary]}
          onPress={() => dispenseFood(40)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnAmount, styles.btnAmountPrimary]}>40g</Text>
          <Text style={[styles.btnLabel, styles.btnLabelPrimary]}>Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.feedBtn}
          onPress={() => dispenseFood(60)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Text style={styles.btnAmount}>60g</Text>
          <Text style={styles.btnLabel}>Large</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.feedBtn, styles.feedBtnCustom]}
          onPress={() => setModalVisible(true)}
          disabled={isDispensing}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={18} color={Colors.cyan} style={{ marginBottom: 2 }} />
          <Text style={styles.btnLabelCustom}>Custom</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Grams Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Dispense</Text>
            <Text style={styles.modalSubtitle}>Specify exact grams to feed (5 - 300g):</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={customInput}
                onChangeText={setCustomInput}
                keyboardType="numeric"
                maxLength={3}
                placeholder="Grams"
                placeholderTextColor={Colors.textDisabled}
                autoFocus
              />
              <Text style={styles.inputSuffix}>grams</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
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
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.amber,
    letterSpacing: 1.1,
  },
  buttonsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  feedBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  feedBtnPrimary: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: Colors.primary,
  },
  feedBtnCustom: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  btnAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  btnAmountPrimary: {
    color: Colors.primary,
  },
  btnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
  },
  btnLabelPrimary: {
    color: Colors.primary,
  },
  btnLabelCustom: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cyan,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputSuffix: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  confirmBtnText: {
    color: '#000',
    fontWeight: '700',
  },
});
