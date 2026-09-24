import React, { useState, useEffect } from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

const STORAGE_KEY_KNOWN_WEIGHT = '@spaw_known_weight_input';

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
    bowlCapacity,
    setBowlCapacity,
  } = useFeeder();

  // Responsive breakpoints
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isNarrow = width < 420;
  const isTabletOrDesktop = width >= 768;

  const [ipInput, setIpInput] = useState<string>(feederIp);
  const [knownWeight, setKnownWeight] = useState<string>('0');
  const [bowlCapacityInput, setBowlCapacityInput] = useState<string>(String(bowlCapacity || 400));
  const [calibrating, setCalibrating] = useState<boolean>(false);

  // Sync with bowlCapacity from context
  useEffect(() => {
    if (bowlCapacity) {
      setBowlCapacityInput(String(bowlCapacity));
    }
  }, [bowlCapacity]);

  const handleBowlCapacityChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const sanitized = digitsOnly === '' ? '0' : digitsOnly.replace(/^0+(?=\d)/, '');
    setBowlCapacityInput(sanitized);
    const num = parseInt(sanitized, 10);
    if (!isNaN(num) && num > 0) {
      setBowlCapacity(num);
    }
  };

  const handleSelectCapacityPreset = (val: number) => {
    const str = String(val);
    setBowlCapacityInput(str);
    setBowlCapacity(val);
  };

  // Load saved known weight on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_KNOWN_WEIGHT);
        if (saved !== null) {
          setKnownWeight(saved);
        } else {
          setKnownWeight('0');
        }
      } catch (e) {
        console.warn('Error loading known weight', e);
      }
    })();
  }, []);

  const handleKnownWeightChange = (text: string) => {
    // Strictly allow numbers only (no characters, no punctuation, no special characters)
    const digitsOnly = text.replace(/[^0-9]/g, '');
    const sanitized = digitsOnly === '' ? '0' : digitsOnly.replace(/^0+(?=\d)/, '');
    setKnownWeight(sanitized);
    AsyncStorage.setItem(STORAGE_KEY_KNOWN_WEIGHT, sanitized).catch(() => {});
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

  // Dynamic card style based on viewport
  const cardResponsiveStyle = {
    padding: isSmallMobile ? 14 : isNarrow ? 16 : isTabletOrDesktop ? 22 : 18,
    borderRadius: isSmallMobile ? 16 : 20,
    marginBottom: isSmallMobile ? 10 : 12,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: isSmallMobile ? 12 : isNarrow ? 16 : isTabletOrDesktop ? 24 : 18,
          paddingTop: isSmallMobile ? 12 : 16,
          paddingBottom: 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Centered responsive container for tablets/desktops */}
      <View style={[styles.responsiveWrapper, { maxWidth: isTabletOrDesktop ? 680 : 640 }]}>
        {/* 1. Appearance / Theme Card */}
        <View
          style={[
            styles.card,
            cardResponsiveStyle,
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

          <View
            style={[
              styles.themeSelectorRow,
              {
                flexDirection: isNarrow ? 'column' : 'row',
                gap: isSmallMobile ? 8 : 10,
              },
            ]}
          >
            {/* Dark Theme Option: Obsidian & Jade */}
            <TouchableOpacity
              style={[
                styles.themeOptionBtn,
                {
                  backgroundColor: isDark ? theme.surfaceLight : theme.surface,
                  borderColor: isDark
                    ? theme.primaryInteractive
                    : theme.borderLight,
                  padding: isSmallMobile ? 10 : 12,
                },
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              {isNarrow ? (
                // Horizontal list-style row for narrow screens
                <View style={styles.themeOptionNarrowContent}>
                  <View style={styles.themeSwatchRow}>
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: '#0D0F0E', borderWidth: 1, borderColor: '#333' },
                      ]}
                    />
                    <View style={[styles.colorCircle, { backgroundColor: '#387B57' }]} />
                  </View>
                  <View style={styles.themeNarrowTextCol}>
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
                  </View>
                  {isDark && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={theme.primaryInteractive}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
              ) : (
                // Grid-box style for wider screens
                <View>
                  <View style={styles.themeHeaderRow}>
                    <View style={styles.themeSwatchRow}>
                      <View
                        style={[
                          styles.colorCircle,
                          { backgroundColor: '#0D0F0E', borderWidth: 1, borderColor: '#333' },
                        ]}
                      />
                      <View style={[styles.colorCircle, { backgroundColor: '#387B57' }]} />
                    </View>
                    {isDark && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.primaryInteractive}
                      />
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
                </View>
              )}
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
                  padding: isSmallMobile ? 10 : 12,
                },
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              {isNarrow ? (
                // Horizontal list-style row for narrow screens
                <View style={styles.themeOptionNarrowContent}>
                  <View style={styles.themeSwatchRow}>
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: '#FBF9F5', borderWidth: 1, borderColor: '#D9D0C3' },
                      ]}
                    />
                    <View style={[styles.colorCircle, { backgroundColor: '#5C3A21' }]} />
                  </View>
                  <View style={styles.themeNarrowTextCol}>
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
                  </View>
                  {!isDark && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={theme.primary}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>
              ) : (
                // Grid-box style for wider screens
                <View>
                  <View style={styles.themeHeaderRow}>
                    <View style={styles.themeSwatchRow}>
                      <View
                        style={[
                          styles.colorCircle,
                          { backgroundColor: '#FBF9F5', borderWidth: 1, borderColor: '#D9D0C3' },
                        ]}
                      />
                      <View style={[styles.colorCircle, { backgroundColor: '#5C3A21' }]} />
                    </View>
                    {!isDark && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.primary}
                      />
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
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Bowl Maximum Capacity Card */}
        <View
          style={[
            styles.card,
            cardResponsiveStyle,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
            HARDWARE SPECIFICATION
          </Text>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            Bowl Maximum Capacity
          </Text>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Container capacity in grams. Calibrates progress gauges, fill limits, and meal boundaries across the app.
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.surfaceLight,
                marginTop: 12,
              },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  color: theme.textPrimary,
                  fontSize: isSmallMobile ? 16 : 18,
                  fontWeight: '700',
                  borderWidth: 0,
                  outlineWidth: 0,
                  outlineStyle: 'none',
                } as any,
              ]}
              value={bowlCapacityInput}
              onChangeText={handleBowlCapacityChange}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={4}
              placeholder="400"
              placeholderTextColor={theme.textDisabled}
            />
            <Text style={[styles.weightSuffix, { color: theme.textMuted, fontSize: 13, marginRight: 6 }]}>gms</Text>
          </View>

          {/* Quick capacity preset chips */}
          <View style={[styles.capacityPresetsRow, { gap: isSmallMobile ? 4 : 6 }]}>
            {[250, 350, 400, 500, 600].map((val) => {
              const isSelected = bowlCapacityInput === String(val);
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.capacityChip,
                    {
                      backgroundColor: isSelected ? theme.primaryTint : theme.surfaceLight,
                      borderColor: isSelected
                        ? isDark
                          ? theme.primaryInteractive
                          : theme.primary
                        : 'transparent',
                    },
                  ]}
                  onPress={() => handleSelectCapacityPreset(val)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.capacityChipText,
                      {
                        color: isSelected
                          ? isDark
                            ? theme.primaryInteractive
                            : theme.primary
                          : theme.textSecondary,
                        fontSize: isSmallMobile ? 10 : 11,
                      },
                    ]}
                  >
                    {val}g
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Interactive Demo Mode Toggle */}
        <View
          style={[
            styles.card,
            cardResponsiveStyle,
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
            <View style={styles.toggleTextCol}>
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
            cardResponsiveStyle,
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
                  fontSize: isSmallMobile ? 12 : 13,
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
                {
                  backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                  paddingHorizontal: isSmallMobile ? 10 : 12,
                },
              ]}
              onPress={handleSaveIp}
              activeOpacity={0.8}
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
                paddingVertical: isSmallMobile ? 8 : 10,
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
            cardResponsiveStyle,
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
            Two-step procedure to reset zero baseline and calibrate grams scaling factor.
          </Text>

          {/* Step 1: Zero Baseline Tare */}
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
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Zero Tare</Text>
              <Text
                style={[styles.stepHelp, { color: theme.textMuted }]}
                numberOfLines={isSmallMobile ? 1 : 2}
              >
                Clean empty bowl on platform
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.stepBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.borderLight,
                  paddingHorizontal: isSmallMobile ? 10 : 12,
                },
              ]}
              onPress={handleTare}
              activeOpacity={0.75}
            >
              <Text style={[styles.stepBtnText, { color: theme.textSecondary }]}>Tare 0g</Text>
            </TouchableOpacity>
          </View>

          {/* Step 2: Reference Weight Calibration */}
          <View
            style={[
              styles.wizardStepDetailed,
              { backgroundColor: theme.surfaceLight, marginTop: 10 },
            ]}
          >
            {/* Step 2 Header */}
            <View style={styles.wizardStepHeader}>
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
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Reference Calibration
                </Text>
                <Text style={[styles.stepHelp, { color: theme.textMuted }]}>
                  Place test mass in bowl to set scale factor
                </Text>
              </View>
            </View>

            {/* Step 2 Controls: Input and Calibrate Action Button */}
            <View
              style={[
                styles.wizardActionRow,
                {
                  flexDirection: isSmallMobile ? 'column' : 'row',
                  alignItems: isSmallMobile ? 'stretch' : 'center',
                },
              ]}
            >
              <View
                style={[
                  styles.weightInputRow,
                  {
                    backgroundColor: theme.surface,
                    alignSelf: isSmallMobile ? 'stretch' : 'flex-start',
                    justifyContent: isSmallMobile ? 'center' : 'flex-start',
                  },
                ]}
              >
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

              <TouchableOpacity
                style={[
                  styles.stepBtn,
                  styles.calibrateBtn,
                  {
                    backgroundColor: isDark ? theme.primaryInteractive : theme.primary,
                    borderColor: isDark ? theme.primaryInteractive : theme.primary,
                    flex: isSmallMobile ? undefined : 1,
                    marginTop: isSmallMobile ? 8 : 0,
                    marginLeft: isSmallMobile ? 0 : 10,
                  },
                ]}
                onPress={handleCalibrateFactor}
                disabled={calibrating}
                activeOpacity={0.8}
              >
                {calibrating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.stepBtnPrimaryText}>Calibrate Scale</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5. Servo Diagnostics */}
        <View
          style={[
            styles.card,
            cardResponsiveStyle,
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

          <View style={[styles.servoGrid, { gap: isSmallMobile ? 6 : 8 }]}>
            {/* Gate Closed: 20 deg */}
            <TouchableOpacity
              style={[
                styles.servoActionBtn,
                {
                  backgroundColor: theme.surfaceLight,
                  borderColor: theme.borderLight,
                  paddingVertical: isSmallMobile ? 8 : 10,
                },
              ]}
              onPress={() => Alert.alert('Gate Closed', 'Servo set to 20° (Closed)')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.servoActionLabel,
                  { color: theme.textPrimary, fontSize: isSmallMobile ? 11 : 12 },
                ]}
              >
                Close
              </Text>
              <Text style={[styles.servoAngleBadge, { color: theme.textMuted }]}>
                20°
              </Text>
            </TouchableOpacity>

            {/* Partial Flow: 55 deg */}
            <TouchableOpacity
              style={[
                styles.servoActionBtn,
                {
                  backgroundColor: theme.surfaceLight,
                  borderColor: theme.borderLight,
                  paddingVertical: isSmallMobile ? 8 : 10,
                },
              ]}
              onPress={() => Alert.alert('Partial Gate', 'Servo set to 55° (Partial flow)')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.servoActionLabel,
                  { color: theme.accentClay, fontSize: isSmallMobile ? 11 : 12 },
                ]}
              >
                Partial
              </Text>
              <Text style={[styles.servoAngleBadge, { color: theme.accentClay }]}>
                55°
              </Text>
            </TouchableOpacity>

            {/* Full Open: 95 deg */}
            <TouchableOpacity
              style={[
                styles.servoActionBtn,
                {
                  backgroundColor: theme.surfaceLight,
                  borderColor: theme.borderLight,
                  paddingVertical: isSmallMobile ? 8 : 10,
                },
              ]}
              onPress={() => Alert.alert('Gate Open', 'Servo set to 95° (Open)')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.servoActionLabel,
                  {
                    color: isDark ? theme.primaryInteractive : theme.primary,
                    fontSize: isSmallMobile ? 11 : 12,
                  },
                ]}
              >
                Open
              </Text>
              <Text
                style={[
                  styles.servoAngleBadge,
                  { color: isDark ? theme.primaryInteractive : theme.primary },
                ]}
              >
                95°
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  responsiveWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  card: {
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
    marginTop: 14,
  },
  themeOptionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  themeOptionNarrowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeNarrowTextCol: {
    flex: 1,
    marginLeft: 12,
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
    alignItems: 'center',
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
  toggleTextCol: {
    flex: 1,
    minWidth: 0,
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
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    paddingVertical: 9,
    fontFamily: 'monospace',
    borderWidth: 0,
  },
  saveIpBtn: {
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
    borderWidth: 1,
    minHeight: 38,
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
  wizardStepDetailed: {
    padding: 12,
    borderRadius: 12,
  },
  wizardStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wizardActionRow: {
    marginTop: 10,
    alignItems: 'center',
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
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  calibrateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    minHeight: 34,
  },
  weightInput: {
    fontWeight: '700',
    fontSize: 14,
    minWidth: 42,
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
    marginTop: 10,
  },
  servoActionBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 46,
  },
  servoActionLabel: {
    fontWeight: '700',
  },
  servoAngleBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
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
  capacityPresetsRow: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
  capacityChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  capacityChipText: {
    fontWeight: '600',
  },
});
