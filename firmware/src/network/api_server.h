#pragma once
#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

class ApiServer {
public:
    ApiServer();
    void begin();
    void handle();

private:
    AsyncWebServer _server;
    void setupRoutes();
};

extern ApiServer apiServer;
