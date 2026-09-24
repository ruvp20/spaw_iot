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
  const { theme, setThemeMode, isDark } = useTheme();
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

  const handleKnownWeightChange = (text: string) => {
    // Strictly allow numbers only (no characters, no punctuation, no special characters)
    const digitsOnly = text.replace(/[^0-9]/g, '');
    setKnownWeight(digitsOnly);
  };

  const handleSaveIp = async () => {
    await setFeederIp(ipInput.trim());
    Alert.alert('Settings Saved', `Endpoint set to: ${ipInput.trim()}`);
  };

  const handleTare = async () => {
    await tareScale();
    Alert.alert('Tare Complete', 'Scale baseline reset to 0.0g.');
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
      Alert.alert('Calibration Saved', `Scale factor adjusted using ${val}g reference weight.`);
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
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          APPEARANCE
        </Text>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Color Palette
        </Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
          Curated architectural palettes designed for tactile elegance and effortless legibility.
        </Text>

        <View style={styles.themeSelectorRow}>
          {/* Dark Theme Option: Obsidian & Jade */}
          <TouchableOpacity
            style={[
              styles.themeOptionBtn,
              {
                backgroundColor: isDark ? theme.surfaceLight : theme.surface,
                borderColor: isDark
                  ? theme.primaryInteractive
                  : theme.borderLight,
              },
            ]}
            onPress={() => setThemeMode('dark')}
            activeOpacity={0.8}
          >
            <View style={styles.themeHeaderRow}>
              <View style={styles.themeSwatchRow}>
                <View style={[styles.colorCircle, { backgroundColor: '#0D0F0E', borderWidth: 1, borderColor: '#333' }]} />
                <View style={[styles.colorCircle, { backgroundColor: '#387B57' }]} />
              </View>
              {isDark && (
                <Ionicons name="checkmark-circle" size={16} color={theme.primaryInteractive} />
              )}
            </View>
            <Text
              style={[
                styles.themeOptionTitle,
                { color: isDark ? theme.primaryInteractive : theme.textPrimary },
              ]}
            >
              Obsidian & Jade
            </Text>
            <Text style={[styles.themeOptionDesc, { color: theme.textMuted }]}>
              Titanium stone & radiant jade
            </Text>
          </TouchableOpacity>

          {/* Light Theme Option: Cream White & Brown Tonic */}
          <TouchableOpacity
            style={[
              styles.themeOptionBtn,
              {
                backgroundColor: !isDark ? theme.surfaceLight : theme.surface,
                borderColor: !isDark
                  ? theme.primary
                  : theme.borderLight,
              },
            ]}
            onPress={() => setThemeMode('light')}
            activeOpacity={0.8}
          >
            <View style={styles.themeHeaderRow}>
              <View style={styles.themeSwatchRow}>
                <View style={[styles.colorCircle, { backgroundColor: '#FBF9F5', borderWidth: 1, borderColor: '#D9D0C3' }]} />
                <View style={[styles.colorCircle, { backgroundColor: '#5C3A21' }]} />
              </View>
              {!isDark && (
                <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
              )}
            </View>
            <Text
              style={[
                styles.themeOptionTitle,
                { color: !isDark ? theme.primary : theme.textPrimary },
              ]}
            >
              Cream & Tonic
            </Text>
            <Text style={[styles.themeOptionDesc, { color: theme.textMuted }]}>
              Cream white & brown tonic
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
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryTint }]}>
            <Ionicons
              name="cube-outline"
              size={16}
              color={isDark ? theme.primaryInteractive : theme.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              Hardware Simulation Mode
            </Text>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              Simulates load cell strain telemetry and servo gate states without physical ESP32.
            </Text>
          </View>
          <Switch
            value={isMockMode}
            onValueChange={setMockMode}
            trackColor={{
              false: theme.surfaceLight,
              true: isDark ? theme.primaryInteractive : theme.primary,
            }}
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
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          CONNECTIVITY
        </Text>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          ESP32 Endpoint
        </Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
          Local IP address or mDNS hostname (`192.168.1.105` or `petfeeder.local`).
        </Text>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surfaceLight,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                color: theme.textPrimary,
                borderWidth: 0,
                outlineWidth: 0,
                outlineStyle: 'none',
              } as any,
            ]}
            value={ipInput}
            onChangeText={setIpInput}
            placeholder="192.168.1.105"
            placeholderTextColor={theme.textDisabled}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[
              styles.saveIpBtn,
              { backgroundColor: isDark ? theme.primaryInteractive : theme.primary },
            ]}
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
          <Ionicons
            name="radio-outline"
            size={14}
            color={theme.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.pingBtnText, { color: theme.textSecondary }]}>
            Ping Feeder & Sync Status
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
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          CALIBRATION WIZARD
        </Text>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          HX711 Strain Gauge Calibration
        </Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
          Two-step process to calibrate zero baseline and grams scaling factor.
        </Text>

        {/* Step 1 */}
        <View style={[styles.wizardStep, { backgroundColor: theme.surfaceLight }]}>
          <View style={[styles.stepNumCircle, { backgroundColor: theme.surface }]}>
            <Text
              style={[
                styles.stepNumText,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              1
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Zero Tare</Text>
            <Text style={[styles.stepHelp, { color: theme.textMuted }]}>
              Clean empty bowl on platform
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
            <Text
              style={[
                styles.stepNumText,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              2
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Reference Calibration</Text>
            <View style={[styles.weightInputRow, { backgroundColor: theme.surface }]}>
              <TextInput
                style={[
                  styles.weightInput,
                  {
                    color: theme.textPrimary,
                    borderWidth: 0,
                    outlineWidth: 0,
                    outlineStyle: 'none',
                  } as any,
                ]}
                value={knownWeight}
                onChangeText={handleKnownWeightChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={4}
                placeholder="0"
                placeholderTextColor={theme.textDisabled}
              />
              <Text style={[styles.weightSuffix, { color: theme.textMuted }]}>gms</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.stepBtn,
              {
                backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                borderColor: isDark ? theme.primaryInteractive : theme.primary,
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
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          DIAGNOSTICS
        </Text>
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Servo Gate Angle Testing
        </Text>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
          Command MG996R gate angles to inspect mechanical action without food.
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
            <Text
              style={[
                styles.servoActionLabel,
                { color: isDark ? theme.primaryInteractive : theme.primary },
              ]}
            >
              Open (95°)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.aboutCard}>
        <Text style={[styles.aboutText, { color: theme.textMuted }]}>
          Spaw IoT • Precision Pet Feeder
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
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  themeOptionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  themeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeSwatchRow: {
    flexDirection: 'row',
    gap: 5,
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  themeOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeOptionDesc: {
    fontSize: 10,
    marginTop: 2,
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
    borderWidth: 0,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: 'monospace',
    borderWidth: 0,
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
    borderRadius: 10,
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
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    borderRadius: 8,
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
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  weightInput: {
    fontWeight: '700',
    fontSize: 13,
    minWidth: 38,
    textAlign: 'center',
    borderWidth: 0,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  weightSuffix: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 3,
  },
  servoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
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
