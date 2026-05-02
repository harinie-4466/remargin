import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Factory, Machine, ShiftLog, ScrapLog, Alert, FixLog } from '../types';

interface AppState {
  user: User | null;
  factory: Factory | null;
  machines: Machine[];
  shiftLogs: ShiftLog[];
  scrapLogs: ScrapLog[];
  alerts: Alert[];
  fixLogs: FixLog[];
  setupComplete: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setFactory: (factory: Factory) => void;
  updateFactory: (factory: Partial<Factory>) => void;
  addShiftLog: (log: ShiftLog) => void;
  addScrapLog: (log: ScrapLog) => void;
  resolveAlert: (alertId: string, fixLog: FixLog) => void;
  completeSetup: () => void;
  resetData: () => void;
}

const defaultState: AppState = {
  user: null,
  factory: null,
  machines: [],
  shiftLogs: [],
  scrapLogs: [],
  alerts: [],
  fixLogs: [],
  setupComplete: false,
};

const AppDataContext = createContext<AppContextType | undefined>(undefined);

// Generate 30 days of realistic seed data
const generateSeedData = (): AppState => {
  const factoryId = 'f1';
  const factory: Factory = {
    id: factoryId,
    name: 'Sakthi Precision Components',
    gstin: '33AABCU9603R1ZM',
    cin: 'U29253TZ2005PTC011855',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    employeesCount: 45,
    productsManufactured: 'Automotive Valves, Aerospace Fittings',
    financialYear: '2025-2026',
    machines_count: 12,
    tariff_per_kwh: 7.50,
    rooftop_sqft: 2000,
    shifts_per_day: 3,
    shift_hours: 8,
    peak_hours: '06:00-14:00',
    benchmark_kwh_per_part: 2.6,
    benchmark_scrap_pct: 8.0,
    maintenance_interval_days: 30,
  };

  const machines: Machine[] = Array.from({ length: 12 }).map((_, i) => {
    // Make Machine 3 and Machine 7 have anomalies
    let lastMaint = new Date();
    if (i === 6) {
      // Machine 7 overdue
      lastMaint.setDate(lastMaint.getDate() - 42);
    } else {
      lastMaint.setDate(lastMaint.getDate() - Math.floor(Math.random() * 25));
    }
    return {
      id: `m${i + 1}`,
      factory_id: factoryId,
      name: `CNC Machine ${i + 1}`,
      wattage_kw: 15,
      last_maintenance_date: lastMaint.toISOString().split('T')[0],
    };
  });

  const shiftLogs: ShiftLog[] = [];
  const scrapLogs: ScrapLog[] = [];
  const alerts: Alert[] = [];
  const fixLogs: FixLog[] = [];

  const today = new Date();
  
  for (let d = 30; d >= 0; d--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - d);
    const dateStr = currentDate.toISOString().split('T')[0];
    const isThursday = currentDate.getDay() === 4;

    ['Morning', 'Afternoon', 'Night'].forEach(shift => {
      // Shift Logs for each machine
      machines.forEach((m) => {
        const partsProduced = 100 + Math.floor(Math.random() * 20); // ~100-120 parts
        let kwhPerPart = factory.benchmark_kwh_per_part + (Math.random() * 0.2 - 0.1);
        
        // Anomalies: Machine 3 overuse
        if (m.id === 'm3') kwhPerPart += 0.8;
        // Machine 7 overuse due to overdue maintenance
        if (m.id === 'm7') kwhPerPart += 0.5;

        const energy_kwh = +(partsProduced * kwhPerPart).toFixed(1);
        const cost_inr = energy_kwh * factory.tariff_per_kwh;
        
        const ideal_energy = partsProduced * factory.benchmark_kwh_per_part;
        const loss_inr = energy_kwh > ideal_energy ? (energy_kwh - ideal_energy) * factory.tariff_per_kwh : 0;

        shiftLogs.push({
          id: `sl_${dateStr}_${shift}_${m.id}`,
          factory_id: factoryId,
          machine_id: m.id,
          date: dateStr,
          shift_type: shift as any,
          start_reading: 1000 + d*100, // mock
          end_reading: 1000 + d*100 + energy_kwh,
          parts_produced: partsProduced,
          energy_kwh,
          cost_inr,
          loss_inr,
          notes: '',
        });
      });

      // Scrap Logs
      let scrapPct = factory.benchmark_scrap_pct - 2 + Math.random() * 4;
      // Anomaly: Scrap spike on night shift Thursdays
      if (isThursday && shift === 'Night') scrapPct += 7.0;

      const input_kg = 50 + Math.random() * 10;
      const scrap_kg = input_kg * (scrapPct / 100);
      const output_kg = input_kg - scrap_kg;
      
      const loss_inr = scrap_kg * 120; // assumed value per kg
      const resale_inr = scrap_kg * 30; // assumed resale value per kg

      scrapLogs.push({
        id: `scr_${dateStr}_${shift}`,
        factory_id: factoryId,
        date: dateStr,
        shift: shift as any,
        material: 'Aluminium',
        input_kg: +input_kg.toFixed(1),
        output_kg: +output_kg.toFixed(1),
        scrap_kg: +scrap_kg.toFixed(1),
        scrap_pct: +scrapPct.toFixed(1),
        loss_inr: +loss_inr.toFixed(0),
        resale_inr: +resale_inr.toFixed(0),
      });
    });
  }

  // Generate some alerts
  alerts.push({
    id: 'a1',
    factory_id: factoryId,
    machine_id: 'm3',
    type: 'Energy',
    message: 'Machine 3 used 22% excess energy on Day shift',
    loss_inr: 640,
    created_at: new Date().toISOString(),
    resolved_at: null,
  });

  alerts.push({
    id: 'a2',
    factory_id: factoryId,
    machine_id: 'm7',
    type: 'Maintenance',
    message: 'Maintenance overdue by 12 days',
    loss_inr: 1200,
    created_at: new Date().toISOString(),
    resolved_at: null,
  });

  return {
    user: { id: 'u1', email: 'owner@sakthiprecision.com', factory_id: factoryId },
    factory,
    machines,
    shiftLogs,
    scrapLogs,
    alerts,
    fixLogs,
    setupComplete: true,
  };
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('remargin_data');
    if (saved) {
      return JSON.parse(saved);
    }
    // Return empty state initially, let user log in to load seed data
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('remargin_data', JSON.stringify(state));
  }, [state]);

  const setUser = (user: User | null) => {
    if (user && state.user === null && !state.setupComplete) {
      // Upon first login in demo, inject seed data
      const seed = generateSeedData();
      setState(seed);
    } else {
      setState(prev => ({ ...prev, user }));
    }
  };

  const setFactory = (factory: Factory) => setState(prev => ({ ...prev, factory }));
  
  const updateFactory = (factoryUpdate: Partial<Factory>) => 
    setState(prev => ({ ...prev, factory: prev.factory ? { ...prev.factory, ...factoryUpdate } : null }));

  const addShiftLog = (log: ShiftLog) => setState(prev => ({ ...prev, shiftLogs: [log, ...prev.shiftLogs] }));
  
  const addScrapLog = (log: ScrapLog) => setState(prev => ({ ...prev, scrapLogs: [log, ...prev.scrapLogs] }));

  const resolveAlert = (alertId: string, fixLog: FixLog) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => a.id === alertId ? { ...a, resolved_at: new Date().toISOString() } : a),
      fixLogs: [fixLog, ...prev.fixLogs]
    }));
  };

  const completeSetup = () => setState(prev => ({ ...prev, setupComplete: true }));

  const resetData = () => {
    setState(defaultState);
    localStorage.removeItem('remargin_data');
  };

  return (
    <AppDataContext.Provider value={{
      ...state,
      setUser,
      setFactory,
      updateFactory,
      addShiftLog,
      addScrapLog,
      resolveAlert,
      completeSetup,
      resetData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
