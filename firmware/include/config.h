#pragma once

// Servo Mechanical Boundaries (Angles in degrees)
#define SERVO_CLOSED_ANGLE   20
#define SERVO_OPEN_ANGLE     95
#define SERVO_PARTIAL_ANGLE  55

// Feeder Safety Limits
#define MIN_FEED_GRAMS       5
#define MAX_FEED_GRAMS       400
#define DEFAULT_FILL_GRAMS   250
#define DISPENSE_TIMEOUT_MS  18000   // 18s safety cutoff to prevent runaway

// NTP & Timezone Configuration
#define NTP_SERVER_1         "pool.ntp.org"
#define NTP_SERVER_2         "time.nist.gov"
#define GMT_OFFSET_SEC       19800   // UTC+05:30 (India Standard Time)
#define DAYLIGHT_OFFSET_SEC  0

// Default calibration factor (must be calibrated per physical assembly)
#define DEFAULT_CALIBRATION_FACTOR -420.0f
