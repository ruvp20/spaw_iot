#pragma once
#include <Arduino.h>
#include <ESP32Servo.h>
#include "config.h"
#include "pins.h"

class ServoController {
public:
    ServoController();
    void begin();
    void close();
    void openFull();
    void openPartial();
    void setAngle(int angle);
    void wiggleAntiJam();
    bool isClosed() const;
    int getCurrentAngle() const;

private:
    Servo _servo;
    int _currentAngle;
};

extern ServoController servoController;
