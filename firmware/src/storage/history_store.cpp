#include "history_store.h"

HistoryStore historyStore;

HistoryStore::HistoryStore() {}

void HistoryStore::begin() {
    _records.clear();
}

void HistoryStore::addRecord(float target, float actual, String type, String status, String timestamp) {
    if (_records.size() >= MAX_RECORDS) {
        _records.erase(_records.begin()); // FIFO eviction
    }

    HistoryRecord rec;
    rec.id = String(millis());
    rec.timestamp = timestamp;
    rec.targetGrams = target;
    rec.actualGrams = actual;
    rec.type = type;
    rec.status = status;

    _records.push_back(rec);
}

std::vector<HistoryRecord> HistoryStore::getRecords() {
    return _records;
}

void HistoryStore::clearOldRecords() {
    // Kept capped via MAX_RECORDS FIFO
}
