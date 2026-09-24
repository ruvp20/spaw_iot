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
  isDispensing: boolean;
  dispenseStage: string;
  activeTargetGrams: number;
  lastResult: DispenseResult | null;

  // Actions
  setMockMode: (enabled: boolean) => Promise<void>;
  setFeederIp: (ip: string) => Promise<void>;
  refreshStatus: () => Promise<void>;
  dispenseFood: (grams: number, type?: 'manual' | 'fill') => Promise<DispenseResult>;
  executeFill: () => Promise<DispenseResult>;
  saveSprint: (grams: number, intervalHours: number, totalFeeds: number) => Promise<void>;
  cancelSprint: () => Promise<void>;
  tareScale: () => Promise<void>;
  calibrateScale: (knownGrams: number) => Promise<void>;
}

const FeederContext = createContext<FeederContextType | undefined>(undefined);

const STORAGE_KEY_IP = '@spaw_feeder_ip';
const STORAGE_KEY_MOCK = '@spaw_feeder_mock';

export const FeederProvider = ({ children }: { children: ReactNode }) => {
  const [feederIp, setFeederIpState] = useState<string>('192.168.1.105');
  const [isMockMode, setIsMockModeState] = useState<boolean>(true); // default to mock on first launch so user sees working prototype immediately
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('mock_mode');

  const [status, setStatus] = useState<FeederStatus>({
    online: true,
    weight: 42.5,
    servo: 'closed',
    wifi: true,
    rssi: -65,
    firmware: '1.0.0-demo',
    busy: false,
    scheduleActive: true,
  });

  const [history, setHistory] = useState<HistoryRecord[]>(mockFeederInstance.getHistory());
  const [sprint, setSprint] = useState<SprintConfig>(mockFeederInstance.getSprint());
  const [isDispensing, setIsDispensing] = useState<boolean>(false);
  const [dispenseStage, setDispenseStage] = useState<string>('Ready');
  const [activeTargetGrams, setActiveTargetGrams] = useState<number>(0);
  const [lastResult, setLastResult] = useState<DispenseResult | null>(null);

  const apiClient = useRef(new FeederApiClient(feederIp));

  // Load saved preferences
  useEffect(() => {
    (async () => {
      try {
        const savedIp = await AsyncStorage.getItem(STORAGE_KEY_IP);
        const savedMock = await AsyncStorage.getItem(STORAGE_KEY_MOCK);

        if (savedIp) {
          setFeederIpState(savedIp);
          apiClient.current.setHost(savedIp);
        }
        if (savedMock !== null) {
          const mockVal = savedMock === 'true';
          setIsMockModeState(mockVal);
          setConnectionStatus(mockVal ? 'mock_mode' : 'connecting');
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
      setHistory(mockFeederInstance.getHistory());
      setSprint(mockFeederInstance.getSprint());
      setConnectionStatus('mock_mode');
      return;
    }

    try {
      const data = await apiClient.current.getStatus();
      setStatus(data);
      setConnectionStatus(data.online ? 'connected' : 'disconnected');

      const histData = await apiClient.current.getHistory();
      if (histData?.records) {
        setHistory(histData.records);
      }
    } catch (err) {
      setConnectionStatus('disconnected');
    }
  };

  // Status Polling interval
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDispensing) {
        refreshStatus();
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [isMockMode, isDispensing, feederIp]);

  const dispenseFood = async (grams: number, type: 'manual' | 'fill' = 'manual'): Promise<DispenseResult> => {
    setIsDispensing(true);
    setActiveTargetGrams(grams);
    setDispenseStage('Tare load cell & aligning gate...');

    try {
      let result: DispenseResult;
      if (isMockMode) {
        result = await mockFeederInstance.simulateDispense(grams, type, (w, stage) => {
          setStatus(prev => ({ ...prev, weight: w, servo: stage.includes('trickling') ? 'partial' : 'open' }));
          setDispenseStage(stage);
        });
        setHistory(mockFeederInstance.getHistory());
      } else {
        setDispenseStage('Dispensing food from hopper...');
        result = await apiClient.current.dispense(grams);
        await refreshStatus();
      }

      setLastResult(result);
      setDispenseStage(`Done! Dispensed ${result.actualGrams}g`);
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

  const executeFill = async (): Promise<DispenseResult> => {
    return dispenseFood(250, 'fill');
  };

  const saveSprint = async (grams: number, intervalHours: number, totalFeeds: number) => {
    const nextFeedEpoch = Date.now() + intervalHours * 3600 * 1000;
    const newSprint: SprintConfig = {
      enabled: true,
      grams,
      intervalHours,
      totalFeeds,
      completedFeeds: 0,
      nextFeedEpoch,
    };

    if (isMockMode) {
      mockFeederInstance.setSprint(newSprint);
      setSprint(newSprint);
      setStatus(prev => ({ ...prev, scheduleActive: true }));
    } else {
      await apiClient.current.startSprint(grams, intervalHours * 60, totalFeeds);
      setSprint(newSprint);
      await refreshStatus();
    }
  };

  const cancelSprint = async () => {
    if (isMockMode) {
      mockFeederInstance.cancelSprint();
      setSprint(prev => ({ ...prev, enabled: false }));
      setStatus(prev => ({ ...prev, scheduleActive: false }));
    } else {
      await apiClient.current.cancelSprint();
      setSprint(prev => ({ ...prev, enabled: false }));
      await refreshStatus();
    }
  };

  const tareScale = async () => {
    if (isMockMode) {
      mockFeederInstance.tare();
      setStatus(prev => ({ ...prev, weight: 0.0 }));
    } else {
      await apiClient.current.tareScale();
      await refreshStatus();
    }
  };

  const calibrateScale = async (knownGrams: number) => {
    if (!isMockMode) {
      await apiClient.current.calibrateFactor(knownGrams);
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
