import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useFeeder } from '../context/FeederContext';

export const SettingsScreen: React.FC = () => {
  const { feederIp, setFeederIp, isMockMode, setMockMode, tareScale, calibrateScale, status, refreshStatus } = useFeeder();
  const [ipInput, setIpInput] = useState<string>(feederIp);
  const [knownWeight, setKnownWeight] = useState<string>('100');
  const [calibrating, setCalibrating] = useState<boolean>(false);
  const [testingServo, setTestingServo] = useState<boolean>(false);

  const handleSaveIp = async () => {
    await setFeederIp(ipInput.trim());
    Alert.alert('Settings Updated', `Feeder target set to: ${ipInput.trim()}`);
  };

  const handleTare = async () => {
    await tareScale();
    Alert.alert('Tare Complete', 'Bowl scale set to zero.');
  };

  const handleCalibrateFactor = async () => {
    const val = parseFloat(knownWeight);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in grams (e.g., 100).');
      return;
    }

    setCalibrating(true);
    try {
      await calibrateScale(val);
      Alert.alert('Calibration Saved', `Calibration factor updated using ${val}g reference weight.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save calibration factor.');
    } finally {
      setCalibrating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Demo / Mock Mode Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.iconCirclePurple}>
            <Ionicons name="game-controller-outline" size={18} color={Colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Interactive Demo Mode</Text>
            <Text style={styles.cardDesc}>
              Simulate load cell weight, staged pouring, and history without physical ESP32.
            </Text>
          </View>
          <Switch
            value={isMockMode}
            onValueChange={setMockMode}
            trackColor={{ false: Colors.surfaceLight, true: Colors.purple }}
            thumbColor={isMockMode ? '#FFF' : Colors.textMuted}
          />
        </View>
      </View>

      {/* Network & IP Configuration */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="wifi" size={16} color={Colors.cyan} style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeading}>ESP32 NETWORK CONFIGURATION</Text>
        </View>
        <Text style={styles.cardDesc}>
          Specify your ESP32 local IP address or mDNS hostname (e.g. 192.168.1.105 or petfeeder.local).
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={ipInput}
            onChangeText={setIpInput}
            placeholder="192.168.1.105"
            placeholderTextColor={Colors.textDisabled}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.saveIpBtn} onPress={handleSaveIp}>
            <Text style={styles.saveIpBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.pingBtn} onPress={refreshStatus}>
          <Ionicons name="radio-outline" size={16} color={Colors.cyan} style={{ marginRight: 6 }} />
          <Text style={styles.pingBtnText}>Test Connection & Ping Feeder</Text>
        </TouchableOpacity>
      </View>

      {/* Load Cell Calibration Wizard */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="scale" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeading}>LOAD CELL CALIBRATION WIZARD</Text>
        </View>
        <Text style={styles.cardDesc}>
          Calibrates the HX711 24-bit strain gauge. Perform whenever bowl geometry changes.
        </Text>

        {/* Step 1 */}
        <View style={styles.wizardStep}>
          <View style={styles.stepNumCircle}><Text style={styles.stepNumText}>1</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Tare Empty Bowl</Text>
            <Text style={styles.stepHelp}>Remove all food, place clean bowl on platform.</Text>
          </View>
          <TouchableOpacity style={styles.stepBtn} onPress={handleTare}>
            <Text style={styles.stepBtnText}>Tare 0g</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2 */}
        <View style={[styles.wizardStep, { marginTop: 12 }]}>
          <View style={styles.stepNumCircle}><Text style={styles.stepNumText}>2</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Place Known Reference Weight</Text>
            <Text style={styles.stepHelp}>Place a reference object (e.g., 100g test weight).</Text>
            <View style={styles.weightInputRow}>
              <TextInput
                style={styles.weightInput}
                value={knownWeight}
                onChangeText={setKnownWeight}
                keyboardType="numeric"
                maxLength={4}
              />
              <Text style={styles.weightSuffix}>grams</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.stepBtn, styles.stepBtnPrimary]} 
            onPress={handleCalibrateFactor}
            disabled={calibrating}
          >
            {calibrating ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.stepBtnPrimaryText}>Calibrate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Servo Diagnostics */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="hardware-chip-outline" size={16} color={Colors.amber} style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeading}>SERVO DIAGNOSTICS & ANTI-JAM</Text>
        </View>
        <Text style={styles.cardDesc}>
          Validate MG996R gate movement without dispensing pet food.
        </Text>

        <View style={styles.servoGrid}>
          <TouchableOpacity 
            style={styles.servoActionBtn} 
            onPress={() => Alert.alert('Gate Closed', 'Servo commanded to 20° (Closed)')}
          >
            <Text style={styles.servoActionLabel}>Close (20°)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.servoActionBtn}
            onPress={() => Alert.alert('Partial Gate', 'Servo commanded to 55° (Partial flow)')}
          >
            <Text style={styles.servoActionLabel}>Partial (55°)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.servoActionBtn}
            onPress={() => Alert.alert('Gate Open', 'Servo commanded to 95° (Open)')}
          >
            <Text style={styles.servoActionLabel}>Open (95°)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About & Firmware */}
      <View style={styles.aboutCard}>
        <Text style={styles.aboutText}>Spaw IoT Smart Pet Feeder — Open Source Edition</Text>
        <Text style={styles.aboutSub}>Firmware {status.firmware} • Mobile App v1.0.0 (APK Ready)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCirclePurple: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  saveIpBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveIpBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  pingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  pingBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.cyan,
  },
  wizardStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
  },
  stepNumCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepHelp: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  stepBtn: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stepBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepBtnPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  weightInput: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    width: 60,
  },
  weightSuffix: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  servoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  servoActionBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  servoActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.amber,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  aboutSub: {
    fontSize: 10,
    color: Colors.textDisabled,
    marginTop: 2,
  },
});
