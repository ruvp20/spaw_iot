#pragma once
#include <Arduino.h>
#include "../hardware/servo_controller.h"
#include "../hardware/weight_sensor.h"
#include "config.h"

struct DispenseResult {
    bool success;
    float targetGrams;
    float actualGrams;
    unsigned long durationMs;
    String status; // "success", "insufficient_food", "timeout", "sensor_error"
};

class DispenseEngine {
public:
    DispenseEngine();
    DispenseResult dispense(float targetGrams);
    bool isDispensing() const;

private:
    bool _busy;
};

extern DispenseEngine dispenseEngine;
