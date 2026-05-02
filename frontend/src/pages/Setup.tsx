import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Factory as FactoryIcon, CheckCircle2 } from 'lucide-react';
import type { Factory } from '../types';

export const Setup = () => {
  const navigate = useNavigate();
  const { setFactory, completeSetup } = useAppData();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [cin, setCin] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [employees, setEmployees] = useState('10');
  const [products, setProducts] = useState('');
  const [finYear, setFinYear] = useState('2024-2025');

  // Step 2
  const [machines, setMachines] = useState('1');
  const [wattage, setWattage] = useState('15');
  const [shifts, setShifts] = useState('2');
  const [shiftHours, setShiftHours] = useState('8');
  const [tariff, setTariff] = useState('7.50');
  const [rooftop, setRooftop] = useState('');
  const [peakHours, setPeakHours] = useState('');

  // Step 3
  const [kwhPerPart, setKwhPerPart] = useState('2.6');
  const [scrapPct, setScrapPct] = useState('8');
  const [maintenanceDays, setMaintenanceDays] = useState('30');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create new factory profile
    const newFactory: Factory = {
      id: `f_${Date.now()}`,
      name,
      gstin,
      cin,
      city,
      state: state,
      employeesCount: parseInt(employees) || 0,
      productsManufactured: products,
      financialYear: finYear,
      machines_count: parseInt(machines) || 1,
      tariff_per_kwh: parseFloat(tariff) || 7.5,
      rooftop_sqft: parseInt(rooftop) || 0,
      shifts_per_day: parseInt(shifts) || 1,
      shift_hours: parseInt(shiftHours) || 8,
      peak_hours: peakHours,
      benchmark_kwh_per_part: parseFloat(kwhPerPart) || 2.6,
      benchmark_scrap_pct: parseFloat(scrapPct) || 8.0,
      maintenance_interval_days: parseInt(maintenanceDays) || 30,
    };

    setTimeout(() => {
      setFactory(newFactory);
      completeSetup();
      navigate('/dashboard');
    }, 1500); // Simulate network delay to show the friendly message
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-[var(--color-brand-emerald)] w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set.</h2>
          <p className="text-gray-500 mb-6">Let's find where your money is going.</p>
          
          <div className="flex justify-center opacity-70">
            {/* Simple Factory SVG */}
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 80V40L35 25L60 40V80" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M60 80V30L85 15L110 30V80" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="25" y="55" width="10" height="15" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="75" y="45" width="10" height="15" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M45 20V10" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
              <path d="M95 10V5" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-[var(--color-brand-primary)]">
          <FactoryIcon size={20} />
          <span className="font-bold">ReMargin</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Factory Setup</h1>
            <div className="flex items-center">
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="text-xs mt-2 font-medium text-gray-600">Identity</span>
              </div>
              <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 2 ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="text-xs mt-2 font-medium text-gray-600">Machines</span>
              </div>
              <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 3 ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <span className="text-xs mt-2 font-medium text-gray-600">Benchmarks</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                    <input type="text" value={gstin} onChange={e => setGstin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CIN</label>
                    <input type="text" value={cin} onChange={e => setCin(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Employees</label>
                    <input type="number" value={employees} onChange={e => setEmployees(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year</label>
                    <select value={finYear} onChange={e => setFinYear(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none">
                      <option>2023-2024</option>
                      <option>2024-2025</option>
                      <option>2025-2026</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Products Manufactured</label>
                    <input type="text" value={products} onChange={e => setProducts(e.target.value)} placeholder="e.g. Automotive valves, Fasteners" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary">Next Step →</button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of CNC Machines *</label>
                    <input required type="number" min="1" value={machines} onChange={e => setMachines(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Machine Wattage (kW) *</label>
                    <input required type="number" step="0.1" value={wattage} onChange={e => setWattage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shifts per Day *</label>
                    <select value={shifts} onChange={e => setShifts(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift Duration (hours) *</label>
                    <input required type="number" value={shiftHours} onChange={e => setShiftHours(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Tariff (₹/kWh) *</label>
                    <input required type="number" step="0.01" value={tariff} onChange={e => setTariff(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooftop Area for Solar (sq ft)</label>
                    <input type="number" value={rooftop} onChange={e => setRooftop(e.target.value)} placeholder="Optional" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peak Production Hours</label>
                    <input type="text" value={peakHours} onChange={e => setPeakHours(e.target.value)} placeholder="e.g. 06:00-14:00" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button type="button" onClick={handleBack} className="btn-outline">← Back</button>
                  <button type="submit" className="btn-primary">Next Step →</button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800 font-medium">We've pre-filled these based on BEE MSME energy study averages. You can override them if you have custom targets.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ideal Energy per Part (kWh/part)</label>
                    <div className="relative">
                      <input type="number" step="0.1" value={kwhPerPart} onChange={e => setKwhPerPart(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                      <span className="absolute right-4 top-2 text-gray-400 text-sm">kWh</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acceptable Scrap Rate (%)</label>
                    <div className="relative">
                      <input type="number" step="0.1" value={scrapPct} onChange={e => setScrapPct(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                      <span className="absolute right-4 top-2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Interval (Days)</label>
                    <div className="relative">
                      <input type="number" value={maintenanceDays} onChange={e => setMaintenanceDays(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                      <span className="absolute right-4 top-2 text-gray-400 text-sm">days</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex justify-between">
                  <button type="button" onClick={handleBack} className="btn-outline">← Back</button>
                  <button type="submit" className="btn-primary">Complete Setup →</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
