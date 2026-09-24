export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'mock_mode';

export interface FeederStatus {
  online: boolean;
  weight: number;
  servo: 'closed' | 'open' | 'partial';
  wifi: boolean;
  rssi?: number;
  firmware: string;
  busy: boolean;
  scheduleActive: boolean;
}

export type FeedType = 'manual' | 'fill' | 'scheduled';
export type FeedStatus = 'success' | 'failed' | 'insufficient_food' | 'sensor_error' | 'timeout';

export interface HistoryRecord {
  id: string;
  timestamp: string;
  targetGrams: number;
  actualGrams: number;
  type: FeedType;
  status: FeedStatus;
}

export interface SprintConfig {
  enabled: boolean;
  grams: number;
  intervalHours: number;
  totalFeeds: number;
  completedFeeds: number;
  nextFeedEpoch: number; // Unix timestamp
}

export interface DispenseResult {
  success: boolean;
  targetGrams: number;
  actualGrams: number;
  durationMs?: number;
  status: FeedStatus;
}
