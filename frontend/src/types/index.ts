export interface User {
  id: string;
  email: string;
  factory_id: string;
}

export interface Factory {
  id: string;
  name: string;
  gstin: string;
  cin: string;
  city: string;
  state: string;
  employeesCount: number;
  productsManufactured: string;
  financialYear: string;
  machines_count: number;
  tariff_per_kwh: number;
  rooftop_sqft: number;
  shifts_per_day: number;
  shift_hours: number;
  peak_hours: string;
  benchmark_kwh_per_part: number;
  benchmark_scrap_pct: number;
  maintenance_interval_days: number;
}

export interface Machine {
  id: string;
  factory_id: string;
  name: string;
  wattage_kw: number;
  last_maintenance_date: string;
}

export interface ShiftLog {
  id: string;
  factory_id: string;
  machine_id: string;
  date: string;
  shift_type: 'Morning' | 'Afternoon' | 'Night';
  start_reading: number;
  end_reading: number;
  parts_produced: number;
  energy_kwh: number;
  cost_inr: number;
  loss_inr: number;
  notes: string;
}

export interface ScrapLog {
  id: string;
  factory_id: string;
  date: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  material: string;
  input_kg: number;
  output_kg: number;
  scrap_kg: number;
  scrap_pct: number;
  loss_inr: number;
  resale_inr: number;
}

export interface MaintenanceLog {
  id: string;
  machine_id: string;
  date: string;
  notes: string;
  technician: string;
}

export interface Alert {
  id: string;
  factory_id: string;
  machine_id: string;
  type: 'Energy' | 'Maintenance' | 'Scrap' | 'Info';
  message: string;
  loss_inr: number;
  created_at: string;
  resolved_at: string | null;
}

export interface FixLog {
  id: string;
  alert_id: string;
  machine_id: string;
  description: string;
  action_taken: string;
  parts_replaced: string;
  technician: string;
  date: string;
  verified: boolean;
  savings_inr?: number;
}
