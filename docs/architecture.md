# System Architecture & Flow

## High-Level Architecture
```text
 ┌────────────────────────────────────────────────────────┐
 │                   Mobile Application                   │
 │                (React Native Expo + TS)                │
 └───────────────────────────┬────────────────────────────┘
                             │
                      HTTP REST / mDNS
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                   ESP32 Microcontroller                │
 │                                                        │
 │   ┌────────────────┐  ┌────────────────────────────┐   │
 │   │ AsyncWebserver │  │      Scheduler Store       │   │
 │   └───────┬────────┘  └─────────────┬──────────────┘   │
 │           │                         │                  │
 │           ▼                         ▼                  │
 │   ┌────────────────────────────────────────────────┐   │
 │   │         Closed-Loop Dispense Engine            │   │
 │   └───────┬─────────────────────────▲──────────────┘   │
 └───────────┼─────────────────────────┼──────────────────┘
             │                         │
      PWM Control Signal          Weight Feedback
             │                         │
             ▼                         ▼
      [MG996R Servo]             [HX711 24-Bit ADC]
             │                         │
        (Gate Flap)              (3kg Load Cell)
             │                         │
             ▼                         ▼
         Food Flow  ═══════════►  [Bowl Weight]
```

## Dispensing Algorithm Stages
1. **Initial Baseline:** Tare or sample resting bowl weight $W_0$. Compute target total $W_{target} = W_0 + \Delta W$.
2. **Bulk Pour Stage:** While $W_{current} < W_{target} - 15g$, open flap fully ($95^\circ$).
3. **Throttled Stage:** Between $15g$ and $5g$ remaining, throttle gate to partial ($55^\circ$).
4. **Pulsed Trickle Stage:** Less than $5g$ remaining, pulse gate open for $40ms$, snap closed, wait $150ms$ for kibbles to settle on the load cell.
5. **Final Settlement:** Wait $300ms$ post-close, take average of 5 load cell readings, log difference to history.
