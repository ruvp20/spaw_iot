# Spaw IoT Feeder REST API Specification

The ESP32 runs an embedded HTTP REST server responding to requests on port `80`.

Base URL: `http://<ESP32_IP>/api` or `http://petfeeder.local/api`

---

## 1. System Status
* **GET** `/api/status`
* **Response `200 OK`**:
```json
{
  "online": true,
  "weight": 128.4,
  "servo": "closed",
  "wifi": true,
  "scheduleActive": true,
  "firmware": "1.0.0",
  "rssi": -58,
  "freeHeap": 184200
}
```

---

## 2. Real-Time Bowl Weight
* **GET** `/api/weight`
* **Response `200 OK`**:
```json
{
  "grams": 128.4
}
```

---

## 3. Manual Feed
* **POST** `/api/feed`
* **Body**:
```json
{
  "grams": 45
}
```
* **Response `200 OK`**:
```json
{
  "success": true,
  "targetGrams": 45,
  "actualGrams": 46.2,
  "durationMs": 3200,
  "status": "success"
}
```

---

## 4. Fill Operation (Default 250g)
* **POST** `/api/fill`
* **Body**:
```json
{
  "grams": 250
}
```
* **Response `200 OK`**:
```json
{
  "success": true,
  "targetGrams": 250,
  "actualGrams": 251.5,
  "status": "success"
}
```

---

## 5. Sprint Scheduler
* **POST** `/api/sprint`
* **Body**:
```json
{
  "grams": 50,
  "intervalMinutes": 300,
  "feedCount": 4
}
```
* **Response `200 OK`**:
```json
{
  "success": true,
  "schedule": {
    "enabled": true,
    "grams": 50,
    "intervalMinutes": 300,
    "totalFeeds": 4,
    "completedFeeds": 0,
    "nextFeedEpoch": 1727190000
  }
}
```
* **DELETE** `/api/sprint`
* **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Sprint schedule cancelled"
}
```

---

## 6. Feeding History (Last 24 Hours)
* **GET** `/api/history`
* **Response `200 OK`**:
```json
{
  "records": [
    {
      "id": "1",
      "timestamp": "2026-09-24T15:00:00+05:30",
      "targetGrams": 50,
      "actualGrams": 51.2,
      "type": "scheduled",
      "status": "success"
    },
    {
      "id": "2",
      "timestamp": "2026-09-24T10:00:00+05:30",
      "targetGrams": 250,
      "actualGrams": 252.0,
      "type": "fill",
      "status": "success"
    }
  ]
}
```

---

## 7. Calibration Endpoints
* **POST** `/api/calibrate/tare`
  * Zeroes out the empty bowl.
* **POST** `/api/calibrate/factor`
  * Body: `{"knownWeightGrams": 100}`
  * Computes and writes calibration factor to ESP32 Non-Volatile Flash (`NVS`).
