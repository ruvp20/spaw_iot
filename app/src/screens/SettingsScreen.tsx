import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const SettingsScreen: React.FC = () => {
  const { theme, mode, setThemeMode, isDark } = useTheme();
  const {
    feederIp,
    setFeederIp,
    isMockMode,
    setMockMode,
    tareScale,
    calibrateScale,
    status,
    refreshStatus,
  } = useFeeder();

  const [ipInput, setIpInput] = useState<string>(feederIp);
  const [knownWeight, setKnownWeight] = useState<string>('100');
  const [calibrating, setCalibrating] = useState<boolean>(false);

  const handleSaveIp = async () => {
    await setFeederIp(ipInput.trim());
    Alert.alert('Settings Updated', `Feeder address set to: ${ipInput.trim()}`);
  };

  const handleTare = async () => {
    await tareScale();
    Alert.alert('Tare Complete', 'Bowl baseline set to zero.');
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
      Alert.alert('Calibration Saved', `Scale calibrated with ${val}g reference object.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save calibration factor.');
    } finally {
      setCalibrating(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Appearance / Theme Card */}
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
        <View style={styles.cardHeader}>
          <Ionicons name="color-palette-outline" size={16} color={theme.accentSage} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            Color Palette & Theme
          </Text>
        </View>
        <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
          Earthy natural botanical themes designed for high contrast and calm tactile operation.
        </Text>

        <View style={styles.themeSelectorRow}>
          {/* Dark Theme Option */}
          <TouchableOpacity
            style={[
              styles.themeOptionBtn,
              {
                backgroundColor: isDark ? theme.surfaceLight : theme.surface,
                borderColor: isDark ? theme.primaryInteractive : theme.borderLight,
              },
            ]}
            onPress={() => setThemeMode('dark')}
            activeOpacity={0.8}
          >
            <View style={styles.themeSwatchRow}>
              <View style={[styles.colorCircle, { backgroundColor: '#14281D' }]} />
              <View style={[styles.colorCircle, { backgroundColor: '#2E5B42' }]} />
            </View>
            <Text
              style={[
                styles.themeOptionTitle,
                { color: isDark ? theme.primaryInteractive : theme.textPrimary },
              ]}
            >
              Dark Forest
            </Text>
            <Text style={[styles.themeOptionDesc, { color: theme.textMuted }]}>
              #14281D • #2E5B42
            </Text>
          </TouchableOpacity>

          {/* Light Theme Option */}
          <TouchableOpacity
            style={[
              styles.themeOptionBtn,
              {
                backgroundColor: !isDark ? theme.surfaceLight : theme.surface,
                borderColor: !isDark ? theme.primaryInteractive : theme.borderLight,
              },
            ]}
            onPress={() => setThemeMode('light')}
            activeOpacity={0.8}
          >
            <View style={styles.themeSwatchRow}>
              <View style={[styles.colorCircle, { backgroundColor: '#F7F5F0', borderWidth: 1, borderColor: '#DDD' }]} />
              <View style={[styles.colorCircle, { backgroundColor: '#2E5B42' }]} />
            </View>
            <Text
              style={[
                styles.themeOptionTitle,
                { color: !isDark ? theme.primaryInteractive : theme.textPrimary },
              ]}
            >
              Warm Linen
            </Text>
            <Text style={[styles.themeOptionDesc, { color: theme.textMuted }]}>
              Botanical Linen & Pine
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Interactive Demo Mode Toggle */}
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
        <View style={styles.toggleRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accentOchreTint }]}>
            <Ionicons name="game-controller-outline" size={17} color={theme.accentOchre} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              Interactive Demo Mode
            </Text>
            <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
              Simulate weight, pouring dynamics, and logs without physical hardware.
            </Text>
          </View>
          <Switch
            value={isMockMode}
            onValueChange={setMockMode}
            trackColor={{ false: theme.surfaceLight, true: theme.primaryInteractive }}
            thumbColor={isMockMode ? '#FFF' : theme.textMuted}
          />
        </View>
      </View>

      {/* 3. ESP32 Network Settings */}
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
        <View style={styles.cardHeader}>
          <Ionicons name="wifi" size={16} color={theme.accentSage} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            ESP32 Network Endpoint
          </Text>
        </View>
        <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
          Enter local IP address or mDNS hostname (e.g. 192.168.1.105 or petfeeder.local).
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
        >
          <TextInput
            style={[styles.textInput, { color: theme.textPrimary }]}
            value={ipInput}
            onChangeText={setIpInput}
            placeholder="192.168.1.105"
            placeholderTextColor={theme.textDisabled}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.saveIpBtn, { backgroundColor: theme.primaryInteractive }]}
            onPress={handleSaveIp}
          >
            <Text style={styles.saveIpBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.pingBtn,
            {
              backgroundColor: theme.surfaceLight,
              borderColor: theme.borderLight,
            },
          ]}
          onPress={refreshStatus}
          activeOpacity={0.7}
        >
          <Ionicons name="radio-outline" size={15} color={theme.accentSage} style={{ marginRight: 6 }} />
          <Text style={[styles.pingBtnText, { color: theme.textSecondary }]}>
            Test Connection & Ping Feeder
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Load Cell Calibration Wizard */}
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
        <View style={styles.cardHeader}>
          <Ionicons name="scale" size={16} color={theme.accentClay} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            Load Cell Calibration
          </Text>
        </View>
        <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
          Calibrate the HX711 24-bit strain gauge for precise gram accuracy.
        </Text>

        {/* Step 1 */}
        <View style={[styles.wizardStep, { backgroundColor: theme.surfaceLight }]}>
          <View style={[styles.stepNumCircle, { backgroundColor: theme.surface }]}>
            <Text style={[styles.stepNumText, { color: theme.accentSage }]}>1</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Tare Empty Bowl</Text>
            <Text style={[styles.stepHelp, { color: theme.textMuted }]}>
              Empty bowl on platform
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.stepBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={handleTare}
          >
            <Text style={[styles.stepBtnText, { color: theme.textSecondary }]}>Tare 0g</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2 */}
        <View style={[styles.wizardStep, { backgroundColor: theme.surfaceLight, marginTop: 10 }]}>
          <View style={[styles.stepNumCircle, { backgroundColor: theme.surface }]}>
            <Text style={[styles.stepNumText, { color: theme.accentSage }]}>2</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Known Reference Weight</Text>
            <View style={styles.weightInputRow}>
              <TextInput
                style={[
                  styles.weightInput,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.borderLight,
                    color: theme.textPrimary,
                  },
                ]}
                value={knownWeight}
                onChangeText={setKnownWeight}
                keyboardType="numeric"
                maxLength={4}
              />
              <Text style={[styles.weightSuffix, { color: theme.textMuted }]}>grams</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.stepBtn,
              {
                backgroundColor: theme.primaryInteractive,
                borderColor: theme.primaryInteractive,
              },
            ]}
            onPress={handleCalibrateFactor}
            disabled={calibrating}
          >
            {calibrating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.stepBtnPrimaryText}>Calibrate</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Servo Diagnostics */}
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
        <View style={styles.cardHeader}>
          <Ionicons name="hardware-chip-outline" size={16} color={theme.accentSage} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            Servo Gate Testing
          </Text>
        </View>
        <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
          Command MG996R gate angles to inspect mechanical action without kibble.
        </Text>

        <View style={styles.servoGrid}>
          <TouchableOpacity
            style={[
              styles.servoActionBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => Alert.alert('Gate Closed', 'Servo set to 20° (Closed)')}
          >
            <Text style={[styles.servoActionLabel, { color: theme.textPrimary }]}>
              Close (20°)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.servoActionBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => Alert.alert('Partial Gate', 'Servo set to 55° (Partial flow)')}
          >
            <Text style={[styles.servoActionLabel, { color: theme.accentClay }]}>
              Partial (55°)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.servoActionBtn,
              {
                backgroundColor: theme.surfaceLight,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => Alert.alert('Gate Open', 'Servo set to 95° (Open)')}
          >
            <Text style={[styles.servoActionLabel, { color: theme.primaryInteractive }]}>
              Open (95°)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.aboutCard}>
        <Text style={[styles.aboutText, { color: theme.textMuted }]}>
          Spaw IoT Smart Pet Feeder
        </Text>
        <Text style={[styles.aboutSub, { color: theme.textDisabled }]}>
          ESP32 FW v{status.firmware} • Mobile App v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  themeOptionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  themeSwatchRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  colorCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  themeOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeOptionDesc: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  saveIpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveIpBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  pingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 9,
    marginTop: 10,
    borderWidth: 1,
  },
  pingBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  wizardStep: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginTop: 10,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepHelp: {
    fontSize: 11,
    marginTop: 1,
  },
  stepBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  stepBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepBtnPrimaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  weightInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontWeight: '700',
    fontSize: 12,
    width: 55,
  },
  weightSuffix: {
    fontSize: 11,
    marginLeft: 6,
  },
  servoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  servoActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  servoActionLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  aboutText: {
    fontSize: 11,
    fontWeight: '500',
  },
  aboutSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
