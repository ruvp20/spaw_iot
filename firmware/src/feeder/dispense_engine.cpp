#include "dispense_engine.h"

DispenseEngine dispenseEngine;

DispenseEngine::DispenseEngine() : _busy(false) {}

DispenseResult DispenseEngine::dispense(float targetGrams) {
    DispenseResult result;
    result.targetGrams = targetGrams;
    result.actualGrams = 0;
    result.success = false;

    if (_busy) {
        result.status = "busy";
        return result;
    }

    if (!weightSensor.isConnected()) {
        result.status = "sensor_error";
        return result;
    }

    _busy = true;
    unsigned long startTime = millis();

    // Baseline weight before dispensing begins
    float initialWeight = weightSensor.getWeightGrams(5);
    float targetTotal = initialWeight + targetGrams;

    // Staged feeding loop
    while (millis() - startTime < DISPENSE_TIMEOUT_MS) {
        float currentWeight = weightSensor.getWeightGrams(1);
        float dispensedSoFar = currentWeight - initialWeight;

        // Stage 1: Far from target (>15g remaining) -> Open full
        if (targetTotal - currentWeight > 15.0f) {
            servoController.openFull();
            delay(120);
        }
        // Stage 2: Approaching target (5g - 15g remaining) -> Partial flow
        else if (targetTotal - currentWeight > 5.0f) {
            servoController.openPartial();
            delay(80);
        }
        // Stage 3: Fine precision pulse (<5g remaining)
        else if (targetTotal - currentWeight > 0.5f) {
            servoController.openPartial();
            delay(40);
            servoController.close();
            delay(150); // wait for kibble to land and settle
        }
        // Stage 4: Target reached!
        else {
            break;
        }

        // Check if hopper ran dry (zero progress over 4 seconds)
        if ((millis() - startTime > 4000) && dispensedSoFar < 2.0f) {
            servoController.close();
            _busy = false;
            result.status = "insufficient_food";
            result.actualGrams = max(0.0f, weightSensor.getWeightGrams(3) - initialWeight);
            result.durationMs = millis() - startTime;
            return result;
        }
    }

    // Immediately snap flap closed
    servoController.close();
    delay(300); // Settling delay for load-cell vibrations

    // Read final settled weight
    float finalWeight = weightSensor.getWeightGrams(5);
    float finalDispensed = max(0.0f, finalWeight - initialWeight);

    result.actualGrams = finalDispensed;
    result.durationMs = millis() - startTime;

    if (result.durationMs >= DISPENSE_TIMEOUT_MS) {
        result.status = "timeout";
        result.success = (finalDispensed >= targetGrams * 0.85f);
    } else {
        result.status = "success";
        result.success = true;
    }

    _busy = false;
    return result;
}

bool DispenseEngine::isDispensing() const {
    return _busy;
}
