#pragma once
#include <Arduino.h>
#include <vector>

struct HistoryRecord {
    String id;
    String timestamp;
    float targetGrams;
    float actualGrams;
    String type;   // "manual", "fill", "scheduled"
    String status; // "success", "failed", "insufficient_food"
};

class HistoryStore {
public:
    HistoryStore();
    void begin();
    void addRecord(float target, float actual, String type, String status, String timestamp);
    std::vector<HistoryRecord> getRecords();
    void clearOldRecords();

private:
    std::vector<HistoryRecord> _records;
    const size_t MAX_RECORDS = 50;
};

extern HistoryStore historyStore;
