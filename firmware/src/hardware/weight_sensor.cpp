#include "weight_sensor.h"

WeightSensor weightSensor;

WeightSensor::WeightSensor() : _calibrationFactor(DEFAULT_CALIBRATION_FACTOR) {}

bool WeightSensor::begin() {
    _scale.begin(PIN_HX711_DOUT, PIN_HX711_SCK);
    
    // Check if sensor responds within 1 second
    unsigned long start = millis();
    while (!_scale.is_ready()) {
        if (millis() - start > 1000) {
            return false;
        }
        delay(10);
    }
    
    _scale.set_scale(_calibrationFactor);
    _scale.tare();
    return true;
}

float WeightSensor::getWeightGrams(byte readTimes) {
    if (!_scale.is_ready()) {
        return 0.0f;
    }
    float w = _scale.get_units(readTimes);
    if (w < 0 && w > -1.5) w = 0.0f; // clamp small noise around zero
    return w;
}

void WeightSensor::tare() {
    if (_scale.is_ready()) {
        _scale.tare();
    }
}

void WeightSensor::setCalibrationFactor(float factor) {
    _calibrationFactor = factor;
    _scale.set_scale(_calibrationFactor);
}

float WeightSensor::getCalibrationFactor() const {
    return _calibrationFactor;
}

bool WeightSensor::isConnected() {
    return _scale.is_ready();
}
