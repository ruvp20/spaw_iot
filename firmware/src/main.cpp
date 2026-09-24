#include <Arduino.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include "config.h"
#include "hardware/servo_controller.h"
#include "hardware/weight_sensor.h"
#include "feeder/dispense_engine.h"
#include "storage/history_store.h"
#include "network/api_server.h"

// Fallback Wi-Fi in case secrets.h is not yet configured
#if __has_include("secrets.h")
    #include "secrets.h"
#else
    #define WIFI_SSID     "Your_WiFi_SSID"
    #define WIFI_PASSWORD "Your_WiFi_Password"
#endif

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n=================================");
    Serial.println("  SPAW IOT - SMART PET FEEDER   ");
    Serial.println("=================================");

    // 1. Initialize Subsystems
    Serial.print("[INIT] Attaching MG996R Servo... ");
    servoController.begin();
    Serial.println("DONE (Closed)");

    Serial.print("[INIT] Initializing HX711 Load Cell... ");
    if (weightSensor.begin()) {
        Serial.println("READY");
    } else {
        Serial.println("WARNING: Sensor not detected, check wiring.");
    }

    historyStore.begin();

    // 2. Connect to Wi-Fi
    Serial.printf("[WIFI] Connecting to %s", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int retries = 0;
    while (WiFi.status() != WL_CONNECTED && retries < 20) {
        delay(500);
        Serial.print(".");
        retries++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n[WIFI] Connected!");
        Serial.print("[WIFI] IP Address: ");
        Serial.println(WiFi.localIP());

        // 3. Start mDNS for auto-discovery (petfeeder.local)
        if (MDNS.begin("petfeeder")) {
            Serial.println("[MDNS] Service started: http://petfeeder.local");
            MDNS.addService("http", "tcp", 80);
        }

        // 4. Start HTTP Server
        apiServer.begin();
        Serial.println("[HTTP] REST API Server online on port 80");
    } else {
        Serial.println("\n[WIFI] Connection failed. Running in standalone offline mode.");
    }
}

void loop() {
    apiServer.handle();
    delay(20);
}
