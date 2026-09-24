import { FeederStatus, HistoryRecord, DispenseResult, SprintConfig } from '../types';

export class MockFeederEngine {
  private currentWeight: number = 42.5;
  private isBusy: boolean = false;
  private servoState: 'closed' | 'open' | 'partial' = 'closed';
  private history: HistoryRecord[] = [
    {
      id: 'mock-1',
      timestamp: 'Today, 10:00 AM',
      targetGrams: 50,
      actualGrams: 51.4,
      type: 'scheduled',
      status: 'success',
    },
    {
      id: 'mock-2',
      timestamp: 'Today, 03:00 PM',
      targetGrams: 50,
      actualGrams: 49.8,
      type: 'scheduled',
      status: 'success',
    },
    {
      id: 'mock-3',
      timestamp: 'Yesterday, 07:30 PM',
      targetGrams: 25,
      actualGrams: 25.1,
      type: 'manual',
      status: 'success',
    },
    {
      id: 'mock-4',
      timestamp: 'Yesterday, 08:00 AM',
      targetGrams: 250,
      actualGrams: 252.6,
      type: 'fill',
      status: 'success',
    },
  ];

  private sprint: SprintConfig = {
    enabled: true,
    grams: 50,
    intervalHours: 4,
    totalFeeds: 4,
    completedFeeds: 2,
    nextFeedEpoch: Date.now() + 2 * 3600 * 1000 + 14 * 60 * 1000,
  };

  getStatus(): FeederStatus {
    return {
      online: true,
      weight: parseFloat(this.currentWeight.toFixed(1)),
      servo: this.servoState,
      wifi: true,
      rssi: -62,
      firmware: '1.0.0-demo',
      busy: this.isBusy,
      scheduleActive: this.sprint.enabled,
    };
  }

  getSprint(): SprintConfig {
    return this.sprint;
  }

  getHistory(): HistoryRecord[] {
    return [...this.history];
  }

  async simulateDispense(
    targetGrams: number,
    type: 'manual' | 'fill' | 'scheduled',
    onProgress?: (currentWeight: number, stage: string) => void
  ): Promise<DispenseResult> {
    if (this.isBusy) {
      return {
        success: false,
        targetGrams,
        actualGrams: 0,
        status: 'failed',
      };
    }

    this.isBusy = true;
    this.servoState = 'open';

    const startWeight = this.currentWeight;
    const steps = 12;
    const jitter = (Math.random() * 2.5 - 1.0); // realistic slight overshoot or undershoot
    const finalGrams = targetGrams + jitter;
    const stepIncrement = finalGrams / steps;

    for (let i = 1; i <= steps; i++) {
      await new Promise(r => setTimeout(r, 220));
      this.currentWeight = startWeight + stepIncrement * i;
      
      let stage = 'Pouring kibbles...';
      if (i > steps - 3) {
        this.servoState = 'partial';
        stage = 'Fine trickling...';
      }
      onProgress?.(parseFloat(this.currentWeight.toFixed(1)), stage);
    }

    this.servoState = 'closed';
    await new Promise(r => setTimeout(r, 350)); // settling delay
    this.isBusy = false;

    const actualDispensed = parseFloat(finalGrams.toFixed(1));
    const record: HistoryRecord = {
      id: `hist-${Date.now()}`,
      timestamp: 'Just now',
      targetGrams,
      actualGrams: actualDispensed,
      type,
      status: 'success',
    };
    this.history.unshift(record);

    return {
      success: true,
      targetGrams,
      actualGrams: actualDispensed,
      status: 'success',
      durationMs: steps * 220 + 350,
    };
  }

  tare() {
    this.currentWeight = 0.0;
  }

  setSprint(config: SprintConfig) {
    this.sprint = { ...config };
  }

  cancelSprint() {
    this.sprint.enabled = false;
  }
}

export const mockFeederInstance = new MockFeederEngine();
