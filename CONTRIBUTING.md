# Contributing to Spaw IoT

Thank you for your interest in contributing to Spaw IoT! This project is an open-source, closed-loop weight-based smart pet feeder built with ESP32 and React Native Expo.

## Project Structure
- `/app`: React Native Expo mobile application with APK generation configuration.
- `/firmware`: PlatformIO ESP32 C++ firmware with modular drivers and REST API.
- `/hardware`: Bill of Materials (BOM) and mechanical design specifications.
- `/docs`: Architecture, API schema, wiring guides, and calibration documentation.

## How to Contribute
1. Fork the repository.
2. Create a descriptive feature branch: `git checkout -b feature/amazing-feature`.
3. Test mobile app changes in Expo (`npm start`) and ensure APK builds compile cleanly.
4. Commit your changes: `git commit -m 'feat: add amazing feature'`.
5. Push to your branch: `git push origin feature/amazing-feature`.
6. Open a Pull Request.

## Code Standards
- **App**: TypeScript, functional React components, strict typing, responsive UI.
- **Firmware**: Clean C++ with separate header and implementation files, non-blocking asynchronous patterns.
