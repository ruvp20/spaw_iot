#include "servo_controller.h"

ServoController servoController;

ServoController::ServoController() : _currentAngle(SERVO_CLOSED_ANGLE) {}

void ServoController::begin() {
    ESP32PWM::allocateTimer(0);
    _servo.setPeriodHertz(50); // Standard 50Hz servo
    _servo.attach(PIN_SERVO_PWM, 500, 2400);
    close();
}

void ServoController::close() {
    setAngle(SERVO_CLOSED_ANGLE);
}

void ServoController::openFull() {
    setAngle(SERVO_OPEN_ANGLE);
}

void ServoController::openPartial() {
    setAngle(SERVO_PARTIAL_ANGLE);
}

void ServoController::setAngle(int angle) {
    angle = constrain(angle, 0, 180);
    _currentAngle = angle;
    _servo.write(_currentAngle);
}

void ServoController::wiggleAntiJam() {
    // Quick pulsing motion to dislodge trapped kibble
    for (int i = 0; i < 2; i++) {
        setAngle(SERVO_OPEN_ANGLE - 15);
        delay(120);
        setAngle(SERVO_CLOSED_ANGLE + 10);
        delay(120);
    }
    close();
}

bool ServoController::isClosed() const {
    return _currentAngle == SERVO_CLOSED_ANGLE;
}

int ServoController::getCurrentAngle() const {
    return _currentAngle;
}
