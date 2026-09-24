# Bill of Materials (BOM) — Spaw IoT Feeder

## 1. Electronics

| Item | Component | Specification | Qty | Recommended Supplier / Notes |
|:---:|:---|:---|:---:|:---|
| 1 | Main MCU | ESP32-WROOM-32 Wi-Fi + BLE DevKit V1 | 1 | 30 or 38 pin devboard |
| 2 | Actuator | MG996R High-Torque Metal Gear Servo | 1 | Operating Voltage: 4.8V - 6V, Stall torque ~10kg/cm |
| 3 | Sensor | 3 kg Straight Bar Micro Load Cell | 1 | 4-wire Wheatstone bridge (Red, Black, White, Green) |
| 4 | Amplifier | HX711 24-Bit ADC Module | 1 | Dual channel, configurable 10/80 SPS |
| 5 | Power Supply | 5V 3A DC Regulated Wall Adapter | 1 | Dedicated for ESP32 and high-current servo spikes |
| 6 | Capacitor | 1000 µF 25V Electrolytic | 1 | Buffer across Servo VCC & GND rail |
| 7 | Prototyping | Solderless Breadboard & Dupont Wires | 1 | Male-to-Male, Male-to-Female |

## 2. Mechanical & Structure

| Item | Part | Dimensions / Material | Qty | Notes |
|:---:|:---|:---|:---:|:---|
| 1 | Food Hopper | Food-grade Acrylic / PET Container (1.5 - 2L) | 1 | Transparent with conical funnel bottom |
| 2 | Chute Pipe | 3" (75mm) PVC Pipe & 45° Elbow | 1 | Smooth interior wall to prevent kibble sticking |
| 3 | Dispenser Flap | 3D Printed / Laser-Cut Acrylic Flap | 1 | Features soft silicone lip on leading edge to avoid kibble pinch |
| 4 | Load Platform | Dual Acrylic / MDF Plates (120x120mm) | 2 | Top for bowl, bottom bolted to rigid base |
| 5 | Pet Bowl | Stainless Steel shallow feeding bowl | 1 | Removable for cleaning, fits on top load cell platform |
