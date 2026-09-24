import { FeederStatus, HistoryRecord, DispenseResult, SprintConfig } from '../types';

export class FeederApiClient {
  private baseUrl: string;

  constructor(ipOrHost: string = '192.168.1.105') {
    this.baseUrl = ipOrHost.startsWith('http') ? ipOrHost : `http://${ipOrHost}`;
  }

  setHost(ipOrHost: string) {
    this.baseUrl = ipOrHost.startsWith('http') ? ipOrHost : `http://${ipOrHost}`;
  }

  getHost(): string {
    return this.baseUrl.replace(/^https?:\/\//, '');
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  async getStatus(): Promise<FeederStatus> {
    const res = await this.fetchWithTimeout('/api/status', {}, 2500);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  }

  async getWeight(): Promise<{ grams: number }> {
    const res = await this.fetchWithTimeout('/api/weight', {}, 1800);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res.json();
  }

  async dispense(grams: number): Promise<DispenseResult> {
    const res = await this.fetchWithTimeout('/api/feed', {
      method: 'POST',
      body: JSON.stringify({ grams }),
    }, 20000); // Dispensing can take up to 18s
    if (!res.ok) throw new Error(`Dispense failed: ${res.status}`);
    return res.json();
  }

  async fill(grams: number = 250): Promise<DispenseResult> {
    const res = await this.fetchWithTimeout('/api/fill', {
      method: 'POST',
      body: JSON.stringify({ grams }),
    }, 25000);
    if (!res.ok) throw new Error(`Fill failed: ${res.status}`);
    return res.json();
  }

  async startSprint(grams: number, intervalMinutes: number, feedCount: number): Promise<any> {
    const res = await this.fetchWithTimeout('/api/sprint', {
      method: 'POST',
      body: JSON.stringify({ grams, intervalMinutes, feedCount }),
    });
    if (!res.ok) throw new Error(`Sprint setup failed: ${res.status}`);
    return res.json();
  }

  async cancelSprint(): Promise<any> {
    const res = await this.fetchWithTimeout('/api/sprint', {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Sprint cancel failed: ${res.status}`);
    return res.json();
  }

  async getHistory(): Promise<{ records: HistoryRecord[] }> {
    const res = await this.fetchWithTimeout('/api/history', {}, 3000);
    if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
    return res.json();
  }

  async tareScale(): Promise<{ success: boolean; message: string }> {
    const res = await this.fetchWithTimeout('/api/calibrate/tare', {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Tare failed: ${res.status}`);
    return res.json();
  }

  async calibrateFactor(knownWeightGrams: number): Promise<{ success: boolean; factor: number }> {
    const res = await this.fetchWithTimeout('/api/calibrate/factor', {
      method: 'POST',
      body: JSON.stringify({ knownWeightGrams }),
    });
    if (!res.ok) throw new Error(`Calibration failed: ${res.status}`);
    return res.json();
  }
}
