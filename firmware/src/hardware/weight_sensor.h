#pragma once
#include <Arduino.h>
#include <HX711.h>
#include "pins.h"
#include "config.h"

class WeightSensor {
public:
    WeightSensor();
    bool begin();
    float getWeightGrams(byte readTimes = 2);
    void tare();
    void setCalibrationFactor(float factor);
    float getCalibrationFactor() const;
    bool isConnected();

private:
    HX711 _scale;
    float _calibrationFactor;
};

extern WeightSensor weightSensor;
