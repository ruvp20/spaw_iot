# Load Cell & Servo Calibration Guide

## 1. Load Cell Calibration Routine

The HX711 converts analog microvolt changes into a signed 24-bit integer. A calibration factor translates this raw count into grams:

$$\text{Weight (g)} = \frac{\text{Raw Reading} - \text{Tare Offset}}{\text{Calibration Factor}}$$

### Step-by-Step Calibration:
1. Ensure the empty stainless steel feeding bowl is positioned on the platform.
2. In the Spaw mobile app, navigate to **Settings $\rightarrow$ Calibration Wizard**.
3. Tap **Step 1: Tare Bowl**. The ESP32 sets the current value as zero.
4. Place a known reference weight in the bowl (e.g., a calibrated 100g weight or 100ml of water).
5. Enter `100` in the grams input field and tap **Step 2: Calculate Factor**.
6. The app issues a `POST /api/calibrate/factor` request. The ESP32 saves the calculated factor to internal NVS Flash so calibration persists across power cycles!

## 2. MG996R Servo Angle Alignment
- **Closed Angle:** The flap should rest firmly against the chute exit without humming or buzzing against a hard mechanical wall.
- **Open Angle:** Rotate between $85^\circ$ and $95^\circ$ to clear the pipe bore.
- Test angles manually via the Mobile App's **Settings $\rightarrow$ Servo Diagnostics** menu before filling kibble into the hopper.
