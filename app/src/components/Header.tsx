import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useFeeder } from '../context/FeederContext';

export const Header: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { connectionStatus, isMockMode, feederIp, refreshStatus } = useFeeder();
  const { width } = useWindowDimensions();
  const isSmallMobile = width < 360;
  const isTabletOrDesktop = width >= 768;

  // Animation values
  const spinAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Gentle status dot pulse
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  const handleToggleTheme = () => {
    Animated.parallel([
      Animated.timing(spinAnim, {
        toValue: isDark ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.75,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    toggleTheme();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'mock_mode':
        return {
          label: 'DEMO',
          bg: theme.accentOchreTint,
          color: theme.accentOchre,
          dot: theme.accentOchre,
        };
      case 'connected':
        return {
          label: 'ONLINE',
          bg: theme.successTint,
          color: theme.success,
          dot: theme.success,
        };
      case 'connecting':
        return {
          label: 'SYNCING',
          bg: theme.accentClayTint,
          color: theme.accentClay,
          dot: theme.accentClay,
        };
      case 'disconnected':
      default:
        return {
          label: 'OFFLINE',
          bg: theme.dangerTint,
          color: theme.danger,
          dot: theme.danger,
        };
    }
  };

  const status = getStatusInfo();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.borderLight }]}>
      <View
        style={[
          styles.innerContainer,
          {
            maxWidth: isTabletOrDesktop ? 680 : '100%',
            paddingHorizontal: isSmallMobile ? 12 : isTabletOrDesktop ? 24 : 18,
          },
        ]}
      >
        {/* Brand & Subtitle */}
        <View style={styles.brandGroup}>
          <View style={styles.titleRow}>
            <View style={[styles.brandIcon, { backgroundColor: theme.primaryTint }]}>
              <Ionicons name="paw" size={14} color={isDark ? theme.primaryInteractive : theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary, fontSize: isSmallMobile ? 15 : 16 }]}>
              SPAW
            </Text>
            <View style={[styles.dotSep, { backgroundColor: theme.border }]} />
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.textMuted,
                  fontSize: isSmallMobile ? 9 : 10,
                  maxWidth: isSmallMobile ? 90 : 160,
                },
              ]}
              numberOfLines={1}
            >
              {isMockMode ? 'SIMULATOR' : feederIp.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Right Actions: Status Badge & Animated Theme Toggle */}
        <View style={styles.actionGroup}>
          {/* Connection status pill */}
          <TouchableOpacity
            style={[
              styles.statusPill,
              {
                backgroundColor: status.bg,
                borderColor: theme.borderLight,
                paddingHorizontal: isSmallMobile ? 7 : 9,
                paddingVertical: isSmallMobile ? 3 : 4,
              },
            ]}
            onPress={refreshStatus}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.statusDot,
                { backgroundColor: status.dot, opacity: pulseAnim },
              ]}
            />
            <Text
              style={[
                styles.statusLabel,
                { color: status.color, fontSize: isSmallMobile ? 9 : 10 },
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>

          {/* Animated Theme Toggle Button */}
          <TouchableOpacity
            onPress={handleToggleTheme}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Theme"
          >
            <Animated.View
              style={[
                styles.themeBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  transform: [{ rotate: spin }, { scale: scaleAnim }],
                },
              ]}
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={14}
                color={isDark ? theme.accentOchre : theme.textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  brandGroup: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  dotSep: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  subtitle: {
    fontWeight: '600',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusLabel: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  themeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
