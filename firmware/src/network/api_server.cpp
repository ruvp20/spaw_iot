#include "api_server.h"
#include <WiFi.h>
#include "../hardware/weight_sensor.h"
#include "../hardware/servo_controller.h"
#include "../feeder/dispense_engine.h"
#include "../storage/history_store.h"

ApiServer apiServer;

ApiServer::ApiServer() : _server(80) {}

void ApiServer::begin() {
    setupRoutes();
    _server.begin();
}

void ApiServer::handle() {
    // AsyncWebServer is asynchronous
}

void ApiServer::setupRoutes() {
    // CORS headers
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

    // 1. Status Endpoint
    _server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        doc["online"] = true;
        doc["weight"] = weightSensor.getWeightGrams(2);
        doc["servo"] = servoController.isClosed() ? "closed" : "open";
        doc["wifi"] = WiFi.isConnected();
        doc["firmware"] = "1.0.0";
        doc["rssi"] = WiFi.RSSI();
        doc["busy"] = dispenseEngine.isDispensing();

        String response;
        serializeJson(doc, response);
        request->send(200, "application/json", response);
    });

    // 2. Weight Endpoint
    _server.on("/api/weight", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        doc["grams"] = weightSensor.getWeightGrams(1);
        String response;
        serializeJson(doc, response);
        request->send(200, "application/json", response);
    });

    // 3. Feed Endpoint
    _server.on("/api/feed", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
        JsonDocument inDoc;
        deserializeJson(inDoc, (const char*)data);
        float grams = inDoc["grams"] | 50.0f;

        DispenseResult res = dispenseEngine.dispense(grams);
        historyStore.addRecord(res.targetGrams, res.actualGrams, "manual", res.status, "Now");

        JsonDocument outDoc;
        outDoc["success"] = res.success;
        outDoc["targetGrams"] = res.targetGrams;
        outDoc["actualGrams"] = res.actualGrams;
        outDoc["status"] = res.status;

        String response;
        serializeJson(outDoc, response);
        request->send(200, "application/json", response);
    });

    // 4. Fill Endpoint
    _server.on("/api/fill", HTTP_POST, [](AsyncWebServerRequest *request) {
        DispenseResult res = dispenseEngine.dispense(DEFAULT_FILL_GRAMS);
        historyStore.addRecord(DEFAULT_FILL_GRAMS, res.actualGrams, "fill", res.status, "Now");

        JsonDocument outDoc;
        outDoc["success"] = res.success;
        outDoc["targetGrams"] = res.targetGrams;
        outDoc["actualGrams"] = res.actualGrams;
        outDoc["status"] = res.status;

        String response;
        serializeJson(outDoc, response);
        request->send(200, "application/json", response);
    });

    // 5. History Endpoint
    _server.on("/api/history", HTTP_GET, [](AsyncWebServerRequest *request) {
        JsonDocument doc;
        JsonArray records = doc["records"].to<JsonArray>();
        for (const auto& r : historyStore.getRecords()) {
            JsonObject item = records.add<JsonObject>();
            item["id"] = r.id;
            item["timestamp"] = r.timestamp;
            item["targetGrams"] = r.targetGrams;
            item["actualGrams"] = r.actualGrams;
            item["type"] = r.type;
            item["status"] = r.status;
        }
        String response;
        serializeJson(doc, response);
        request->send(200, "application/json", response);
    });

    // 6. Tare Calibration Endpoint
    _server.on("/api/calibrate/tare", HTTP_POST, [](AsyncWebServerRequest *request) {
        weightSensor.tare();
        request->send(200, "application/json", "{\"success\":true,\"message\":\"Scale tared successfully\"}");
    });
}
