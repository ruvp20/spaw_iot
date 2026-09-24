import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeederStatus, HistoryRecord, SprintConfig, DispenseResult, ConnectionStatus } from '../types';
import { FeederApiClient } from '../api/feederApi';
import { mockFeederInstance } from '../api/mockFeeder';

interface FeederContextType {
  status: FeederStatus;
  connectionStatus: ConnectionStatus;
  isMockMode: boolean;
  feederIp: string;
  history: HistoryRecord[];
  sprint: SprintConfig;
  fillTarget: number;
  setFillTarget: (grams: number) => Promise<void>;
  bowlCapacity: number;
  setBowlCapacity: (capacity: number) => Promise<void>;
  isDispensing: boolean;
  dispenseStage: string;
  activeTargetGrams: number;
  lastResult: DispenseResult | null;

  // Actions
  setMockMode: (enabled: boolean) => Promise<void>;
  setFeederIp: (ip: string) => Promise<void>;
  refreshStatus: () => Promise<void>;
  dispenseFood: (grams: number, type?: 'manual' | 'fill') => Promise<DispenseResult>;
  executeFill: (customGrams?: number) => Promise<DispenseResult>;
  saveSprint: (grams: number, intervalHours: number, totalFeeds: number) => Promise<void>;
  cancelSprint: () => Promise<void>;
  tareScale: () => Promise<void>;
  calibrateScale: (knownGrams: number) => Promise<void>;
}

const FeederContext = createContext<FeederContextType | undefined>(undefined);

const STORAGE_KEY_IP = '@spaw_feeder_ip';
const STORAGE_KEY_MOCK = '@spaw_feeder_mock';
const STORAGE_KEY_HISTORY = '@spaw_history';
const STORAGE_KEY_SPRINT = '@spaw_sprint_config';
const STORAGE_KEY_FILL = '@spaw_fill_target';
const STORAGE_KEY_BOWL_CAPACITY = '@spaw_bowl_capacity';

export const FeederProvider = ({ children }: { children: ReactNode }) => {
  const [feederIp, setFeederIpState] = useState<string>('192.168.1.105');
  // Default to REAL / fully functioning mode (no demo by default)
  const [isMockMode, setIsMockModeState] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Initial state starts clean from 0
  const [status, setStatus] = useState<FeederStatus>({
    online: false,
    weight: 0.0,
    servo: 'closed',
    wifi: false,
    rssi: 0,
    firmware: '1.0.0',
    busy: false,
    scheduleActive: false,
  });

  // Empty initial history - starts clean, populated and saved from user actions/feeder
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Default sprint starts from 0
  const [sprint, setSprint] = useState<SprintConfig>({
    enabled: false,
    grams: 0,
    intervalHours: 0,
    totalFeeds: 0,
    completedFeeds: 0,
    nextFeedEpoch: 0,
  });

  // Default fill target starts from 0
  const [fillTarget, setFillTargetState] = useState<number>(0);

  // Default bowl capacity is 400gms, saved from user input
  const [bowlCapacity, setBowlCapacityState] = useState<number>(400);

  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [dispenseStage, setDispenseStage] = useState<string>('Ready');
  const [activeTargetGrams, setActiveTargetGrams] = useState<number>(0);
  const [lastResult, setLastResult] = useState<DispenseResult | null>(null);

  const apiClient = useRef(new FeederApiClient(feederIp));

  // Load saved preferences & saved user inputs
  useEffect(() => {
    (async () => {
      try {
        const savedIp = await AsyncStorage.getItem(STORAGE_KEY_IP);
        const savedMock = await AsyncStorage.getItem(STORAGE_KEY_MOCK);
        const savedHist = await AsyncStorage.getItem(STORAGE_KEY_HISTORY);
        const savedSprint = await AsyncStorage.getItem(STORAGE_KEY_SPRINT);
        const savedFill = await AsyncStorage.getItem(STORAGE_KEY_FILL);
        const savedCapacity = await AsyncStorage.getItem(STORAGE_KEY_BOWL_CAPACITY);

        if (savedIp) {
          setFeederIpState(savedIp);
          apiClient.current.setHost(savedIp);
        }

        // Mock mode is strictly false unless user previously explicitly turned it on in settings
        if (savedMock !== null) {
          const mockVal = savedMock === 'true';
          setIsMockModeState(mockVal);
          setConnectionStatus(mockVal ? 'mock_mode' : 'connecting');
        } else {
          setIsMockModeState(false);
          setConnectionStatus('connecting');
        }

        if (savedHist) {
          try {
            setHistory(JSON.parse(savedHist));
          } catch {}
        }

        if (savedSprint) {
          try {
            setSprint(JSON.parse(savedSprint));
          } catch {}
        }

        if (savedFill) {
          const parsedFill = parseInt(savedFill, 10);
          if (!isNaN(parsedFill)) {
            setFillTargetState(parsedFill);
          }
        }

        if (savedCapacity) {
          const parsedCap = parseInt(savedCapacity, 10);
          if (!isNaN(parsedCap) && parsedCap > 0) {
            setBowlCapacityState(parsedCap);
          }
        }
      } catch (e) {
        console.warn('Error loading preferences', e);
      }
    })();
  }, []);

  const setFeederIp = async (ip: string) => {
    setFeederIpState(ip);
    apiClient.current.setHost(ip);
    await AsyncStorage.setItem(STORAGE_KEY_IP, ip);
    refreshStatus();
  };

  const setFillTarget = async (grams: number) => {
    setFillTargetState(grams);
    await AsyncStorage.setItem(STORAGE_KEY_FILL, String(grams));
  };

  const setBowlCapacity = async (capacity: number) => {
    setBowlCapacityState(capacity);
    await AsyncStorage.setItem(STORAGE_KEY_BOWL_CAPACITY, String(capacity));
  };

  const setMockMode = async (enabled: boolean) => {
    setIsMockModeState(enabled);
    setConnectionStatus(enabled ? 'mock_mode' : 'connecting');
    await AsyncStorage.setItem(STORAGE_KEY_MOCK, String(enabled));
    if (enabled) {
      setStatus(mockFeederInstance.getStatus());
      setHistory(mockFeederInstance.getHistory());
      setSprint(mockFeederInstance.getSprint());
    } else {
      refreshStatus();
    }
  };

  const refreshStatus = async () => {
    if (isMockMode) {
      setStatus(mockFeederInstance.getStatus());
      setConnectionStatus('mock_mode');
      return;
    }

    try {
      const data = await apiClient.current.getStatus();
      setStatus(data);
      setConnectionStatus(data.online ? 'connected' : 'disconnected');

      try {
        const histData = await apiClient.current.getHistory();
        if (histData?.records && histData.records.length > 0) {
          setHistory(histData.records);
          AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(histData.records)).catch(() => {});
        }
      } catch {
        // Fallback to local persisted history if feeder history endpoint is unreachable
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      setStatus(prev => ({ ...prev, online: false, wifi: false }));
    }
  };

  // Status Polling interval
  useEffect(() => {
    refreshStatus();
    const timer = setInterval(() => {
      if (!isDispensing) {
        refreshStatus();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isMockMode, isDispensing, feederIp]);

  const dispenseFood = async (grams: number, type: 'manual' | 'fill' = 'manual'): Promise<DispenseResult> => {
    if (grams <= 0) {
      const zeroResult: DispenseResult = {
        success: false,
        targetGrams: 0,
        actualGrams: 0,
        status: 'failed',
      };
      return zeroResult;
    }

    setIsDispensing(true);
    setActiveTargetGrams(grams);
    setDispenseStage(`Tare load cell & aligning gate for ${grams}g...`);

    try {
      let result: DispenseResult;
      if (isMockMode) {
        result = await mockFeederInstance.simulateDispense(grams, type, (w, stage) => {
          setStatus(prev => ({ ...prev, weight: w, servo: stage.includes('trickling') ? 'partial' : 'open' }));
          setDispenseStage(stage);
        });
      } else {
        setDispenseStage('Dispensing food from hopper...');
        try {
          result = await apiClient.current.dispense(grams);
        } catch (err: any) {
          result = {
            success: false,
            targetGrams: grams,
            actualGrams: 0,
            status: 'failed',
          };
        }
        await refreshStatus();
      }

      setLastResult(result);
      setDispenseStage(result.success ? `Done! Dispensed ${result.actualGrams}g` : 'Dispense completed');

      // Create history record and save to AsyncStorage
      const newRecord: HistoryRecord = {
        id: `feed_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetGrams: grams,
        actualGrams: result.actualGrams,
        type,
        status: result.success ? 'success' : 'failed',
      };

      setHistory(prev => {
        const updated = [newRecord, ...prev];
        AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });

      return result;
    } catch (e: any) {
      const failedResult: DispenseResult = {
        success: false,
        targetGrams: grams,
        actualGrams: 0,
        status: 'failed',
      };
      setLastResult(failedResult);
      setDispenseStage('Dispense interrupted or failed');
      return failedResult;
    } finally {
      setTimeout(() => {
        setIsDispensing(false);
        setActiveTargetGrams(0);
        setDispenseStage('Ready');
      }, 1500);
    }
  };

  const executeFill = async (customGrams?: number): Promise<DispenseResult> => {
    const target = customGrams !== undefined ? customGrams : fillTarget;
    return dispenseFood(target, 'fill');
  };

  const saveSprint = async (grams: number, intervalHours: number, totalFeeds: number) => {
    const nextFeedEpoch = intervalHours > 0 ? Date.now() + intervalHours * 3600 * 1000 : 0;
    const newSprint: SprintConfig = {
      enabled: grams > 0 && intervalHours > 0 && totalFeeds > 0,
      grams,
      intervalHours,
      totalFeeds,
      completedFeeds: 0,
      nextFeedEpoch,
    };

    setSprint(newSprint);
    await AsyncStorage.setItem(STORAGE_KEY_SPRINT, JSON.stringify(newSprint));

    if (!isMockMode) {
      try {
        await apiClient.current.startSprint(grams, intervalHours * 60, totalFeeds);
      } catch (e) {
        console.warn('Could not sync sprint with hardware:', e);
      }
      await refreshStatus();
    } else {
      mockFeederInstance.setSprint(newSprint);
      setStatus(prev => ({ ...prev, scheduleActive: newSprint.enabled }));
    }
  };

  const cancelSprint = async () => {
    const resetSprint: SprintConfig = {
      enabled: false,
      grams: 0,
      intervalHours: 0,
      totalFeeds: 0,
      completedFeeds: 0,
      nextFeedEpoch: 0,
    };
    setSprint(resetSprint);
    await AsyncStorage.setItem(STORAGE_KEY_SPRINT, JSON.stringify(resetSprint));

    if (!isMockMode) {
      try {
        await apiClient.current.cancelSprint();
      } catch (e) {
        console.warn('Could not cancel sprint on hardware:', e);
      }
      await refreshStatus();
    } else {
      mockFeederInstance.cancelSprint();
      setStatus(prev => ({ ...prev, scheduleActive: false }));
    }
  };

  const tareScale = async () => {
    if (isMockMode) {
      mockFeederInstance.tare();
      setStatus(prev => ({ ...prev, weight: 0.0 }));
    } else {
      try {
        await apiClient.current.tareScale();
      } catch (e) {
        console.warn('Tare scale failed:', e);
      }
      await refreshStatus();
    }
  };

  const calibrateScale = async (knownGrams: number) => {
    if (!isMockMode) {
      try {
        await apiClient.current.calibrateFactor(knownGrams);
      } catch (e) {
        console.warn('Calibrate factor failed:', e);
      }
      await refreshStatus();
    }
  };

  return (
    <FeederContext.Provider
      value={{
        status,
        connectionStatus,
        isMockMode,
        feederIp,
        history,
        sprint,
        fillTarget,
        setFillTarget,
        bowlCapacity,
        setBowlCapacity,
        isDispensing,
        dispenseStage,
        activeTargetGrams,
        lastResult,
        setMockMode,
        setFeederIp,
        refreshStatus,
        dispenseFood,
        executeFill,
        saveSprint,
        cancelSprint,
        tareScale,
        calibrateScale,
      }}
    >
      {children}
    </FeederContext.Provider>
  );
};

export const useFeeder = () => {
  const context = useContext(FeederContext);
  if (!context) {
    throw new Error('useFeeder must be used within a FeederProvider');
  }
  return context;
};
