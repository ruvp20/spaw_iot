# Spaw IoT — Smart Pet Feeder 🐾

An open-source, closed-loop weight-based automated pet feeder with ESP32 microcontroller and React Native mobile application (Android APK ready).

---

## 🌟 Key Highlights

- **Closed-Loop Weight Control:** Instead of guessing dispensing time, continuous load-cell feedback (HX711 + 3kg load cell) dynamically cuts off feed at precise target grams.
- **Pulse & Staged Dispensing:** Staged flow (full open $\rightarrow$ partial $\rightarrow$ fine pulse $\rightarrow$ settle) prevents kinetic overshoot.
- **Anti-Jam Routine:** Auto-detects and frees kibble jams on the MG996R servo gate.
- **Cross-Platform Mobile App:** Built with React Native & Expo, ready to build an APK with `eas build` or run locally.
- **Sprint & Fill Modes:** One-tap 250g Fill mode, plus periodic scheduled Sprint mode (interval + count).
- **24-Hour Feeding Logs:** Tracks actual vs. target grams, timestamps, and status flags.
- **Dual Mode App (Live & Interactive Demo):** Includes full offline interactive mock mode so developers can test the complete UI and workflow without physical hardware connected.

---

## 📂 Repository Structure

```text
spaw_iot/
├── app/                  # React Native (Expo + TypeScript) mobile application
│   ├── src/
│   │   ├── api/          # Feeder REST API client & offline Mock engine
│   │   ├── components/   # UI components (WeightGauge, Cards, Badges)
│   │   ├── context/      # Global Feeder State (Zustand/React Context)
│   │   ├── screens/      # Dashboard, Fill, Sprint, History, Settings
│   │   └── theme/        # Dark/Light theme palette & typography
│   ├── app.json          # Expo configuration with Android Cleartext HTTP support
│   └── eas.json          # EAS Build profile for standalone Android APK
├── firmware/             # ESP32 C++ firmware (PlatformIO)
│   ├── platformio.ini    # Board dependencies (ESP32Servo, HX711, ArduinoJson)
│   ├── include/          # Pins, configuration limits, secrets
│   └── src/
│       ├── hardware/     # Servo & HX711 driver classes
│       ├── feeder/       # Staged closed-loop dispensing engine
│       ├── storage/      # 24-hour circular history store
│       └── network/      # AsyncWebServer REST API endpoints
├── hardware/             # Schematics, BOM, 3D CAD/mechanical specs
│   ├── BOM.md            # Bill of Materials with supplier notes
│   └── mechanical_specs.md # Assembly diagram and cantilever load cell instructions
└── docs/                 # Documentation
    ├── architecture.md   # System architecture & data flow
    ├── api.md            # REST API endpoint reference
    └── calibration.md    # Load cell and servo calibration guide
```

---

## 🚀 Quick Start: Mobile App & Building the APK

### 1. Run App Locally
```bash
cd app
npm install
npm start
```
- Press `w` to open web preview.
- Scan the QR code with **Expo Go** on Android/iOS to run immediately on your physical phone!

### 2. Generate Standalone Android `.apk`
To generate a downloadable `.apk` file for direct installation on any Android device:
```bash
cd app
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
The APK link will be generated in your terminal upon completion.

---

## ⚡ ESP32 Firmware Setup

1. Open `firmware/` in VS Code with the PlatformIO extension.
2. Copy `firmware/include/secrets.example.h` to `secrets.h` and enter your Wi-Fi credentials.
3. Connect the ESP32 via USB and click **Upload**.
4. The ESP32 will connect to Wi-Fi and broadcast on `http://petfeeder.local`.

---

## 📄 License

MIT License — free for hobbyists, makers, and commercial derivatives.
